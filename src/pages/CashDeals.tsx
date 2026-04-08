import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CashDealHero from "@/components/cash-deals/CashDealHero";
import BrowseDeals from "@/components/cash-deals/BrowseDeals";
import BuyersGuide from "@/components/cash-deals/BuyersGuide";
import ResourceDownloads from "@/components/cash-deals/ResourceDownloads";
import SellerCTA from "@/components/cash-deals/SellerCTA";
import CashDealFAQ from "@/components/cash-deals/CashDealFAQ";

const CashDeals = () => {
  const [activeTab, setActiveTab] = useState<"browse" | "guide">("browse");

  useEffect(() => {
    const handleScroll = () => {
      const guideEl = document.getElementById("guide-section");
      if (guideEl) {
        const rect = guideEl.getBoundingClientRect();
        setActiveTab(rect.top < 200 ? "guide" : "browse");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <CashDealHero />

      {/* Sticky Tab Bar */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-[1100px] mx-auto px-4 flex items-center gap-6">
          {([
            { key: "browse", label: "🔍 Browse Ca$h Deals", target: "browse-section" },
            { key: "guide", label: "📚 Buyer's Guide", target: "guide-section" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => scrollTo(tab.target)}
              className={`py-3.5 text-sm font-heading font-bold transition-colors border-b-[3px] ${
                activeTab === tab.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <BrowseDeals />
      <BuyersGuide />
      <ResourceDownloads />
      <SellerCTA />
      <CashDealFAQ />
      <Footer />
    </div>
  );
};

export default CashDeals;
