import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/admin/master", label: "Dashboard", end: true },
  { to: "/admin/inventory", label: "Inventory" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/alerts", label: "Alerts" },
  { to: "/admin/audit", label: "Audit Log" },
  { to: "/admin/settings", label: "Settings" },
];

interface Props {
  children: ReactNode;
}

const MasterAdminLayout = ({ children }: Props) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const initials = (profile?.full_name ?? profile?.display_name ?? profile?.email ?? "AW")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="h-[3px] w-full bg-primary" />
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-6">
          <Link to="/admin/master" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-primary">
              <span className="font-heading text-base font-bold text-primary-foreground">AW</span>
            </div>
            <span className="font-heading text-lg uppercase tracking-widest text-primary">
              Master Admin
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wider transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm text-muted-foreground">
              {profile?.full_name ?? profile?.display_name ?? "Admin"}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex items-center gap-1 overflow-x-auto border-t border-border px-3 py-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground",
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="container py-6">{children}</main>
    </div>
  );
};

export default MasterAdminLayout;
