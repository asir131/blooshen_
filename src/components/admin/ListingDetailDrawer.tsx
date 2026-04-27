import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { CopyVin } from "@/components/admin/CopyVin";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { fraudBgClass, fraudTextClass } from "@/lib/fraudColor";
import { formatDistanceToNow } from "date-fns";
import {
  StatusBadge,
  ValidationBadge,
} from "@/components/admin-master/StatusBadges";

interface Props {
  listingId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged?: () => void;
}

interface Listing {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string | null;
  body_style: string | null;
  condition: string | null;
  seller_type: string;
  description: string;
  status: string;
  validation_status: string;
  validation_score: number;
  fraud_score: number;
  flag_reasons: unknown;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface ImageRow {
  id: string;
  url: string;
  is_primary: boolean;
}

interface AuditRow {
  id: string;
  action: string;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

export function ListingDetailDrawer({ listingId, open, onOpenChange, onChanged }: Props) {
  const { isMasterAdmin } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState<null | {
    title: string;
    description: string;
    confirmWord: string;
    onConfirm: () => Promise<void>;
  }>(null);

  useEffect(() => {
    if (!open || !listingId) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [{ data: l }, { data: imgs }, { data: a }] = await Promise.all([
        supabase.from("vehicle_listings").select("*").eq("id", listingId).maybeSingle(),
        supabase
          .from("listing_images")
          .select("id, url, is_primary")
          .eq("listing_id", listingId),
        supabase
          .from("audit_logs")
          .select("id, action, created_at, metadata")
          .eq("entity_id", listingId)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      if (cancelled) return;
      setListing((l as Listing) ?? null);
      setImages((imgs as ImageRow[]) ?? []);
      setAudit((a as AuditRow[]) ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [listingId, open]);

  const update = async (patch: Partial<Listing>) => {
    if (!listingId) return;
    const { error } = await supabase
      .from("vehicle_listings")
      .update(patch as never)
      .eq("id", listingId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Listing updated");
    onChanged?.();
    onOpenChange(false);
  };

  const flags: { code?: string; severity?: string; description?: string }[] = Array.isArray(
    listing?.flag_reasons,
  )
    ? ((listing!.flag_reasons as unknown[]).map((f) =>
        typeof f === "string" ? { code: f } : (f as Record<string, unknown>),
      ) as never)
    : [];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-border bg-card p-0 text-foreground sm:max-w-[480px]"
        >
          {loading || !listing ? (
            <div className="space-y-3 p-6">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <div className="space-y-5 p-5">
              <SheetHeader className="space-y-3 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <CopyVin vin={listing.vin} />
                  <StatusBadge status={listing.status} />
                </div>
                <SheetTitle className="font-heading text-2xl uppercase tracking-wider">
                  {listing.year} {listing.make} {listing.model}
                </SheetTitle>
              </SheetHeader>

              {/* Image gallery */}
              {images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[...images]
                    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
                    .map((img, i) => (
                      <img
                        key={img.id}
                        src={img.url}
                        alt=""
                        className={
                          i === 0
                            ? "h-44 w-72 shrink-0 rounded object-cover"
                            : "h-32 w-44 shrink-0 rounded object-cover opacity-90"
                        }
                      />
                    ))}
                </div>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Detail label="Price" value={`$${Number(listing.price).toLocaleString()}`} />
                <Detail label="Mileage" value={`${Number(listing.mileage).toLocaleString()} mi`} />
                <Detail label="Color" value={listing.color ?? "—"} />
                <Detail label="Body Style" value={listing.body_style ?? "—"} />
                <Detail label="Seller" value={listing.seller_type} />
                <Detail label="Condition" value={listing.condition ?? "—"} />
              </div>

              {/* Description */}
              <div className="rounded-md border border-border bg-background/40 p-3 text-sm">
                <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
                  <span>Description</span>
                  <span>{listing.description?.length ?? 0} chars</span>
                </div>
                <p className="whitespace-pre-wrap text-foreground/90">{listing.description}</p>
              </div>

              {/* Validation report */}
              <div className="rounded-md border border-border bg-background/40 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Validation Report
                  </div>
                  <ValidationBadge status={listing.validation_status} />
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`font-heading text-4xl leading-none ${fraudTextClass(listing.fraud_score)}`}
                  >
                    {listing.fraud_score}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                      Fraud score
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded bg-muted">
                      <div
                        className={`h-full ${fraudBgClass(listing.fraud_score)}`}
                        style={{ width: `${Math.max(4, listing.fraud_score)}%` }}
                      />
                    </div>
                  </div>
                </div>
                {flags.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {flags.map((f, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 rounded border border-border/60 bg-background/60 p-2 text-xs"
                      >
                        <span>
                          {f.severity === "critical" ? "🔴" : f.severity === "warning" ? "🟡" : "🔵"}
                        </span>
                        <div>
                          <div className="font-mono text-[11px] text-foreground">{f.code}</div>
                          {f.description && (
                            <div className="text-muted-foreground">{f.description}</div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Audit trail */}
              <div className="rounded-md border border-border bg-background/40 p-3">
                <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                  Recent activity
                </div>
                {audit.length === 0 ? (
                  <div className="text-xs text-muted-foreground">No actions logged.</div>
                ) : (
                  <ul className="space-y-1.5 text-xs">
                    {audit.map((row) => (
                      <li key={row.id} className="flex items-center justify-between">
                        <span className="font-mono text-foreground">{row.action}</span>
                        <span
                          className="text-muted-foreground"
                          title={new Date(row.created_at).toLocaleString()}
                        >
                          {formatDistanceToNow(new Date(row.created_at), { addSuffix: true })}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                {isMasterAdmin ? (
                  <>
                    <Button
                      size="sm"
                      className="bg-emerald-500 text-black hover:bg-emerald-400"
                      onClick={() =>
                        update({
                          status: "approved",
                          is_published: true,
                          published_at: new Date().toISOString(),
                        } as Partial<Listing>)
                      }
                      disabled={listing.status === "approved"}
                    >
                      Approve & Publish
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => update({ status: "rejected", is_published: false } as Partial<Listing>)}
                      disabled={listing.status === "rejected"}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        setConfirm({
                          title: "Block listing",
                          description: "This blocks the listing from the marketplace.",
                          confirmWord: "BLOCK",
                          onConfirm: async () =>
                            update({ status: "blocked", is_published: false } as Partial<Listing>),
                        })
                      }
                      disabled={listing.status === "blocked"}
                    >
                      Block
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() =>
                      update({ status: "pending_review" } as Partial<Listing>)
                    }
                    disabled={listing.status === "pending_review"}
                  >
                    Submit for Review
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {confirm && (
        <ConfirmModal
          open={!!confirm}
          onOpenChange={(v) => !v && setConfirm(null)}
          title={confirm.title}
          description={confirm.description}
          confirmWord={confirm.confirmWord}
          onConfirm={confirm.onConfirm}
        />
      )}
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border/60 bg-background/40 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium text-foreground">{value}</div>
    </div>
  );
}
