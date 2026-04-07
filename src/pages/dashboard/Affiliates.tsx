import { usePromoterProfile, usePromoterCommissions, usePromoterClicks } from "@/hooks/usePromoterProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Link2, MousePointerClick, Clock, TrendingUp, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "accent"> = {
  pending: "secondary",
  approved: "accent",
  paid: "default",
};

const CATEGORY_LABELS: Record<string, string> = {
  cars_for_sale: "Cars for Sale",
  parts_accessories: "Parts",
  service_providers: "Services",
  rentals: "Rentals",
  neighborhood_experts: "Experts",
  events_meetups: "Events",
};

const Affiliates = () => {
  const { data: profile, isLoading: profileLoading } = usePromoterProfile();
  const { data: commissions = [] } = usePromoterCommissions();
  const { data: clicks = [] } = usePromoterClicks();
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!profile) return;
    await navigator.clipboard.writeText(profile.promoter_code);
    setCodeCopied(true);
    toast.success("Promoter code copied!");
    setTimeout(() => setCodeCopied(false), 2000);
  };

  if (profileLoading) {
    return <div className="p-8 text-center text-muted-foreground font-body">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Affiliate Program</h1>
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-lg font-bold text-foreground mb-2">Sign in to start earning</h2>
            <p className="text-sm text-muted-foreground font-body">
              Create an account to get your unique promoter code and earn commissions on referrals.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingCount = commissions.filter((c) => c.status === "pending").length;
  const approvedTotal = commissions
    .filter((c) => c.status === "approved" || c.status === "paid")
    .reduce((sum, c) => sum + Number(c.commission_amount), 0);

  const stats = [
    { icon: Link2, label: "Promoter Code", value: profile.promoter_code, accent: true },
    { icon: MousePointerClick, label: "Total Clicks", value: clicks.length.toString() },
    { icon: Clock, label: "Pending", value: `$${Number(profile.pending_earnings).toFixed(2)}` },
    { icon: TrendingUp, label: "Total Earned", value: `$${Number(profile.total_earnings).toFixed(2)}` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Affiliate Program</h1>
        <Button size="sm" variant="secondary" className="gap-2" onClick={handleCopyCode}>
          {codeCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Copy Code
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">{s.label}</span>
              </div>
              <p className={`text-lg font-heading font-bold ${s.accent ? "text-primary" : "text-foreground"}`}>
                {s.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Commission table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-heading font-bold text-foreground">Recent Commissions</h2>
          </div>
          {commissions.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground font-body">
              No commissions yet. Share listings to start earning!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground font-heading uppercase tracking-wider">
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 text-muted-foreground">
                        {new Date(c.converted_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant="outline" className="text-[10px]">
                          {CATEGORY_LABELS[c.listing_category] ?? c.listing_category}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 capitalize text-foreground">{c.conversion_type}</td>
                      <td className="px-5 py-3 font-heading font-bold text-primary">
                        ${Number(c.commission_amount).toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={STATUS_VARIANT[c.status] ?? "secondary"} className="text-[10px] capitalize">
                          {c.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Affiliates;
