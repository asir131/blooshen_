import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Bot,
  Pencil,
  Trash2,
  ListChecks,
  LogOut,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ListingFormModal } from "@/components/admin/ListingFormModal";

type StatusFilter = "all" | "draft" | "pending_review" | "approved" | "rejected" | "blocked" | "flagged";
type SellerFilter = "all" | "dealer" | "private" | "broker";

interface Listing {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  status: string;
  validation_status: string;
  fraud_score: number;
  flag_reasons: unknown;
  seller_type: string;
}

interface ListingImage {
  listing_id: string;
  url: string;
  is_primary: boolean;
}

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "pending_review", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "blocked", label: "Blocked" },
  { key: "flagged", label: "Flagged" },
];

const SELLER_FILTERS: { key: SellerFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "dealer", label: "Dealer" },
  { key: "private", label: "Private" },
  { key: "broker", label: "Broker" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    draft: { cls: "bg-muted text-muted-foreground", label: "DRAFT" },
    pending_review: { cls: "bg-amber-500/20 text-amber-400 border border-amber-500/40", label: "⏳ PENDING" },
    approved: { cls: "bg-green-500/20 text-green-400 border border-green-500/40", label: "✅ APPROVED" },
    rejected: { cls: "bg-red-500/20 text-red-400 border border-red-500/40", label: "✗ REJECTED" },
    blocked: { cls: "bg-red-600/30 text-red-300 border-2 border-red-500 font-bold", label: "🚫 BLOCKED" },
  };
  const v = map[status] ?? map.draft;
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs uppercase", v.cls)}>
      {v.label}
    </span>
  );
}

function ValidationBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    passed: { cls: "text-green-400", label: "✅ VALID" },
    failed: { cls: "text-red-400", label: "❌ FAILED" },
    flagged: { cls: "text-amber-400", label: "⚠ FLAGGED" },
    unvalidated: { cls: "text-muted-foreground", label: "— PENDING" },
  };
  const v = map[status] ?? map.unvalidated;
  return <span className={cn("text-xs font-semibold", v.cls)}>{v.label}</span>;
}

function FraudBar({ score }: { score: number }) {
  const color = score <= 30 ? "bg-green-500" : score <= 60 ? "bg-amber-500" : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded bg-muted">
        <div className={cn("h-full", color)} style={{ width: `${Math.max(4, score)}%` }} />
      </div>
      <span className="font-mono text-xs">{score}</span>
    </div>
  );
}

