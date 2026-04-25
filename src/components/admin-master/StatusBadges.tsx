import { cn } from "@/lib/utils";

export const StatusBadge = ({ status }: { status: string | null | undefined }) => {
  const map: Record<string, { label: string; className: string; icon?: string }> = {
    draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
    pending_review: { label: "Pending", className: "bg-amber-500/15 text-amber-400 border border-amber-500/30", icon: "⏳" },
    approved: { label: "Approved", className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30", icon: "✅" },
    rejected: { label: "Rejected", className: "bg-red-500/15 text-red-400 border border-red-500/30", icon: "✗" },
    blocked: { label: "Blocked", className: "bg-red-500/20 text-red-300 border-2 border-red-500/60 font-bold", icon: "🚫" },
    flagged: { label: "Flagged", className: "bg-amber-500/15 text-amber-400 border border-amber-500/30", icon: "⚠" },
  };
  const cfg = map[status ?? ""] ?? { label: status ?? "—", className: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] uppercase tracking-wider", cfg.className)}>
      {cfg.icon && <span>{cfg.icon}</span>}
      {cfg.label}
    </span>
  );
};

export const ValidationBadge = ({ status }: { status: string | null | undefined }) => {
  const map: Record<string, { label: string; className: string }> = {
    passed: { label: "✅ Valid", className: "bg-emerald-500/15 text-emerald-400" },
    failed: { label: "❌ Failed", className: "bg-red-500/15 text-red-400" },
    flagged: { label: "⚠ Flagged", className: "bg-amber-500/15 text-amber-400" },
    unvalidated: { label: "— Pending", className: "bg-muted text-muted-foreground" },
  };
  const cfg = map[status ?? "unvalidated"] ?? map.unvalidated;
  return (
    <span className={cn("inline-flex rounded px-2 py-0.5 text-[11px] font-semibold", cfg.className)}>
      {cfg.label}
    </span>
  );
};

export const FraudScoreBar = ({ score }: { score: number }) => {
  const safe = Math.max(0, Math.min(100, score ?? 0));
  const color = safe <= 30 ? "bg-emerald-500" : safe <= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full transition-all", color)} style={{ width: `${safe}%` }} />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">{safe}</span>
    </div>
  );
};
