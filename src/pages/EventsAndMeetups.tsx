import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import MobileFilterSheet from "@/components/MobileFilterSheet";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CalendarIcon, MapPin, Users, List, CalendarDays, Plus,
  ChevronLeft, ChevronRight, Clock, DollarSign, Filter, Ticket, Star, SlidersHorizontal,
} from "lucide-react";
import ShareEarnButton from "@/components/ShareEarnButton";
import { cn } from "@/lib/utils";
import { format, isSameDay, isSameMonth, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths, getDay, isAfter, isBefore } from "date-fns";
import { mockEvents, eventTypes, type AutoEvent, type EventType } from "@/data/mockEvents";

const ITEMS_PER_PAGE = 6;

const eventTypeColors: Record<EventType, string> = {
  "Car Show": "bg-primary/15 text-primary",
  "Track Day": "bg-destructive/15 text-destructive",
  "Swap Meet": "bg-cta/15 text-cta",
  "Cruise Night": "bg-[hsl(270_60%_60%)]/15 text-[hsl(270_60%_60%)]",
  "Club Meeting": "bg-success/15 text-success",
  "Charity Drive": "bg-[hsl(200_70%_50%)]/15 text-[hsl(200_70%_50%)]",
  "Race": "bg-destructive/15 text-destructive",
};

