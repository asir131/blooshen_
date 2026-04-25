import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MasterAdminLayout from "@/components/admin-master/MasterAdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

type Alert = {
  id: string;
  alert_type: string;
  title: string;
  message: string;
  listing_id: string | null;
  is_resolved: boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
};

type Filter = "all" | "critical" | "warning" | "info" | "resolved";

const filterTabs: { key: Filter; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "" },
  { key: "critical", label: "Critical", icon: "🔴" },
  { key: "warning", label: "Warning", icon: "🟡" },
  { key: "info", label: "Info", icon: "🔵" },
  { key: "resolved", label: "Resolved", icon: "✅" },
];

const AdminAlerts = () => {
  const { user, isMasterAdmin } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [vinByListing, setVinByListing] = useState<Record<string, { vin: string; make: string; model: string; status: string }>>({});

  const load = async () => {
    const { data } = await supabase
      .from("system_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    setAlerts((data as Alert[]) ?? []);

    const ids = Array.from(new Set((data ?? []).map((d) => d.listing_id).filter(Boolean) as string[]));
    if (ids.length) {
      const { data: vls } = await supabase
        .from("vehicle_listings")
        .select("id, vin, make, model, status")
        .in("id", ids);
      const map: Record<string, { vin: string; make: string; model: string; status: string }> = {};
      (vls ?? []).forEach((r) => {
        map[r.id] = { vin: r.vin, make: r.make, model: r.model, status: r.status };
      });
      setVinByListing(map);
    }
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("admin-alerts")
      .on("postgres_changes", { event: "*", schema: "public", table: "system_alerts" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "resolved") return alerts.filter((a) => a.is_resolved);
    if (filter === "all") return alerts.filter((a) => !a.is_resolved);
    return alerts.filter((a) => !a.is_resolved && a.alert_type === filter);
  }, [alerts, filter]);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const resolveOne = async (id: string) => {
    if (!user) return;
    await supabase
      .from("system_alerts")
      .update({ is_resolved: true, resolved_at: new Date().toISOString(), resolved_by: user.id })
      .eq("id", id);
    toast.success("Resolved");
  };

  const bulkResolve = async () => {
    if (!user || !selected.size) return;
    await supabase
      .from("system_alerts")
      .update({ is_resolved: true, resolved_at: new Date().toISOString(), resolved_by: user.id })
      .in("id", Array.from(selected));
    toast.success(`Resolved ${selected.size} alert(s)`);
    setSelected(new Set());
  };

  const stripColor = (a: Alert) => {
    if (a.is_resolved) return "border-l-emerald-500";
    if (a.alert_type === "critical") return "border-l-red-500";
    if (a.alert_type === "warning") return "border-l-amber-500";
    return "border-l-blue-500";
  };

  return (
    <MasterAdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl uppercase tracking-wider text-foreground">Alerts</h1>
        {isMasterAdmin && selected.size > 0 && (
          <Button onClick={bulkResolve}>Mark {selected.size} Resolved</Button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filterTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs uppercase tracking-wider transition-colors",
              filter === t.key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {t.icon && <span className="mr-1">{t.icon}</span>}
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card className="border-border bg-card p-8 text-center text-muted-foreground">
            No alerts in this view.
          </Card>
        )}
        {filtered.map((a) => {
          const listing = a.listing_id ? vinByListing[a.listing_id] : undefined;
          return (
            <Card key={a.id} className={cn("border-l-4 border-border bg-card p-4", stripColor(a))}>
              <div className="flex items-start gap-3">
                {isMasterAdmin && !a.is_resolved && (
                  <Checkbox
                    checked={selected.has(a.id)}
                    onCheckedChange={() => toggleSelect(a.id)}
                    className="mt-1"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                      {a.alert_type}
                    </span>
                    <h3 className="font-bold text-foreground">{a.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.message}</p>
                  {listing && (
                    <div className="mt-2 inline-flex items-center gap-2 rounded border border-border bg-background/50 px-3 py-1.5 text-xs">
                      <span className="font-mono text-muted-foreground">{listing.vin}</span>
                      <span className="text-foreground">
                        {listing.make} {listing.model}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.5 uppercase text-[10px]">{listing.status}</span>
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span>Created {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}</span>
                    {a.is_resolved && a.resolved_at && (
                      <span className="text-emerald-400">
                        Resolved {formatDistanceToNow(new Date(a.resolved_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {a.listing_id && (
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/admin/inventory">View Listing</Link>
                    </Button>
                  )}
                  {!a.is_resolved && isMasterAdmin && (
                    <Button size="sm" onClick={() => resolveOne(a.id)}>
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </MasterAdminLayout>
  );
};

export default AdminAlerts;
