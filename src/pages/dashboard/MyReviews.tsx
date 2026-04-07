import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { mockDashboardReviews } from "@/data/mockDashboard";

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={`h-4 w-4 ${s <= rating ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
    ))}
  </div>
);

const MyReviews = () => (
  <div className="space-y-6">
    <h1 className="font-heading text-2xl font-bold text-foreground">My Reviews</h1>
    <div className="space-y-3">
      {mockDashboardReviews.map((r) => (
        <Card key={r.id} className="border-border bg-card">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-foreground text-sm">{r.entityName}</span>
              <span className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <RatingStars rating={r.rating} />
            <p className="text-sm text-muted-foreground">{r.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default MyReviews;
