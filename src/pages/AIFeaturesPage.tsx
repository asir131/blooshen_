import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  Search,
  Store,
  Briefcase,
  BarChart3,
  LayoutGrid,
  Mic,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Check,
  Headphones,
  Brain,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "42,800+", label: "Active listings" },
  { value: "2,100+", label: "Certified brokers" },
  { value: "$2.4B+", label: "Transactions closed" },
  { value: "98%", label: "Satisfaction rate" },
];

const features = [
  {
    id: "otto-agents",
    icon: Bot,
    iconBg: "bg-primary/15 text-primary",
    title: "Otto AI Agents",
    description:
      "Education, pricing support, negotiation guidance, fraud prevention, and transaction safety — built into every step.",
    tags: ["Voice-enabled", "ElevenLabs", "Fraud prevention"],
  },
  {
    id: "search",
    icon: Search,
    iconBg: "bg-[#1A6EDB]/15 text-[#1A6EDB]",
    title: "Assistive Search Engine",
    description:
      "Real-time listings, comparison tools, vehicle history insights, and the ability to request showings or initiate purchases online.",
    tags: ["Real-time", "VIN history", "Comparisons"],
  },
  {
    id: "marketplace",
    icon: Store,
    iconBg: "bg-primary/15 text-primary",
    title: "Marketplace",
    description:
      "Listings for buyers and sellers with intelligent pricing tools, photo verification, and identity checks built in.",
    tags: ["Verified listings", "AI pricing", "Photo tools"],
  },
  {
    id: "brokers",
    icon: Briefcase,
    iconBg: "bg-[#1A6EDB]/15 text-[#1A6EDB]",
    title: "Neighborhood Broker Network",
    description:
      "Certified local brokers handle negotiations, paperwork, and the close. CRM and AWX Board built in.",
    tags: ["CRM", "Local brokers", "Negotiation"],
  },
  {
    id: "analytics",
    icon: BarChart3,
    iconBg: "bg-primary/15 text-primary",
    title: "Data & Analytics Tools",
    description:
      "Valuations, custom reports, market insights, document readiness scores, and full transparency tools.",
    tags: ["Valuations", "Doc scores", "Market data"],
  },
  {
    id: "awx-board",
    icon: LayoutGrid,
    iconBg: "bg-[#1A6EDB]/15 text-[#1A6EDB]",
    title: "AWX Board",
    description:
      "Real-time milestone tracking that connects buyers, sellers, brokers, and lenders in one shared workspace.",
    tags: ["Real-time", "All parties", "Milestones"],
  },
];

const ottoSteps = [
  {
    icon: Headphones,
    title: "Listen & understand",
    description: "Otto hears your goals, budget, and preferences through natural conversation.",
  },
  {
    icon: Brain,
    title: "Research & recommend",
    description: "Cross-references thousands of listings, VIN data, and market prices in real time.",
  },
  {
    icon: Users,
    title: "Guide & connect",
    description: "Walks you to the right decision, then hands you to a live broker to close.",
  },
];

const plans = [
  {
    name: "Otto Free",
    price: "$0",
    cadence: "/mo",
    features: ["10 searches/month", "Basic comparisons", "Text chat", "Listing access"],
    cta: "Get started",
    featured: false,
    variant: "outline" as const,
  },
  {
    name: "Otto Plus",
    price: "$29",
    cadence: "/mo",
    features: [
      "Unlimited searches",
      "Otto voice (ElevenLabs)",
      "Pricing & negotiation AI",
      "VIN history",
      "Priority broker matching",
      "AWX Board access",
    ],
    cta: "Subscribe to Otto Plus",
    featured: true,
    variant: "default" as const,
  },
  {
    name: "Otto Pro",
    price: "$79",
    cadence: "/mo",
    features: [
      "Everything in Plus",
      "Multi-vehicle management",
      "Custom market reports",
      "Document readiness scoring",
      "Dedicated broker line",
      "API access",
    ],
    cta: "Learn more",
    featured: false,
    variant: "outline" as const,
  },
  {
    name: "Otto One-Time",
    price: "$49",
    cadence: "one-time",
    features: ["Full Plus features for 1 deal", "Voice AI throughout", "Broker connection included"],
    cta: "Buy for one deal",
    featured: false,
    variant: "outline" as const,
  },
];

