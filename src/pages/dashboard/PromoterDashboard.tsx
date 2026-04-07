import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePromoterProfile, usePromoterCommissions, usePromoterClicks } from "@/hooks/usePromoterProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DollarSign, TrendingUp, MousePointerClick, BarChart3, Trophy, Copy, Check,
  ExternalLink, Filter, Car, Wrench, Star, CalendarDays, MapPin, Download,
  MessageSquare, QrCode, CreditCard, Banknote, Wallet,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Section 1 — Stats Cards                                           */
/* ------------------------------------------------------------------ */
function StatsCards() {
  const { data: profile } = usePromoterProfile();
  const { data: commissions = [] } = usePromoterCommissions();
  const { data: clicks = [] } = usePromoterClicks();

  const thisMonth = useMemo(() => {
    const now = new Date();
    return commissions
      .filter((c) => new Date(c.converted_at).getMonth() === now.getMonth() && new Date(c.converted_at).getFullYear() === now.getFullYear())
      .reduce((s, c) => s + Number(c.commission_amount), 0);
  }, [commissions]);

  const conversionRate = clicks.length > 0 ? ((commissions.length / clicks.length) * 100).toFixed(1) : "0.0";

  const stats = [
    { label: "Total Earned", value: `$${profile?.total_earnings?.toFixed(2) ?? "0.00"}`, icon: DollarSign, accent: true },
    { label: "Pending", value: `$${profile?.pending_earnings?.toFixed(2) ?? "0.00"}`, icon: TrendingUp },
    { label: "This Month", value: `$${thisMonth.toFixed(2)}`, icon: BarChart3 },
    { label: "Total Clicks", value: String(clicks.length), icon: MousePointerClick },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp },
    { label: "Rank", value: "#—", icon: Trophy },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className={cn("border-border", s.accent && "border-primary/40")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="h-4 w-4 text-primary" />
              <span className="font-heading text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
            </div>
            <p className={cn("font-heading text-xl font-black", s.accent ? "text-primary" : "text-foreground")}>{s.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 2 — Open Opportunities                                     */
/* ------------------------------------------------------------------ */
const CATEGORY_ICONS: Record<string, typeof Car> = {
  cars_for_sale: Car,
  parts_accessories: Wrench,
  service_providers: Wrench,
  rentals: Car,
  neighborhood_experts: Star,
  events_meetups: CalendarDays,
};

const CATEGORY_LABELS: Record<string, string> = {
  cars_for_sale: "Cars",
  parts_accessories: "Parts",
  service_providers: "Services",
  rentals: "Rentals",
  neighborhood_experts: "Experts",
  events_meetups: "Events",
};

function OpenOpportunities() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { data: profile } = usePromoterProfile();
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: gigs = [], isLoading } = useQuery({
    queryKey: ["promotion-gigs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotion_gigs")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const claimMutation = useMutation({
    mutationFn: async (gigId: string) => {
      if (!profile) throw new Error("No promoter profile");
      const gig = gigs.find((g) => g.id === gigId);
      if (!gig) throw new Error("Gig not found");

      const referralUrl = `${window.location.origin}/cars-for-sale/${gig.listing_id}?ref=${profile.promoter_code}`;

      const { error } = await supabase.from("claimed_promotions").insert({
        gig_id: gigId,
        promoter_id: profile.id,
        referral_url: referralUrl,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Gig claimed! Your link is ready.");
      queryClient.invalidateQueries({ queryKey: ["claimed-promotions"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = categoryFilter === "all" ? gigs : gigs.filter((g) => g.listing_category === categoryFilter);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Open <span className="text-primary">Opportunities</span>
        </h2>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40 h-9 text-sm">
            <Filter className="h-3 w-3 mr-1" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border animate-pulse">
              <CardContent className="p-0"><div className="h-40 bg-muted rounded-t-lg" /><div className="p-4 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded w-1/2" /></div></CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground font-body">No open opportunities right now. Check back soon!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((gig) => {
            const Icon = CATEGORY_ICONS[gig.listing_category] || Car;
            return (
              <Card key={gig.id} className="border-border group hover:border-primary/50 transition-colors overflow-hidden">
                <CardContent className="p-0">
                  {gig.image_url && (
                    <div className="relative h-40 overflow-hidden">
                      <img src={gig.image_url} alt={gig.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <Badge className="absolute top-3 left-3 gap-1" variant="default">
                        <Icon className="h-3 w-3" />
                        {CATEGORY_LABELS[gig.listing_category] || gig.listing_category}
                      </Badge>
                    </div>
                  )}
                  <div className="p-4 space-y-3">
                    <h3 className="font-heading text-base font-bold text-foreground line-clamp-1">{gig.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-lg font-black text-primary">
                        Earn {gig.commission_type === "percentage" ? `${gig.commission_amount}%` : `$${Number(gig.commission_amount).toFixed(0)}`}
                      </span>
                      {gig.seller_rating && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                          <Star className="h-3 w-3 text-primary fill-primary" />
                          {Number(gig.seller_rating).toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
                      {gig.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{gig.location}</span>}
                      <span>{new Date(gig.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                    <Button
                      className="w-full"
                      size="sm"
                      disabled={!profile || claimMutation.isPending}
                      onClick={() => claimMutation.mutate(gig.id)}
                    >
                      {profile ? "Claim & Get Link" : "Sign in to Claim"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 3 — My Active Promotions                                   */
/* ------------------------------------------------------------------ */
function ActivePromotions() {
  const { data: profile } = usePromoterProfile();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: claimed = [] } = useQuery({
    queryKey: ["claimed-promotions"],
    enabled: !!profile,
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from("claimed_promotions")
        .select("*, promotion_gigs(*)")
        .eq("promoter_id", profile.id)
        .order("claimed_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (claimed.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground font-body">You haven't claimed any promotions yet. Browse opportunities above!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead className="bg-muted">
          <tr>
            {["Listing", "My Link", "Clicks", "Conversions", "Earned", "Status", ""].map((h) => (
              <th key={h} className="px-4 py-3 text-left font-heading text-[10px] uppercase tracking-wider text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {claimed.map((c: any) => (
            <tr key={c.id} className="border-t border-border hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-body text-sm text-foreground">{(c.promotion_gigs as any)?.title ?? "—"}</td>
              <td className="px-4 py-3">
                <span className="text-xs text-muted-foreground font-body truncate max-w-[140px] inline-block align-middle">{c.referral_url}</span>
              </td>
              <td className="px-4 py-3 font-heading text-sm text-foreground">{c.clicks}</td>
              <td className="px-4 py-3 font-heading text-sm text-foreground">{c.conversions}</td>
              <td className="px-4 py-3 font-heading text-sm font-bold text-primary">${Number(c.earned).toFixed(2)}</td>
              <td className="px-4 py-3">
                <Badge variant={c.status === "active" ? "default" : "secondary"} className="text-[10px]">{c.status}</Badge>
              </td>
              <td className="px-4 py-3">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(c.referral_url, c.id)}>
                  {copiedId === c.id ? <Check className="h-3 w-3 text-[hsl(var(--success))]" /> : <Copy className="h-3 w-3" />}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 4 — Promo Toolkit                                          */
/* ------------------------------------------------------------------ */
function PromoToolkit() {
  const { data: profile } = usePromoterProfile();
  const code = profile?.promoter_code ?? "WURX-XXXXXX";

  const SMS_TEMPLATE = `Hey, found this awesome deal on AutoWurx — thought you'd be interested: ${window.location.origin}?ref=${code}`;
  const FB_TEMPLATE = `🚗 Check out this listing on AutoWurx! Great deal alert 👇\n${window.location.origin}?ref=${code}`;
  const IG_TEMPLATE = `🔥 Found an incredible deal on @AutoWurx. Link in bio! #AutoWurx #CarDeals #Affiliate`;
  const X_TEMPLATE = `Just found an amazing deal on @AutoWurx 🚗💰 Check it out: ${window.location.origin}?ref=${code}`;

  const templates = [
    { label: "SMS Script", icon: MessageSquare, text: SMS_TEMPLATE },
    { label: "Facebook", icon: MessageSquare, text: FB_TEMPLATE },
    { label: "Instagram", icon: MessageSquare, text: IG_TEMPLATE },
    { label: "X (Twitter)", icon: MessageSquare, text: X_TEMPLATE },
  ];

  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Template copied!");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((t, i) => (
          <Card key={t.label} className="border-border">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <t.icon className="h-4 w-4 text-primary" />
                <span className="font-heading text-sm font-bold text-foreground">{t.label}</span>
              </div>
              <p className="text-xs text-muted-foreground font-body line-clamp-3">{t.text}</p>
              <Button variant="secondary" size="sm" className="w-full" onClick={() => handleCopy(t.text, i)}>
                {copiedIdx === i ? <><Check className="h-3 w-3 mr-1" /> Copied</> : <><Copy className="h-3 w-3 mr-1" /> Copy Template</>}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border">
        <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <QrCode className="h-6 w-6 text-primary" />
            <div>
              <p className="font-heading text-sm font-bold text-foreground">QR Code Generator</p>
              <p className="text-xs text-muted-foreground font-body">Generate a QR code for in-person sharing</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => {
            const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${window.location.origin}?ref=${code}`)}`;
            window.open(url, "_blank");
          }}>
            <Download className="h-3 w-3 mr-1" /> Generate QR
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 5 — Payout Settings                                        */
/* ------------------------------------------------------------------ */
function PayoutSettings() {
  const { data: profile } = usePromoterProfile();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["payout-settings"],
    enabled: !!profile,
    queryFn: async () => {
      if (!profile) return null;
      const { data, error } = await supabase
        .from("payout_settings")
        .select("*")
        .eq("promoter_id", profile.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: history = [] } = useQuery({
    queryKey: ["payout-history"],
    enabled: !!profile,
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from("payout_history")
        .select("*")
        .eq("promoter_id", profile.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [method, setMethod] = useState(settings?.payout_method ?? "paypal");
  const [schedule, setSchedule] = useState(settings?.payout_schedule ?? "monthly");
  const [threshold, setThreshold] = useState(String(settings?.payout_threshold ?? "25"));

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("No profile");
      const payload = {
        promoter_id: profile.id,
        payout_method: method,
        payout_schedule: schedule,
        payout_threshold: Number(threshold) || 25,
      };

      if (settings) {
        const { error } = await supabase.from("payout_settings").update(payload).eq("id", settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("payout_settings").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Payout settings saved!");
      queryClient.invalidateQueries({ queryKey: ["payout-settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const METHOD_OPTIONS = [
    { value: "paypal", label: "PayPal", icon: Wallet },
    { value: "venmo", label: "Venmo", icon: Wallet },
    { value: "ach", label: "ACH / Bank Transfer", icon: Banknote },
    { value: "check", label: "Check", icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="font-heading text-xs uppercase tracking-wider text-muted-foreground">Payout Method</label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {METHOD_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="font-heading text-xs uppercase tracking-wider text-muted-foreground">Payout Schedule</label>
          <Select value={schedule} onValueChange={setSchedule}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="font-heading text-xs uppercase tracking-wider text-muted-foreground">Min. Threshold ($)</label>
          <Input type="number" min={25} value={threshold} onChange={(e) => setThreshold(e.target.value)} className="h-10" />
        </div>
      </div>

      <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
        Save Payout Settings
      </Button>

      {/* Payout History */}
      {history.length > 0 && (
        <div className="rounded-lg border border-border overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead className="bg-muted">
              <tr>
                {["Date", "Amount", "Method", "Status", "Reference"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-heading text-[10px] uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((p: any) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 text-sm font-body text-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-heading text-sm font-bold text-primary">${Number(p.amount).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm font-body text-muted-foreground capitalize">{p.payout_method}</td>
                  <td className="px-4 py-3"><Badge variant={p.status === "completed" ? "default" : "secondary"} className="text-[10px]">{p.status}</Badge></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-body">{p.reference_id ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard Page                                                */
/* ------------------------------------------------------------------ */
export default function PromoterDashboard() {
  const { data: profile, isLoading } = usePromoterProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Trophy className="h-12 w-12 text-primary" />
        <h2 className="font-heading text-2xl font-bold text-foreground">Join the Promoter Program</h2>
        <p className="text-muted-foreground font-body max-w-md">Sign up or log in to start earning commissions by promoting AutoWurx listings.</p>
        <Button size="lg" asChild>
          <a href="/promoters">Learn More</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Promoter <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Your code: <span className="font-mono text-primary font-bold">{profile.promoter_code}</span>
          </p>
        </div>
      </div>

      <StatsCards />

      <Tabs defaultValue="opportunities" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="opportunities">Open Opportunities</TabsTrigger>
          <TabsTrigger value="active">My Promotions</TabsTrigger>
          <TabsTrigger value="toolkit">Promo Toolkit</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities">
          <OpenOpportunities />
        </TabsContent>

        <TabsContent value="active">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            My Active <span className="text-primary">Promotions</span>
          </h2>
          <ActivePromotions />
        </TabsContent>

        <TabsContent value="toolkit">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            Promo <span className="text-primary">Toolkit</span>
          </h2>
          <PromoToolkit />
        </TabsContent>

        <TabsContent value="payouts">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            Payout <span className="text-primary">Settings</span>
          </h2>
          <PayoutSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
