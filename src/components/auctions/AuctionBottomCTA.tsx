import { Button } from "@/components/ui/button";

const AuctionBottomCTA = () => (
  <section className="bg-card py-14">
    <div className="max-w-xl mx-auto px-4 text-center">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Ready to Start Bidding?</h2>
      <p className="text-sm text-muted-foreground mb-6">Join 1,240+ registered bidders on AutoWurx. Your next vehicle is one winning bid away.</p>
      <div className="flex gap-3 justify-center mb-8">
        <Button onClick={() => document.getElementById("auction-grid")?.scrollIntoView({ behavior: "smooth" })}>
          Browse All Auctions ↑
        </Button>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Register Free →</Button>
      </div>
      <div className="flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
        {["No buyer's fee", "Identity-verified sellers", "Free Auto Reports on every vehicle", "Instant outbid alerts"].map((t) => (
          <span key={t} className="flex items-center gap-1"><span className="text-primary">✦</span> {t}</span>
        ))}
      </div>
    </div>
  </section>
);

export default AuctionBottomCTA;
