import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus, Clock, CheckCircle, XCircle, MapPin,
  Download, ChevronDown, Search, MoreHorizontal, Loader2,
} from "lucide-react";
import AdminBrokersSidebar from "@/components/admin-brokers/AdminBrokersSidebar";
import ApplicationDetailPanel from "@/components/admin-brokers/ApplicationDetailPanel";
import InviteBrokerModal from "@/components/admin-brokers/InviteBrokerModal";
import {
  type BrokerApplication,
  type ApplicationStatus,
} from "@/data/mockBrokerApplications";
import { useBrokerApplications, useUpdateApplicationStatus } from "@/hooks/useBrokerApplications";

const statusBadgeClasses: Record<ApplicationStatus, string> = {
  pending: "bg-[hsl(var(--primary))] text-[#1A1A1A]",
  under_review: "bg-orange-500 text-white",
  approved: "bg-green-600 text-white",
  rejected: "bg-red-600 text-white",
  suspended: "bg-gray-500 text-white",
  waitlisted: "bg-blue-500 text-white",
};

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
  waitlisted: "Waitlisted",
};

const AdminBrokers = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("applications");
  const { data: applications = [], isLoading } = useBrokerApplications();
  const updateStatus = useUpdateApplicationStatus();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedApp, setSelectedApp] = useState<BrokerApplication | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const filtered = applications.filter((a) => {
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const liveStats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === "pending").length;
    const approved = applications.filter((a) => a.status === "approved").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    const rejectionRate = total > 0 ? (rejected / total) * 100 : 0;
    const cities = new Set(applications.filter((a) => a.status === "approved").map((a) => a.city)).size;
    return { total, pending, approved, rejected, rejectionRate, activeBrokers: approved, cities };
  }, [applications]);

  const liveStatusCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = { all: applications.length };
    for (const a of applications) counts[a.status] = (counts[a.status] ?? 0) + 1;
    return counts;
  }, [applications]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.id)));
    }
  };

  const handleUpdateStatus = (id: string, status: ApplicationStatus, reason?: string) => {
    updateStatus.mutate({ id, status });
    setSelectedApp((prev) => (prev?.id === id ? { ...prev, status } : prev));
  };

  const scoreColor = (score: number) =>
    score >= 80 ? "text-green-400" : score >= 60 ? "text-[hsl(var(--primary))]" : "text-red-400";

  const stats = [
    { label: "Total Applications", value: liveStats.total.toLocaleString(), change: "All-time", changeColor: "text-muted-foreground", icon: UserPlus },
    { label: "Pending Review", value: String(liveStats.pending), change: "Awaiting decision", changeColor: "text-red-400", icon: Clock, valueColor: "text-[hsl(var(--primary))]" },
    { label: "Approved", value: String(liveStats.approved), change: "Total approved", changeColor: "text-green-400", icon: CheckCircle },
    { label: "Rejection Rate", value: `${liveStats.rejectionRate.toFixed(1)}%`, change: `${liveStats.rejected} rejected`, changeColor: "text-muted-foreground", icon: XCircle },
    { label: "Active Brokers", value: String(liveStats.activeBrokers), change: `Across ${liveStats.cities} cities`, changeColor: "text-muted-foreground", icon: MapPin },
  ];

  const statusTabs = [
    { key: "all", label: "All", count: liveStatusCounts.all ?? 0 },
    { key: "pending", label: "Pending", count: liveStatusCounts.pending ?? 0 },
    { key: "under_review", label: "Under Review", count: liveStatusCounts.under_review ?? 0 },
    { key: "approved", label: "Approved", count: liveStatusCounts.approved ?? 0 },
    { key: "rejected", label: "Rejected", count: liveStatusCounts.rejected ?? 0 },
    { key: "suspended", label: "Suspended", count: liveStatusCounts.suspended ?? 0 },
    { key: "waitlisted", label: "Waitlisted", count: liveStatusCounts.waitlisted ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex">
      <AdminBrokersSidebar
        activeItem={activeNav}
        onItemClick={setActiveNav}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 min-w-0 p-6 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">Broker Applications</h1>
            <p className="text-[11px] text-muted-foreground">Admin → Brokers → Applications</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="text-xs gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" className="text-xs border-[hsl(var(--primary))] text-[hsl(var(--primary))] gap-1.5">
              Bulk Actions <ChevronDown className="h-3 w-3" />
            </Button>
            <Button size="sm" className="text-xs gap-1.5" onClick={() => setShowInviteModal(true)}>
              <UserPlus className="h-3.5 w-3.5" /> Invite Broker
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#242424] border border-[#2a2a2a] rounded-[10px] p-3.5 relative">
              <stat.icon className="absolute top-3 right-3 h-5 w-5 text-[hsl(var(--primary))] opacity-60" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading mb-1">{stat.label}</p>
              <p className={cn("text-2xl font-bold", stat.valueColor || "text-foreground")}>{stat.value}</p>
              <p className={cn("text-[11px] mt-0.5", stat.changeColor)}>{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#242424] rounded-[10px] p-3 mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, username, city..."
              className="pl-9 bg-[#1a1a1a] border-[#333] text-xs h-8"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors",
                  statusFilter === tab.key
                    ? "bg-[hsl(var(--primary))] text-[#1A1A1A]"
                    : "bg-[#1a1a1a] text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Bulk action bar */}
        {selectedIds.size > 0 && (
          <div className="bg-[#0f0f0f] border-t-2 border-[hsl(var(--primary))] rounded-lg p-3 mb-3 flex items-center gap-3 animate-in slide-in-from-top duration-200">
            <span className="text-xs text-foreground font-medium">{selectedIds.size} selected</span>
            <Button size="sm" className="text-[10px] bg-green-600 hover:bg-green-700 text-white h-7">Approve All</Button>
            <Button size="sm" className="text-[10px] bg-red-600 hover:bg-red-700 text-white h-7">Reject All</Button>
            <Button size="sm" variant="secondary" className="text-[10px] h-7">Move to Waitlist</Button>
            <Button size="sm" variant="secondary" className="text-[10px] h-7">Export Selected</Button>
            <button onClick={() => setSelectedIds(new Set())} className="text-[10px] text-muted-foreground hover:text-foreground ml-auto">
              Deselect All
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-[#242424] rounded-[10px] overflow-hidden border border-[#2a2a2a]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1a1a1a] border-b border-[#333]">
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="accent-[hsl(var(--primary))] h-3.5 w-3.5"
                    />
                  </th>
                  {["Applicant", "Location", "Applied", "Status", "Step", "Score", "Actions"].map((h) => (
                    <th key={h} className="p-3 text-left text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => {
                  const initials = app.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
                  const isSelected = selectedIds.has(app.id);
                  return (
                    <tr
                      key={app.id}
                      className={cn(
                        "border-b border-[#2a2a2a] hover:bg-[#2e2e2e] transition-colors cursor-pointer",
                        isSelected && "bg-[hsl(var(--primary))]/5 border-l-[3px] border-l-[hsl(var(--primary))]"
                      )}
                      onClick={() => setSelectedApp(app)}
                    >
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(app.id)}
                          className="accent-[hsl(var(--primary))] h-3.5 w-3.5"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-full bg-[hsl(var(--primary))]/15 flex items-center justify-center text-[11px] font-bold text-[hsl(var(--primary))] shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-foreground">{app.name}</p>
                            <p className="text-[11px] text-muted-foreground">{app.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-xs text-foreground">{app.city}, {app.state}</p>
                        <p className="text-[10px] text-muted-foreground">{app.distanceMi} mi from nearest</p>
                      </td>
                      <td className="p-3">
                        <p className="text-xs text-foreground">{app.appliedDate}</p>
                        <p className="text-[10px] text-muted-foreground">{app.daysAgo} days ago</p>
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 mt-0.5 border-[#444]">
                          {app.source}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={cn("text-[10px]", statusBadgeClasses[app.status])}>
                          {statusLabels[app.status]}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <p className="text-xs text-foreground mb-1">Step {app.stepReached}/6</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                i < app.stepReached ? "bg-[hsl(var(--primary))]" : "bg-[#444]"
                              )}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={cn("text-sm font-bold", scoreColor(app.score))}>{app.score}</span>
                      </td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <Button size="sm" className="text-[10px] h-7 px-3" onClick={() => setSelectedApp(app)}>
                            Review
                          </Button>
                          <button className="h-7 w-7 rounded-md hover:bg-[#333] flex items-center justify-center text-muted-foreground">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a2a2a]">
            <p className="text-[11px] text-muted-foreground">Showing 1–{filtered.length} of {statusFilter === "all" ? liveStatusCounts.all ?? 0 : liveStatusCounts[statusFilter] ?? filtered.length} applications</p>
            <div className="flex items-center gap-1">
              <Button variant="secondary" size="sm" className="text-[10px] h-7" disabled>← Previous</Button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={cn(
                    "h-7 w-7 rounded text-[11px] font-medium",
                    p === 1 ? "bg-[hsl(var(--primary))] text-[#1A1A1A]" : "text-muted-foreground hover:bg-[#333]"
                  )}
                >
                  {p}
                </button>
              ))}
              <span className="text-muted-foreground text-xs px-1">...</span>
              <button className="h-7 w-7 rounded text-[11px] text-muted-foreground hover:bg-[#333]">106</button>
              <Button variant="secondary" size="sm" className="text-[10px] h-7">Next →</Button>
            </div>
          </div>
        </div>
      </main>

      {/* Detail panel */}
      {selectedApp && (
        <ApplicationDetailPanel
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Invite modal */}
      {showInviteModal && <InviteBrokerModal onClose={() => setShowInviteModal(false)} />}
    </div>
  );
};

export default AdminBrokers;
