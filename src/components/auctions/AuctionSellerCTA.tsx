import { Button } from "@/components/ui/button";

const AuctionSellerCTA = () => (
  <section className="bg-primary py-14">
    <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
      <div className="flex-1">
        <h2 className="font-heading text-xl md:text-2xl font-bold text-primary-foreground mb-2">Got a Vehicle to Sell Fast?</h2>
        <p className="text-primary-foreground/80 text-xs mb-6 max-w-md">
          List it as an AutoWurx Auction and let competitive bidding drive the price up. No haggling, no lowballers — just real buyers competing for your vehicle.
        </p>
        <div className="flex gap-6 mb-6">
          {[["$0", "To list an auction"], ["48hr", "Average sale time"], ["23%", "Higher than private sale avg"]].map(([n, l]) => (
            <div key={l}>
              <span className="font-heading text-lg font-bold text-primary-foreground">{n}</span>
              <p className="text-[10px] text-primary-foreground/70">{l}</p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
          Start Auction Listing →
        </Button>
      </div>

      {/* Animated bar chart */}
      <div className="flex items-end gap-3 h-32">
        {[40, 55, 72, 90].map((h, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-10 rounded-t motion-safe:animate-[grow_3s_ease-in-out_infinite]"
              style={{ height: `${h}%`, backgroundColor: i === 3 ? "#1A1A1A" : `rgba(26,26,26,${0.3 + i * 0.2})`, animationDelay: `${i * 0.3}s` }}
            />
            <span className="text-[9px] text-primary-foreground/60 font-heading">Bid {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AuctionSellerCTA;
