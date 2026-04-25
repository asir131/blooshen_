import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, user, loading: authLoading, isMasterAdmin, isAdmin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect after login based on role
  useEffect(() => {
    if (authLoading || !user) return;
    const from = (location.state as { from?: string } | null)?.from;
    if (isMasterAdmin) {
      navigate(from && from !== "/admin/login" ? from : "/admin/master", { replace: true });
    } else if (isAdmin) {
      navigate(from && from !== "/admin/login" ? from : "/admin/dashboard", { replace: true });
    }
  }, [user, authLoading, isMasterAdmin, isAdmin, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);

    if (signInError) {
      const msg = signInError.message || "Invalid email or password.";
      setError(msg);
      toast({ title: "Sign-in failed", description: msg, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary">
            <span className="font-heading text-3xl font-bold uppercase tracking-wider text-primary-foreground">
              AW
            </span>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold uppercase tracking-[0.2em] text-foreground">
            AutoWurx
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
            Admin Console
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-foreground">
            Sign In
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Authorized personnel only.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@autowurx.com"
                className="bg-background focus-visible:ring-primary focus-visible:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background focus-visible:ring-primary focus-visible:border-primary"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading text-base uppercase tracking-wider"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AutoWurx. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
