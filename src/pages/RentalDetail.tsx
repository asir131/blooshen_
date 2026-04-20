import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { format, differenceInCalendarDays, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isBefore, isAfter, startOfDay } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGallery from "@/components/PhotoGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ShareEarnButton from "@/components/ShareEarnButton";
import SalesAgentChat from "@/components/SalesAgentChat";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mockRentals } from "@/data/mockRentals";
import { cn } from "@/lib/utils";
import {
  Users, DoorOpen, Cog, Fuel, Gauge, MapPin, Star, Heart, MessageSquare,
  CalendarIcon, ArrowLeft, Flag, ShieldCheck, Check, Clock, Truck, Briefcase,
  ChevronLeft, ChevronRight, Banknote,
} from "lucide-react";

const RentalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const listing = mockRentals.find((r) => r.id === Number(id));
  const [pickupDate, setPickupDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [calMonth, setCalMonth] = useState(new Date());

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <h1 className="text-2xl font-heading font-bold text-foreground">Rental Not Found</h1>
          <Button asChild><Link to="/rentals">Back to Rentals</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const title = `${listing.year} ${listing.make} ${listing.model}`;
  const d = listing.detail!;
  const images = d.images.length ? d.images : [listing.image];
  const cashOk = listing.features.includes("Cash Accepted");
  const bookedSet = new Set(d.bookedDates);
  const today = startOfDay(new Date());

  const rentalDays = pickupDate && returnDate ? Math.max(differenceInCalendarDays(returnDate, pickupDate), 1) : 0;
  const totalCost = rentalDays > 0 ? (rentalDays >= 7 ? Math.floor(rentalDays / 7) * listing.weeklyRate + (rentalDays % 7) * listing.dailyRate : rentalDays * listing.dailyRate) : 0;

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(listing.rating));
  const similar = mockRentals.filter((r) => r.id !== listing.id && r.vehicleType === listing.vehicleType).slice(0, 4);

  // Rating distribution mock
  const dist = [65, 20, 10, 3, 2]; // 5,4,3,2,1 star %

  // Availability calendar
  const calStart = startOfMonth(calMonth);
  const calEnd = endOfMonth(calMonth);
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd });
  const startDow = getDay(calStart);

  const specs = [
    { icon: Users, label: "Seats", value: String(d.seats) },
    { icon: DoorOpen, label: "Doors", value: String(d.doors) },
    { icon: Cog, label: "Transmission", value: d.transmission },
    { icon: Fuel, label: "Fuel", value: d.fuelType },
    { icon: Gauge, label: "MPG / Range", value: d.mpg },
    { icon: MapPin, label: "Mi Limit/Day", value: d.mileageLimit },
    { icon: Banknote, label: "Deposit", value: `$${d.deposit}` },
  ];

  const terms = [
    { icon: Clock, label: "Min Rental", value: `${d.minRentalDays} day${d.minRentalDays > 1 ? "s" : ""}` },
    { icon: Clock, label: "Late Return", value: d.latePolicy },
    { icon: Fuel, label: "Fuel Policy", value: d.fuelPolicy },
    { icon: Truck, label: "Delivery", value: d.deliveryOption },
    { icon: Briefcase, label: "Allowed Uses", value: d.allowedUses },
  ];

  const DateBtn = ({ date, label, onSelect }: { date: Date | undefined; label: string; onSelect: (d: Date | undefined) => void }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className={cn("w-full justify-start text-left text-sm font-body", !date && "text-muted-foreground")}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          {date ? format(date, "MMM d, yyyy") : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={onSelect} initialFocus className={cn("p-3 pointer-events-auto")} disabled={(dt) => isBefore(dt, today) || bookedSet.has(format(dt, "yyyy-MM-dd"))} />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container flex-1 py-6">
        <Link to="/rentals" className="inline-flex items-center gap-1 text-sm text-muted-foreground font-body hover:text-primary transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to rentals
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* 1. Gallery */}
            <PhotoGallery images={images} alt={title} />

            {/* 2. Title block */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline">{listing.vehicleType}</Badge>
                {cashOk && <Badge>Cash OK</Badge>}
                {listing.availableNow ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-heading font-bold tracking-wider"><span className="h-2 w-2 rounded-full bg-success" /><span className="text-foreground">AVAILABLE NOW</span></span>
                ) : (
                  <span className="text-xs font-heading tracking-wider text-muted-foreground">Next: {listing.nextAvailable}</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-foreground">{title}</h1>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="font-heading text-3xl font-black text-primary">${listing.dailyRate}/day</span>
                <span className="text-sm text-muted-foreground font-body">${listing.weeklyRate}/week</span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground font-body">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.distance} mi away</span>
                <div className="flex items-center gap-1">
                  {stars.map((f, i) => <Star key={i} className={`h-4 w-4 ${f ? "fill-primary text-primary" : "text-muted-foreground"}`} />)}
                  <span className="ml-1">{listing.rating} ({listing.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* 3. Key specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {specs.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="rounded-lg border border-border bg-card p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="font-heading text-[10px] tracking-wider text-muted-foreground">{s.label.toUpperCase()}</span>
                    </div>
                    <p className="text-sm font-body font-medium text-foreground">{s.value}</p>
                  </div>
                );
              })}
            </div>

            {/* 4. Rental Terms */}
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">RENTAL TERMS</h2>
              <div className="space-y-3">
                {terms.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div key={t.label} className="flex gap-3 text-sm font-body">
                      <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <span className="font-heading text-xs tracking-wider text-muted-foreground">{t.label.toUpperCase()}</span>
                        <p className="text-foreground">{t.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Availability Calendar */}
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">AVAILABILITY</h2>
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setCalMonth((m) => addMonths(m, -1))} className="p-1 rounded hover:bg-muted"><ChevronLeft className="h-5 w-5 text-muted-foreground" /></button>
                  <span className="font-heading text-sm font-bold text-foreground">{format(calMonth, "MMMM yyyy").toUpperCase()}</span>
                  <button onClick={() => setCalMonth((m) => addMonths(m, 1))} className="p-1 rounded hover:bg-muted"><ChevronRight className="h-5 w-5 text-muted-foreground" /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
                    <div key={d} className="text-[10px] font-heading tracking-wider text-muted-foreground py-1">{d}</div>
                  ))}
                  {Array.from({ length: startDow }).map((_, i) => <div key={`e-${i}`} />)}
                  {calDays.map((day) => {
                    const isBooked = bookedSet.has(format(day, "yyyy-MM-dd"));
                    const isPast = isBefore(day, today);
                    const isSelected = (pickupDate && isSameDay(day, pickupDate)) || (returnDate && isSameDay(day, returnDate));
                    const inRange = pickupDate && returnDate && isAfter(day, pickupDate) && isBefore(day, returnDate);
                    return (
                      <button
                        key={day.toISOString()}
                        disabled={isBooked || isPast}
                        onClick={() => {
                          if (!pickupDate || (pickupDate && returnDate)) { setPickupDate(day); setReturnDate(undefined); }
                          else if (isBefore(day, pickupDate)) { setPickupDate(day); }
                          else { setReturnDate(day); }
                        }}
                        className={cn(
                          "h-9 rounded text-sm font-body transition-colors",
                          isBooked || isPast ? "text-muted-foreground/30 cursor-not-allowed line-through" : "hover:bg-primary/20 text-foreground cursor-pointer",
                          isSelected && "bg-primary text-primary-foreground font-bold",
                          inRange && "bg-primary/10",
                        )}
                      >
                        {format(day, "d")}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-body">
                  <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-primary" /> Selected</span>
                  <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-muted line-through text-[8px] flex items-center justify-center">X</span> Booked</span>
                </div>
              </div>
            </div>

            {/* 7. What's Included */}
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">WHAT'S INCLUDED</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {d.included.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-body text-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Reviews */}
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">REVIEWS</h2>
              {/* Rating breakdown */}
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="text-center">
                  <p className="font-heading text-5xl font-black text-primary">{listing.rating}</p>
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    {stars.map((f, i) => <Star key={i} className={`h-4 w-4 ${f ? "fill-primary text-primary" : "text-muted-foreground"}`} />)}
                  </div>
                  <p className="text-xs text-muted-foreground font-body mt-1">{listing.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {dist.map((pct, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-body">
                      <span className="w-3 text-muted-foreground">{5 - i}</span>
                      <Star className="h-3 w-3 text-primary fill-primary" />
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-muted-foreground">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live reviews + form */}
              <div className="space-y-4">
                <ReviewList listingId={String(listing.id)} category="rentals" />
                <ReviewForm listingId={String(listing.id)} category="rentals" />
              </div>
            </div>
          </div>

          {/* 6. Sidebar — Booking panel */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* Booking card */}
              <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                <p className="font-heading text-2xl font-black text-primary">${listing.dailyRate}<span className="text-sm font-body text-muted-foreground font-normal"> /day</span></p>

                <div className="space-y-2">
                  <DateBtn date={pickupDate} label="Pick-up date" onSelect={(d) => { setPickupDate(d); if (returnDate && d && isAfter(d, returnDate)) setReturnDate(undefined); }} />
                  <DateBtn date={returnDate} label="Return date" onSelect={setReturnDate} />
                </div>

                {rentalDays > 0 && (
                  <div className="rounded-md bg-muted p-3 space-y-1">
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-muted-foreground">{rentalDays} day{rentalDays > 1 ? "s" : ""}</span>
                      <span className="text-foreground font-medium">${totalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-muted-foreground">Deposit (refundable)</span>
                      <span className="text-foreground font-medium">${d.deposit}</span>
                    </div>
                    <div className="border-t border-border pt-1 mt-1 flex justify-between text-sm font-heading font-bold">
                      <span>Total Due</span>
                      <span className="text-primary">${(totalCost + d.deposit).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <Button className="w-full" size="lg" disabled={!pickupDate || !returnDate}>Request to Rent</Button>
                <ShareEarnButton listingId={String(listing.id)} listingPath={`/rentals/${listing.id}`} category="rentals" variant="detail" />
                <Button variant="secondary" className="w-full gap-2"><MessageSquare className="h-4 w-4" /> Message Owner</Button>

                {cashOk && (
                  <p className="text-xs text-muted-foreground font-body flex items-center gap-1.5">
                    <Banknote className="h-4 w-4 text-primary" /> Cash rental — contact owner directly
                  </p>
                )}
              </div>

              {/* Owner card */}
              <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={listing.ownerAvatar} alt={listing.ownerName} className="h-12 w-12 rounded-full object-cover border-2 border-primary" />
                  <div>
                    <p className="font-heading text-base font-bold text-foreground">{listing.ownerName}</p>
                    <p className="text-xs text-muted-foreground font-body">Member since {listing.memberSince}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {stars.map((f, i) => <Star key={i} className={`h-3.5 w-3.5 ${f ? "fill-primary text-primary" : "text-muted-foreground"}`} />)}
                  <span className="text-xs text-muted-foreground font-body ml-1">{listing.rating}</span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground font-body">
                  <p>Response rate: <span className="text-foreground font-medium">97%</span></p>
                  <p>Response time: <span className="text-foreground font-medium">Within 1 hour</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 9. Similar Rentals */}
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">SIMILAR <span className="text-primary">RENTALS</span></h2>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max">
                {similar.map((r) => (
                  <Link key={r.id} to={`/rentals/${r.id}`} className="w-72 shrink-0 block group">
                    <div className="rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-[0_0_24px_hsl(50_100%_50%/0.06)]">
                      <div className="relative h-44 overflow-hidden">
                        <img src={r.image} alt={`${r.year} ${r.make} ${r.model}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                        {r.features.includes("Cash Accepted") && <Badge className="absolute top-3 left-3">Cash OK</Badge>}
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-heading text-sm font-bold text-foreground">{r.year} {r.make} {r.model}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="font-heading text-xl font-black text-primary">${r.dailyRate}/day</span>
                          <span className="text-[11px] text-muted-foreground font-body">${r.weeklyRate}/wk</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-body">{r.distance} mi away · {r.rating}★</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 10. Report */}
        <div className="mt-12 pb-4 text-center">
          <button className="inline-flex items-center gap-1 text-xs text-muted-foreground font-body hover:text-destructive transition-colors">
            <Flag className="h-3 w-3" /> Report this listing
          </button>
        </div>
      </div>
      <SalesAgentChat
        listingId={String(listing.id)}
        listingCategory="rentals"
        listingContext={listing as unknown as Record<string, unknown>}
      />
      <ShareEarnButton listingId={String(listing.id)} listingPath={`/rentals/${listing.id}`} category="rentals" variant="floating" />
      <Footer />
    </div>
  );
};

export default RentalDetail;