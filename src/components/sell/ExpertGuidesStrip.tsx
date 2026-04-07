import { Link } from "react-router-dom";

const guides = [
  { title: "How to Price Your Car for a Fast Sale", time: "5 min read" },
  { title: "The Safest Ways to Accept Payment from a Private Buyer", time: "7 min read" },
  { title: "10 Photos That Will Get Your Listing More Offers", time: "4 min read" },
  { title: "Cash vs. Financing: What Sellers Need to Know", time: "6 min read" },
];

const ExpertGuidesStrip = () => (
  <section className="w-full py-16 md:py-20 bg-[hsl(0,0%,14%)]">
    <div className="container">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-primary rounded-full" />
        <h2 className="text-xl md:text-2xl font-bold text-foreground font-heading uppercase">
          Selling Your Car? Learn From the Experts
        </h2>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {guides.map((g, i) => (
          <Link
            key={i}
            to="/sell"
            className="min-w-[260px] max-w-[280px] flex-shrink-0 snap-start bg-card rounded-xl overflow-hidden border border-transparent hover:border-primary/40 hover:-translate-y-1 transition-all group"
          >
            {/* Placeholder thumbnail */}
            <div className="w-full h-36 bg-secondary flex items-center justify-center">
              <span className="text-muted-foreground text-xs">Article Image</span>
            </div>
            <div className="p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground bg-primary px-2 py-0.5 rounded">
                Seller Guide
              </span>
              <h3 className="text-foreground font-bold text-sm mt-2 mb-1 line-clamp-2 font-heading uppercase">
                {g.title}
              </h3>
              <span className="text-muted-foreground text-xs">{g.time}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-right mt-4">
        <Link to="/sell" className="text-primary text-sm font-bold hover:underline">
          Explore All Guides →
        </Link>
      </div>
    </div>
  </section>
);

export default ExpertGuidesStrip;
