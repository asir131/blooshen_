import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, AlertTriangle, MailX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type State = "validating" | "valid" | "already" | "invalid" | "submitting" | "done" | "error";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("validating");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setState("invalid");
      setErrorMsg("Missing unsubscribe token in link.");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON } },
        );
        const data = await res.json();
        if (res.ok && data.valid) setState("valid");
        else if (data.reason === "already_unsubscribed") setState("already");
        else {
          setState("invalid");
          setErrorMsg(data.error || "Invalid or expired link.");
        }
      } catch (err: any) {
        setState("error");
        setErrorMsg(err?.message || "Network error. Please try again.");
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState("submitting");
    try {
      const { data, error } = await supabase.functions.invoke(
        "handle-email-unsubscribe",
        { body: { token } },
      );
      if (error) throw error;
      if (data?.success) setState("done");
      else if (data?.reason === "already_unsubscribed") setState("already");
      else {
        setState("error");
        setErrorMsg(data?.error || "Failed to unsubscribe.");
      }
    } catch (err: any) {
      setState("error");
      setErrorMsg(err?.message || "Failed to unsubscribe.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16 max-w-xl">
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center space-y-4">
            {state === "validating" && (
              <>
                <Loader2 className="h-10 w-10 text-muted-foreground mx-auto animate-spin" />
                <h1 className="font-heading text-2xl font-bold text-foreground">
                  Verifying...
                </h1>
              </>
            )}

            {state === "valid" && (
              <>
                <MailX className="h-12 w-12 text-cta mx-auto" />
                <h1 className="font-heading text-2xl font-bold text-foreground uppercase">
                  Unsubscribe from Autowurx emails?
                </h1>
                <p className="text-muted-foreground">
                  You'll stop receiving notification and confirmation emails
                  from us. You can resubscribe anytime by contacting support.
                </p>
                <Button
                  onClick={confirm}
                  className="bg-cta hover:bg-cta/85 text-cta-foreground font-bold uppercase tracking-wider"
                >
                  Confirm Unsubscribe
                </Button>
              </>
            )}

            {state === "submitting" && (
              <>
                <Loader2 className="h-10 w-10 text-muted-foreground mx-auto animate-spin" />
                <p className="text-muted-foreground">Processing...</p>
              </>
            )}

            {state === "done" && (
              <>
                <CheckCircle2 className="h-12 w-12 text-cta mx-auto" />
                <h1 className="font-heading text-2xl font-bold text-foreground uppercase">
                  You've been unsubscribed
                </h1>
                <p className="text-muted-foreground">
                  We're sorry to see you go. You won't receive any more emails
                  from this address.
                </p>
                <Button asChild variant="secondary">
                  <Link to="/">Back to Autowurx</Link>
                </Button>
              </>
            )}

            {state === "already" && (
              <>
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto" />
                <h1 className="font-heading text-2xl font-bold text-foreground uppercase">
                  Already unsubscribed
                </h1>
                <p className="text-muted-foreground">
                  This email address is already opted out.
                </p>
                <Button asChild variant="secondary">
                  <Link to="/">Back to Autowurx</Link>
                </Button>
              </>
            )}

            {(state === "invalid" || state === "error") && (
              <>
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                <h1 className="font-heading text-2xl font-bold text-foreground uppercase">
                  {state === "invalid" ? "Invalid link" : "Something went wrong"}
                </h1>
                <p className="text-muted-foreground">{errorMsg}</p>
                <Button asChild variant="secondary">
                  <Link to="/">Back to Autowurx</Link>
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
