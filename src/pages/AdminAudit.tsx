import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MasterAdminLayout from "@/components/admin-master/MasterAdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronRight, Download } from "lucide-react";
import { format } from "date-fns";

type Log = {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
};

const AdminAudit = () => {
  const { isMasterAdmin } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [profiles, setProfiles] = useState<Record<string, { full_name: string | null; email: string | null }>>({});
  const [roles, setRoles] = useState<Record<string, string>>({});

  const load = async () => {
    let q = supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(500);
    if (dateFrom) q = q.gte("created_at", new Date(dateFrom).toISOString());
    if (dateTo) q = q.lte("created_at", new Date(dateTo + "T23:59:59").toISOString());
    if (actionFilter !== "all") q = q.eq("action", actionFilter);
    if (entityFilter !== "all") q = q.eq("entity_type", entityFilter);
    if (userFilter !== "all") q = q.eq("user_id", userFilter);

    const { data } = await q;
    setLogs((data as Log[]) ?? []);

    const userIds = Array.from(new Set((data ?? []).map((d) => d.user_id).filter(Boolean) as string[]));
    if (userIds.length) {
      const [{ data: profs }, { data: roleRows }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email").in("id", userIds),
        supabase.from("user_roles").select("user_id, role").in("user_id", userIds),
      ]);
      const pmap: Record<string, { full_name: string | null; email: string | null }> = {};
      (profs ?? []).forEach((p) => (pmap[p.id] = { full_name: p.full_name, email: p.email }));
      setProfiles(pmap);
      const rmap: Record<string, string> = {};
      (roleRows ?? []).forEach((r) => {
        if (!rmap[r.user_id] || r.role === "master_admin") rmap[r.user_id] = r.role;
      });
      setRoles(rmap);
    }
  };

  useEffect(() => {
    load();
  }, [actionFilter, entityFilter, userFilter, dateFrom, dateTo]);

  // Realtime
  useEffect(() => {
    const ch = supabase
      .channel("admin-audit")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "audit_logs" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions = useMemo(() => Array.from(new Set(logs.map((l) => l.action))).sort(), [logs]);
  const entities = useMemo(() => Array.from(new Set(logs.map((l) => l.entity_type))).sort(), [logs]);

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const exportCsv = () => {
    if (!isMasterAdmin) return;
    const header = ["timestamp", "user_id", "action", "entity_type", "entity_id", "ip_address", "metadata"];
    const rows = logs.map((l) =>
      [
        l.created_at,
        l.user_id ?? "",
        l.action,
        l.entity_type,
        l.entity_id ?? "",
        l.ip_address ?? "",
        JSON.stringify(l.metadata ?? {}),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${format(new Date(), "yyyyMMdd-HHmm")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MasterAdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl uppercase tracking-wider text-foreground">Audit Log</h1>
        {isMasterAdmin && (
          <Button onClick={exportCsv}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        )}
      </div>

      <Card className="mb-4 border-border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-5">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground">From</label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground">To</label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Action</label>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {actions.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Entity</label>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All entities</SelectItem>
                {entities.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              variant="ghost"
              onClick={() => {
                setActionFilter("all");
                setEntityFilter("all");
                setUserFilter("all");
                setDateFrom("");
                setDateTo("");
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>

      <Card className="border-border bg-card p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-8 px-2"></th>
                <th className="px-3 py-2 text-left">Timestamp</th>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-left">Role</th>
                <th className="px-3 py-2 text-left">Action</th>
                <th className="px-3 py-2 text-left">Entity</th>
                <th className="px-3 py-2 text-left">Entity ID</th>
                <th className="px-3 py-2 text-left">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">
                    No log entries match the filters.
                  </td>
                </tr>
              )}
              {logs.map((log) => {
                const open = expanded.has(log.id);
                const prof = log.user_id ? profiles[log.user_id] : undefined;
                return (
                  <>
                    <tr
                      key={log.id}
                      className="cursor-pointer border-t border-border hover:bg-muted/30"
                      onClick={() => toggleExpand(log.id)}
                    >
                      <td className="px-2">
                        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss")}
                      </td>
                      <td className="px-3 py-2 text-sm">{prof?.full_name ?? prof?.email ?? "system"}</td>
                      <td className="px-3 py-2 text-xs uppercase text-muted-foreground">
                        {log.user_id ? roles[log.user_id] ?? "—" : "agent"}
                      </td>
                      <td className="px-3 py-2 text-xs font-bold uppercase">{log.action}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{log.entity_type}</td>
                      <td className="px-3 py-2 font-mono text-[11px]">
                        {log.entity_id ? log.entity_id.slice(0, 8) : "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{log.ip_address ?? "—"}</td>
                    </tr>
                    {open && (
                      <tr className="border-t border-border bg-background/50">
                        <td colSpan={8} className="px-6 py-3">
                          <pre className="overflow-x-auto rounded bg-background p-3 text-[11px] text-muted-foreground">
{JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </MasterAdminLayout>
  );
};

export default AdminAudit;
