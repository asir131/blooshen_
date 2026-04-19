import { Check, X, Sparkles, Search, FileText, Handshake, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OttoAvatar } from "@/components/otto/OttoAvatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Tier {
  name: string;
  price: string;
  cadence: string;
  badge?: string;
  features: { label: string; included: boolean }[];
  cta: string;
  ctaVariant: "default" | "outline";
  highlighted?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Otto Basic",
    price: "$0",
    cadence: "Always Free",
    features: [
      { label: "Chat with Otto on any page", included: true },
      { label: "Basic vehicle search assistance", included: true },
      { label: "Deal score explanations", included: true },
      { label: "Event & listing recommendations", included: true },
      { label: "Voice responses", included: false },
      { label: "Personalized preferences memory", included: false },
      { label: "Proactive deal alerts", included: false },
      { label: "Priority broker matching", included: false },
    ],
    cta: "You have this",
    ctaVariant: "outline",
  },
  {
    name: "Otto Pro",
    price: "$9.99",
    cadence: "Per Month",
    badge: "Most Popular",
    highlighted: true,
    features: [
      { label: "Everything in Basic", included: true },
      { label: "Voice responses (ElevenLabs TTS)", included: true },
      { label: "Otto remembers your preferences", included: true },
      { label: "Proactive deal alerts via email/SMS", included: true },
      { label: "Priority broker matching", included: true },
      { label: "Full conversation history", included: true },
      { label: "Multi-session memory", included: true },
    ],
    cta: "Start Pro Free — 7 Day Trial",
    ctaVariant: "default",
  },
  {
    name: "Guided Session",
    price: "$4.99",
    cadence: "One-Time",
    features: [
      { label: "60-minute premium Otto session", included: true },
      { label: "Voice-guided car buying walkthrough", included: true },
      { label: "Dedicated broker match for your purchase", included: true },
      { label: "Session transcript emailed to you", included: true },
      { label: "Deal scorecard for any vehicle", included: true },
    ],
    cta: "Buy a Session",
    ctaVariant: "outline",
  },
];

const USE_CASES = [
  {
    icon: Search,
    title: "Finding the Right Vehicle",
    body:
      "Tell Otto your budget, needs, and preferences — he searches all 6 AutoWurx directories and returns the best matches in seconds.",
  },
  {
    icon: FileText,
    title: "Understanding the Deal",
    body:
      "Otto explains Deal Scores, market values, and vehicle history reports in plain English — so you know exactly what you're looking at before you commit.",
  },
  {
    icon: Sparkles,
    title: "Preparing to Negotiate",
    body:
      "Otto briefs you on the vehicle's history, price trends, and comparable sales — so when you sit down with a broker, you walk in informed.",
  },
  {
    icon: Handshake,
    title: "Connecting You with Brokers",
    body:
      "When you're ready for a human, Otto finds the right Neighborhood Broker for your specific needs, shares your preferences, and makes a warm introduction.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Otto found me a cash deal matching my exact specs in under 2 minutes. Didn't think AI could actually do that.",
    name: "Marcus B., East Atlanta",
  },
  {
    quote:
      "I was nervous about my first car purchase. Otto walked me through the whole inspection checklist while I was at the lot. Game changer.",
    name: "Devon O., Stone Mountain",
  },
  {
    quote:
      "I said 'I need a truck under $20K that takes cash' and Otto had 6 options in 30 seconds. Then connected me with Marcus. Done in a day.",
    name: "Tanya F., College Park",
  },
];

export default function OttoLanding() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 pt-12 pb-16 text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <OttoAvatar size={120} state="idle" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-wide">
            Meet Otto. Your Personal Car Buying Assistant.
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            Otto guides you through every step of the AutoWurx experience — from finding the
            right vehicle to closing the deal. Available 24/7, powered by AI.
          </p>
        </section>

        {/* Pricing */}
        <section className="px-4 pb-16 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border bg-card p-6 flex flex-col ${
                  tier.highlighted
                    ? "border-primary shadow-[0_0_40px_hsl(50_100%_50%/0.15)]"
                    : "border-border"
                }`}
              >
                {tier.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    {tier.badge}
                  </Badge>
                )}
                <h3 className="text-xl font-heading font-bold text-foreground">{tier.name}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{tier.cadence}</span>
                </div>

                <ul className="mt-6 space-y-2 flex-1">
                  {tier.features.map((f) => (
                    <li
                      key={f.label}
                      className={`flex items-start gap-2 text-sm ${
                        f.included ? "text-foreground" : "text-muted-foreground line-through"
                      }`}
                    >
                      {f.included ? (
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      )}
                      <span>{f.label}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.ctaVariant}
                  className={`mt-6 w-full ${
                    tier.ctaVariant === "default"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-primary/50 text-primary hover:bg-primary/10"
                  }`}
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* How Otto helps */}
        <section className="px-4 pb-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-8">
            How Otto Helps You
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {USE_CASES.map((u) => (
              <div
                key={u.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <u.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="text-lg font-heading font-bold text-foreground">{u.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{u.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-4 pb-20 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 justify-center mb-6">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-heading font-bold text-foreground">
              Real users, real wins
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t) => (
              <blockquote
                key={t.name}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="text-sm text-foreground italic leading-relaxed">"{t.quote}"</p>
                <footer className="mt-3 text-xs text-primary font-semibold">— {t.name}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