const quickReplies = [
  "Find me a vehicle",
  "What's fair value?",
  "Connect to a broker",
  "Subscribe to Otto",
];

const AIFeaturesPage = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section id="hero" className="border-b border-border/60">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                Powered by Otto AI
              </div>
              <h1 className="mt-5 font-heading text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
                Meet Otto — your <span className="text-primary">AI automotive guide</span>
              </h1>
              <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Otto is AutoWurx's voice-enabled AI assistant that walks buyers and sellers through every step of their transaction — from search to signed.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={() => scrollTo("plans")}>
                  Try Otto free
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/otto">See Otto in action</Link>
                </Button>
              </div>
            </div>

            {/* Right — Otto chat mockup */}
            <div className="relative">
              <div className="rounded-2xl border border-border bg-card shadow-xl p-5 md:p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/60">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-[#1A6EDB] flex items-center justify-center text-white font-heading font-bold text-lg">
                      O
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-bold text-sm">Otto</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-[#1A6EDB]/10 text-[#1A6EDB] px-2 py-0.5 rounded">
                        <Mic className="h-3 w-3" /> ElevenLabs voice
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">AutoWurx AI Guide</p>
                  </div>
                </div>

                <div className="py-4">
                  <div className="flex gap-2 items-start">
                    <div className="h-7 w-7 rounded-full bg-[#1A6EDB] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      O
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[85%]">
                      Hey! I can help you find a vehicle, check fair value, or connect you with a certified broker. What are you working on today?
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => console.log("Otto quick reply:", reply)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
              <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-[#1A6EDB]/20 blur-3xl opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border/60 bg-card/50">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-card p-5 md:p-6 text-center"
              >
                <p className="font-heading text-2xl md:text-4xl font-bold text-foreground">
                  {s.value}
                </p>
                <p className="mt-1 text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              Platform features
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight">
              Everything you need, intelligently connected
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              const isActive = activeFeature === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveFeature(f.id);
                    scrollTo(f.id);
                    console.log("Feature clicked:", f.id);
                  }}
                  className={`group text-left rounded-2xl border bg-card p-6 md:p-7 transition-all hover:-translate-y-1 hover:shadow-lg ${
                    isActive ? "border-primary/60 shadow-lg" : "border-border"
                  }`}
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.iconBg}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {f.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW OTTO WORKS */}
      <section id="how-otto-works" className="py-16 md:py-24 bg-card/40 border-y border-border/60">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              Otto in action
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight">
              Voice AI that guides every decision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ottoSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-border bg-card p-6 md:p-7"
                >
                  <span className="absolute top-6 right-6 font-heading text-5xl font-bold text-primary/15">
                    0{idx + 1}
                  </span>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A6EDB]/10 text-[#1A6EDB]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              Otto AI plans
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight">
              Choose how Otto guides you
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border bg-card p-6 flex flex-col ${
                  plan.featured ? "border-[#1A6EDB] shadow-xl ring-1 ring-[#1A6EDB]/20" : "border-border"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-[#1A6EDB] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    <Sparkles className="h-3 w-3" /> Most popular
                  </span>
                )}
                <h3 className="font-heading text-lg font-bold">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.cadence}</span>
                </div>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-6 w-full ${
                    plan.featured ? "bg-[#1A6EDB] text-white hover:bg-[#1A6EDB]/90" : ""
                  }`}
                  variant={plan.variant}
                  onClick={() => console.log("Plan CTA:", plan.name)}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/40 p-8 md:p-12 text-center">
            <ShieldCheck className="h-10 w-10 text-primary mx-auto" />
            <h2 className="mt-4 font-heading text-3xl md:text-4xl font-bold">
              Ready to experience Otto?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Start free and upgrade when your deal gets serious.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
              <Button size="lg" onClick={() => scrollTo("plans")}>
                Start with Otto free
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollTo("plans")}>
                View all plans <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIFeaturesPage;
