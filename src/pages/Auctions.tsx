import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuctionHero from "@/components/auctions/AuctionHero";
import AuctionFilterBar from "@/components/auctions/AuctionFilterBar";
import EndingSoonStrip from "@/components/auctions/EndingSoonStrip";
import AuctionCard from "@/components/auctions/AuctionCard";
import AuctionDetailModal from "@/components/auctions/AuctionDetailModal";
import AuctionHowItWorks from "@/components/auctions/AuctionHowItWorks";
import AuctionSellerCTA from "@/components/auctions/AuctionSellerCTA";
import AuctionTrustFAQ from "@/components/auctions/AuctionTrustFAQ";
import AuctionBottomCTA from "@/components/auctions/AuctionBottomCTA";
import { mockAuctions } from "@/data/mockAuctions";
import type { Auction } from "@/data/mockAuctions";

const Auctions = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("Ending Soonest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [detailAuction, setDetailAuction] = useState<Auction | null>(null);

  // Client-side filtering
  const filtered = mockAuctions.filter((a) => {
    if (activeTab === "All") return true;
    if (activeTab === "Ending Soon") return a.timeLeftMs < 3600_000;
    if (activeTab === "No Reserve") return a.noReserve;
    if (activeTab === "Under $5K") return a.currentBid < 5000;
    if (activeTab === "Trucks & SUVs") return ["F-150", "Silverado 1500", "4Runner", "Wrangler", "Telluride", "1500", "F-250"].some((m) => a.model.includes(m));
    if (activeTab === "Classic Cars") return a.year < 2015;
    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Ending Soonest") return a.timeLeftMs - b.timeLeftMs;
    if (sortBy === "Highest Bid") return b.currentBid - a.currentBid;
    if (sortBy === "Most Bids") return b.bids - a.bids;
    if (sortBy === "No Reserve First") return (b.noReserve ? 1 : 0) - (a.noReserve ? 1 : 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AuctionHero />
      <AuctionFilterBar
        activeTab={activeTab} setActiveTab={setActiveTab}
        sortBy={sortBy} setSortBy={setSortBy}
        viewMode={viewMode} setViewMode={setViewMode}
        count={sorted.length}
      />
      <EndingSoonStrip />

      {/* Main auction grid */}
      <section id="auction-grid" className="bg-[#1A1A1A] py-10">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "flex flex-col gap-4"
          }>
            {sorted.map((a) => (
              <AuctionCard key={a.id} auction={a} onDetails={setDetailAuction} />
            ))}
          </div>
        </div>
      </section>

      <AuctionHowItWorks />
      <AuctionSellerCTA />
      <AuctionTrustFAQ />
      <AuctionBottomCTA />
      <Footer />

      {detailAuction && (
        <AuctionDetailModal auction={detailAuction} onClose={() => setDetailAuction(null)} />
      )}
    </div>
  );
};

export default Auctions;
