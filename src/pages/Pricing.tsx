import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Zap, Crown, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useSubscription } from "@/hooks/useSubscription";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { toast } from "sonner";

type Interval = "monthly" | "yearly";

const tiers = [
  {
    id: "broker_starter",
    name: "Starter",
    icon: Star,
    monthlyPriceId: "broker_starter_monthly",
    yearlyPriceId: "broker_starter_yearly",
    monthly: 29,
    yearly: 290,
    features: [
      "Up to 5 active listings",
      "Basic broker dashboard",
      "Standard email support",
      "Affiliate tools",
    ],
  },
  {
    id: "broker_pro",
    name: "Pro",
    icon: Zap,
    highlight: true,
    monthlyPriceId: "broker_pro_monthly",
    yearlyPriceId: "broker_pro_yearly",
    monthly: 79,
    yearly: 790,
    features: [
      "Unlimited active listings",
      "Featured placement",
      "Lead alerts & inbox",
      "Priority support",
      "Promoter boost credits",
    ],
  },
  {
    id: "broker_elite",
    name: "Elite",
    icon: Crown,
    monthlyPriceId: "broker_elite_monthly",
    yearlyPriceId: "broker_elite_yearly",
    monthly: 199,
    yearly: 1990,
    features: [
      "Everything in Pro",
      "Top-of-search placement",
      "Dedicated account manager",
      "White-glove onboarding",
      "API & bulk import access",
    ],
  },
];

export default function Pricing() {
  const [interval, setInterval] = useState<Interval>("monthly");
  const { user } = useAuth();
  const { subscription, isActive } = useSubscription();
  const { openCheckout, CheckoutDialog } = useStripeCheckout();
  const navigate = useNavigate();

  const handleSubscribe = (priceId: string, tierName: string) => {
    if (!user) {
      toast.info("Please sign in to subscribe");
      navigate("/auth?redirect=/pricing");
      return;
    }
    openCheckout({
      priceId,
      customerEmail: user.email,
      userId: user.id,
      title: `Subscribe to Broker ${tierName}`,
      returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <PaymentTestModeBanner />
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="text-center mb-10 space-y-3">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
            Choose your Broker plan
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sell more vehicles with the right tools. Upgrade or downgrade anytime —
            changes are pro-rated automatically.
          </p>
        </header>

        <Tabs value={interval} onValueChange={(v) => setInterval(v as Interval)} className="w-full">
          <TabsList className="mx-auto mb-8 grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly <Badge variant="accent" className="ml-2">Save 17%</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={interval}>
            <div className="grid gap-6 md:grid-cols-3">
              {tiers.map((tier) => {
                const Icon = tier.icon;
                const priceId = interval === "monthly" ? tier.monthlyPriceId : tier.yearlyPriceId;
                const amount = interval === "monthly" ? tier.monthly : tier.yearly;
                const isCurrent = isActive && subscription?.product_id === tier.id;

                return (
                  <Card
                    key={tier.id}
                    className={`relative border-border bg-card ${
                      tier.highlight ? "ring-2 ring-cta shadow-lg" : ""
                    }`}
                  >
                    {tier.highlight && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cta text-cta-foreground">
                        Most popular
                      </Badge>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-cta" />
                        <CardTitle className="font-heading text-2xl">{tier.name}</CardTitle>
                      </div>
                      <div className="mt-2">
                        <span className="text-4xl font-bold text-foreground">${amount}</span>
                        <span className="text-muted-foreground">
                          /{interval === "monthly" ? "mo" : "yr"}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {tier.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                            <Check className="h-4 w-4 text-cta mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full bg-cta hover:bg-cta/85 text-cta-foreground"
                        disabled={isCurrent}
                        onClick={() => handleSubscribe(priceId, tier.name)}
                      >
                        {isCurrent ? "Current plan" : `Choose ${tier.name}`}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-center text-xs text-muted-foreground mt-8">
          All plans include access to the Autowurx affiliate marketplace. Cancel
          anytime — you keep access through the end of your billing period.
        </p>
      </main>
      <Footer />
      <CheckoutDialog />
    </div>
  );
}
