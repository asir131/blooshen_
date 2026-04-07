import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Eye, Ban, CheckCircle, DollarSign, Send, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockAdminPromoters, type PromoterStatus } from "@/data/mockAdminAffiliates";

const statusColors: Record<PromoterStatus, string> = {
  Active: "bg-success/15 text-success",
  Suspended: "bg-destructive/15 text-destructive",
  Pending: "bg-cta/15 text-cta",
};

const PromoterManagement = () => {
  const [search, setSearch] = useState("");
  const filtered = mockAdminPromoters.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, email, or code..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} promoters</p>
      </div>

      <Card className="border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Promoter</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Code</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Joined</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-right">Earned</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-center">Conversions</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-center">Flags</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} className="border-border">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">{p.code}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(p.joinDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                  <TableCell className="text-sm font-bold text-foreground text-right">${p.totalEarned.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground text-center">{p.totalConversions}</TableCell>
                  <TableCell className="text-center">
                    {p.flaggedEvents > 0 ? (
                      <Badge className="bg-destructive/15 text-destructive text-[10px] gap-0.5">
                        <AlertTriangle className="h-2.5 w-2.5" /> {p.flaggedEvents}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell><Badge className={cn("text-[10px]", statusColors[p.status])}>{p.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader><DialogTitle className="font-heading">{p.name}</DialogTitle></DialogHeader>
                          <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="rounded-lg bg-secondary p-3"><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading font-bold">Email</p><p className="text-foreground">{p.email}</p></div>
                              <div className="rounded-lg bg-secondary p-3"><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading font-bold">Code</p><p className="text-foreground font-mono">{p.code}</p></div>
                              <div className="rounded-lg bg-secondary p-3"><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading font-bold">Total Earned</p><p className="text-foreground font-bold">${p.totalEarned.toLocaleString()}</p></div>
                              <div className="rounded-lg bg-secondary p-3"><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading font-bold">Pending</p><p className="text-foreground">${p.pendingEarnings}</p></div>
                              <div className="rounded-lg bg-secondary p-3"><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading font-bold">Clicks</p><p className="text-foreground">{p.totalClicks.toLocaleString()}</p></div>
                              <div className="rounded-lg bg-secondary p-3"><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading font-bold">Conversions</p><p className="text-foreground">{p.totalConversions}</p></div>
                            </div>
                            <div className="flex gap-2">
                              {p.status === "Pending" && <Button size="sm" className="bg-success hover:bg-success/85 text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" /> Approve</Button>}
                              {p.status !== "Suspended" && <Button size="sm" variant="destructive"><Ban className="h-3 w-3 mr-1" /> Suspend</Button>}
                              <Button size="sm" variant="outline"><DollarSign className="h-3 w-3 mr-1" /> Adjust Balance</Button>
                              <Button size="sm" variant="outline"><Send className="h-3 w-3 mr-1" /> Message</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {p.status === "Pending" && <Button variant="ghost" size="icon" className="h-7 w-7 text-success hover:text-success"><CheckCircle className="h-3.5 w-3.5" /></Button>}
                      {p.status !== "Suspended" && <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Ban className="h-3.5 w-3.5" /></Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default PromoterManagement;
