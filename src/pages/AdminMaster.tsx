import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Car,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Ban,
  ImageOff,
  Loader2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import MasterAdminLayout from "@/components/admin-master/MasterAdminLayout";
import { PulseDot } from "@/components/admin-master/PulseDot";
import { StatusBadge, ValidationBadge, FraudScoreBar } from "@/components/admin-master/StatusBadges";
import { formatDistanceToNow } from "date-fns";

type Counts = {
  total: number;
  approved: number;
  pending: number;
  flagged: number;
  blocked: number;
  missingImages: number;
};

type ListingRow = {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  status: string;
  validation_status: string;
  fraud_score: number;
  updated_at: string;
  created_by: string;
};

type AlertRow = {
  id: string;
  alert_type: string;
  title: string;
  message: string;
  listing_id: string | null;
  created_at: string;
  is_resolved: boolean;
};

type AuditRow = {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  user_id: string | null;
};

const AdminMaster = () => {
  const { user, isMasterAdmin } = useAuth();
  const [counts, setCounts] = useState<Counts>({
    total: 0,
    approved: 0,
    pending: 0,
    flagged: 0,
    blocked: 0,
    missingImages: 0,
  });
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [agentLogs, setAgentLogs] = useState<AuditRow[]>([]);
  const [adminLogs, setAdminLogs] = useState<AuditRow[]>([]);
  const [profilesByUser, setProfilesByUser] = useState<Record<string, { full_name: string | null; email: string | null }>>({});
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const [scanning, setScanning] = useState(false);
  const [vinByListing, setVinByListing] = useState<Record<string, string>>({});

  const loadAll = async () => {
    // counts
    const [
      total,
      approved,
      pending,
      flagged,
      blocked,
      imgRows,
      listingsRes,
      alertsRes,
      agentLogsRes,
      adminLogsRes,
    ] = await Promise.all([
      supabase.from("vehicle_listings").select("id", { count: "exact", head: true }),
      supabase
        .from("vehicle_listings")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved")
        .eq("is_published", true),
      supabase
        .from("vehicle_listings")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_review"),
      supabase
        .from("vehicle_listings")
        .select("id", { count: "exact", head: true })
        .eq("validation_status", "flagged"),
      supabase
        .from("vehicle_listings")
        .select("id", { count: "exact", head: true })
        .eq("status", "blocked"),
      supabase.from("listing_images").select("listing_id"),
      supabase
        .from("vehicle_listings")
        .select("id, vin, make, model, year, status, validation_status, fraud_score, updated_at, created_by")
        .order("updated_at", { ascending: false })
        .limit(15),
      supabase
        .from("system_alerts")
        .select("id, alert_type, title, message, listing_id, created_at, is_resolved")
        .eq("is_resolved", false)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("audit_logs")
        .select("id, action, entity_type, entity_id, metadata, created_at, user_id")
        .eq("action", "INTEGRITY_AGENT_SCAN")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("audit_logs")
        .select("id, action, entity_type, entity_id, metadata, created_at, user_id")
        .neq("action", "INTEGRITY_AGENT_SCAN")
        .not("user_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    // missing images: total listings minus those with >=3 imgs
    const imgCounts: Record<string, number> = {};
    (imgRows.data ?? []).forEach((r) => {
      imgCounts[r.listing_id] = (imgCounts[r.listing_id] ?? 0) + 1;
    });
    const totalListings = total.count ?? 0;
    const enough = Object.values(imgCounts).filter((n) => n >= 3).length;
    const missingImages = Math.max(0, totalListings - enough);

    setCounts({
      total: totalListings,
      approved: approved.count ?? 0,
      pending: pending.count ?? 0,
      flagged: flagged.count ?? 0,
      blocked: blocked.count ?? 0,
      missingImages,
    });

    setListings((listingsRes.data as ListingRow[]) ?? []);
    setAlerts((alertsRes.data as AlertRow[]) ?? []);
    setAgentLogs((agentLogsRes.data as AuditRow[]) ?? []);
    setAdminLogs((adminLogsRes.data as AuditRow[]) ?? []);

    if (agentLogsRes.data?.[0]?.created_at) {
      setLastScan(new Date(agentLogsRes.data[0].created_at));
    }

    // resolve user names + listing VINs for joins
    const userIds = Array.from(
      new Set(
        [
          ...(adminLogsRes.data ?? []).map((r) => r.user_id),
          ...(listingsRes.data ?? []).map((r) => r.created_by),
        ].filter(Boolean) as string[],
      ),
    );
    if (userIds.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);
      const map: Record<string, { full_name: string | null; email: string | null }> = {};
      (profs ?? []).forEach((p) => {
        map[p.id] = { full_name: p.full_name, email: p.email };
      });
      setProfilesByUser(map);
    }

    const listingIds = Array.from(
      new Set(
        [
          ...(agentLogsRes.data ?? []).map((r) => r.entity_id),
          ...(adminLogsRes.data ?? []).map((r) => r.entity_id),
          ...(alertsRes.data ?? []).map((r) => r.listing_id),
        ].filter(Boolean) as string[],
      ),
    );
    if (listingIds.length) {
      const { data: vls } = await supabase
        .from("vehicle_listings")
        .select("id, vin")
        .in("id", listingIds);
      const map: Record<string, string> = {};
      (vls ?? []).forEach((r) => {
        map[r.id] = r.vin;
      });
      setVinByListing((prev) => ({ ...prev, ...map }));
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel("master-admin-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "system_alerts" }, () => loadAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "vehicle_listings" }, () => loadAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "audit_logs" }, () => loadAll())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const isHealthy = counts.blocked === 0 && alerts.filter((a) => a.alert_type === "critical").length === 0;
  const issueCount = counts.blocked + alerts.filter((a) => !a.is_resolved).length;

  const runFullScan = async () => {
    setScanning(true);
    try {
      const { data: pending } = await supabase
        .from("vehicle_listings")
        .select("id")
        .in("status", ["pending_review", "draft"])
        .limit(50);
      if (!pending?.length) {
        toast.info("No pending listings to scan");
        return;
      }
      const results = await Promise.allSettled(
        pending.map((l) => supabase.functions.invoke("integrity-agent", { body: { listing_id: l.id } })),
      );
      const ok = results.filter((r) => r.status === "fulfilled").length;
      toast.success(`Scanned ${ok}/${pending.length} listings`);
      loadAll();
    } catch (err) {
      toast.error("Scan failed", { description: (err as Error).message });
    } finally {
      setScanning(false);
    }
  };

  const resolveAlert = async (id: string) => {
    if (!isMasterAdmin || !user) return;
    const { error } = await supabase
      .from("system_alerts")
      .update({ is_resolved: true, resolved_at: new Date().toISOString(), resolved_by: user.id })
      .eq("id", id);
    if (error) {
      toast.error("Could not resolve alert");
      return;
    }
    toast.success("Alert resolved");
  };

  const kpis = useMemo(
    () => [
      { label: "Total Listings", value: counts.total, icon: Car, accent: "border-l-primary" },
      { label: "Approved & Live", value: counts.approved, icon: CheckCircle2, accent: "border-l-emerald-500" },
      { label: "Pending Review", value: counts.pending, icon: Clock, accent: "border-l-amber-500" },
      { label: "Flagged", value: counts.flagged, icon: AlertTriangle, accent: "border-l-amber-500" },
      { label: "Blocked", value: counts.blocked, icon: Ban, accent: "border-l-red-500" },
      { label: "Missing Images", value: counts.missingImages, icon: ImageOff, accent: "border-l-red-500" },
    ],
    [counts],
  );

  return (
    <MasterAdminLayout>
      {/* SECTION 1 — System Health */}
      <Card className="mb-6 border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div className="font-heading text-sm uppercase tracking-widest text-muted-foreground">
              AutoWurx Integrity Agent
            </div>
            <PulseDot tone={isHealthy ? "green" : "red"} />
            <span className={isHealthy ? "text-sm font-bold text-emerald-400" : "text-sm font-bold text-red-400"}>
              {isHealthy ? "SYSTEM HEALTHY" : `${issueCount} ISSUES DETECTED`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Last scan: {lastScan ? formatDistanceToNow(lastScan, { addSuffix: true }) : "never"}
            </span>
            <Button size="sm" onClick={runFullScan} disabled={scanning}>
              {scanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Run Full Scan
            </Button>
          </div>
        </div>
      </Card>

      {/* SECTION 2 — KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card
              key={k.label}
              className={`group border-l-4 ${k.accent} border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div className="mt-2 font-heading text-5xl font-bold leading-none text-foreground">
                {k.value}
              </div>
              <div className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
            </Card>
          );
        })}
      </div>

      {/* SECTION 3 — Two-column */}
      <div className="mb-6 grid gap-4 lg:grid-cols-5">
        {/* Recent Listings */}
        <Card className="border-border bg-card p-0 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-sm uppercase tracking-widest text-foreground">
                Recent Listings Activity
              </h2>
              <PulseDot tone="green" />
            </div>
            <Link to="/admin/inventory" className="text-xs uppercase tracking-wider text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">VIN</th>
                  <th className="px-4 py-2 text-left">Vehicle</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Validation</th>
                  <th className="px-4 py-2 text-left">Score</th>
                  <th className="px-4 py-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {listings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                      No listings yet.
                    </td>
                  </tr>
                )}
                {listings.map((l) => (
                  <tr key={l.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{l.vin}</td>
                    <td className="px-4 py-2">
                      {l.year} {l.make} {l.model}
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="px-4 py-2">
                      <ValidationBadge status={l.validation_status} />
                    </td>
                    <td className="px-4 py-2">
                      <FraudScoreBar score={l.fraud_score ?? 0} />
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(l.updated_at), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Alerts feed */}
        <Card className="border-border bg-card p-0 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-sm uppercase tracking-widest text-foreground">
                Integrity Alerts
              </h2>
              <PulseDot tone={alerts.length ? "red" : "green"} />
            </div>
            <Link to="/admin/alerts" className="text-xs uppercase tracking-wider text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="max-h-[460px] space-y-2 overflow-y-auto p-3">
            {alerts.length === 0 && (
              <div className="rounded-md bg-emerald-500/10 p-4 text-center text-sm text-emerald-400">
                ✅ No active alerts. System integrity is healthy.
              </div>
            )}
            {alerts.map((a) => {
              const icon = a.alert_type === "critical" ? "🔴" : a.alert_type === "warning" ? "🟡" : "🔵";
              return (
                <div
                  key={a.id}
                  className="rounded-md border border-border bg-background/50 p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span>{icon}</span>
                      <span className="font-semibold text-foreground">{a.title}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{a.message}</p>
                  {a.listing_id && vinByListing[a.listing_id] && (
                    <Link
                      to="/admin/inventory"
                      className="mt-1 inline-block font-mono text-[11px] text-primary hover:underline"
                    >
                      {vinByListing[a.listing_id]}
                    </Link>
                  )}
                  {isMasterAdmin && (
                    <div className="mt-2 flex justify-end">
                      <Button size="sm" variant="ghost" onClick={() => resolveAlert(a.id)}>
                        Resolve
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* SECTION 4 — Agent log */}
      <Card className="mb-6 border-border bg-card p-0">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-heading text-sm uppercase tracking-widest text-foreground">
            Agent Activity Log
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">VIN</th>
                <th className="px-4 py-2 text-left">Result</th>
                <th className="px-4 py-2 text-left">Flags</th>
                <th className="px-4 py-2 text-left">Score</th>
                <th className="px-4 py-2 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              {agentLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                    Agent has not run yet.
                  </td>
                </tr>
              )}
              {agentLogs.map((log) => {
                const meta = (log.metadata ?? {}) as { result?: string; flags?: string[]; score?: number; duration_ms?: number };
                const result = (meta.result ?? "").toUpperCase();
                const tone =
                  result === "PASSED"
                    ? "text-emerald-400"
                    : result === "BLOCKED" || result === "FAILED"
                    ? "text-red-400"
                    : "text-amber-400";
                return (
                  <tr key={log.id} className="border-t border-border">
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">
                      {log.entity_id ? vinByListing[log.entity_id] ?? log.entity_id.slice(0, 8) : "—"}
                    </td>
                    <td className={`px-4 py-2 font-bold ${tone}`}>{result || "—"}</td>
                    <td className="px-4 py-2 text-xs">{meta.flags?.length ?? 0}</td>
                    <td className="px-4 py-2 text-xs tabular-nums">{meta.score ?? 0}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {meta.duration_ms ? `${meta.duration_ms}ms` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SECTION 5 — Admin activity */}
      <Card className="border-border bg-card p-0">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-heading text-sm uppercase tracking-widest text-foreground">
            Admin Activity
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Admin</th>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Entity</th>
                <th className="px-4 py-2 text-left">Reference</th>
                <th className="px-4 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {adminLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                    No admin activity yet.
                  </td>
                </tr>
              )}
              {adminLogs.map((log) => {
                const prof = log.user_id ? profilesByUser[log.user_id] : undefined;
                const tone: Record<string, string> = {
                  CREATED: "text-blue-400",
                  EDITED: "text-amber-400",
                  DELETED: "text-red-400",
                  APPROVED: "text-emerald-400",
                  REJECTED: "text-red-400",
                  PUBLISHED: "text-emerald-400",
                };
                return (
                  <tr key={log.id} className="border-t border-border">
                    <td className="px-4 py-2 text-sm">
                      {prof?.full_name ?? prof?.email ?? "—"}
                    </td>
                    <td className={`px-4 py-2 text-xs font-bold uppercase ${tone[log.action] ?? "text-muted-foreground"}`}>
                      {log.action}
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{log.entity_type}</td>
                    <td className="px-4 py-2 font-mono text-xs">
                      {log.entity_id ? vinByListing[log.entity_id] ?? log.entity_id.slice(0, 8) : "—"}
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </MasterAdminLayout>
  );
};

export default AdminMaster;
