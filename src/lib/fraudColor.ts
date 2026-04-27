/**
 * Returns the canonical fraud-score color tokens used across the admin UI.
 * 0–30 green, 31–60 amber, 61+ red.
 */
export function fraudTier(score: number): "low" | "medium" | "high" {
  if (score <= 30) return "low";
  if (score <= 60) return "medium";
  return "high";
}

export function fraudTextClass(score: number): string {
  const t = fraudTier(score);
  return t === "low"
    ? "text-emerald-400"
    : t === "medium"
      ? "text-amber-400"
      : "text-red-400";
}

export function fraudBgClass(score: number): string {
  const t = fraudTier(score);
  return t === "low" ? "bg-emerald-500" : t === "medium" ? "bg-amber-500" : "bg-red-500";
}
