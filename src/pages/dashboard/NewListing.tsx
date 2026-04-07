import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Car, Wrench, Store, Key, Users, CalendarDays, ArrowLeft, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ListingCategory, categoryColors } from "@/data/mockDashboard";
import RentalFields from "@/components/listing-form/RentalFields";
import CategoryFields from "@/components/listing-form/CategoryFields";
import PromoterBoostFields from "@/components/listing-form/PromoterBoostFields";

const categories: { label: ListingCategory; icon: React.ElementType; desc: string }[] = [
  { label: "Cars for Sale", icon: Car, desc: "List a vehicle for sale" },
  { label: "Parts & Accessories", icon: Wrench, desc: "Sell parts or accessories" },
  { label: "Service Providers", icon: Store, desc: "Offer automotive services" },
  { label: "Rentals", icon: Key, desc: "Rent out your vehicle" },
  { label: "Neighborhood Experts", icon: Users, desc: "Offer your expertise" },
  { label: "Events & Meetups", icon: CalendarDays, desc: "Host a car event" },
];

const NewListing = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory | null>(null);

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
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(null)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-heading text-2xl font-bold text-foreground">New Listing</h1>
        <Badge className={cn("text-[10px]", categoryColors[selectedCategory])}>{selectedCategory}</Badge>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-5">
          {/* Common fields */}
          <div className="space-y-1">
            <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Title</label>
            <Input placeholder="Enter listing title" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Description</label>
            <Textarea placeholder="Describe your listing..." rows={4} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Location</label>
            <Input placeholder="City, State or ZIP" />
          </div>

          {/* Photo upload */}
          <div className="space-y-1">
            <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Photos</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
              <p className="text-xs text-muted-foreground">Up to 10 photos</p>
            </div>
          </div>

          {/* Category-specific fields */}
          {selectedCategory === "Rentals" && <RentalFields />}
          {selectedCategory !== "Rentals" && <CategoryFields category={selectedCategory} />}

          {/* Promoter boost section */}
          <PromoterBoostFields category={selectedCategory} />

          <div className="flex gap-3 pt-4">
            <Button className="bg-cta hover:bg-cta/85 text-cta-foreground">Publish Listing</Button>
            <Button variant="secondary">Save as Draft</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewListing;
