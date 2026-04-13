import { cn } from "@/lib/utils";
import {
  LayoutGrid, UserPlus, Users, Ban, Trophy,
  DollarSign, Building, AlertTriangle,
  List, Flag, Bot, FileText, Newspaper,
  SlidersHorizontal, Settings, ShieldCheck, LogOut,
} from "lucide-react";

const navSections = [
  {
    label: "OVERVIEW",
    items: [{ id: "dashboard", label: "Dashboard", icon: LayoutGrid }],
  },
  {
    label: "BROKERS",
    items: [
      { id: "applications", label: "Applications", icon: UserPlus },
      { id: "active-brokers", label: "Active Brokers", icon: Users },
      { id: "suspended", label: "Suspended", icon: Ban },
      { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    ],
  },
  {
    label: "AFFILIATE",
    items: [
      { id: "commissions", label: "Commissions", icon: DollarSign },
      { id: "payouts", label: "Payouts", icon: Building },
      { id: "fraud-flags", label: "Fraud Flags", icon: AlertTriangle },
    ],
  },
  {
    label: "LISTINGS",
    items: [
      { id: "all-listings", label: "All Listings", icon: List },
      { id: "reported", label: "Reported", icon: Flag },
      { id: "ai-logs", label: "AI Agent Logs", icon: Bot },
    ],
  },
  {
    label: "CONTENT",
    items: [
      { id: "articles", label: "Articles", icon: FileText },
      { id: "news", label: "News & Entertainment", icon: Newspaper },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { id: "commission-rules", label: "Commission Rules", icon: SlidersHorizontal },
      { id: "platform-settings", label: "Platform Settings", icon: Settings },
      { id: "admin-users", label: "Admin Users", icon: ShieldCheck },
    ],
  },
];

interface AdminBrokersSidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const AdminBrokersSidebar = ({ activeItem, onItemClick, collapsed, onToggleCollapse }: AdminBrokersSidebarProps) => {
  return (
    <aside
      className={cn(
        "h-screen sticky top-0 border-r border-[#1e1e1e] bg-[#0f0f0f] flex flex-col transition-all duration-200 shrink-0 overflow-y-auto",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-[#1e1e1e]">
        <span className="text-lg font-heading font-black text-[hsl(var(--primary))]">A</span>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-heading font-bold text-foreground">AutoWurx</span>
            <span className="text-[9px] font-bold uppercase bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded">Admin</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 space-y-1">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-4 pt-4 pb-1 text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground/60">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onItemClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-2 text-xs transition-colors relative",
                    isActive
                      ? "text-[hsl(var(--primary))] bg-[#1a1200] border-l-[3px] border-[hsl(var(--primary))]"
                      : "text-muted-foreground hover:text-foreground hover:bg-[#1a1a1a] border-l-[3px] border-transparent"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0 text-[hsl(var(--primary))]" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[#1e1e1e] p-3">
        {!collapsed && (
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))]/20 flex items-center justify-center text-xs font-bold text-[hsl(var(--primary))]">
              SK
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Sarah K.</p>
              <p className="text-[10px] text-[hsl(var(--primary))]">Super Admin</p>
            </div>
          </div>
        )}
        <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground w-full px-1 py-1">
          <LogOut className="h-3.5 w-3.5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="absolute top-4 -right-3 h-6 w-6 rounded-full bg-[#242424] border border-[#333] flex items-center justify-center text-muted-foreground hover:text-foreground text-xs z-10"
      >
        {collapsed ? "→" : "←"}
      </button>
    </aside>
  );
};

export default AdminBrokersSidebar;
