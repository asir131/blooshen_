import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SellHero from "@/components/sell/SellHero";
import SellHowItWorks from "@/components/sell/SellHowItWorks";
import WhySellSection from "@/components/sell/WhySellSection";
import AffiliateShareBanner from "@/components/sell/AffiliateShareBanner";
import SellerFAQ from "@/components/sell/SellerFAQ";
import ExpertGuidesStrip from "@/components/sell/ExpertGuidesStrip";
import BottomCTABanner from "@/components/sell/BottomCTABanner";

const SellYourCar = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main className="flex-1">
      <SellHero />
      <SellHowItWorks />
      <WhySellSection />
      <AffiliateShareBanner />
      <SellerFAQ />
      <ExpertGuidesStrip />
      <BottomCTABanner />
    </main>
    <Footer />
  </div>
);

export default SellYourCar;
