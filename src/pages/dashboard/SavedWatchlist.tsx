import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const SavedWatchlist = () => (
  <div className="space-y-6">
    <h1 className="font-heading text-2xl font-bold text-foreground">Saved / Watchlist</h1>
    <Card className="border-border bg-card">
      <CardContent className="p-12 text-center space-y-3">
        <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto" />
        <p className="text-muted-foreground">No saved items yet.</p>
        <p className="text-xs text-muted-foreground">Browse listings and tap the heart icon to save them here.</p>
      </CardContent>
    </Card>
  </div>
);

export default SavedWatchlist;
