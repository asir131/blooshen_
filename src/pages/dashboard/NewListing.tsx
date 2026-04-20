import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Car, Wrench, Store, Key, Users, CalendarDays, ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ListingCategory, categoryColors } from "@/data/mockDashboard";
import RentalFields from "@/components/listing-form/RentalFields";
import CategoryFields from "@/components/listing-form/CategoryFields";
import PromoterBoostFields from "@/components/listing-form/PromoterBoostFields";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type DbCategory = Database["public"]["Enums"]["listing_category_enum"];

const categories: { label: ListingCategory; icon: React.ElementType; desc: string; db: DbCategory }[] = [
  { label: "Cars for Sale", icon: Car, desc: "List a vehicle for sale", db: "cars_for_sale" },
  { label: "Parts & Accessories", icon: Wrench, desc: "Sell parts or accessories", db: "parts_accessories" },
  { label: "Service Providers", icon: Store, desc: "Offer automotive services", db: "service_providers" },
  { label: "Rentals", icon: Key, desc: "Rent out your vehicle", db: "rentals" },
  { label: "Neighborhood Experts", icon: Users, desc: "Offer your expertise", db: "neighborhood_experts" },
  { label: "Events & Meetups", icon: CalendarDays, desc: "Host a car event", db: "events_meetups" },
];

const NewListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dbCategory = categories.find((c) => c.label === selectedCategory)?.db;

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 10 - photos.length);
    if (!files.length) return;
    setPhotos((prev) => [...prev, ...files].slice(0, 10));
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 10));
  };

  const removePhoto = (i: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[i]);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const uploadPhotos = async (userId: string): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of photos) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("listing-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, isDraft: boolean) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to post a listing.", variant: "destructive" });
      navigate("/auth");
      return;
    }
    if (!dbCategory || !selectedCategory) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get("title") ?? "").trim();
    const description = String(fd.get("description") ?? "").trim();
    const location = String(fd.get("location") ?? "").trim();

    if (!title) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }

    // Collect category-specific fields into data JSONB
    const data: Record<string, any> = {};
    const categoryFieldKeys = [
      "year", "make", "model", "condition", "serviceType",
      "specialty", "hourlyRate", "eventDate", "ticketPrice",
    ];
    for (const key of categoryFieldKeys) {
      const v = fd.get(key);
      if (v !== null && String(v).trim() !== "") data[key] = String(v);
    }

    const priceRaw = fd.get("price");
    const price = priceRaw ? Number(priceRaw) : null;

    setSubmitting(true);
    try {
      const imageUrls = photos.length ? await uploadPhotos(user.id) : [];

      const { error } = await supabase.from("listings").insert({
        user_id: user.id,
        category: dbCategory,
        title,
        description: description || null,
        location: location || null,
        price: Number.isFinite(price as number) ? (price as number) : null,
        image: imageUrls[0] ?? null,
        images: imageUrls,
        data,
        is_active: !isDraft,
      });

      if (error) throw error;

      toast({
        title: isDraft ? "Draft saved" : "Listing published",
        description: isDraft ? "You can finish it later from My Listings." : "Your listing is now live.",
      });
      navigate("/dashboard/listings");
    } catch (err: any) {
      toast({ title: "Could not save listing", description: err.message ?? String(err), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-heading text-2xl font-bold text-foreground">Post a New Listing</h1>
        </div>
        <p className="text-muted-foreground">Choose a category to get started.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card
              key={cat.label}
              className="border-border bg-card hover:border-primary/40 cursor-pointer transition-colors"
              onClick={() => setSelectedCategory(cat.label)}
            >
              <CardContent className="p-6 text-center space-y-3">
                <cat.icon className="h-10 w-10 mx-auto text-primary" />
                <h3 className="font-heading font-bold text-foreground">{cat.label}</h3>
                <p className="text-xs text-muted-foreground">{cat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="icon" onClick={() => setSelectedCategory(null)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-heading text-2xl font-bold text-foreground">New Listing</h1>
        <Badge className={cn("text-[10px]", categoryColors[selectedCategory])}>{selectedCategory}</Badge>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Title</label>
            <Input name="title" placeholder="Enter listing title" required />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Description</label>
            <Textarea name="description" placeholder="Describe your listing..." rows={4} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Location</label>
            <Input name="location" placeholder="City, State or ZIP" />
          </div>

          {/* Photo upload */}
          <div className="space-y-2">
            <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Photos</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoChange}
            />
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload</p>
              <p className="text-xs text-muted-foreground">Up to 10 photos ({photos.length}/10)</p>
            </div>
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {previews.map((src, i) => (
                  <div key={src} className="relative aspect-square rounded-md overflow-hidden border border-border">
                    <img src={src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 hover:bg-background"
                      aria-label="Remove photo"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category-specific fields */}
          {selectedCategory === "Rentals" && <RentalFields />}
          {selectedCategory !== "Rentals" && <CategoryFields category={selectedCategory} />}

          {/* Promoter boost section */}
          <PromoterBoostFields category={selectedCategory} />

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={submitting} className="bg-cta hover:bg-cta/85 text-cta-foreground">
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Publish Listing
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={submitting}
              onClick={(e) => {
                const form = (e.currentTarget as HTMLButtonElement).form;
                if (form) handleSubmit({ preventDefault: () => {}, currentTarget: form } as any, true);
              }}
            >
              Save as Draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default NewListing;
