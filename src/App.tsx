import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileBottomNav from "@/components/MobileBottomNav";
import Index from "./pages/Index.tsx";
import CarsForSale from "./pages/CarsForSale.tsx";
import CarListingDetail from "./pages/CarListingDetail.tsx";
import PartsAndAccessories from "./pages/PartsAndAccessories.tsx";
import ServiceProviders from "./pages/ServiceProviders.tsx";
import Rentals from "./pages/Rentals.tsx";
import RentalDetail from "./pages/RentalDetail.tsx";
import ExpertsAndReviews from "./pages/ExpertsAndReviews.tsx";
import EventsAndMeetups from "./pages/EventsAndMeetups.tsx";
import SearchResults from "./pages/SearchResults.tsx";
import DashboardLayout from "./pages/DashboardLayout.tsx";
import MyListings from "./pages/dashboard/MyListings.tsx";
import MyRentals from "./pages/dashboard/MyRentals.tsx";
import SavedWatchlist from "./pages/dashboard/SavedWatchlist.tsx";
import Messages from "./pages/dashboard/Messages.tsx";
import MyReviews from "./pages/dashboard/MyReviews.tsx";
import MyEvents from "./pages/dashboard/MyEvents.tsx";
import AccountSettings from "./pages/dashboard/AccountSettings.tsx";
import Billing from "./pages/dashboard/Billing.tsx";
import NewListing from "./pages/dashboard/NewListing.tsx";
import Affiliates from "./pages/dashboard/Affiliates.tsx";
import PromoterDashboard from "./pages/dashboard/PromoterDashboard.tsx";
import PromotersLanding from "./pages/PromotersLanding.tsx";
import AdminAffiliates from "./pages/AdminAffiliates.tsx";
import SellYourCar from "./pages/SellYourCar.tsx";
import AutoReport from "./pages/AutoReport.tsx";
import ExpertProfile from "./pages/ExpertProfile.tsx";
import CashDeals from "./pages/CashDeals.tsx";
import NotFound from "./pages/NotFound.tsx";
import { useReferralDetection } from "@/hooks/useReferralTracking";

const queryClient = new QueryClient();

const AppContent = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard");
  useReferralDetection();

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/cars-for-sale" element={<CarsForSale />} />
        <Route path="/cars-for-sale/:id" element={<CarListingDetail />} />
        <Route path="/parts-accessories" element={<PartsAndAccessories />} />
        <Route path="/service-providers" element={<ServiceProviders />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/rentals/:id" element={<RentalDetail />} />
        <Route path="/reviews" element={<ExpertsAndReviews />} />
        <Route path="/events" element={<EventsAndMeetups />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/sell" element={<SellYourCar />} />
        <Route path="/auto-report" element={<AutoReport />} />
        <Route path="/promoters" element={<PromotersLanding />} />
        <Route path="/admin/affiliates" element={<AdminAffiliates />} />
        <Route path="/experts/:username" element={<ExpertProfile />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<MyListings />} />
          <Route path="rentals" element={<MyRentals />} />
          <Route path="saved" element={<SavedWatchlist />} />
          <Route path="messages" element={<Messages />} />
          <Route path="reviews" element={<MyReviews />} />
          <Route path="events" element={<MyEvents />} />
          <Route path="settings" element={<AccountSettings />} />
          <Route path="billing" element={<Billing />} />
          <Route path="new-listing" element={<NewListing />} />
          <Route path="affiliates" element={<Affiliates />} />
          <Route path="promoter" element={<PromoterDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isDashboard && <MobileBottomNav />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