/* ─── Featured Banner ─── */
const FeaturedBanner = ({ events }: { events: AutoEvent[] }) => {
  const [idx, setIdx] = useState(0);
  const ev = events[idx];
  if (!ev) return null;

  return (
    <div className="relative rounded-lg overflow-hidden border border-border">
      <img src={ev.photo} alt={ev.title} className="w-full h-64 md:h-80 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
        <Badge className="bg-cta text-cta-foreground">Featured Event</Badge>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{ev.title}</h2>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><CalendarIcon className="h-4 w-4" />{format(parseISO(ev.date), "MMM d, yyyy")}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{ev.time}</span>
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{ev.location}</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4" />{ev.attending} attending</span>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button size="sm"><Ticket className="h-4 w-4 mr-1" />{ev.isFree ? "RSVP — Free" : `Get Tickets — $${ev.price}`}</Button>
          {events.length > 1 && (
            <div className="flex gap-1 ml-auto">
              {events.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Event Card ─── */
const EventCard = ({ event }: { event: AutoEvent }) => (
  <Card className="border-border bg-card hover:border-primary/40 transition-colors overflow-hidden">
    <div className="relative">
      <img src={event.photo} alt={event.title} className="w-full h-44 object-cover" />
      <Badge className={cn("absolute top-3 left-3 text-[10px]", eventTypeColors[event.eventType])}>
        {event.eventType}
      </Badge>
      <ShareEarnButton listingId={event.id} listingPath={`/events/${event.id}`} category="events_meetups" variant="card" />
    </div>
    <CardContent className="p-4 space-y-3">
      <h3 className="font-heading text-lg font-bold text-foreground leading-tight">{event.title}</h3>
      <div className="space-y-1 text-sm text-muted-foreground">
        <p className="flex items-center gap-1.5"><CalendarIcon className="h-3.5 w-3.5 shrink-0" />{format(parseISO(event.date), "EEE, MMM d, yyyy")} · {event.time}</p>
        <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" />{event.location} <span className="text-xs">({event.distance} mi)</span></p>
      </div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="h-3.5 w-3.5" />{event.attending}</span>
        <span className="font-heading font-bold text-sm text-foreground">
          {event.isFree ? <span className="text-success">Free</span> : `$${event.price}`}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">Hosted by <span className="text-foreground font-medium">{event.organizer}</span></p>
      <Button size="sm" className="w-full">
        <Ticket className="h-4 w-4 mr-1" />{event.isFree ? "RSVP" : "Get Tickets"}
      </Button>
    </CardContent>
  </Card>
);

/* ─── Calendar View ─── */
const CalendarView = ({ events, filteredEvents }: { events: AutoEvent[]; filteredEvents: AutoEvent[] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // March 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const eventsByDate = useMemo(() => {
    const map = new Map<string, AutoEvent[]>();
    filteredEvents.forEach((ev) => {
      const key = ev.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    });
    return map;
  }, [filteredEvents]);

  const selectedEvents = selectedDate
    ? filteredEvents.filter((ev) => isSameDay(parseISO(ev.date), selectedDate))
    : [];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-heading text-xl font-bold text-foreground">{format(currentMonth, "MMMM yyyy")}</h3>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {weekdays.map((d) => (
            <div key={d} className="bg-secondary p-2 text-center text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">{d}</div>
          ))}
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDate.get(key) || [];
            const inMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <button
                key={key}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "bg-card p-2 min-h-[72px] text-left transition-colors hover:bg-secondary/60",
                  !inMonth && "opacity-30",
                  isSelected && "ring-2 ring-primary ring-inset"
                )}
              >
                <span className={cn("text-sm font-body", inMonth ? "text-foreground" : "text-muted-foreground")}>
                  {format(day, "d")}
                </span>
                {dayEvents.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <div key={ev.id} className="h-1.5 w-1.5 rounded-full bg-primary" title={ev.title} />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[9px] text-muted-foreground">+{dayEvents.length - 3}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side panel */}
      <div className="w-full lg:w-80 shrink-0">
        <Card className="border-border bg-card sticky top-20">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-heading font-bold text-foreground">
              {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a date"}
            </h3>
            {selectedDate && selectedEvents.length === 0 && (
              <p className="text-sm text-muted-foreground">No events on this date.</p>
            )}
            {selectedEvents.map((ev) => (
              <div key={ev.id} className="space-y-2 border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <img src={ev.photo} alt={ev.title} className="h-14 w-14 rounded object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-sm text-foreground leading-tight">{ev.title}</p>
                    <p className="text-xs text-muted-foreground">{ev.time} · {ev.location}</p>
                    <Badge className={cn("text-[9px] mt-1", eventTypeColors[ev.eventType])}>{ev.eventType}</Badge>
                  </div>
                </div>
                <Button size="sm" className="w-full">
                  <Ticket className="h-3.5 w-3.5 mr-1" />{ev.isFree ? "RSVP" : `$${ev.price}`}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/* ─── Page ─── */
const EventsAndMeetups = () => {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
  const [maxDistance, setMaxDistance] = useState(50);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleType = (t: EventType) => {
    setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
    setPage(1);
  };

  const filtered = useMemo(() => {
    return mockEvents.filter((ev) => {
      if (selectedTypes.length && !selectedTypes.includes(ev.eventType)) return false;
      if (ev.distance > maxDistance) return false;
      if (showFreeOnly && !ev.isFree) return false;
      if (showPaidOnly && ev.isFree) return false;
      const evDate = parseISO(ev.date);
      if (dateFrom && isBefore(evDate, dateFrom)) return false;
      if (dateTo && isAfter(evDate, dateTo)) return false;
      return true;
    }).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  }, [selectedTypes, maxDistance, showFreeOnly, showPaidOnly, dateFrom, dateTo]);

  const featured = mockEvents.filter((e) => e.featured);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="border-b border-border bg-card py-10">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Events & Meetups
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Car shows, track days, swap meets, and cruises happening near you.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="inline-flex bg-secondary rounded-md p-1 gap-1">
              <button
                onClick={() => setView("list")}
                className={cn("flex items-center gap-1.5 px-4 py-2 rounded font-heading font-bold text-sm uppercase tracking-wider transition-colors", view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                <List className="h-4 w-4" /> List
              </button>
              <button
                onClick={() => setView("calendar")}
                className={cn("flex items-center gap-1.5 px-4 py-2 rounded font-heading font-bold text-sm uppercase tracking-wider transition-colors", view === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                <CalendarDays className="h-4 w-4" /> Calendar
              </button>
            </div>
            <Button className="bg-cta hover:bg-cta/85 text-cta-foreground">
              <Plus className="h-4 w-4 mr-1" /> Host an Event
            </Button>
          </div>
        </div>
      </section>

      <div className="container flex-1 py-8">
        {/* Featured */}
        <div className="mb-8">
          <FeaturedBanner events={featured} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter button */}
          <div className="lg:hidden mb-4">
            <Button variant="secondary" size="sm" className="min-h-[44px]" onClick={() => setMobileFiltersOpen(true)}>
              <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
            </Button>
          </div>

          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6">
            <Card className="border-border bg-card">
              <CardContent className="p-5 space-y-5">
                <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </h3>

                {/* Event Type */}
                <div className="space-y-2">
                  <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Event Type</p>
                  <div className="space-y-1.5">
                    {eventTypes.map((t) => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                        <Checkbox checked={selectedTypes.includes(t)} onCheckedChange={() => toggleType(t)} />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Distance */}
                <div className="space-y-2">
                  <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">
                    Distance: {maxDistance} mi
                  </p>
                  <Slider value={[maxDistance]} onValueChange={([v]) => { setMaxDistance(v); setPage(1); }} min={5} max={50} step={5} />
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Date Range</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                        <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                        {dateFrom ? format(dateFrom, "MMM d, yyyy") : "From date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={dateFrom} onSelect={(d) => { setDateFrom(d); setPage(1); }} className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                        <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                        {dateTo ? format(dateTo, "MMM d, yyyy") : "To date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={dateTo} onSelect={(d) => { setDateTo(d); setPage(1); }} className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Price</p>
                  <div className="flex gap-2">
                    {[
                      { label: "All", free: false, paid: false },
                      { label: "Free", free: true, paid: false },
                      { label: "Paid", free: false, paid: true },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => { setShowFreeOnly(opt.free); setShowPaidOnly(opt.paid); setPage(1); }}
                        className={cn(
                          "px-3 py-1 text-xs rounded font-heading font-bold transition-colors",
                          (showFreeOnly === opt.free && showPaidOnly === opt.paid)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main */}
          <div className="flex-1 space-y-4">
            {view === "list" ? (
              <>
                <p className="text-sm text-muted-foreground">{filtered.length} events found</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paged.map((ev) => (
                    <EventCard key={ev.id} event={ev} />
                  ))}
                </div>
                {paged.length === 0 && (
                  <p className="text-center py-12 text-muted-foreground">No events match your filters.</p>
                )}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <Button variant="secondary" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button key={p} variant={p === page ? "default" : "secondary"} size="sm" onClick={() => setPage(p)} className="w-9">{p}</Button>
                    ))}
                    <Button variant="secondary" size="icon" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <CalendarView events={mockEvents} filteredEvents={filtered} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <MobileFilterSheet open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Event Type</p>
            <div className="space-y-1.5">
              {eventTypes.map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer text-sm text-foreground min-h-[44px]">
                  <Checkbox checked={selectedTypes.includes(t)} onCheckedChange={() => toggleType(t)} />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Distance: {maxDistance} mi</p>
            <Slider value={[maxDistance]} onValueChange={([v]) => { setMaxDistance(v); setPage(1); }} min={5} max={50} step={5} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Price</p>
            <div className="flex gap-2">
              {[
                { label: "All", free: false, paid: false },
                { label: "Free", free: true, paid: false },
                { label: "Paid", free: false, paid: true },
              ].map((opt) => (
                <button key={opt.label} onClick={() => { setShowFreeOnly(opt.free); setShowPaidOnly(opt.paid); setPage(1); }}
                  className={cn("px-4 py-2 text-xs rounded font-heading font-bold min-h-[44px] transition-colors",
                    (showFreeOnly === opt.free && showPaidOnly === opt.paid) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >{opt.label}</button>
              ))}
            </div>
          </div>
        </div>
      </MobileFilterSheet>

      <Footer />
    </div>
  );
};

export default EventsAndMeetups;
