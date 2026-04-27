import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Shield,
  TrendingUp,
  FileCheck,
  ShieldAlert,
  Zap,
  MapPin,
  Users,
  CheckCircle2,
  ArrowRight,
  Award,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BLUE = "#1A6EDB";
const GREEN = "#22C55E";

const brokers = [
  {
    name: "Marcus R.",
    initials: "MR",
    color: "#1A6EDB",
    location: "Baltimore, MD",
    experience: "6 yrs experience",
    rating: 4.98,
    deals: 312,
    badges: ["Certified", "Top Broker", "Luxury"],
  },
  {
    name: "Tanya W.",
    initials: "TW",
    color: "#22C55E",
    location: "Silver Spring, MD",
    experience: "4 yrs experience",
    rating: 4.95,
    deals: 198,
    badges: ["Certified", "First-time buyers"],
  },
  {
    name: "Devon J.",
    initials: "DJ",
    color: "#FFE000",
    textOnColor: "#0A0A0A",
    location: "Annapolis, MD",
    experience: "8 yrs experience",
    rating: 4.97,
    deals: 441,
    badges: ["Certified", "Top Broker", "Fleet"],
  },
];

const journeySteps = [
  {
    title: "Otto handoff & broker assignment",
    desc: "Otto shares deal context, vehicle shortlist, and price range. Your broker reviews your full profile before first contact — so the first conversation is already informed.",
  },
  {
    title: "Consultation & strategy",
    desc: "Your broker contacts you within 2 hours to align on goals, budget, must-haves, and negotiation strategy via AWX messaging.",
  },
  {
    title: "Offer preparation & submission",
    desc: "Broker uses Otto's AI valuation data to craft a competitive offer. Submitted through the AWX Board so all parties see it in real time.",
  },
  {
    title: "Negotiation & counteroffer management",
    desc: "Your broker handles all back-and-forth with the seller. You receive updates in the AWX Board and approve key decisions.",
  },
  {
    title: "Document review & lender coordination",
    desc: "Broker coordinates with lenders, reviews all paperwork, and flags document-readiness scores before signing.",
  },
  {
    title: "Close & title transfer",
    desc: "Broker oversees final signing, title transfer, and fund disbursement. AWX Board marks the deal closed and issues a full transaction record.",
  },
];

const reasons = [
  { icon: Users, title: "Neutral representation", desc: "Brokers represent your interests exclusively, unlike dealerships." },
  { icon: TrendingUp, title: "Data-backed negotiation", desc: "Every offer anchored to real-time Otto AI valuations." },
  { icon: FileCheck, title: "Paperwork handled", desc: "Contracts, titles, lender docs, and compliance checks before you sign." },
  { icon: ShieldAlert, title: "Fraud prevention", desc: "VIN verification, identity checks, and ownership records reviewed before money moves." },
  { icon: Zap, title: "Faster closes", desc: "Broker-assisted deals close 3× faster than unassisted ones." },
  { icon: MapPin, title: "Local expertise", desc: "Neighborhood brokers know local pricing trends and regional title laws." },
];

const pipelineStages = [
  { name: "New Leads", count: 5, value: "$218k", color: BLUE },
  { name: "Consulting", count: 3, value: "$142k", color: "#FFE000" },
  { name: "Negotiating", count: 3, value: "$187k", color: "#F97316" },
  { name: "Closing", count: 2, value: "$113k", color: GREEN },
];

