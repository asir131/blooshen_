import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";
import { getStoredReferral, fireConversionEvent } from "@/hooks/useReferralTracking";

type ListingCategory = Database["public"]["Enums"]["listing_category_enum"];

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SalesAgentChatProps {
  listingId: string;
  listingCategory: ListingCategory;
  listingContext: Record<string, unknown>;
  /** Custom opener override */
  openerMessage?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sales-chat`;

const CATEGORY_OPENERS: Record<ListingCategory, (ctx: Record<string, unknown>) => string> = {
  cars_for_sale: (ctx) => {
    const title = [ctx.year, ctx.make, ctx.model].filter(Boolean).join(" ");
    return `Hey! Interested in this ${title || "vehicle"}? I can answer questions, check availability, or help you schedule a test drive. 🚗`;
  },
  rentals: (ctx) => {
    const title = [ctx.year, ctx.make, ctx.model].filter(Boolean).join(" ");
    return `Looking to rent this ${title || "vehicle"}? I can check dates, explain terms, or connect you with the owner right now. 🔑`;
  },
  service_providers: () =>
    "Need this service? I can get you a quote or book an appointment today. 🔧",
  parts_accessories: () =>
    "Got questions about this part? I can confirm compatibility with your vehicle. ⚙️",
  neighborhood_experts: () =>
    "Looking for expert advice? I can help connect you with this specialist. 🌟",
  events_meetups: () =>
    "Interested in this event? I can share details or help you RSVP. 🎉",
};

function cleanLeadTag(content: string): string {
  return content.replace(/\[LEAD_CAPTURED:.*?\]/g, "").trim();
}

export default function SalesAgentChat({
  listingId,
  listingCategory,
  listingContext,
  openerMessage,
}: SalesAgentChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-open after 8 seconds
  useEffect(() => {
    if (hasAutoOpened) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasAutoOpened(true);
      const opener =
        openerMessage || CATEGORY_OPENERS[listingCategory](listingContext);
      setMessages([{ role: "assistant", content: opener }]);
    }, 8000);
    return () => clearTimeout(timer);
  }, [hasAutoOpened, listingCategory, listingContext, openerMessage]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    if (messages.length === 0) {
      const opener =
        openerMessage || CATEGORY_OPENERS[listingCategory](listingContext);
      setMessages([{ role: "assistant", content: opener }]);
    }
  }, [messages.length, openerMessage, listingCategory, listingContext]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          session_id: sessionId,
          listing_context: listingContext,
          listing_category: listingCategory,
          listing_id: listingId,
        }),
      });

      // Capture session ID from header
      const newSessionId = resp.headers.get("X-Session-Id");
      if (newSessionId) setSessionId(newSessionId);

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to get response");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > updatedMessages.length) {
                  return prev.map((m, i) =>
                    i === prev.length - 1
                      ? { ...m, content: cleanLeadTag(assistantContent) }
                      : m
                  );
                }
                return [
                  ...prev,
                  { role: "assistant", content: cleanLeadTag(assistantContent) },
                ];
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Fire lead conversion if contact was captured
      if (assistantContent.includes("[LEAD_CAPTURED:")) {
        const referral = getStoredReferral();
        if (referral) {
          fireConversionEvent({
            listing_id: listingId,
            listing_category: listingCategory,
            conversion_type: "lead",
          });
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, sessionId, listingContext, listingCategory, listingId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat bubble trigger */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_hsl(50_100%_50%/0.3)] transition-transform hover:scale-110 active:scale-95"
          aria-label="Open chat"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 flex w-[360px] max-w-[calc(100vw-2.5rem)] flex-col rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
          style={{ height: "min(520px, calc(100vh - 140px))" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-foreground">
                  AutoWurx Assistant
                </p>
                <p className="text-[11px] text-muted-foreground font-body">
                  Typically replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm font-body leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-2 justify-start">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
                <div className="rounded-lg bg-muted px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border px-3 py-3">
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 h-9 text-sm"
                disabled={isLoading}
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="h-9 w-9 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground font-body">
              Powered by AutoWurx AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
