import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Flag, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockPendingCommissions, type FraudFlag } from "@/data/mockAdminAffiliates";
import { categoryColors } from "@/data/mockDashboard";

const flagLabels: Record<FraudFlag, string> = {
  same_ip: "Same IP",
  fast_conversion: "< 2min conversion",
  repeat_conversion: "Repeat conversion",
};

const CommissionApprovals = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [items, setItems] = useState(mockPendingCommissions);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    setSelected(selected.size === items.length ? new Set() : new Set(items.map((i) => i.id)));
  };

  const handleAction = (id: string, action: "approve" | "reject" | "flag") => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const bulkApprove = () => {
    setItems((prev) => prev.filter((i) => !selected.has(i.id)));
    setSelected(new Set());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} pending commissions</p>
        <Button onClick={bulkApprove} disabled={selected.size === 0} size="sm" className="bg-success hover:bg-success/85 text-success-foreground">
          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Bulk Approve ({selected.size})
        </Button>
      </div>

      <Card className="border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-10"><Checkbox checked={selected.size === items.length && items.length > 0} onCheckedChange={toggleAll} /></TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Promoter</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Listing</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Category</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Type</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-right">Amount</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Date</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Flags</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id} className={cn("border-border", c.flags.length > 0 && "bg-destructive/5")}>
                  <TableCell><Checkbox checked={selected.has(c.id)} onCheckedChange={() => toggleSelect(c.id)} /></TableCell>
                  <TableCell className="text-sm font-medium text-foreground">{c.promoterName}</TableCell>
                  <TableCell className="text-sm text-foreground max-w-[180px] truncate">{c.listingTitle}</TableCell>
                  <TableCell><Badge className={cn("text-[10px]", categoryColors[c.category])}>{c.category}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.conversionType}</TableCell>
                  <TableCell className="text-sm font-bold text-foreground text-right">${c.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</TableCell>
                  <TableCell>
                    {c.flags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {c.flags.map((f) => (
                          <Badge key={f} className="bg-destructive/15 text-destructive text-[9px] gap-0.5">
                            <AlertTriangle className="h-2.5 w-2.5" /> {flagLabels[f]}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Clean</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-success hover:text-success" onClick={() => handleAction(c.id, "approve")}><CheckCircle className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleAction(c.id, "reject")}><XCircle className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-cta hover:text-cta" onClick={() => handleAction(c.id, "flag")}><Flag className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center py-12 text-muted-foreground">All commissions reviewed!</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default CommissionApprovals;
