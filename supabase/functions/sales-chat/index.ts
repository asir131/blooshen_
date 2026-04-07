import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an automotive sales assistant for AutoWurx. You are helpful, friendly, and honest. Your goal is to understand what the buyer needs, answer their questions using the listing details provided, and when they are ready, capture their contact info to connect them with the seller. Never be pushy. Never fabricate listing details. If you don't know something, say so and offer to find out.

IMPORTANT GUIDELINES:
- Answer questions using ONLY the listing data provided in the context. Do not invent specs, prices, or features.
- Ask qualifying questions naturally: budget, timeline, location, trade-in (for cars), use case (for parts/rentals).
- When the user seems interested, gently ask for their name and best contact (phone or email) to connect them with the seller.
- Create urgency naturally: mention high interest, limited availability, or seasonal demand when appropriate.
- If the user provides contact info, acknowledge it warmly and let them know the seller will reach out.
- Keep responses concise (2-4 sentences typically). Be conversational, not robotic.
- Format contact capture response as: [LEAD_CAPTURED: name="...", email="...", phone="..."] at the end of your message when you receive contact details.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { messages, session_id, listing_context, listing_category, listing_id } = await req.json();

    // Create or reuse session
    let sessionId = session_id;
    if (!sessionId) {
      const { data: session, error } = await supabase
        .from("chat_sessions")
        .insert({
          listing_id,
          listing_category,
          listing_context,
        })
        .select("id")
        .single();

      if (error) throw error;
      sessionId = session.id;
    }

    // Save user message
    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg?.role === "user") {
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: lastUserMsg.content,
      });
    }

    // Build messages for AI
    const contextMessage = `LISTING CONTEXT (${listing_category}):\n${JSON.stringify(listing_context, null, 2)}`;

    const aiMessages = [
      { role: "system", content: SYSTEM_PROMPT + "\n\n" + contextMessage },
      ...messages,
    ];

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: aiMessages,
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    // We need to collect the full response to save it, while streaming to client
    // Use a TransformStream to tee the response
    const reader = response.body!.getReader();
    let fullAssistantContent = "";

    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          controller.enqueue(value);

          // Parse SSE to collect full content
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) fullAssistantContent += content;
            } catch {}
          }
        }

        // Save assistant message
        if (fullAssistantContent) {
          await supabase.from("chat_messages").insert({
            session_id: sessionId,
            role: "assistant",
            content: fullAssistantContent,
          });

          // Check for lead capture
          const leadMatch = fullAssistantContent.match(
            /\[LEAD_CAPTURED:\s*name="([^"]*)",?\s*email="([^"]*)",?\s*phone="([^"]*)"\]/
          );
          if (leadMatch) {
            await supabase.from("leads").insert({
              session_id: sessionId,
              listing_id,
              listing_category,
              name: leadMatch[1] || null,
              email: leadMatch[2] || null,
              phone: leadMatch[3] || null,
            });
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Session-Id": sessionId,
      },
    });
  } catch (e) {
    console.error("sales-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
