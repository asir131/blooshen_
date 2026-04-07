import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Pencil, Trash2, Megaphone, Eye, ChevronDown, ChevronUp,
  Users, MousePointerClick, ArrowRightLeft, DollarSign, Crown, Send, Pause, Play, Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockListingsDashboard, categoryColors, type ListingStatus } from "@/data/mockDashboard";
import { mockPromoterActivity, type ListingPromoterActivity } from "@/data/mockPromoterActivity";
import { useNavigate } from "react-router-dom";

const statusColors: Record<ListingStatus, string> = {
  Active: "bg-success/15 text-success",
  Pending: "bg-cta/15 text-cta",
  Expired: "bg-destructive/15 text-destructive",
  Draft: "bg-secondary text-muted-foreground",
};

const tabs: ListingStatus[] = ["Active", "Pending", "Expired", "Draft"];

const PromoterPanel = ({ activity }: { activity: ListingPromoterActivity }) => {
  const [paused, setPaused] = useState(activity.commissionsPaused);
  const [featured, setFeatured] = useState(activity.featuredInMarketplace);
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="bg-secondary/30 border-t border-border px-6 py-4 space-y-4 animate-in fade-in-0 slide-in-from-top-1 duration-200">
      <div className="flex items-center gap-2 mb-1">
        <Megaphone className="h-4 w-4 text-cta" />
        <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">Promoter Activity</h4>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard icon={Users} label="Promoters" value={activity.activePromoters} />
        <StatCard icon={MousePointerClick} label="Clicks" value={activity.totalClicks} />
        <StatCard icon={ArrowRightLeft} label="Conversions" value={activity.totalConversions} />
        <StatCard icon={DollarSign} label="Paid Out" value={`$${activity.totalCommissionsPaid}`} />
        {activity.topPromoter && (
          <div className="rounded-lg border border-border bg-card p-3 space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Crown className="h-3 w-3 text-cta" />
              <span className="text-[10px] uppercase tracking-wider font-heading font-bold">Top Promoter</span>
            </div>
            <p className="text-sm font-bold text-foreground">{activity.topPromoter.name}</p>
            <p className="text-[10px] text-muted-foreground">{activity.topPromoter.conversions} conversions</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
          {paused ? <Play className="h-3.5 w-3.5 text-success" /> : <Pause className="h-3.5 w-3.5 text-destructive" />}
          <span className="text-xs text-foreground">{paused ? "Commissions paused" : "Commissions active"}</span>
          <Switch checked={!paused} onCheckedChange={(v) => setPaused(!v)} />
        </div>
        <div className="flex items-center gap-2 rounded-md border border-cta/30 bg-cta/5 px-3 py-2">
          <Flame className="h-3.5 w-3.5 text-cta" />
          <span className="text-xs text-foreground">Featured</span>
          {featured && <Badge className="bg-cta/15 text-cta text-[9px]">Hot Deal</Badge>}
          <Switch checked={featured} onCheckedChange={setFeatured} />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => setShowMessage(!showMessage)}
        >
          <Send className="h-3 w-3 mr-1" /> Message Promoters
        </Button>
      </div>

      {showMessage && (
        <div className="space-y-2 animate-in fade-in-0 duration-150">
          <Textarea
            placeholder="e.g. Price just dropped — re-share!"
            rows={2}
            className="text-sm"
          />
          <Button size="sm" className="bg-cta hover:bg-cta/85 text-cta-foreground text-xs">
            <Send className="h-3 w-3 mr-1" /> Send to {activity.activePromoters} Promoters
          </Button>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
  <div className="rounded-lg border border-border bg-card p-3 space-y-1">
    <div className="flex items-center gap-1 text-muted-foreground">
      <Icon className="h-3 w-3" />
      <span className="text-[10px] uppercase tracking-wider font-heading font-bold">{label}</span>
    </div>
    <p className="text-sm font-bold text-foreground">{value}</p>
  </div>
);

const MyListings = () => {
  const [activeTab, setActiveTab] = useState<ListingStatus | "All">("All");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (activeTab === "All") return mockListingsDashboard;
    return mockListingsDashboard.filter((l) => l.status === activeTab);
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-foreground">My Listings</h1>
        <Button onClick={() => navigate("/dashboard/new-listing")} className="bg-cta hover:bg-cta/85 text-cta-foreground">
          <Plus className="h-4 w-4 mr-1" /> Post a New Listing
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["All", ...tabs] as const).map((t) => {
          const count = t === "All" ? mockListingsDashboard.length : mockListingsDashboard.filter((l) => l.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                "px-4 py-1.5 rounded text-xs font-heading font-bold uppercase tracking-wider transition-colors",
                activeTab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {t} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <Card className="border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Listing</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Category</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-center">Views</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-center">Promoters</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Date Posted</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((listing) => {
                const activity = mockPromoterActivity[listing.id];
                const isExpanded = expandedRow === listing.id;

                return (
                  <>
                    <TableRow key={listing.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={listing.thumbnail} alt="" className="h-10 w-10 rounded object-cover shrink-0" />
                          <span className="font-medium text-foreground text-sm">{listing.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px]", categoryColors[listing.category])}>{listing.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          <Eye className="h-3.5 w-3.5" /> {listing.views}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {activity ? (
                          <button
                            onClick={() => setExpandedRow(isExpanded ? null : listing.id)}
                            className="flex items-center justify-center gap-1 text-sm text-cta hover:text-cta/80 transition-colors mx-auto"
                          >
                            <Users className="h-3.5 w-3.5" />
                            {activity.activePromoters}
                            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </button>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(listing.datePosted).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px]", statusColors[listing.status])}>{listing.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-cta hover:text-cta"
                            onClick={() => activity && setExpandedRow(isExpanded ? null : listing.id)}
                          >
                            <Megaphone className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && activity && (
                      <TableRow key={`${listing.id}-promo`} className="hover:bg-transparent">
                        <TableCell colSpan={7} className="p-0">
                          <PromoterPanel activity={activity} />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No listings in this category.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default MyListings;
