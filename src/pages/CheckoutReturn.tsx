import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

export default function CheckoutReturn() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Webhook usually fires within a few seconds; show "still processing" hint after 8s
    const t = setTimeout(() => setShowFallback(true), 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PaymentTestModeBanner />
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-xl">
        <Card className="border-border bg-card text-center">
          <CardContent className="p-8 space-y-4">
            {sessionId ? (
              <>
                <CheckCircle2 className="h-14 w-14 text-cta mx-auto" />
                <h1 className="font-heading text-3xl font-bold text-foreground">
                  Payment received
                </h1>
                <p className="text-muted-foreground">
                  Thanks! Your purchase is being processed and will appear in your
                  dashboard within a few seconds.
                </p>
                {showFallback && (
                  <p className="text-xs text-muted-foreground">
                    Still processing? Refresh your dashboard or contact support if
                    it takes more than a minute.
                  </p>
                )}
                <p className="text-xs text-muted-foreground/70 break-all">
                  Reference: {sessionId}
                </p>
                <div className="flex gap-3 justify-center pt-2">
                  <Button asChild className="bg-cta hover:bg-cta/85 text-cta-foreground">
                    <Link to="/dashboard/billing">Go to billing</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Loader2 className="h-10 w-10 text-muted-foreground mx-auto animate-spin" />
                <h1 className="font-heading text-2xl font-bold text-foreground">
                  No session information
                </h1>
                <p className="text-muted-foreground">
                  We couldn't find a checkout session. If you completed a payment,
                  check your dashboard.
                </p>
                <Button asChild>
                  <Link to="/dashboard">Go to dashboard</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
