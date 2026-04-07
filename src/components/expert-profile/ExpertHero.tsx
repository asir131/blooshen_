import { useState } from "react";
import { Star, CheckCircle, Crown, Award, Zap, Share2, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ExpertProfile } from "@/data/mockExpertProfile";
import { FaInstagram, FaFacebookF, FaXTwitter, FaYoutube, FaTiktok, FaWhatsapp } from "react-icons/fa6";

interface ExpertHeroProps {
  expert: ExpertProfile;
  isOwner: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
}

const tierConfig = {
  starter: { label: "Starter", icon: Zap, className: "bg-muted text-muted-foreground border-border" },
  pro: { label: "Pro", icon: Award, className: "bg-primary/15 text-primary border-primary/40" },
  elite: { label: "Elite", icon: Star, className: "bg-primary/15 text-primary border-primary/40" },
  legend: { label: "Legend", icon: Crown, className: "bg-primary/15 text-primary border-primary/40" },
};

const socialIcons: Record<string, { icon: React.ElementType; color: string }> = {
  instagram: { icon: FaInstagram, color: "#E4405F" },
  facebook: { icon: FaFacebookF, color: "#1877F2" },
  x: { icon: FaXTwitter, color: "#fff" },
  youtube: { icon: FaYoutube, color: "#FF0000" },
  tiktok: { icon: FaTiktok, color: "#fff" },
  whatsapp: { icon: FaWhatsapp, color: "#25D366" },
};

export default function ExpertHero({ expert, isOwner, isEditing, onToggleEdit }: ExpertHeroProps) {
  const [bio, setBio] = useState(expert.bio);
  const tier = tierConfig[expert.badge_tier];
  const TierIcon = tier.icon;

  return (
    <section className="relative">
      {/* Edit mode top bar */}
      {isOwner && isEditing && (
        <div className="bg-primary/10 border-b border-primary/30 px-4 py-3 text-center">
          <span className="text-sm text-foreground mr-4">You're editing your public profile</span>
          <Button size="sm" className="mr-2">Save Changes</Button>
          <Button size="sm" variant="secondary" className="mr-2">Preview</Button>
          <Button size="sm" variant="ghost" onClick={onToggleEdit}>Cancel</Button>
        </div>
      )}

      {/* Banner */}
      <div className="relative w-full h-[160px] md:h-[220px] overflow-hidden">
        {expert.banner_url ? (
          <>
            <img src={expert.banner_url} alt="Profile banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/65" />
          </>
        ) : (
          <div className="w-full h-full bg-background" style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, hsl(var(--muted)/0.15) 10px, hsl(var(--muted)/0.15) 11px)",
          }} />
        )}
      </div>

      {/* Profile Card */}
      <div className="relative max-w-[860px] mx-auto px-4 -mt-16 md:-mt-20 z-10 pb-8">
        <div className={`bg-[#242424] border rounded-2xl p-6 md:p-7 ${isEditing ? "border-primary" : "border-border"}`}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* LEFT COLUMN */}
            <div className="flex flex-col items-center md:items-start md:w-[200px] shrink-0">
              {/* Avatar */}
              <div className="relative -mt-20 md:-mt-24 mb-3">
                <div className="w-[110px] h-[110px] rounded-full border-[3px] border-primary overflow-hidden bg-muted">
                  <img src={expert.avatar_url} alt={expert.display_name} className="w-full h-full object-cover" />
                </div>
                <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#242424] ${expert.is_online ? "bg-green-500" : "bg-muted-foreground"}`} />
              </div>

              {/* Badge Tier */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-heading font-bold uppercase tracking-wider mb-2 ${tier.className}`}>
                <TierIcon className="w-3.5 h-3.5" />
                {tier.label}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{expert.rating.average} ({expert.rating.count} reviews)</span>
              </div>

              {/* Action Buttons */}
              <Button className="w-full mb-2" size="sm">
                <MessageCircle className="w-4 h-4" /> Contact Expert
              </Button>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10" size="sm">
                <Calendar className="w-4 h-4" /> Request Consultation
              </Button>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex-1 min-w-0">
              {/* Name row */}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">{expert.display_name}</h1>
                {expert.is_verified && (
                  <CheckCircle className="w-5 h-5 text-primary fill-primary" />
                )}
                {isOwner && !isEditing && (
                  <Button size="sm" variant="ghost" className="ml-auto text-xs" onClick={onToggleEdit}>
                    Edit My Page
                  </Button>
                )}
                <button className="ml-auto md:ml-0 p-2 rounded-full hover:bg-muted transition-colors" title="Share Profile">
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Tagline */}
              <p className="text-xs md:text-sm text-muted-foreground italic mb-3">{expert.tagline}</p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {expert.specialties.map((s) => (
                  <span key={s} className="px-2.5 py-0.5 rounded-full bg-[#333] text-primary text-[11px] font-heading font-bold uppercase tracking-wider">
                    {s}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                {[
                  { value: expert.stats.listings_referred.toString(), label: "Listings Referred" },
                  { value: `$${(expert.stats.total_deal_value / 1000).toFixed(1)}K`, label: "Total Deal Value" },
                  { value: `${expert.stats.avg_response_hours} hrs`, label: "Avg. Response Time" },
                  { value: `${expert.stats.member_since_years} yrs`, label: "Member Since" },
                ].map((stat, i, arr) => (
                  <div key={stat.label} className="flex items-center gap-4">
                    <div>
                      <div className="text-lg font-heading font-bold text-primary">{stat.value}</div>
                      <div className="text-[11px] text-muted-foreground">{stat.label}</div>
                    </div>
                    {i < arr.length - 1 && <div className="hidden sm:block w-px h-8 bg-border" />}
                  </div>
                ))}
              </div>

              {/* Bio */}
              {isEditing ? (
                <textarea
                  className="w-full bg-background border border-primary rounded-lg p-3 text-sm text-foreground resize-none mb-3"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              ) : (
                <p className="text-sm text-foreground leading-relaxed mb-3">{expert.bio}</p>
              )}

              {/* Social Links */}
              <div className="flex gap-2 flex-wrap">
                {Object.entries(expert.social_links).map(([platform, url]) => {
                  if (!url) return null;
                  const config = socialIcons[platform];
                  if (!config) return null;
                  const Icon = config.icon;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center hover:border hover:border-primary transition-colors"
                    >
                      <Icon className="w-4 h-4" style={{ color: config.color }} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
