import { useEffect, useState } from "react";
import { Bot, ChevronDown, ChevronUp, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PulseDot } from "@/components/admin-master/PulseDot";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Stats {
  scannedToday: number;
  passed: number;
  flagged: number;
  blocked: number;
  lastScan: Date | null;
  issues: number;
}

const empty: Stats = {
  scannedToday: 0,
  passed: 0,
  flagged: 0,
  blocked: 0,
  lastScan: null,
  issues: 0,
};

export function IntegrityAgentWidget() {
  const [stats, setStats] = useState<Stats>(empty);
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);

  const load = async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [{ data: scans }, { count: blockedCount }, { count: openAlerts }] = await Promise.all([
      supabase
        .from("audit_logs")
        .select("created_at, metadata")
        .eq("action", "INTEGRITY_AGENT_SCAN")
        .gte("created_at", startOfDay.toISOString())
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("vehicle_listings")
        .select("id", { count: "exact", head: true })
        .eq("status", "blocked"),
      supabase
        .from("system_alerts")
        .select("id", { count: "exact", head: true })
        .eq("is_resolved", false),
    ]);

    let passed = 0;
    let flagged = 0;
    let blocked = 0;
    (scans ?? []).forEach((s) => {
      const meta = (s.metadata ?? {}) as { result?: string };
      if (meta.result === "passed") passed++;
      else if (meta.result === "flagged") flagged++;
      else if (meta.result === "failed" || meta.result === "blocked") blocked++;
    });

    setStats({
      scannedToday: scans?.length ?? 0,
      passed,
      flagged,
      blocked,
      lastScan: scans?.[0]?.created_at ? new Date(scans[0].created_at) : null,
      issues: (blockedCount ?? 0) + (openAlerts ?? 0),
    });
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("integrity-widget")
      .on("postgres_changes", { event: "*", schema: "public", table: "audit_logs" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "system_alerts" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const runScan = async () => {
    setScanning(true);
    try {
      const { data: pending } = await supabase
        .from("vehicle_listings")
        .select("id")
        .in("status", ["pending_review", "draft"])
        .limit(25);
      if (!pending?.length) {
        toast.info("No pending listings to scan");
        return;
      }
      await Promise.allSettled(
        pending.map((l) =>
          supabase.functions.invoke("integrity-agent", { body: { listing_id: l.id } }),
        ),
      );
      toast.success(`Scan complete — ${pending.length} listings`);
      load();
    } finally {
      setScanning(false);
    }
  };

  const healthy = stats.issues === 0;

  return (
    <div className="fixed bottom-4 left-4 z-30 hidden md:block">
      <div
        className={cn(
          "rounded-lg border border-border bg-card/95 shadow-lg backdrop-blur transition-all",
          open ? "w-72" : "w-auto",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2 px-3 py-2 text-left"
        >
          <Bot className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Agent:
          </span>
          <span
            className={cn(
              "text-xs font-bold",
              healthy ? "text-emerald-400" : "text-red-400",
            )}
          >
            {healthy ? "HEALTHY" : `${stats.issues} ISSUES`}
          </span>
          <PulseDot tone={healthy ? "green" : "red"} />
          <span className="ml-auto text-muted-foreground">
            {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </span>
        </button>

        {open && (
          <div className="space-y-3 border-t border-border p-3 text-xs">
            <div className="text-muted-foreground">
              Last scan:{" "}
              <span className="text-foreground">
                {stats.lastScan
                  ? formatDistanceToNow(stats.lastScan, { addSuffix: true })
                  : "never"}
              </span>
            </div>
            <div className="text-muted-foreground">
              Scanned today: <span className="text-foreground">{stats.scannedToday}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
              <div className="rounded bg-emerald-500/10 p-1.5">
                <div className="text-sm font-bold text-emerald-400">{stats.passed}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Pass
                </div>
              </div>
              <div className="rounded bg-amber-500/10 p-1.5">
                <div className="text-sm font-bold text-amber-400">{stats.flagged}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Flag
                </div>
              </div>
              <div className="rounded bg-red-500/10 p-1.5">
                <div className="text-sm font-bold text-red-400">{stats.blocked}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Block
                </div>
              </div>
            </div>
            <Button size="sm" className="w-full" onClick={runScan} disabled={scanning}>
              {scanning ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
              )}
              Run scan now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
