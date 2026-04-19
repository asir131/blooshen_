import { cn } from "@/lib/utils";

export type OttoState = "idle" | "speaking" | "thinking" | "listening";

interface OttoAvatarProps {
  size?: number;
  state?: OttoState;
  className?: string;
  showRing?: boolean;
}

/**
 * Otto — AutoWurx AI assistant character.
 * Pure SVG, no external image. Yellow accent + dark suit.
 */
export function OttoAvatar({
  size = 40,
  state = "idle",
  className,
  showRing = true,
}: OttoAvatarProps) {
  const isThinking = state === "thinking";
  const isListening = state === "listening";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-[hsl(0_0%_8%)]",
        showRing && "ring-2 ring-primary",
        isThinking && "otto-pulse",
        state === "idle" && "otto-float",
        className,
      )}
      style={{ width: size, height: size }}
      aria-label="Otto avatar"
      role="img"
    >
      <svg
        viewBox="0 0 64 64"
        width={size * 0.78}
        height={size * 0.78}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <circle cx="32" cy="28" r="14" fill="#f1d6b3" />
        {/* Hair / cap */}
        <path
          d="M18 26 Q32 8 46 26 L46 22 Q32 12 18 22 Z"
          fill="hsl(0 0% 12%)"
        />
        {/* Yellow visor stripe */}
        <rect x="18" y="22" width="28" height="2.5" fill="hsl(50 100% 50%)" />
        {/* Eyes */}
        <circle cx="26" cy="29" r="1.6" fill="hsl(0 0% 12%)" />
        <circle cx="38" cy="29" r="1.6" fill="hsl(0 0% 12%)" />
        {/* Smile */}
        <path
          d="M27 35 Q32 38 37 35"
          stroke="hsl(0 0% 12%)"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Suit / shoulders */}
        <path
          d="M10 64 Q10 46 22 44 L42 44 Q54 46 54 64 Z"
          fill="hsl(0 0% 14%)"
        />
        {/* Yellow collar */}
        <path
          d="M22 44 L32 52 L42 44 L40 48 L32 56 L24 48 Z"
          fill="hsl(50 100% 50%)"
        />
        {/* Badge */}
        <circle cx="44" cy="50" r="2" fill="hsl(50 100% 50%)" />
      </svg>

      {/* Speaking waveform */}
      {state === "speaking" && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end h-3">
          <span className="otto-wave-bar" />
          <span className="otto-wave-bar" />
          <span className="otto-wave-bar" />
        </div>
      )}

      {/* Listening mic glow */}
      {isListening && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary/30 otto-pulse" />
      )}
    </div>
  );
}
