import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGallery from "@/components/PhotoGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockListings } from "@/data/mockListings";
import CarListingCard from "@/components/CarListingCard";
import ShareEarnButton from "@/components/ShareEarnButton";
import SalesAgentChat from "@/components/SalesAgentChat";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import {
  Gauge, Cog, PaintBucket, Fingerprint, MapPin, CalendarDays,
  Phone, Mail, MessageSquare, Flag, ShieldCheck, ArrowLeft,
} from "lucide-react";

const CarListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const listing = mockListings.find((l) => l.id === Number(id));

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <h1 className="text-2xl font-heading font-bold text-foreground">Listing Not Found</h1>
          <Button asChild><Link to="/cars-for-sale">Back to Listings</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const title = `${listing.year} ${listing.make} ${listing.model}${listing.trim ? ` ${listing.trim}` : ""}`;
  const images = listing.images ?? [listing.image];
  const similar = mockListings
    .filter((l) => l.id !== listing.id && l.bodyStyle === listing.bodyStyle)
    .slice(0, 4);

  const specs = [
    { icon: Gauge, label: "Mileage", value: `${listing.mileage.toLocaleString()} mi` },
    { icon: Cog, label: "Engine", value: listing.engine ?? "—" },
    { icon: Cog, label: "Transmission", value: listing.transmission ?? "—" },
    { icon: PaintBucket, label: "Exterior", value: listing.exteriorColor ?? "—" },
    { icon: PaintBucket, label: "Interior", value: listing.interiorColor ?? "—" },
    { icon: Fingerprint, label: "VIN", value: listing.vin ?? "—" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container flex-1 py-6">
        {/* Back link */}
        <Link
          to="/cars-for-sale"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground font-body hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Gallery */}
            <PhotoGallery images={images} alt={title} />

            {/* Title block */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant={listing.condition === "New" ? "default" : listing.condition === "Certified" ? "accent" : "secondary"}>
                  {listing.condition}
                </Badge>
                <Badge variant="outline">{listing.bodyStyle}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-foreground">{title}</h1>
              <p className="font-heading text-3xl font-black text-primary mt-2">
                ${listing.price.toLocaleString()}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground font-body">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.location}</span>
                {listing.datePosted && (
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    Listed {new Date(listing.datePosted).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
                <ShareEarnButton
                  listingId={String(listing.id)}
                  listingPath={`/cars-for-sale/${listing.id}`}
                  category="cars_for_sale"
                  variant="detail"
                />
              </div>
            </div>

            {/* Key specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {specs.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="font-heading text-xs tracking-wider text-muted-foreground">{s.label.toUpperCase()}</span>
                    </div>
                    <p className="text-sm font-body font-medium text-foreground truncate">{s.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Description */}
            {listing.description && (
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-3">DESCRIPTION</h2>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{listing.description}</p>
              </div>
            )}

            {/* Vehicle History */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">VEHICLE HISTORY</h2>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-heading text-sm font-bold text-foreground">Carfax / AutoCheck Report</p>
                  <p className="text-xs text-muted-foreground font-body">Vehicle history report available upon request.</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-bold text-foreground">REVIEWS</h2>
              <ReviewList listingId={String(listing.id)} category="cars_for_sale" />
              <ReviewForm listingId={String(listing.id)} category="cars_for_sale" />
            </div>
          </div>

          {/* Sidebar — Seller card */}
          {listing.seller && (
            <div className="w-full lg:w-80 shrink-0">
              <div className="sticky top-20 rounded-lg border border-border bg-card p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <img
                    src={listing.seller.avatar}
                    alt={listing.seller.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-primary"
                  />
                  <div>
                    <p className="font-heading text-base font-bold text-foreground">{listing.seller.name}</p>
                    <p className="text-xs text-muted-foreground font-body">Member since {listing.seller.memberSince}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full gap-2">
                    <MessageSquare className="h-4 w-4" /> Message Seller
                  </Button>
                  <Button variant="secondary" className="w-full gap-2">
                    <Phone className="h-4 w-4" /> {listing.seller.phone}
                  </Button>
                  <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" /> Email Seller
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Similar Listings */}
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
              SIMILAR <span className="text-primary">LISTINGS</span>
            </h2>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max">
                {similar.map((car) => (
                  <Link key={car.id} to={`/cars-for-sale/${car.id}`} className="w-72 shrink-0 block">
                    <div className="group rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-[0_0_24px_hsl(50_100%_50%/0.06)]">
                      <div className="relative h-44 overflow-hidden">
                        <img src={car.image} alt={`${car.year} ${car.make} ${car.model}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                        <Badge className="absolute top-3 left-3" variant={car.condition === "New" ? "default" : car.condition === "Certified" ? "accent" : "secondary"}>{car.condition}</Badge>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-heading text-base font-bold text-foreground">{car.year} {car.make} {car.model}</h3>
                        <p className="font-heading text-xl font-black text-primary">${car.price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground font-body">{car.mileage.toLocaleString()} mi · {car.location}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Report */}
        <div className="mt-12 pb-4 text-center">
          <button className="inline-flex items-center gap-1 text-xs text-muted-foreground font-body hover:text-destructive transition-colors">
            <Flag className="h-3 w-3" /> Report this listing
          </button>
        </div>
      </div>

      <SalesAgentChat
        listingId={String(listing.id)}
        listingCategory="cars_for_sale"
        listingContext={listing as unknown as Record<string, unknown>}
      />
      <ShareEarnButton listingId={String(listing.id)} listingPath={`/cars-for-sale/${listing.id}`} category="cars_for_sale" variant="floating" />
      <Footer />
    </div>
  );
};

export default CarListingDetail;