const AdminInventory = () => {
  const { isMasterAdmin, signOut, profile } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sellerFilter, setSellerFilter] = useState<SellerFilter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [runningAgent, setRunningAgent] = useState<string | null>(null);

  const { data: listings = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Listing[];
    },
  });

  const { data: imagesByListing = {} } = useQuery({
    queryKey: ["admin-inventory-images", listings.map((l) => l.id).join(",")],
    enabled: listings.length > 0,
    queryFn: async () => {
      const ids = listings.map((l) => l.id);
      const { data } = await supabase
        .from("listing_images")
        .select("listing_id, url, is_primary")
        .in("listing_id", ids);
      const map: Record<string, string> = {};
      ((data ?? []) as ListingImage[]).forEach((img) => {
        if (img.is_primary || !map[img.listing_id]) {
          map[img.listing_id] = img.url;
        }
      });
      return map;
    },
  });

  const counts = useMemo(() => {
    const c = { total: listings.length, approved: 0, flagged: 0, blocked: 0 };
    for (const l of listings) {
      if (l.status === "approved") c.approved++;
      if (l.validation_status === "flagged" || l.status === "pending_review") c.flagged++;
      if (l.status === "blocked") c.blocked++;
    }
    return c;
  }, [listings]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (sellerFilter !== "all" && l.seller_type !== sellerFilter) return false;
      if (statusFilter !== "all") {
        if (statusFilter === "flagged") {
          if (l.validation_status !== "flagged") return false;
        } else if (l.status !== statusFilter) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const blob = `${l.vin} ${l.make} ${l.model} ${l.year}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [listings, statusFilter, sellerFilter, search]);

  const runAgent = async (id: string) => {
    setRunningAgent(id);
    try {
      const { error } = await supabase.functions.invoke("integrity-agent", {
        body: { listing_id: id, triggered_by: "manual_admin" },
      });
      if (error) toast.error(error.message);
      else toast.success("Integrity agent finished");
      qc.invalidateQueries({ queryKey: ["admin-inventory"] });
    } finally {
      setRunningAgent(null);
    }
  };

  const setStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("vehicle_listings")
      .update({
        status,
        is_published: status === "approved",
        published_at: status === "approved" ? new Date().toISOString() : null,
      } as never)
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Listing ${status}`);
      refetch();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Permanently delete this listing? This cannot be undone.")) return;
    await supabase.from("listing_images").delete().eq("listing_id", id);
    const { error } = await supabase.from("vehicle_listings").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Listing deleted");
      refetch();
    }
  };

  useEffect(() => {
    document.title = "Inventory Management — AutoWurx";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-primary">
                <span className="font-heading text-base font-bold uppercase tracking-wider text-primary-foreground">
                  AW
                </span>
              </div>
              <span className="font-heading text-xl font-bold uppercase tracking-widest">
                Inventory
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{profile?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Header bar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-heading text-4xl uppercase tracking-wider text-foreground">
              Inventory Management
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { label: "Total", value: counts.total },
                { label: "Approved", value: counts.approved, cls: "border-green-500/40 text-green-400" },
                { label: "Flagged", value: counts.flagged, cls: "border-amber-500/40 text-amber-400" },
                { label: "Blocked", value: counts.blocked, cls: "border-red-500/40 text-red-400" },
              ].map((c) => (
                <span
                  key={c.label}
                  className={cn(
                    "rounded-full border border-border bg-card px-3 py-1 text-sm",
                    c.cls,
                  )}
                >
                  {c.label}: <span className="font-bold">{c.value}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search VIN / make / model"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-72 bg-card pl-8 focus-visible:ring-primary"
              />
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Listing
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-6 space-y-3">
          <FilterRow label="Status" filters={STATUS_FILTERS} active={statusFilter} onChange={setStatusFilter} />
          <FilterRow label="Seller" filters={SELLER_FILTERS} active={sellerFilter} onChange={setSellerFilter} />
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Image</TableHead>
                <TableHead>VIN</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Validation</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-12 text-center text-muted-foreground">
                    No listings match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((l) => {
                  const flags = Array.isArray(l.flag_reasons) ? (l.flag_reasons as string[]) : [];
                  return (
                    <TableRow key={l.id} className="border-border">
                      <TableCell>
                        {imagesByListing[l.id] ? (
                          <img
                            src={imagesByListing[l.id]}
                            alt=""
                            className="h-12 w-16 rounded object-cover"
                          />
                        ) : (
                          <div className="h-12 w-16 rounded bg-muted" />
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{l.vin}</TableCell>
                      <TableCell className="text-sm">
                        {l.year} {l.make} {l.model}
                      </TableCell>
                      <TableCell>${Number(l.price).toLocaleString()}</TableCell>
                      <TableCell>{Number(l.mileage).toLocaleString()}</TableCell>
                      <TableCell><StatusBadge status={l.status} /></TableCell>
                      <TableCell><ValidationBadge status={l.validation_status} /></TableCell>
                      <TableCell><FraudBar score={l.fraud_score} /></TableCell>
                      <TableCell>
                        {flags.length === 0 ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          <span
                            className="cursor-help text-xs text-amber-400"
                            title={flags.join("\n")}
                          >
                            {flags.length} flag{flags.length === 1 ? "" : "s"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Run Integrity Agent"
                            onClick={() => runAgent(l.id)}
                            disabled={runningAgent === l.id}
                          >
                            {runningAgent === l.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Bot className="h-4 w-4 text-primary" />
                            )}
                          </Button>
                          <Button size="icon" variant="ghost" title="View logs" disabled>
                            <ListChecks className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" title="Edit" disabled>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {isMasterAdmin && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Approve"
                                onClick={() => setStatus(l.id, "approved")}
                                disabled={l.status === "approved"}
                              >
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Reject"
                                onClick={() => setStatus(l.id, "rejected")}
                                disabled={l.status === "rejected"}
                              >
                                <XCircle className="h-4 w-4 text-destructive" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Delete"
                                onClick={() => remove(l.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      <ListingFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSaved={() => refetch()}
      />
    </div>
  );
};

interface FilterRowProps<T extends string> {
  label: string;
  filters: { key: T; label: string }[];
  active: T;
  onChange: (v: T) => void;
}

function FilterRow<T extends string>({ label, filters, active, onChange }: FilterRowProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      {filters.map((f) => (
        <button
          key={f.key}
          type="button"
          onClick={() => onChange(f.key)}
          className={cn(
            "rounded-full border px-3 py-1 text-sm transition-colors",
            active === f.key
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export default AdminInventory;
