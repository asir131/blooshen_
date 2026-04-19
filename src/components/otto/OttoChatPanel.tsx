import { useEffect, useRef, useState, useCallback, FormEvent } from "react";
import { X, Send, Mic, MicOff, Volume2, VolumeX, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OttoAvatar, OttoState } from "./OttoAvatar";
import { BrokerHandoffCard } from "./BrokerHandoffCard";
import {
  getVoiceEnabled,
  setVoiceEnabled,
  recordDismissal,
} from "@/lib/otto-context";

export interface OttoMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  showHandoff?: boolean;
  quickReplies?: string[];
}

interface OttoChatPanelProps {
  open: boolean;
  onClose: () => void;
  onMinimize: () => void;
  messages: OttoMessage[];
  isStreaming: boolean;
  onSend: (text: string) => void;
  pageQuickReplies?: string[];
  preferredSpecialties?: string[];
  speakingMessageId?: string | null;
  onToggleVoice: (enabled: boolean) => void;
}

// Web Speech API typings (loose — vendor-prefixed)
interface SpeechRecognitionLike {
  start(): void;
  stop(): void;
  onresult: (event: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void;
  onend: () => void;
  onerror: () => void;
}

export function OttoChatPanel({
  open,
  onClose,
  onMinimize,
  messages,
  isStreaming,
  onSend,
  pageQuickReplies,
  preferredSpecialties,
  speakingMessageId,
  onToggleVoice,
}: OttoChatPanelProps) {
  const [input, setInput] = useState("");
  const [voiceOn, setVoiceOn] = useState<boolean>(() => getVoiceEnabled());
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    if (open) {
      // Focus input on open (next tick)
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    onSend(text);
    setInput("");
  };

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    setVoiceEnabled(next);
    onToggleVoice(next);
  };

  const startListening = () => {
    const W = window as unknown as {
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      SpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    recognitionRef.current = rec;
    rec.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      const transcript = last[0].transcript;
      setInput(transcript);
      if (last.isFinal) {
        onSend(transcript);
        setInput("");
      }
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleClose = () => {
    recordDismissal();
    onClose();
  };

  if (!open) return null;

  const lastMsg = messages[messages.length - 1];
  const ottoState: OttoState = isStreaming
    ? "thinking"
    : speakingMessageId
      ? "speaking"
      : listening
        ? "listening"
        : "idle";

  const supportsSpeechRecognition =
    typeof window !== "undefined" &&
    !!(
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition ||
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition
    );

  return (
    <div
      role="dialog"
      aria-label="Otto AI assistant"
      className={cn(
        "fixed z-[9999] otto-slide-up",
        "bottom-24 right-5 w-[360px] max-w-[calc(100vw-2.5rem)]",
        "md:bottom-24",
        "max-md:left-0 max-md:right-0 max-md:bottom-16 max-md:w-full max-md:max-w-none",
      )}
      style={{
        height: "min(520px, calc(100vh - 140px))",
      }}
    >
      <div className="flex h-full flex-col rounded-2xl max-md:rounded-b-none border border-primary/40 bg-[hsl(0_0%_10%)] shadow-[0_-4px_40px_rgba(255,224,0,0.12)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-[hsl(0_0%_6%)] px-3 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <OttoAvatar size={36} state={ottoState} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-foreground leading-tight">Otto</p>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[hsl(142_71%_45%)]" />
                <span className="text-[10px] text-muted-foreground">Online</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">
                AutoWurx AI assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={toggleVoice}
              aria-label={voiceOn ? "Mute Otto voice" : "Enable Otto voice"}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                voiceOn
                  ? "text-primary hover:bg-primary/10"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {voiceOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              onClick={onMinimize}
              aria-label="Minimize Otto"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={handleClose}
              aria-label="Close Otto"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          aria-live="polite"
          className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
        >
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              <div
                className={cn(
                  "flex gap-2",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {msg.role === "assistant" && (
                  <div className="shrink-0 mt-0.5">
                    <OttoAvatar
                      size={24}
                      state={speakingMessageId === msg.id ? "speaking" : "idle"}
                      showRing={false}
                    />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] px-3 py-2 text-[13px] leading-relaxed",
                    msg.role === "user"
                      ? "bg-[hsl(50_100%_8%)] border border-primary/30 rounded-[12px_0_12px_12px] text-foreground"
                      : "bg-[hsl(0_0%_14%)] border border-border rounded-[0_12px_12px_12px] text-foreground",
                  )}
                >
                  {msg.content || (msg.role === "assistant" && isStreaming ? "…" : "")}
                </div>
              </div>

              {/* Quick replies under last assistant msg */}
              {msg.role === "assistant" &&
                msg === lastMsg &&
                !isStreaming &&
                msg.quickReplies &&
                msg.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pl-8">
                    {msg.quickReplies.map((q) => (
                      <button
                        key={q}
                        onClick={() => onSend(q)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-[hsl(0_0%_14%)] border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

              {/* Broker handoff card */}
              {msg.role === "assistant" && msg.showHandoff && (
                <div className="pl-8">
                  <BrokerHandoffCard preferredSpecialties={preferredSpecialties} />
                </div>
              )}
            </div>
          ))}

          {isStreaming && lastMsg?.role === "user" && (
            <div className="flex gap-2 justify-start">
              <div className="shrink-0 mt-0.5">
                <OttoAvatar size={24} state="thinking" showRing={false} />
              </div>
              <div className="bg-[hsl(0_0%_14%)] border border-border rounded-[0_12px_12px_12px] px-3 py-2.5">
                <span className="otto-typing-dot" />
                <span className="otto-typing-dot" />
                <span className="otto-typing-dot" />
              </div>
            </div>
          )}

          {/* Always-visible page quick replies if no chat yet */}
          {messages.length === 1 && pageQuickReplies && pageQuickReplies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pl-8">
              {pageQuickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => onSend(q)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-[hsl(0_0%_14%)] border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-border bg-[hsl(0_0%_6%)] px-3 py-2.5"
        >
          <div className="flex items-center gap-2">
            {supportsSpeechRecognition && (
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                aria-label={listening ? "Stop voice input" : "Start voice input"}
                className={cn(
                  "shrink-0 rounded-full p-2 transition-colors",
                  listening
                    ? "bg-primary text-primary-foreground otto-pulse"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {listening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>
            )}
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Otto anything…"
              className="flex-1 h-9 rounded-full bg-[hsl(0_0%_10%)] border border-border px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              disabled={isStreaming}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isStreaming}
              className="h-9 w-9 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
            Powered by AutoWurx AI
          </p>
        </form>
      </div>
    </div>
  );
}
