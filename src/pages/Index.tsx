import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import CategoryGrid from "@/components/CategoryGrid";
import RentalsBanner from "@/components/RentalsBanner";
import FeaturedListings from "@/components/FeaturedListings";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <CategoryGrid />
      <RentalsBanner />
      <FeaturedListings />
      <NewsSection />
      <Footer />
    </div>
  );
};

export default Index;
