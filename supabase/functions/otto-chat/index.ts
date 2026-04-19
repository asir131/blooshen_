import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Otto, the AutoWurx AI shopping assistant.

AutoWurx is an automotive marketplace with 6 directories: Cars for Sale, Parts & Accessories, Service Providers, Rentals, Neighborhood Experts & Reviews, and Events & Meetups. AutoWurx also has Auctions, Cash Deals, an Affiliate/Promoter program, and Neighborhood Brokers who help buyers find vehicles.

Your job:
- Help users find the right vehicle, part, rental, service, or event based on their needs
- Answer questions about listings using the listing context provided
- Guide users through the buying process step by step
- Recommend relevant AutoWurx features (Auto Report, Cash Deals, Auctions, Brokers)
- When a user is ready to buy or wants human help, offer to connect them with a Neighborhood Broker

Your personality:
- Friendly, direct, and knowledgeable — like a trusted car-savvy friend
- Never pushy or salesy
- Always honest about limitations
- Use casual but professional language
- Keep responses concise (2-4 sentences max unless the user asks for detail)
- Use specific numbers, prices, and details when available from the listing context

When the user wants to talk to a human broker, is ready to buy, asks "connect me with a broker", "talk to someone", "I'm ready", or expresses strong purchase intent, end your response with the exact tag [HANDOFF: requested] on a new line.

When the user provides their name + phone or email, end your response with the exact tag [LEAD: name="...", email="...", phone="..."] on a new line.

Never make up listing details, prices, or vehicle specifications. Only use what's provided in the context.`;

interface ChatBody {
  message: string;
  conversation_id: string;
  session_id: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  context: {
    current_page?: string;
    current_listing?: Record<string, unknown> | null;
    listing_id?: string | null;
    listing_category?: string | null;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = (await req.json()) as ChatBody;
    if (!body?.message || !body?.conversation_id || !body?.session_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Resolve user_id from JWT if present (optional)
    let userId: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.slice(7);
        const { data } = await supabase.auth.getUser(token);
        userId = data.user?.id ?? null;
      } catch {
        /* ignore — anonymous */
      }
    }

    // Persist user message
    await supabase.from("otto_conversations").insert({
      conversation_id: body.conversation_id,
      session_id: body.session_id,
      user_id: userId,
      role: "user",
      content: body.message,
      page_context: body.context?.current_page ?? null,
      listing_context_id: body.context?.listing_id ?? null,
      listing_context_type: body.context?.listing_category ?? null,
    });

    // Build context blocks
    const contextBlock = body.context?.current_listing
      ? `\n\nCURRENT LISTING CONTEXT (${body.context.listing_category}):\n${JSON.stringify(
          body.context.current_listing,
          null,
          2,
        )}`
      : "";
    const pageBlock = body.context?.current_page
      ? `\nUser is currently on page: ${body.context.current_page}`
      : "";

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT + pageBlock + contextBlock },
      ...body.history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: body.message },
    ];

    // Call Lovable AI Gateway (OpenAI-compatible, streaming)
    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        stream: true,
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("Lovable AI error", aiResp.status, errText);
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add credits in Lovable Cloud." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ error: "Otto is having trouble right now." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Transform OpenAI SSE → simple SSE with {delta:"..."} JSON lines
    let fullContent = "";
    const reader = aiResp.body!.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const json = line.slice(6).trim();
              if (!json || json === "[DONE]") continue;
              try {
                const evt = JSON.parse(json);
                const delta = evt.choices?.[0]?.delta?.content as string | undefined;
                if (delta) {
                  fullContent += delta;
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`),
                  );
                }
              } catch {
                /* skip malformed */
              }
            }
          }

          // Detect signals from full content
          const handoff = /\[HANDOFF:\s*requested\]/i.test(fullContent);
          const leadMatch = fullContent.match(
            /\[LEAD:\s*name="([^"]*)",?\s*email="([^"]*)",?\s*phone="([^"]*)"\]/i,
          );
          const cleaned = fullContent
            .replace(/\[HANDOFF:.*?\]/gi, "")
            .replace(/\[LEAD:.*?\]/gi, "")
            .trim();

          // Persist assistant message
          await supabase.from("otto_conversations").insert({
            conversation_id: body.conversation_id,
            session_id: body.session_id,
            user_id: userId,
            role: "assistant",
            content: cleaned,
            page_context: body.context?.current_page ?? null,
            listing_context_id: body.context?.listing_id ?? null,
            listing_context_type: body.context?.listing_category ?? null,
            intent_signal: handoff,
            broker_handoff_triggered: handoff,
          });

          if (leadMatch) {
            await supabase.from("leads").insert({
              session_id: null,
              listing_id: body.context?.listing_id ?? "otto-chat",
              listing_category: (body.context?.listing_category as
                | "cars_for_sale"
                | "parts_accessories"
                | "service_providers"
                | "rentals"
                | "neighborhood_experts"
                | "events_meetups") ?? "cars_for_sale",
              name: leadMatch[1] || null,
              email: leadMatch[2] || null,
              phone: leadMatch[3] || null,
            });
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, handoff, lead_captured: !!leadMatch })}\n\n`,
            ),
          );
          controller.close();
        } catch (err) {
          console.error("Otto stream error", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    console.error("otto-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", fallback: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
