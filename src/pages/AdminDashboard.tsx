import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();

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
              Admin
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
          Admin Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/admin/inventory" className="rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors">
            <h2 className="font-heading text-xl uppercase tracking-wider text-foreground">Inventory</h2>
            <p className="mt-1 text-sm text-muted-foreground">Manage vehicle listings & run the Integrity Agent.</p>
          </Link>
          <Link to="/dashboard" className="rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors">
            <h2 className="font-heading text-xl uppercase tracking-wider text-foreground">My Listings</h2>
            <p className="mt-1 text-sm text-muted-foreground">Manage your personal inventory.</p>
          </Link>
          <Link to="/admin/affiliates" className="rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors">
            <h2 className="font-heading text-xl uppercase tracking-wider text-foreground">Affiliates</h2>
            <p className="mt-1 text-sm text-muted-foreground">Promoter program oversight.</p>
          </Link>
          <Link to="/admin/brokers" className="rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors">
            <h2 className="font-heading text-xl uppercase tracking-wider text-foreground">Brokers</h2>
            <p className="mt-1 text-sm text-muted-foreground">Broker applications & approvals.</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
