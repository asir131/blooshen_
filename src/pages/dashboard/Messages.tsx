import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { mockMessages } from "@/data/mockDashboard";

const Messages = () => (
  <div className="space-y-6">
    <h1 className="font-heading text-2xl font-bold text-foreground">Messages</h1>
    <div className="space-y-2">
      {mockMessages.map((msg) => (
        <Card key={msg.id} className={cn("border-border bg-card cursor-pointer hover:border-primary/40 transition-colors", !msg.read && "border-l-2 border-l-primary")}>
          <CardContent className="p-4 flex items-center gap-4">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={msg.avatar} alt={msg.from} />
              <AvatarFallback className="bg-secondary text-foreground text-xs">{msg.from[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-heading", !msg.read ? "font-bold text-foreground" : "text-muted-foreground")}>{msg.from}</span>
                {!msg.read && <Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0">New</Badge>}
              </div>
              <p className={cn("text-sm truncate", !msg.read ? "text-foreground" : "text-muted-foreground")}>{msg.subject}</p>
              <p className="text-xs text-muted-foreground truncate">{msg.preview}</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {new Date(msg.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Messages;
