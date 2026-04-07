import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Flag, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockAgentLogs } from "@/data/mockAdminAffiliates";
import { categoryColors } from "@/data/mockDashboard";

const AgentLogs = () => {
  const [logs, setLogs] = useState(mockAgentLogs);

  const toggleFlag = (id: string) => {
    setLogs((prev) => prev.map((l) => l.id === id ? { ...l, flagged: !l.flagged } : l));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{logs.length} conversations — {logs.filter((l) => l.leadCaptured).length} leads captured</p>

      <Card className="border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Listing</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Category</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Started</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-center">Msgs</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-center">Duration</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-center">Lead</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-center">Conversion</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Promoter</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className={cn("border-border", log.flagged && "bg-cta/5")}>
                  <TableCell className="text-sm font-medium text-foreground max-w-[180px] truncate">{log.listingTitle}</TableCell>
                  <TableCell><Badge className={cn("text-[10px]", categoryColors[log.category])}>{log.category}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(log.startTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</TableCell>
                  <TableCell className="text-sm text-muted-foreground text-center">{log.messageCount}</TableCell>
                  <TableCell className="text-sm text-muted-foreground text-center">{log.durationMinutes}m</TableCell>
                  <TableCell className="text-center">{log.leadCaptured ? <CheckCircle className="h-4 w-4 text-success mx-auto" /> : <XCircle className="h-4 w-4 text-muted-foreground/40 mx-auto" />}</TableCell>
                  <TableCell className="text-center">{log.conversionFired ? <CheckCircle className="h-4 w-4 text-success mx-auto" /> : <XCircle className="h-4 w-4 text-muted-foreground/40 mx-auto" />}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.promoterAttributed || "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle className="font-heading text-sm">{log.listingTitle} — Transcript</DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-3">
                              {log.transcript.map((msg, i) => (
                                <div key={i} className={cn("rounded-lg p-3 text-sm", msg.role === "assistant" ? "bg-primary/10 text-foreground" : "bg-secondary text-foreground ml-8")}>
                                  <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground mb-1">{msg.role === "assistant" ? "AI Agent" : "Visitor"}</p>
                                  <p>{msg.content}</p>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" className={cn("h-7 w-7", log.flagged ? "text-cta" : "text-muted-foreground")} onClick={() => toggleFlag(log.id)}>
                        <Flag className="h-3.5 w-3.5" />
                      </Button>
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

export default AgentLogs;
