import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, Loader2, Upload, Star, Trash2, AlertTriangle, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { validateVIN, detectPlaceholderText } from "@/lib/utils";
import {
  listingSchema,
  type ListingFormValues,
  BODY_STYLES,
} from "@/lib/listingSchema";
import { cn } from "@/lib/utils";
import { VinFirstInput, type VinStatus, type DecodedVin } from "@/components/admin/VinFirstInput";

interface ListingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

interface UploadedImage {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  qualityScore: number;
  flagged: boolean;
  flagReason: string | null;
  isPrimary: boolean;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ListingFormModal({ open, onOpenChange, onSaved }: ListingFormModalProps) {
  const { profile } = useAuth();
  const [tab, setTab] = useState("info");
  const [listingId, setListingId] = useState<string | null>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    mode: "onChange",
    defaultValues: {
      vin: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      mileage: 0,
      price: 1000,
      description: "",
      seller_type: "dealer",
      body_style: "",
      color: "",
      condition: "used",
    },
  });

  const { register, handleSubmit, watch, setValue, formState } = form;
  const values = watch();

  // Reset on open
  useEffect(() => {
    if (open) {
      form.reset();
      setListingId(null);
      setImages([]);
      setTab("info");
    }
  }, [open, form]);

  // ---- Live validation indicators
  const vinValid = useMemo(() => validateVIN(values.vin || ""), [values.vin]);
  const placeholderHits = useMemo(
    () => [
      ...detectPlaceholderText(values.vin || ""),
      ...detectPlaceholderText(values.make || ""),
      ...detectPlaceholderText(values.model || ""),
      ...detectPlaceholderText(values.description || ""),
    ],
    [values.vin, values.make, values.model, values.description],
  );
  const requiredFilled =
    !!values.vin &&
    !!values.make &&
    !!values.model &&
    !!values.year &&
    values.mileage >= 0 &&
    !!values.price &&
    !!values.description &&
    !!values.seller_type;
  const descriptionOk = (values.description || "").length >= 100;
  const enoughImages = images.length >= 3;
  const noPlaceholders = placeholderHits.length === 0;

  const checklist = [
    { label: "VIN format valid", ok: vinValid },
    { label: "All required fields filled", ok: requiredFilled },
    { label: "Description ≥ 100 characters", ok: descriptionOk },
    { label: "3+ images uploaded", ok: enoughImages },
    { label: "No placeholder text detected", ok: noPlaceholders },
  ];
  const canSubmit = checklist.every((c) => c.ok);

  // ---- Save draft so we have an id for image uploads
  const ensureDraft = useCallback(async (): Promise<string | null> => {
    if (listingId) return listingId;
    if (!profile?.id) {
      toast.error("Profile not loaded yet");
      return null;
    }
    const v = form.getValues();
    const { data, error } = await supabase
      .from("vehicle_listings")
      .insert({
        created_by: profile.id,
        vin: v.vin || "PENDING0000000000",
        make: v.make || "Pending",
        model: v.model || "Pending",
        year: v.year || new Date().getFullYear(),
        mileage: v.mileage ?? 0,
        price: v.price ?? 0,
        description: v.description || "Pending listing draft",
        seller_type: v.seller_type,
        body_style: v.body_style || null,
        color: v.color || null,
        condition: v.condition,
        status: "draft",
      } as never)
      .select("id")
      .single();
    if (error) {
      toast.error(`Could not create draft: ${error.message}`);
      return null;
    }
    const id = (data as { id: string }).id;
    setListingId(id);
    return id;
  }, [listingId, profile, form]);

  // ---- Image upload via edge function
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const id = await ensureDraft();
    if (!id) return;

    setUploading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const url = `https://${projectId}.functions.supabase.co/validate-image`;

      for (const file of Array.from(files)) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`${file.name}: only JPG, PNG, WEBP allowed`);
          continue;
        }
        const fd = new FormData();
        fd.append("file", file);
        fd.append("listing_id", id);
        fd.append("is_primary", String(images.length === 0));

        const res = await fetch(url, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        const json = await res.json();
        if (!json.success) {
          toast.error(`${file.name}: ${json.error ?? "upload failed"}`);
          continue;
        }
        setImages((prev) => [
          ...prev,
          {
            id: json.imageId,
            url: json.url,
            fileName: file.name,
            fileSize: file.size,
            width: json.width,
            height: json.height,
            qualityScore: json.qualityScore,
            flagged: json.flagged,
            flagReason: json.flagReason,
            isPrimary: prev.length === 0,
          },
        ]);
      }
      toast.success("Images processed");
    } finally {
      setUploading(false);
    }
  };

  const setPrimary = async (imgId: string) => {
    if (!listingId) return;
    await supabase
      .from("listing_images")
      .update({ is_primary: false } as never)
      .eq("listing_id", listingId);
    await supabase
      .from("listing_images")
      .update({ is_primary: true } as never)
      .eq("id", imgId);
    setImages((prev) => prev.map((i) => ({ ...i, isPrimary: i.id === imgId })));
  };

  const removeImage = async (imgId: string) => {
    await supabase.from("listing_images").delete().eq("id", imgId);
    setImages((prev) => prev.filter((i) => i.id !== imgId));
  };

  // ---- Final submit: update listing fields & trigger integrity agent
  const onSubmit = async (data: ListingFormValues) => {
    if (!canSubmit) {
      toast.error("Resolve checklist items before submitting");
      return;
    }
    const id = await ensureDraft();
    if (!id) return;

    setSubmitting(true);
    try {
      const { error: updErr } = await supabase
        .from("vehicle_listings")
        .update({
          vin: data.vin.toUpperCase(),
          make: data.make,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          price: data.price,
          description: data.description,
          seller_type: data.seller_type,
          body_style: data.body_style || null,
          color: data.color || null,
          condition: data.condition,
          status: "pending_review",
        } as never)
        .eq("id", id);
      if (updErr) {
        toast.error(updErr.message);
        return;
      }

      const { data: agentRes, error: agentErr } = await supabase.functions.invoke(
        "integrity-agent",
        { body: { listing_id: id, triggered_by: "form_submit" } },
      );
      if (agentErr) {
        toast.error(`Agent error: ${agentErr.message}`);
      } else {
        const status = (agentRes as { status?: string })?.status ?? "submitted";
        toast.success(`Listing submitted — agent result: ${status}`);
      }
      onSaved?.();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-heading text-3xl uppercase tracking-wider text-primary">
            New Listing
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-3 bg-card">
              <TabsTrigger value="info">Vehicle Info</TabsTrigger>
              <TabsTrigger value="images">
                Images {images.length > 0 && `(${images.length})`}
              </TabsTrigger>
              <TabsTrigger value="review">Review &amp; Submit</TabsTrigger>
            </TabsList>

            {/* ---- Tab 1: Info ---- */}
            <TabsContent value="info" className="space-y-4 pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="vin">VIN *</Label>
                  <div className="relative">
                    <Input
                      id="vin"
                      maxLength={17}
                      className="font-mono uppercase pr-9 focus-visible:ring-primary"
                      {...register("vin", {
                        setValueAs: (v: string) => v.toUpperCase(),
                      })}
                    />
                    {values.vin?.length === 17 && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2">
                        {vinValid ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-destructive" />
                        )}
                      </span>
                    )}
                  </div>
                  {formState.errors.vin && (
                    <p className="mt-1 text-sm text-destructive">
                      {formState.errors.vin.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="seller_type">Seller Type *</Label>
                  <RadioGroup
                    value={values.seller_type}
                    onValueChange={(v) => setValue("seller_type", v as ListingFormValues["seller_type"])}
                    className="mt-2 flex gap-4"
                  >
                    {(["dealer", "private", "broker"] as const).map((t) => (
                      <div key={t} className="flex items-center gap-2">
                        <RadioGroupItem value={t} id={`st-${t}`} />
                        <Label htmlFor={`st-${t}`} className="capitalize">{t}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Input id="make" className="focus-visible:ring-primary" {...register("make")} />
                  {formState.errors.make && (
                    <p className="mt-1 text-sm text-destructive">{formState.errors.make.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input id="model" className="focus-visible:ring-primary" {...register("model")} />
                  {formState.errors.model && (
                    <p className="mt-1 text-sm text-destructive">{formState.errors.model.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    min={1900}
                    max={2030}
                    className="focus-visible:ring-primary"
                    {...register("year", { valueAsNumber: true })}
                  />
                  {formState.errors.year && (
                    <p className="mt-1 text-sm text-destructive">{formState.errors.year.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="mileage">Mileage *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min={0}
                    className="focus-visible:ring-primary"
                    {...register("mileage", { valueAsNumber: true })}
                  />
                  {formState.errors.mileage && (
                    <p className="mt-1 text-sm text-destructive">{formState.errors.mileage.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min={500}
                    max={500000}
                    className="focus-visible:ring-primary"
                    {...register("price", { valueAsNumber: true })}
                  />
                  {formState.errors.price && (
                    <p className="mt-1 text-sm text-destructive">{formState.errors.price.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" className="focus-visible:ring-primary" {...register("color")} />
                </div>

                <div>
                  <Label htmlFor="body_style">Body Style</Label>
                  <Select
                    value={values.body_style || ""}
                    onValueChange={(v) => setValue("body_style", v)}
                  >
                    <SelectTrigger className="focus:ring-primary">
                      <SelectValue placeholder="Select body style" />
                    </SelectTrigger>
                    <SelectContent>
                      {BODY_STYLES.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select
                    value={values.condition}
                    onValueChange={(v) => setValue("condition", v as ListingFormValues["condition"])}
                  >
                    <SelectTrigger className="focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="certified">Certified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">
                  Description * <span className="text-xs text-muted-foreground">
                    ({(values.description || "").length}/100 min)
                  </span>
                </Label>
                <Textarea
                  id="description"
                  rows={5}
                  className="focus-visible:ring-primary"
                  {...register("description")}
                />
                {formState.errors.description && (
                  <p className="mt-1 text-sm text-destructive">
                    {formState.errors.description.message}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* ---- Tab 2: Images ---- */}
            <TabsContent value="images" className="space-y-4 pt-4">
              <label
                htmlFor="image-upload"
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card p-10 text-center transition-colors hover:border-primary",
                  uploading && "pointer-events-none opacity-60",
                )}
              >
                {uploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : (
                  <Upload className="h-8 w-8 text-primary" />
                )}
                <span className="font-medium">Drop images or click to upload</span>
                <span className="text-xs text-muted-foreground">JPG, PNG, WEBP — max 15MB</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>

              {images.length < 3 && (
                <div className="flex items-center gap-2 rounded border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
                  <AlertTriangle className="h-4 w-4" />
                  At least 3 images required before validation
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((img) => (
                  <div key={img.id} className="rounded-lg border border-border bg-card p-2">
                    <div className="relative aspect-video overflow-hidden rounded">
                      <img src={img.url} alt={img.fileName} className="h-full w-full object-cover" />
                      {img.isPrimary && (
                        <span className="absolute left-2 top-2 rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <div className="truncate font-medium text-foreground">{img.fileName}</div>
                      <div>{(img.fileSize / 1024).toFixed(0)} KB · {img.width}×{img.height}</div>
                      <div className="flex items-center gap-2">
                        <span>Quality:</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded bg-muted">
                          <div
                            className={cn(
                              "h-full",
                              img.qualityScore >= 70
                                ? "bg-green-500"
                                : img.qualityScore >= 40
                                ? "bg-amber-500"
                                : "bg-destructive",
                            )}
                            style={{ width: `${img.qualityScore}%` }}
                          />
                        </div>
                        <span className="font-mono">{img.qualityScore}</span>
                      </div>
                      {img.flagged && (
                        <div className="text-destructive">⚠ {img.flagReason}</div>
                      )}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setPrimary(img.id)}
                        disabled={img.isPrimary}
                      >
                        <Star className="mr-1 h-3 w-3" />
                        Primary
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeImage(img.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ---- Tab 3: Review ---- */}
            <TabsContent value="review" className="space-y-4 pt-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 font-heading text-lg uppercase tracking-wider text-primary">
                  Summary
                </h3>
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">VIN</dt>
                  <dd className="font-mono">{values.vin || "—"}</dd>
                  <dt className="text-muted-foreground">Vehicle</dt>
                  <dd>{values.year} {values.make} {values.model}</dd>
                  <dt className="text-muted-foreground">Price</dt>
                  <dd>${(values.price || 0).toLocaleString()}</dd>
                  <dt className="text-muted-foreground">Mileage</dt>
                  <dd>{(values.mileage || 0).toLocaleString()} mi</dd>
                  <dt className="text-muted-foreground">Seller</dt>
                  <dd className="capitalize">{values.seller_type}</dd>
                  <dt className="text-muted-foreground">Condition</dt>
                  <dd className="capitalize">{values.condition}</dd>
                </dl>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 font-heading text-lg uppercase tracking-wider text-primary">
                  Validation Checklist
                </h3>
                <ul className="space-y-2 text-sm">
                  {checklist.map((c) => (
                    <li key={c.label} className="flex items-center gap-2">
                      {c.ok ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                      <span className={c.ok ? "" : "text-muted-foreground"}>{c.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={!canSubmit || submitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Integrity Agent…
                  </>
                ) : (
                  "Submit for Validation"
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
}
