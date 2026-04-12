import { Shield, Home, Handshake, MapPin } from "lucide-react";

const tiles = [
  {
    icon: Shield,
    title: "Always On Your Side",
    desc: "Your broker has zero affiliation with dealerships or sellers. They act as your trusted liaison — protecting you from high-pressure tactics, hidden fees, and one-sided contracts.",
  },
  {
    icon: Home,
    title: "Car Buying From Your Couch",
    desc: "Test drives delivered to your door. Remote paperwork signing. Your broker handles the logistics so you never have to set foot in a dealership until you're ready to say yes — or not at all.",
  },
  {
    icon: Handshake,
    title: "They Negotiate. You Win.",
    desc: "Your broker knows dealer cost, market value, and every negotiation lever. They use that knowledge to secure a deal you couldn't get alone — on price, financing terms, and trade-in value.",
  },
  {
    icon: MapPin,
    title: "Neighborhood-Level Intel",
    desc: "Your broker lives where you live. They know the local market, the trusted sellers, and the hidden gems that never make it onto the big listing sites. That's an edge you can't Google.",
  },
];

const steps = ["You connect", "Share your needs", "Broker searches", "You review picks", "Broker closes the deal"];

const HowBrokerHelps = () => {
  return (
    <section className="bg-card py-16 px-4">
      <div className="max-w-[900px] mx-auto text-center">
        <p className="text-primary text-xs font-heading uppercase tracking-[0.2em] mb-2">WHAT YOUR BROKER DOES</p>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-1">
          Your Personal Car Buying Advocate
        </h2>
        <div className="w-12 h-0.5 bg-primary mx-auto mb-4" />
        <p className="text-muted-foreground text-sm max-w-[500px] mx-auto mb-10 leading-relaxed">
          Your AutoWurx Neighborhood Broker acts on your behalf — not the seller's. They're paid through referral fees
          when deals close, which means their only job is to find YOU the best possible vehicle at the best possible
          price.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {tiles.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-background border border-border rounded-xl p-5 text-left hover:border-t-primary hover:border-t-[3px] transition-all duration-200 motion-reduce:transition-none"
            >
              <Icon className="w-7 h-7 text-primary mb-3" />
              <h3 className="font-heading text-sm font-bold text-foreground mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Process strip */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-0">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading text-sm font-bold">
                  {i + 1}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 whitespace-nowrap">{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block w-12 border-t border-dashed border-primary mx-2 mt-[-12px]" />
              )}
              {i < steps.length - 1 && (
                <div className="md:hidden h-6 border-l border-dashed border-primary my-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowBrokerHelps;
