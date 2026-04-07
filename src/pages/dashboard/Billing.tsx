import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Zap } from "lucide-react";

const Billing = () => (
  <div className="space-y-6">
    <h1 className="font-heading text-2xl font-bold text-foreground">Billing & Upgrades</h1>
    <Card className="border-border bg-card">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-foreground">Current Plan</h3>
            <p className="text-sm text-muted-foreground">Free — 5 active listings</p>
          </div>
          <Badge variant="accent">Free</Badge>
        </div>
        <Button className="bg-cta hover:bg-cta/85 text-cta-foreground">
          <Zap className="h-4 w-4 mr-1" /> Upgrade to Pro
        </Button>
      </CardContent>
    </Card>
    <Card className="border-border bg-card">
      <CardContent className="p-5 space-y-3">
        <h3 className="font-heading font-bold text-foreground flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment Methods</h3>
        <p className="text-sm text-muted-foreground">No payment methods on file.</p>
        <Button size="sm" variant="secondary">Add Payment Method</Button>
      </CardContent>
    </Card>
  </div>
);

export default Billing;
