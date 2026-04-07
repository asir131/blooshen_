import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockDashboardEvents } from "@/data/mockDashboard";

const MyEvents = () => (
  <div className="space-y-6">
    <h1 className="font-heading text-2xl font-bold text-foreground">My Events</h1>
    <div className="space-y-3">
      {mockDashboardEvents.map((ev) => (
        <Card key={ev.id} className="border-border bg-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-bold text-foreground text-sm">{ev.title}</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{new Date(ev.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{ev.attending}</span>
              </div>
            </div>
            <Badge className={cn("text-[10px]", ev.type === "hosted" ? "bg-cta/15 text-cta" : "bg-primary/15 text-primary")}>
              {ev.type === "hosted" ? "Hosting" : "RSVP'd"}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default MyEvents;
