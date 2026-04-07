import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3, CheckSquare, Users, DollarSign, Settings, MessageSquare, ArrowLeft, ShieldCheck,
} from "lucide-react";
import AdminOverview from "@/components/admin/AdminOverview";
import CommissionApprovals from "@/components/admin/CommissionApprovals";
import PromoterManagement from "@/components/admin/PromoterManagement";
import PayoutProcessing from "@/components/admin/PayoutProcessing";
import CommissionRulesEditor from "@/components/admin/CommissionRulesEditor";
import AgentLogs from "@/components/admin/AgentLogs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "approvals", label: "Approvals", icon: CheckSquare },
  { id: "promoters", label: "Promoters", icon: Users },
  { id: "payouts", label: "Payouts", icon: DollarSign },
  { id: "rules", label: "Commission Rules", icon: Settings },
  { id: "ai-logs", label: "AI Agent Logs", icon: MessageSquare },
] as const;

type TabId = (typeof tabs)[number]["id"];

const AdminAffiliates = () => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h1 className="font-heading text-2xl font-bold text-foreground">Affiliate Admin</h1>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1.5 flex-wrap border-b border-border pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-xs font-heading font-bold uppercase tracking-wider transition-colors rounded-t-md -mb-px border-b-2",
                activeTab === tab.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50",
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "overview" && <AdminOverview />}
          {activeTab === "approvals" && <CommissionApprovals />}
          {activeTab === "promoters" && <PromoterManagement />}
          {activeTab === "payouts" && <PayoutProcessing />}
          {activeTab === "rules" && <CommissionRulesEditor />}
          {activeTab === "ai-logs" && <AgentLogs />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminAffiliates;
