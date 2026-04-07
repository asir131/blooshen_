import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, Car, Heart, MessageSquare, Star, CalendarDays, Settings, CreditCard, Menu, ChevronLeft, DollarSign, Megaphone, ShieldCheck,
} from "lucide-react";
import autowurxLogo from "@/assets/autowurx-logo.png";

const navItems = [
  { title: "My Listings", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Rentals", url: "/dashboard/rentals", icon: Car },
  { title: "Saved / Watchlist", url: "/dashboard/saved", icon: Heart },
  { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
  { title: "My Reviews", url: "/dashboard/reviews", icon: Star },
  { title: "My Events", url: "/dashboard/events", icon: CalendarDays },
  { title: "Affiliates", url: "/dashboard/affiliates", icon: DollarSign },
  { title: "Promoter Hub", url: "/dashboard/promoter", icon: Megaphone },
  { title: "Admin: Affiliates", url: "/admin/affiliates", icon: ShieldCheck },
  { title: "Account Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Billing & Upgrades", url: "/dashboard/billing", icon: CreditCard },
];

function DashboardSidebarInner() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="bg-card">
        <div className="p-4 border-b border-border">
          <a href="/">
            {collapsed ? (
              <span className="font-heading font-bold text-primary text-lg">AW</span>
            ) : (
              <img src={autowurxLogo} alt="AutoWurx" className="h-6" />
            )}
          </a>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-heading uppercase tracking-wider text-[10px]">
            {!collapsed && "Dashboard"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardSidebar() {
  return <DashboardSidebarInner />;
}
