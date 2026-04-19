import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { OttoAvatar } from "./OttoAvatar";
import { OttoChatPanel, OttoMessage } from "./OttoChatPanel";
import {
  resolvePageKey,
  getOpenerConfig,
  shouldHideOtto,
  isDismissedRecently,
  getVoiceEnabled,
  getOrCreateSessionId,
} from "@/lib/otto-context";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/otto-chat`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/otto-tts`;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function OttoProvider() {
  const { pathname } = useLocation();
  const hidden = shouldHideOtto(pathname);

  const [open, setOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [messages, setMessages] = useState<OttoMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [voiceOn, setVoiceOn] = useState<boolean>(() => getVoiceEnabled());

  const conversationIdRef = useRef(uid());
  const sessionIdRef = useRef(getOrCreateSessionId());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const proactiveFiredForPathRef = useRef<string | null>(null);

  const pageKey = useMemo(() => resolvePageKey(pathname), [pathname]);
  const opener = useMemo(() => getOpenerConfig(pageKey), [pageKey]);

  // Proactive opener trigger
  useEffect(() => {
    if (hidden) return;
    if (open) return;
    if (isDismissedRecently()) return;
    if (proactiveFiredForPathRef.current === pathname) return;

    const timer = setTimeout(() => {
      proactiveFiredForPathRef.current = pathname;
      // Only seed if no messages yet on this path
      setMessages((prev) => {
        if (prev.length > 0) return prev;
        return [
          {
            id: uid(),
            role: "assistant",
            content: opener.message,
            quickReplies: opener.quickReplies,
          },
        ];
      });
      setHasNotification(true);
    }, opener.delayMs);

    return () => clearTimeout(timer);
  }, [pathname, hidden, open, opener]);

  // Clear notification when opened
  useEffect(() => {
    if (open) setHasNotification(false);
  }, [open]);

  const playVoice = useCallback(async (text: string, messageId: string) => {
    if (!voiceOn || !text) return;
    try {
      const resp = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text }),
      });
      if (!resp.ok) return;
      // If TTS provider failed, edge function returns JSON {fallback:true} — skip silently
      const contentType = resp.headers.get("content-type") || "";
      if (!contentType.startsWith("audio/")) return;
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      setSpeakingMessageId(messageId);
      audio.onended = () => {
        setSpeakingMessageId(null);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setSpeakingMessageId(null);
        URL.revokeObjectURL(url);
      };
      await audio.play();
    } catch {
      setSpeakingMessageId(null);
    }
  }, [voiceOn]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: OttoMessage = { id: uid(), role: "user", content: text };
      const assistantMsg: OttoMessage = { id: uid(), role: "assistant", content: "" };
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      let assistantContent = "";
      let handoff = false;

      try {
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            message: text,
            conversation_id: conversationIdRef.current,
            session_id: sessionIdRef.current,
            history,
            context: {
              current_page: pathname,
              current_listing: null,
              listing_id: null,
              listing_category: null,
            },
          }),
        });

        if (!resp.ok || !resp.body) throw new Error("Chat failed");

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (!json) continue;
            try {
              const evt = JSON.parse(json);
              if (evt.delta) {
                assistantContent += evt.delta;
                // Strip signal tags from displayed text live
                const display = assistantContent
                  .replace(/\[HANDOFF:.*?\]/gi, "")
                  .replace(/\[LEAD:.*?\]/gi, "");
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsg.id ? { ...m, content: display } : m,
                  ),
                );
              }
              if (evt.done) {
                handoff = !!evt.handoff;
              }
            } catch {
              /* skip */
            }
          }
        }

        // Finalize message
        const cleaned = assistantContent
          .replace(/\[HANDOFF:.*?\]/gi, "")
          .replace(/\[LEAD:.*?\]/gi, "")
          .trim();

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id
              ? { ...m, content: cleaned, showHandoff: handoff }
              : m,
          ),
        );

        // Voice playback
        if (cleaned) playVoice(cleaned, assistantMsg.id);
      } catch (err) {
        console.error("Otto error", err);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id
              ? {
                  ...m,
                  content:
                    "Something went sideways on my end. Try again or connect with a broker directly.",
                }
              : m,
          ),
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, messages, pathname, playVoice],
  );

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      setMessages([
        {
          id: uid(),
          role: "assistant",
          content: opener.message,
          quickReplies: opener.quickReplies,
        },
      ]);
    }
  };

  const handleToggleVoice = (next: boolean) => {
    setVoiceOn(next);
    if (!next && audioRef.current) {
      audioRef.current.pause();
      setSpeakingMessageId(null);
    }
  };

  if (hidden) return null;

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={handleOpen}
          aria-label="Open Otto AI chat assistant"
          className="fixed bottom-24 right-5 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110 active:scale-95 otto-pulse max-md:bottom-20 max-md:h-13 max-md:w-13"
        >
          <OttoAvatar size={48} state="idle" showRing={false} />
          {hasNotification && (
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-destructive ring-2 ring-background" />
          )}
        </button>
      )}

      <OttoChatPanel
        open={open}
        onClose={() => setOpen(false)}
        onMinimize={() => setOpen(false)}
        messages={messages}
        isStreaming={isStreaming}
        onSend={sendMessage}
        pageQuickReplies={opener.quickReplies}
        speakingMessageId={speakingMessageId}
        onToggleVoice={handleToggleVoice}
      />
    </>
  );
}
