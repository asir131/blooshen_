import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, Users, Zap, TrendingUp, ArrowRight, Star,
  Car, Wrench, MapPin, CalendarDays, Award, ShieldCheck,
} from "lucide-react";

const COMMISSION_TABLE = [
  { category: "Cars for Sale", icon: Car, lead: "$25", sale: "$150", color: "text-primary" },
  { category: "Parts & Accessories", icon: Wrench, lead: "—", sale: "8% of sale", color: "text-primary" },
  { category: "Service Providers", icon: Wrench, lead: "$10", sale: "$35 booking", color: "text-primary" },
  { category: "Rentals", icon: Car, lead: "—", sale: "12% of rental", color: "text-primary" },
  { category: "Experts & Reviews", icon: Star, lead: "$8", sale: "—", color: "text-primary" },
  { category: "Events & Meetups", icon: CalendarDays, lead: "$5 RSVP", sale: "$20 ticket", color: "text-primary" },
];

const BENEFITS = [
  {
    icon: Zap,
    title: "Easy Sign Up",
    desc: "Create your free promoter account in 60 seconds. No interviews, no approval wait — start sharing immediately.",
  },
  {
    icon: DollarSign,
    title: "Real Commissions",
    desc: "Earn cash every time someone buys, books, or signs up through your link. Commissions range from $5 to $300+.",
  },
  {
    icon: Users,
    title: "No Experience Needed",
    desc: "Just share your link on social media, text it to friends, or hand out your QR code. We handle the rest.",
  },
];

export default function PromotersLanding() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="container relative py-20 md:py-28 text-center">
          <Badge variant="outline" className="mb-4 text-primary border-primary/40 font-heading uppercase tracking-wider">
            Promoter Program
          </Badge>
          <h1 className="font-heading text-4xl md:text-6xl font-black text-foreground leading-tight max-w-3xl mx-auto">
            Turn Your Connections <br className="hidden sm:block" />
            Into <span className="text-primary">Cash</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto">
            Promote AutoWurx listings and earn every time someone buys, books, or signs up through your link. No inventory. No risk. Just earnings.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/dashboard/promoter">
                Start Earning <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#commission-rates">See Commission Rates</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="border-b border-border bg-secondary/50">
        <div className="container py-5 flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { label: "Promoters earned last month", value: "142" },
            { label: "Avg. payout", value: "$87" },
            { label: "Top earner this month", value: "$1,240" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-2xl md:text-3xl font-black text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="container py-16 md:py-20">
        <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">
          HOW IT <span className="text-primary">WORKS</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {BENEFITS.map((b, i) => (
            <div key={b.title} className="relative rounded-lg border border-border bg-card p-8 text-center group hover:border-primary/50 transition-colors">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm">
                {i + 1}
              </div>
              <b.icon className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Commission Rate Card */}
      <section id="commission-rates" className="bg-secondary/30 border-y border-border">
        <div className="container py-16 md:py-20">
          <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-3">
            COMMISSION <span className="text-primary">RATES</span>
          </h2>
          <p className="text-center text-muted-foreground font-body mb-10 max-w-xl mx-auto">
            Earn on every category. Some sellers even offer boosted commissions above these base rates.
          </p>
          <div className="max-w-3xl mx-auto rounded-lg border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-3 gap-0 border-b border-border bg-muted px-6 py-3">
              <span className="font-heading text-xs uppercase tracking-wider text-muted-foreground">Category</span>
              <span className="font-heading text-xs uppercase tracking-wider text-muted-foreground text-center">Per Lead</span>
              <span className="font-heading text-xs uppercase tracking-wider text-muted-foreground text-center">Per Sale/Booking</span>
            </div>
            {COMMISSION_TABLE.map((row) => (
              <div key={row.category} className="grid grid-cols-3 gap-0 border-b border-border last:border-0 px-6 py-4 items-center hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <row.icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-body text-sm text-foreground">{row.category}</span>
                </div>
                <span className="text-center font-heading font-bold text-foreground">{row.lead}</span>
                <span className="text-center font-heading font-bold text-primary">{row.sale}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Final CTA */}
      <section className="container py-16 md:py-20 text-center">
        <div className="flex justify-center gap-6 mb-8">
          {[ShieldCheck, Award, TrendingUp].map((Icon, i) => (
            <div key={i} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-7 w-7 text-primary" />
            </div>
          ))}
        </div>
        <h2 className="font-heading text-3xl md:text-4xl font-black text-foreground mb-4">
          Ready to Start <span className="text-primary">Earning</span>?
        </h2>
        <p className="text-muted-foreground font-body max-w-lg mx-auto mb-8">
          Join hundreds of promoters already earning with AutoWurx. Sign up free, browse listings, grab your link, and share.
        </p>
        <Button size="lg" asChild>
          <Link to="/dashboard/promoter">
            Create My Promoter Account <ArrowRight className="ml-1 h-5 w-5" />
          </Link>
        </Button>
      </section>

      <Footer />
    </div>
  );
}
