import { Search, UserCheck, Gavel, KeyRound } from "lucide-react";

const steps = [
  { icon: Search, num: "01", title: "Find a Vehicle", desc: "Browse live and timed auctions. Filter by type, price range, location, and reserve status. Tap any listing to see full details, history report, and seller info." },
  { icon: UserCheck, num: "02", title: "Register & Verify", desc: "Create your free AutoWurx account and verify your identity once. Then you're cleared to bid on any active auction — no per-auction registration needed." },
  { icon: Gavel, num: "03", title: "Place Your Bid", desc: "Enter your maximum bid and AutoWurx automatically bids on your behalf up to that amount — so you never overpay. Outbid alerts are instant." },
  { icon: KeyRound, num: "04", title: "Win & Pay", desc: "Win the auction and connect with the seller directly through AutoWurx to arrange payment and pickup. Cash, Venmo, bank transfer — your deal, your terms." },
];

const AuctionHowItWorks = () => (
  <section className="bg-card py-16">
    <div className="max-w-[860px] mx-auto px-4">
      <p className="font-heading text-xs uppercase tracking-[0.2em] text-primary text-center mb-1">How It Works</p>
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-2">Bid With Confidence</h2>
      <div className="w-10 h-0.5 bg-primary mx-auto mb-10" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <div key={s.num} className="relative bg-[#1a1a1a] border border-border rounded-xl p-5">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-sm mb-3">
              {s.num}
            </div>
            <s.icon className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-10 -right-3 w-6 border-t-2 border-dashed border-primary/40" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-[#1a1a1a] border-l-3 border-primary p-3 rounded-r-lg text-xs text-muted-foreground">
          🛡 <strong className="text-foreground">Buyer Protection</strong> — Report a non-performing seller for a full refund of any deposits.
        </div>
        <div className="bg-[#1a1a1a] border-l-3 border-primary p-3 rounded-r-lg text-xs text-muted-foreground">
          ⚡ <strong className="text-foreground">Auto-Bid</strong> — Set your max and let AutoWurx bid for you up to your limit.
        </div>
      </div>
    </div>
  </section>
);

export default AuctionHowItWorks;