const activeDeals = [
  { vehicle: "2023 BMW M3", status: "Negotiating", price: "$58,400", statusColor: "bg-orange-500/20 text-orange-300 border-orange-500/40" },
  { vehicle: "2022 Tesla Model Y", status: "In Review", price: "$49,200", statusColor: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
  { vehicle: "2021 Ford F-150", status: "Closing", price: "$41,900", statusColor: "bg-green-500/20 text-green-300 border-green-500/40" },
];

const requirements = [
  "Valid automotive dealer or agent license",
  "Background check & identity verification",
  "Completion of AutoWurx broker training",
  "Minimum 2 years industry experience",
  "Agreement to AutoWurx code of conduct",
];

const benefits = [
  "Access to AWX CRM & Board tools",
  "Otto AI integration in every deal",
  "Priority lead matching",
  "Competitive commission structure",
  "Dedicated broker support line",
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    <Star className="w-4 h-4 fill-primary text-primary" />
    <span className="text-sm font-bold text-foreground">{rating.toFixed(2)}</span>
  </div>
);

const BrokerNetworkPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState<"pipeline" | "deals" | "analytics">("pipeline");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* 1. HERO */}
      <section className="border-b-[0.5px] border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/10 text-primary border-[0.5px] border-primary/30 mb-5">
            Neighborhood Broker Network
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-5 tracking-tight">
            Local experts. <span className="text-primary">Platform-powered.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed normal-case tracking-normal" style={{ fontFamily: "var(--font-body)" }}>
            AutoWurx brokers are certified, background-checked local agents who handle negotiations, paperwork, and the final close — backed by Otto AI tools and the AWX Board.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link
              to="/find-my-broker"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-md transition-colors"
            >
              Get matched with a broker
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/experts/apply"
              className="inline-flex items-center justify-center gap-2 border-[0.5px] border-border hover:border-primary text-foreground hover:text-primary font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-md transition-colors"
            >
              Join as a broker
            </Link>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { value: "2,100+", label: "Certified brokers" },
              { value: "48 states", label: "Network coverage" },
              { value: "4.9/5", label: "Avg broker rating" },
              { value: "~11 days", label: "Avg time to close" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border-[0.5px] border-border rounded-lg p-4">
                <p className="text-2xl md:text-3xl font-black text-primary mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground normal-case tracking-normal" style={{ fontFamily: "var(--font-body)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SAMPLE BROKER CARDS */}
      <section className="border-b-[0.5px] border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Meet the network</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mt-2 mb-2">Meet the network</h2>
            <p className="text-sm md:text-base text-muted-foreground normal-case tracking-normal" style={{ fontFamily: "var(--font-body)" }}>
              Rated, reviewed, and verified before every deal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {brokers.map((b) => (
              <div
                key={b.name}
                className="bg-card border-[0.5px] border-border rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_8px_24px_-8px_rgba(255,224,0,0.25)]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg shrink-0"
                    style={{ backgroundColor: b.color, color: b.textOnColor || "#fff" }}
                  >
                    {b.initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-foreground text-lg leading-tight">{b.name}</h3>
                    <p className="text-xs text-muted-foreground normal-case tracking-normal flex items-center gap-1 mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                      <MapPin className="w-3 h-3" />
                      {b.location} · {b.experience}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b-[0.5px] border-border">
                  <StarRating rating={b.rating} />
                  <span className="text-xs text-muted-foreground normal-case tracking-normal" style={{ fontFamily: "var(--font-body)" }}>
                    {b.deals} deals
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {b.badges.map((badge) => (
                    <span
                      key={badge}
                      className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded bg-primary/10 text-primary border-[0.5px] border-primary/30"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW A BROKER HANDLES YOUR DEAL */}
      <section className="border-b-[0.5px] border-border bg-card/30">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">The broker journey</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mt-2">Step by step — from Otto handoff to close</h2>
          </div>

          <div className="space-y-3">
            {journeySteps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.title}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left rounded-xl border-[0.5px] transition-all duration-200 ${
                    isActive
                      ? "bg-card border-[#1A6EDB]/60 shadow-[0_0_0_1px_#1A6EDB40]"
                      : "bg-card border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start gap-4 p-5">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base shrink-0 ${
                        isActive ? "text-white" : "bg-secondary text-foreground"
                      }`}
                      style={isActive ? { backgroundColor: BLUE } : undefined}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className={`font-bold text-base md:text-lg ${isActive ? "text-foreground" : "text-foreground"}`}>
                          {step.title}
                        </h3>
                        <ChevronRight
                          className={`w-5 h-5 shrink-0 transition-transform ${isActive ? "rotate-90 text-[#1A6EDB]" : "text-muted-foreground"}`}
                        />
                      </div>
                      {isActive && (
                        <p
                          className="text-sm text-muted-foreground mt-2 leading-relaxed normal-case tracking-normal"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {step.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. WHY BROKERS MATTER */}
      <section className="border-b-[0.5px] border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">The value brokers bring</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mt-2">Why broker-assisted deals win</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reasons.map((r) => (
              <div key={r.title} className="bg-card border-[0.5px] border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
                <div className="w-11 h-11 rounded-lg bg-primary/10 border-[0.5px] border-primary/30 flex items-center justify-center mb-4">
                  <r.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-base mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed normal-case tracking-normal" style={{ fontFamily: "var(--font-body)" }}>
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BROKER CRM PREVIEW */}
      <section className="border-b-[0.5px] border-border bg-card/30">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">Professional tools for every broker</h2>
            <p className="text-sm md:text-base text-muted-foreground normal-case tracking-normal" style={{ fontFamily: "var(--font-body)" }}>
              The AWX CRM gives brokers everything they need to manage your deal end-to-end.
            </p>
          </div>

          <div className="bg-card border-[0.5px] border-border rounded-2xl overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b-[0.5px] border-border bg-background/40">
              {[
                { id: "pipeline" as const, label: "Pipeline" },
                { id: "deals" as const, label: "Active Deals" },
                { id: "analytics" as const, label: "Analytics" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 md:flex-none px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary -mb-[0.5px]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Pipeline tab */}
            {activeTab === "pipeline" && (
              <div className="p-5 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {pipelineStages.map((stage) => (
                    <div key={stage.name} className="bg-background/50 border-[0.5px] border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stage.name}</p>
                      </div>
                      <p className="text-3xl font-black text-foreground">{stage.count}</p>
                      <p className="text-sm text-muted-foreground normal-case tracking-normal mt-1" style={{ fontFamily: "var(--font-body)" }}>
                        {stage.value} pipeline value
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Deals tab */}
            {activeTab === "deals" && (
              <div className="p-5 md:p-6 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-[0.5px] border-border">
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-2">Vehicle</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-2">Status</th>
                      <th className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeDeals.map((deal) => (
                      <tr key={deal.vehicle} className="border-b-[0.5px] border-border last:border-0 hover:bg-background/40">
                        <td className="py-4 px-2 text-sm font-medium text-foreground normal-case tracking-normal" style={{ fontFamily: "var(--font-body)" }}>
                          {deal.vehicle}
                        </td>
                        <td className="py-4 px-2">
                          <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded border-[0.5px] ${deal.statusColor}`}>
                            {deal.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right text-sm font-bold text-primary">{deal.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Analytics tab */}
            {activeTab === "analytics" && (
              <div className="p-5 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: "$2.1M", label: "Volume this year", color: "text-primary" },
                    { value: "312", label: "Total deals closed", color: "text-foreground" },
                    { value: "98.4%", label: "Client satisfaction", color: "text-foreground", accent: GREEN },
                  ].map((m) => (
                    <div key={m.label} className="bg-background/50 border-[0.5px] border-border rounded-lg p-5">
                      <p
                        className={`text-4xl font-black mb-1 ${m.color}`}
                        style={m.accent ? { color: m.accent } : undefined}
                      >
                        {m.value}
                      </p>
                      <p className="text-sm text-muted-foreground normal-case tracking-normal" style={{ fontFamily: "var(--font-body)" }}>
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. BROKER CERTIFICATION */}
      <section className="border-b-[0.5px] border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Become a broker</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mt-2">Join the AutoWurx Broker Network</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Requirements */}
            <div className="bg-card border-[0.5px] border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-black text-foreground text-lg">Requirements</h3>
              </div>
              <ul className="space-y-3">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-foreground normal-case tracking-normal" style={{ fontFamily: "var(--font-body)" }}>
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-card border-[0.5px] border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Award className="w-5 h-5" style={{ color: GREEN }} />
                <h3 className="font-black text-foreground text-lg">Benefits</h3>
              </div>
              <ul className="space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-foreground normal-case tracking-normal" style={{ fontFamily: "var(--font-body)" }}>
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GREEN }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/experts/apply"
              className="inline-flex w-full md:w-auto items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-md transition-colors"
            >
              Apply to become a certified broker
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FOOTER CTA BAR */}
      <section className="bg-card border-b-[0.5px] border-border">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">Ready to work with a broker?</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 normal-case tracking-normal" style={{ fontFamily: "var(--font-body)" }}>
            Otto will match you with the best local expert in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/find-my-broker"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-md transition-colors"
            >
              Get matched now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/find-my-broker"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 border-[0.5px] border-border hover:border-primary text-foreground hover:text-primary font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-md transition-colors"
            >
              Browse the network
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BrokerNetworkPage;
