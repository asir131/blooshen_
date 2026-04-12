import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FindBrokerHero from "@/components/find-broker/FindBrokerHero";
import BrokerResults from "@/components/find-broker/BrokerResults";
import HowBrokerHelps from "@/components/find-broker/HowBrokerHelps";
import BrokerTestimonials from "@/components/find-broker/BrokerTestimonials";
import BrokerFAQ from "@/components/find-broker/BrokerFAQ";
import BecomeBrokerCTA from "@/components/find-broker/BecomeBrokerCTA";
import BottomCTA from "@/components/find-broker/BottomCTA";

const FindMyBroker = () => {
  const [city, setCity] = useState("Atlanta, GA");

  const handleZipSubmit = useCallback((zip: string) => {
    // TODO: Reverse geocode zip to city name
    setCity(`${zip} Area`);
    document.getElementById("broker-results")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FindBrokerHero onZipSubmit={handleZipSubmit} />
      <BrokerResults city={city} />
      <HowBrokerHelps />
      <BrokerTestimonials />
      <BrokerFAQ />
      <BecomeBrokerCTA />
      <BottomCTA onZipSubmit={handleZipSubmit} />
      <Footer />
    </div>
  );
};

export default FindMyBroker;
