import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, AlertTriangle, ListChecks, ShieldAlert } from "lucide-react";

const AdminMaster = () => {
  const { profile, signOut } = useAuth();
  const [counts, setCounts] = useState({ listings: 0, alerts: 0, audits: 0 });

  useEffect(() => {
    const load = async () => {
      const [{ count: listings }, { count: alerts }, { count: audits }] = await Promise.all([
        supabase.from("vehicle_listings").select("id", { count: "exact", head: true }),
        supabase.from("system_alerts").select("id", { count: "exact", head: true }).eq("is_resolved", false),
        supabase.from("audit_logs").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        listings: listings ?? 0,
        alerts: alerts ?? 0,
        audits: audits ?? 0,
      });
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-primary">
              <span className="font-heading text-base font-bold uppercase tracking-wider text-primary-foreground">
                AW
              </span>
            </div>
            <span className="font-heading text-xl font-bold uppercase tracking-widest text-foreground">
              Master Admin
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="container py-12">
        <h1 className="font-heading text-4xl font-bold uppercase tracking-wider text-foreground">
          Master Admin
        </h1>
        <p className="mt-2 text-muted-foreground">
          {profile?.full_name ?? "AWX Master"} — full platform oversight.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <ListChecks className="h-6 w-6 text-primary" />
            <p className="mt-3 text-3xl font-heading font-bold text-foreground">{counts.listings}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Vehicle listings</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <p className="mt-3 text-3xl font-heading font-bold text-foreground">{counts.alerts}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Open alerts</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <p className="mt-3 text-3xl font-heading font-bold text-foreground">{counts.audits}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Audit events</p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link to="/admin/dashboard" className="rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors">
            <h2 className="font-heading text-xl uppercase tracking-wider text-foreground">Admin Dashboard</h2>
            <p className="mt-1 text-sm text-muted-foreground">Switch to standard admin view.</p>
          </Link>
          <Link to="/admin/brokers" className="rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors">
            <h2 className="font-heading text-xl uppercase tracking-wider text-foreground">Broker Applications</h2>
            <p className="mt-1 text-sm text-muted-foreground">Review and approve brokers.</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminMaster;
