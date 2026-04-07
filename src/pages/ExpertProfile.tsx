import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExpertHero from "@/components/expert-profile/ExpertHero";
import SocialFeed from "@/components/expert-profile/SocialFeed";
import FeaturedVehicles from "@/components/expert-profile/FeaturedVehicles";
import ExpertArticles from "@/components/expert-profile/ExpertArticles";
import ExpertReviews from "@/components/expert-profile/ExpertReviews";
import ReferralEarningsCTA from "@/components/expert-profile/ReferralEarningsCTA";
import ExpertDirectoryCTA from "@/components/expert-profile/ExpertDirectoryCTA";
import AskExpertModal from "@/components/expert-profile/AskExpertModal";
import {
  mockExpert,
  mockFeaturedVehicles,
  mockSocialPosts,
  mockArticles,
  mockReviews,
  type FeaturedVehicle,
} from "@/data/mockExpertProfile";

export default function ExpertProfile() {
  const { username } = useParams<{ username: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [askVehicle, setAskVehicle] = useState<FeaturedVehicle | null>(null);

  // Mock owner detection — replace with auth check
  const isOwner = true;

  const expert = mockExpert;
  const connectedPlatforms = Object.keys(expert.social_links).filter(
    (k) => expert.social_links[k as keyof typeof expert.social_links]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <ExpertHero
        expert={expert}
        isOwner={isOwner}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing((e) => !e)}
      />

      <SocialFeed
        posts={mockSocialPosts}
        expertName={expert.display_name}
        connectedPlatforms={connectedPlatforms}
        isEditing={isEditing}
      />

      <FeaturedVehicles
        vehicles={mockFeaturedVehicles}
        expert={expert}
        onAskExpert={(v) => setAskVehicle(v)}
      />

      <ExpertArticles articles={mockArticles} expert={expert} />

      <ExpertReviews reviews={mockReviews} expert={expert} />

      {/* Only rendered for the page owner — not CSS hidden, conditionally rendered */}
      {isOwner && <ReferralEarningsCTA />}

      <ExpertDirectoryCTA />

      <Footer />

      <AskExpertModal
        open={!!askVehicle}
        onClose={() => setAskVehicle(null)}
        vehicle={askVehicle}
        expert={expert}
      />
    </div>
  );
}
