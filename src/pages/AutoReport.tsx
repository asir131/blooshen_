import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoReportHero from "@/components/auto-report/AutoReportHero";
import WhatInReport from "@/components/auto-report/WhatInReport";
import SampleReport from "@/components/auto-report/SampleReport";
import HowItWorksReport from "@/components/auto-report/HowItWorksReport";
import TitleBrandExplainer from "@/components/auto-report/TitleBrandExplainer";
import FindYourVin from "@/components/auto-report/FindYourVin";
import PricingTiers from "@/components/auto-report/PricingTiers";
import AutoReportFAQ from "@/components/auto-report/AutoReportFAQ";
import ReportBottomCTA from "@/components/auto-report/ReportBottomCTA";

const AutoReport = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main className="flex-1">
      <AutoReportHero />
      <WhatInReport />
      <SampleReport />
      <HowItWorksReport />
      <TitleBrandExplainer />
      <FindYourVin />
      <PricingTiers />
      <AutoReportFAQ />
      <ReportBottomCTA />
    </main>
    <Footer />
  </div>
);

export default AutoReport;
