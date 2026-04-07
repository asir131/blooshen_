import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockCommissionRules, type CommissionRule } from "@/data/mockAdminAffiliates";
import { categoryColors } from "@/data/mockDashboard";

const CommissionRulesEditor = () => {
  const [rules, setRules] = useState<CommissionRule[]>(mockCommissionRules);
  const [auditLog, setAuditLog] = useState<{ category: string; field: string; oldVal: string; newVal: string; timestamp: string }[]>([]);

  const updateRule = (idx: number, field: keyof CommissionRule, value: unknown) => {
    setRules((prev) => {
      const next = [...prev];
      const old = next[idx];
      const oldVal = String(old[field]);
      next[idx] = { ...old, [field]: value, lastChanged: new Date().toISOString().slice(0, 10), changedBy: "Admin" };
      setAuditLog((log) => [{ category: old.category, field, oldVal, newVal: String(value), timestamp: new Date().toLocaleTimeString() }, ...log]);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Category</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-right">Lead Rate</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-right">Sale/Booking Rate</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-center">Type</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-center">Enabled</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Last Changed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((r, i) => (
                <TableRow key={r.categoryKey} className="border-border">
                  <TableCell><Badge className={cn("text-[10px]", categoryColors[r.category])}>{r.category}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-xs text-muted-foreground">$</span>
                      <Input type="number" value={r.leadRate} onChange={(e) => updateRule(i, "leadRate", Number(e.target.value))} className="h-7 w-16 text-xs text-right" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-xs text-muted-foreground">{r.saleType === "percent" ? "%" : "$"}</span>
                      <Input type="number" value={r.saleRate} onChange={(e) => updateRule(i, "saleRate", Number(e.target.value))} className="h-7 w-16 text-xs text-right" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-xs text-muted-foreground">{r.saleType === "percent" ? "Percentage" : "Fixed"}</TableCell>
                  <TableCell className="text-center"><Switch checked={r.enabled} onCheckedChange={(v) => updateRule(i, "enabled", v)} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.lastChanged} by {r.changedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {auditLog.length > 0 && (
        <Card className="border-border bg-card">
          <div className="p-4">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Change Log (this session)</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {auditLog.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-[10px] text-muted-foreground/60 w-20 shrink-0">{entry.timestamp}</span>
                  <span className="text-foreground font-medium">{entry.category}</span>
                  <span>→ {entry.field}:</span>
                  <span className="text-destructive line-through">{entry.oldVal}</span>
                  <span className="text-success">{entry.newVal}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CommissionRulesEditor;
