import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Download } from "lucide-react";
import { mockPayoutQueue } from "@/data/mockAdminAffiliates";

const methodColors: Record<string, string> = {
  Venmo: "bg-primary/15 text-primary",
  PayPal: "bg-cta/15 text-cta",
  ACH: "bg-success/15 text-success",
  Check: "bg-secondary text-muted-foreground",
};

const PayoutProcessing = () => {
  const [items, setItems] = useState(mockPayoutQueue);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [paymentRefs, setPaymentRefs] = useState<Record<string, string>>({});

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const markPaid = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const exportCsv = () => {
    const headers = "Promoter,Email,Amount,Method,Commissions,Approved Date\n";
    const rows = items.map((i) => `${i.promoterName},${i.promoterEmail},${i.amount},${i.method},${i.commissionsCount},${i.approvedDate}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "autowurx-payouts.csv";
    a.click();
  };

  const totalAmount = items.reduce((s, i) => s + i.amount, 0);

  const groupedByMethod = items.reduce((acc, i) => {
    acc[i.method] = (acc[i.method] || 0) + i.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">{items.length} payouts ready — <span className="font-bold text-foreground">${totalAmount.toLocaleString()}</span></p>
          {Object.entries(groupedByMethod).map(([m, amt]) => (
            <Badge key={m} className={`${methodColors[m] || "bg-secondary text-foreground"} text-[10px]`}>{m}: ${amt}</Badge>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-3.5 w-3.5 mr-1" /> Export CSV</Button>
      </div>

      <Card className="border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-10"><Checkbox checked={selected.size === items.length && items.length > 0} onCheckedChange={() => setSelected(selected.size === items.length ? new Set() : new Set(items.map((i) => i.id)))} /></TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Promoter</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-right">Amount</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Method</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-center">Commissions</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Approved</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Payment Ref</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.id} className="border-border">
                  <TableCell><Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} /></TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.promoterName}</p>
                      <p className="text-xs text-muted-foreground">{p.promoterEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-bold text-foreground text-right">${p.amount}</TableCell>
                  <TableCell><Badge className={`${methodColors[p.method]} text-[10px]`}>{p.method}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground text-center">{p.commissionsCount}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(p.approvedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</TableCell>
                  <TableCell><Input placeholder="Ref #" value={paymentRefs[p.id] || ""} onChange={(e) => setPaymentRefs({ ...paymentRefs, [p.id]: e.target.value })} className="h-7 text-xs w-28" /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-success hover:text-success text-xs" onClick={() => markPaid(p.id)}>
                      <CheckCircle className="h-3 w-3 mr-1" /> Mark Paid
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">All payouts processed!</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default PayoutProcessing;
