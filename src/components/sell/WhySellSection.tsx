import { Zap, Shield, DollarSign, Banknote, Bot, Share2 } from "lucide-react";

const stats = [
  { value: "10,000+", label: "Active buyers on AutoWurx" },
  { value: "3 min", label: "Average time to first offer" },
  { value: "$0", label: "Fees to list your vehicle" },
];

const benefits = [
  { icon: Zap, title: "Instant Cash Offers", desc: "Your listing goes live and buyers send real numbers — not lowball estimates from algorithms." },
  { icon: Shield, title: "Your Privacy, Protected", desc: "Share only what you're comfortable sharing. Your personal info stays hidden until you decide to connect." },
  { icon: DollarSign, title: "Zero Seller Fees", desc: "Listing, messaging, and accepting an offer — none of it costs you a cent. Ever." },
  { icon: Banknote, title: "Cash & Alternative Payments", desc: "Sell to buyers who pay cash, Venmo, CashApp, or bank transfer. You choose what works." },
  { icon: Bot, title: "AI-Powered Sales Agent", desc: "Our built-in AI agent follows up on every lead, answers buyer questions, and helps close the deal — even while you sleep." },
  { icon: Share2, title: "Affiliate Network Promotes You", desc: "AutoWurx promoters actively share your listing to earn commissions. Your car gets marketed for free across social media and local networks." },
];

const WhySellSection = () => (
  <section className="w-full py-16 md:py-20 bg-[hsl(0,0%,14%)]">
    <div className="container">
      {/* Two-column header */}
      <div className="grid md:grid-cols-2 gap-10 mb-14 items-center">
        <div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 font-heading uppercase">
            Why settle for <span className="text-primary">one offer?</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every listing on AutoWurx reaches thousands of local buyers, independent dealers, and cash-in-hand shoppers at once. More eyes means more competition — and more competition means a better price for you.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          {stats.map((s, i) => (
            <div key={i} className={i < stats.length - 1 ? "pb-6 border-b border-border" : ""}>
              <div className="text-3xl md:text-4xl font-bold text-primary font-heading">{s.value}</div>
              <div className="text-muted-foreground text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefit grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="bg-card rounded-xl p-6 border border-transparent hover:border-primary/40 transition-colors group"
          >
            <b.icon className="w-7 h-7 text-primary mb-4" />
            <h3 className="text-foreground font-bold text-sm mb-2 font-heading uppercase">{b.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhySellSection;
