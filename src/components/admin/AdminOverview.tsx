import { DollarSign, Clock, CheckCircle, Users, TrendingUp, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockAdminOverview } from "@/data/mockAdminAffiliates";

const stats = [
  { label: "Total Commissions (All Time)", value: `$${mockAdminOverview.totalCommissionsAllTime.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
  { label: "This Month", value: `$${mockAdminOverview.totalCommissionsThisMonth.toLocaleString()}`, icon: TrendingUp, color: "text-success" },
  { label: "Pending Payouts", value: `$${mockAdminOverview.pendingPayouts.toLocaleString()}`, icon: Clock, color: "text-cta" },
  { label: "Total Paid Out", value: `$${mockAdminOverview.totalPaidOut.toLocaleString()}`, icon: CheckCircle, color: "text-success" },
  { label: "Active Promoters", value: mockAdminOverview.activePromoters, icon: Users, color: "text-primary" },
  { label: "Conversion Rate", value: `${mockAdminOverview.conversionRate}%`, icon: TrendingUp, color: "text-cta" },
];

const AdminOverview = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((s) => (
        <Card key={s.label} className="border-border bg-card">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-1.5">
              <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-4 w-4 text-cta" />
          <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">Top 5 Promoters This Month</h3>
        </div>
        <div className="space-y-2">
          {mockAdminOverview.topPromotersThisMonth.map((p) => (
            <div key={p.rank} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${p.rank <= 3 ? "text-cta" : "text-muted-foreground"}`}>#{p.rank}</span>
                <span className="text-sm font-medium text-foreground">{p.name}</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-muted-foreground">{p.conversions} conversions</span>
                <span className="font-bold text-foreground">${p.earned.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AdminOverview;
