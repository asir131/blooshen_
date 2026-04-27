import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  GitCompare,
  Sparkles,
  Handshake,
  Banknote,
  ShieldCheck,
  Truck,
  Compass,
  Wrench,
  ClipboardList,
  CheckCircle2,
  Bot,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type PhaseId = "find-it" | "buy-it" | "drive-it";

const phases: { id: PhaseId; label: string; color: string }[] = [
  { id: "find-it", label: "Find it", color: "bg-orange-500 text-white" },
  { id: "buy-it", label: "Buy it", color: "bg-[#1A6EDB] text-white" },
  { id: "drive-it", label: "Drive it", color: "bg-green-500 text-white" },
];

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const SectionLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${className}`}>
    {children}
  </span>
);

const StepCard = ({
  icon: Icon,
  iconBg,
  title,
  desc,
  features,
}: {
  icon: React.ElementType;
  iconBg: string;
  title: string;
  desc: string;
  features: string[];
}) => (
  <div className="bg-white border-[0.5px] border-gray-200 rounded-xl p-6 flex flex-col h-full">
    <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-grow">{desc}</p>
    <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t-[0.5px] border-gray-200">
      {features.map((f) => (
        <span key={f} className="text-xs text-gray-700 bg-gray-50 border-[0.5px] border-gray-200 px-2 py-1 rounded">
          {f}
        </span>
      ))}
    </div>
  </div>
);

const HowItWorksPage = () => {
  const [activePhase, setActivePhase] = useState<PhaseId>("find-it");

  useEffect(() => {
    document.title = "How AutoWurx Works — Find it. Buy it. Drive it.";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivePhase(entry.target.id as PhaseId);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    phases.forEach((p) => {
      const el = document.getElementById(p.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* HERO */}
      <section className="bg-white border-b-[0.5px] border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <SectionLabel className="bg-yellow-100 text-yellow-900 mb-5">How AutoWurx works</SectionLabel>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-5 tracking-tight">
            Find it. Buy it. Drive it.
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            From your first search to driving off and beyond — Otto AI and our broker network guide every step of the journey.
          </p>

          {/* Phase pill nav */}
          <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 bg-gray-50 border-[0.5px] border-gray-200 rounded-full">
            {phases.map((p) => {
              const isActive = activePhase === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => scrollTo(p.id)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive ? p.color : "text-gray-700 hover:bg-white"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* PHASE 1 — FIND IT */}
      <section id="find-it" className="bg-orange-50 border-b-[0.5px] border-gray-200 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <SectionLabel className="bg-orange-500 text-white mb-4">Phase 1 · Find it</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Search & evaluate with Otto AI</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your search starts with Otto — who surfaces listings, runs comparisons, and flags anything worth knowing before you ever talk to a seller.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <StepCard
              icon={Search}
              iconBg="bg-[#1A6EDB]"
              title="Search & discover"
              desc="Real-time listings filtered by make, model, year, price, mileage, and ZIP. Otto learns your preferences and refines results as you search."
              features={["Smart filters", "Saved searches", "Price drop alerts"]}
            />
            <StepCard
              icon={GitCompare}
              iconBg="bg-[#1A6EDB]"
              title="Evaluate & compare"
              desc="Otto pulls VIN history, accident reports, ownership records, and maintenance history. Side-by-side comparison tools let you stack up to 3 vehicles at once."
              features={["VIN & history report", "Market value score", "3-vehicle compare"]}
            />
            <StepCard
              icon={Sparkles}
              iconBg="bg-[#1A6EDB]"
              title="Assess & decide"
              desc="Otto gives you a Deal Score — a plain-language assessment of whether a listing is priced fairly, has red flags, or is ready to move on."
              features={["Deal Score (AI)", "Red flag alerts", "Request a showing"]}
            />
          </div>

          {/* Otto guidance highlight */}
          <div className="bg-blue-50 border-[0.5px] border-blue-200 rounded-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-5 h-5 text-[#1A6EDB]" />
                <h3 className="text-lg font-bold text-gray-900">Otto is with you throughout Find It</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  "Answers questions in plain language",
                  "Explains vehicle history items",
                  "Compares similar listings",
                  "Tells you if a price is above/below market",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A6EDB] mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border-[0.5px] border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1A6EDB] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Otto AI</p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    This 2022 Honda Accord is priced $1,200 below market average for its mileage and trim. No accidents on record. I'd rate it a <span className="font-bold text-[#1A6EDB]">91 Deal Score</span>. Want me to request a showing?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 2 — BUY IT */}
      <section id="buy-it" className="bg-blue-50 border-b-[0.5px] border-gray-200 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <SectionLabel className="bg-[#1A6EDB] text-white mb-4">Phase 2 · Buy it</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Broker assist — negotiate, finance, insure</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
              When you're ready to move, your matched broker takes the wheel. They handle the offer, the back-and-forth, the lender, and the paperwork — with Otto AI feeding them data the whole time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <StepCard
              icon={Handshake}
              iconBg="bg-[#1A6EDB]"
              title="Negotiate"
              desc="Your broker uses Otto's real-time valuations to craft a competitive offer. All counters go through the AWX Board — you approve each move from your dashboard."
              features={["AI-assisted offer", "AWX Board updates", "Broker advocates for you"]}
            />
            <StepCard
              icon={Banknote}
              iconBg="bg-[#1A6EDB]"
              title="Finance"
              desc="AutoWurx connects you to lenders through the platform. Your broker reviews loan terms, flags hidden fees, and helps you compare financing options before you commit."
              features={["Lender marketplace", "Rate comparison", "Document review"]}
            />
            <StepCard
              icon={ShieldCheck}
              iconBg="bg-[#1A6EDB]"
              title="Insure"
              desc="Before you sign, Otto surfaces insurance quotes from multiple carriers based on the specific vehicle. Your broker can help you review coverage options before close."
              features={["Otto insurance scan", "Multi-carrier quotes", "Coverage guidance"]}
            />
          </div>

          {/* Secure Close highlight */}
          <div className="bg-green-50 border-[0.5px] border-green-200 rounded-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">What happens at close</h3>
              </div>
              <ol className="space-y-2 text-sm text-gray-700">
                {[
                  "Agreement confirmed on AWX Board",
                  "All docs reviewed and signed securely",
                  "Title transferred digitally",
                  "Funds disbursed to seller",
                  "Full transaction record issued to buyer",
                ].map((item, i) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-white border-[0.5px] border-gray-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">AWX Board · Milestones</p>
              <ul className="space-y-3">
                {[
                  "Offer accepted",
                  "Financing confirmed",
                  "Documents signed",
                  "Title transferred",
                  "Deal closed",
                ].map((m) => (
                  <li key={m} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-800">{m}</span>
                    </div>
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      Done
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 3 — DRIVE IT */}
      <section id="drive-it" className="bg-green-50 border-b-[0.5px] border-gray-200 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <SectionLabel className="bg-green-100 text-green-700 mb-4">Phase 3 · Drive it</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Delivery, ownership, and everything after</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
              AutoWurx doesn't stop at the sale. Otto stays with you — helping you understand your vehicle, stay ahead of maintenance, and discover features you didn't know you had.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <StepCard
              icon={Truck}
              iconBg="bg-green-500"
              title="Delivery"
              desc="Coordinate delivery or pickup through the platform. Otto sends you a pre-delivery checklist and confirms the vehicle matches the listing before you accept."
              features={["Delivery tracking", "Pre-delivery checklist", "Condition confirmation"]}
            />
            <StepCard
              icon={Compass}
              iconBg="bg-green-500"
              title="Discover your vehicle"
              desc="Otto gives you a personalized vehicle orientation — explaining your car's features, tech, and controls in plain language. Ask anything about your new car, anytime."
              features={["Feature walkthroughs", "Tech explainers", "Ask Otto anything"]}
            />
            <StepCard
              icon={Wrench}
              iconBg="bg-green-500"
              title="Preventative maintenance"
              desc="Otto tracks your vehicle's maintenance schedule based on mileage and manufacturer specs. Get reminders for oil changes, tire rotations, inspections, and more."
              features={["Maintenance calendar", "Mileage-based reminders", "Service shop finder"]}
            />
            <StepCard
              icon={ClipboardList}
              iconBg="bg-green-500"
              title="Understanding car ownership"
              desc="From insurance renewals to registration, title storage, and resale timing — Otto helps first-time and experienced owners stay on top of the obligations of ownership."
              features={["Registration reminders", "Resale value tracker", "Ownership checklist"]}
            />
          </div>

          {/* Otto ownership widget */}
          <div className="bg-white border-[0.5px] border-gray-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Otto AI</p>
                <p className="text-sm font-bold text-gray-900">Otto stays with you after the sale</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:ml-auto">
              {[
                "Check my maintenance schedule",
                "What does this dashboard light mean?",
                "When should I sell this vehicle?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => console.log("Otto quick action:", q)}
                  className="text-xs font-medium text-gray-700 bg-gray-50 border-[0.5px] border-gray-200 hover:border-green-500 hover:text-green-700 px-3 py-2 rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM PHASE NAVIGATOR */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Ready to start?</h2>
            <p className="text-sm md:text-base text-gray-600">Pick the phase that fits where you are right now.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                name: "Find it",
                desc: "Browse listings, run comparisons, and let Otto AI score every deal.",
                cta: "Start searching",
                btn: "bg-orange-500 hover:bg-orange-600 text-white",
                href: "/cars-for-sale",
              },
              {
                num: "02",
                name: "Buy it",
                desc: "Match with a broker who negotiates, finances, and closes for you.",
                cta: "Get matched with a broker",
                btn: "bg-[#1A6EDB] hover:bg-[#1559B0] text-white",
                href: "/find-my-broker",
              },
              {
                num: "03",
                name: "Drive it",
                desc: "Maintenance, ownership tools, and Otto stays with you after the sale.",
                cta: "Explore ownership tools",
                btn: "bg-green-500 hover:bg-green-600 text-white",
                href: "/otto",
              },
            ].map((p) => (
              <div key={p.num} className="bg-white border-[0.5px] border-gray-200 rounded-xl p-6 flex flex-col">
                <p className="text-xs font-bold text-gray-400 mb-1">{p.num}</p>
                <h3 className="text-2xl font-black text-gray-900 mb-2">{p.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">{p.desc}</p>
                <Link
                  to={p.href}
                  className={`inline-flex items-center justify-center gap-2 ${p.btn} font-semibold text-sm px-5 py-3 rounded-lg transition-colors`}
                >
                  {p.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
