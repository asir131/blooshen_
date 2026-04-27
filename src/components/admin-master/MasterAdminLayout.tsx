import { ReactNode, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { IntegrityAgentWidget } from "@/components/admin/IntegrityAgentWidget";

const tabs = [
  { to: "/admin/master", label: "Dashboard", end: true, key: "dashboard" },
  { to: "/admin/inventory", label: "Inventory", key: "inventory" },
  { to: "/admin/users", label: "Users", key: "users" },
  { to: "/admin/alerts", label: "Alerts", key: "alerts" },
  { to: "/admin/audit", label: "Audit Log", key: "audit" },
  { to: "/admin/settings", label: "Settings", key: "settings" },
];

interface Props {
  children: ReactNode;
}

const MasterAdminLayout = ({ children }: Props) => {
  const { profile, signOut, role } = useAuth();
  const navigate = useNavigate();
  const [openAlerts, setOpenAlerts] = useState(0);

  const initials = (profile?.full_name ?? profile?.display_name ?? profile?.email ?? "AW")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    const load = async () => {
      const { count } = await supabase
        .from("system_alerts")
        .select("id", { count: "exact", head: true })
        .eq("is_resolved", false);
      setOpenAlerts(count ?? 0);
    };
    load();
    const channel = supabase
      .channel("master-layout-alerts")
      .on("postgres_changes", { event: "*", schema: "public", table: "system_alerts" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const renderTabLabel = (label: string, key: string) => {
    if (key !== "alerts" || openAlerts === 0) return label;
    return (
      <span className="flex items-center gap-2">
        {label}
        <span className="rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
          {openAlerts > 99 ? "99+" : openAlerts}
        </span>
      </span>
    );
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
                {renderTabLabel(tab.label, tab.key)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="text-sm text-foreground">
                {profile?.full_name ?? profile?.display_name ?? "Admin"}
              </span>
              {role && (
                <span className="text-[10px] uppercase tracking-wider text-primary">
                  {role.replace("_", " ")}
                </span>
              )}
            </div>
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
              {renderTabLabel(tab.label, tab.key)}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="container py-6">{children}</main>

      <IntegrityAgentWidget />
    </div>
  );
};

export default MasterAdminLayout;
