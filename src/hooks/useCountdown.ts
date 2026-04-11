import { useState, useEffect, useRef } from "react";

export function useCountdown(initialMs: number) {
  const [remaining, setRemaining] = useState(initialMs);
  const endRef = useRef(Date.now() + initialMs);

  useEffect(() => {
    endRef.current = Date.now() + initialMs;
    setRemaining(initialMs);
  }, [initialMs]);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      const left = Math.max(0, endRef.current - Date.now());
      setRemaining(left);
      if (left <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [remaining > 0]);

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const ended = remaining <= 0;
  const isUrgent = remaining > 0 && remaining < 900_000; // <15min
  const isWarning = remaining > 0 && remaining < 3600_000 && !isUrgent; // 15min-1hr

  const formatted = ended
    ? "ENDED"
    : days > 0
    ? `${days}d ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return { remaining, formatted, ended, isUrgent, isWarning, days, hours, minutes, seconds };
}
