import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Zap, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Purchase {
  id: string;
  product_id: string;
  amount_cents: number;
  currency: string;
  created_at: string;
}

const formatPlanName = (productId: string) =>
  productId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const Billing = () => {
  const { user } = useAuth();
  const { subscription, isActive, loading } = useSubscription();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("purchases")
      .select("id, product_id, amount_cents, currency, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setPurchases((data as Purchase[]) ?? []));
  }, [user]);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-portal-session", {
        body: {
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/dashboard/billing`,
        },
      });
      if (error || !data?.url) throw new Error(error?.message || "No portal URL");
      window.open(data.url, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Could not open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString()
    : null;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Billing & Upgrades</h1>

      <Card className="border-border bg-card">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-foreground">Current Plan</h3>
              {loading ? (
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Loading…
                </p>
              ) : isActive && subscription ? (
                <>
                  <p className="text-sm text-foreground mt-1">
                    {formatPlanName(subscription.product_id)}
                  </p>
                  {periodEnd && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {subscription.cancel_at_period_end || subscription.status === "canceled"
                        ? `Access ends ${periodEnd}`
                        : `Renews ${periodEnd}`}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
                  Free — 5 active listings
                </p>
              )}
            </div>
            <Badge variant={isActive ? "default" : "accent"}>
              {isActive ? subscription?.status : "Free"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {isActive ? (
              <>
                <Button asChild variant="secondary">
                  <Link to="/pricing">Change plan</Link>
                </Button>
                <Button onClick={openPortal} disabled={portalLoading}>
                  {portalLoading ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4 mr-1" />
                  )}
                  Manage billing
                </Button>
              </>
            ) : (
              <Button asChild className="bg-cta hover:bg-cta/85 text-cta-foreground">
                <Link to="/pricing">
                  <Zap className="h-4 w-4 mr-1" /> Upgrade to Pro
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Recent purchases
          </h3>
          {purchases.length === 0 ? (
            <p className="text-sm text-muted-foreground">No purchases yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {purchases.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{formatPlanName(p.product_id)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-foreground font-medium">
                    ${(p.amount_cents / 100).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
