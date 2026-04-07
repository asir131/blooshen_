import { useState } from "react";
import { Play, Heart, MessageCircle } from "lucide-react";
import { FaInstagram, FaFacebookF, FaXTwitter, FaYoutube, FaTiktok } from "react-icons/fa6";
import type { SocialPost } from "@/data/mockExpertProfile";

// TODO: Replace with live social API integration
// Supported: Instagram Basic Display API, Facebook Graph API, Twitter/X API v2, TikTok Display API

const platformIcons: Record<string, { icon: React.ElementType; color: string }> = {
  instagram: { icon: FaInstagram, color: "#E4405F" },
  facebook: { icon: FaFacebookF, color: "#1877F2" },
  x: { icon: FaXTwitter, color: "#fff" },
  youtube: { icon: FaYoutube, color: "#FF0000" },
  tiktok: { icon: FaTiktok, color: "#fff" },
};

const tabs = ["All", "Instagram", "Facebook", "X", "TikTok", "YouTube"] as const;

function platformFromTab(tab: string): string | null {
  if (tab === "All") return null;
  return tab.toLowerCase();
}

interface SocialFeedProps {
  posts: SocialPost[];
  expertName: string;
  connectedPlatforms: string[];
  isEditing: boolean;
}

export default function SocialFeed({ posts, expertName, connectedPlatforms, isEditing }: SocialFeedProps) {
  const [activeTab, setActiveTab] = useState<string>("All");

  const visibleTabs = tabs.filter(
    (t) => t === "All" || connectedPlatforms.includes(t.toLowerCase())
  );

  const filtered = activeTab === "All"
    ? posts
    : posts.filter((p) => p.platform === platformFromTab(activeTab));

  const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();

  return (
    <section className="bg-background py-16 px-4">
      <div className="max-w-[900px] mx-auto">
        <p className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-primary mb-2">Social Feed</p>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-1">
          Latest From {expertName}
        </h2>
        <div className="w-12 h-1 bg-primary rounded mb-6" />

        {isEditing && (
          <div className="bg-[#242424] border border-border rounded-xl p-4 mb-6">
            <p className="text-sm font-bold text-foreground mb-3">Connect Social Accounts</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(platformIcons).map(([key, { icon: Icon, color }]) => {
                const connected = connectedPlatforms.includes(key);
                return (
                  <button key={key} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold ${connected ? "border-green-500/40 bg-green-500/10" : "border-border bg-muted"}`}>
                    <Icon style={{ color }} className="w-4 h-4" />
                    {connected ? `Connected` : `Connect ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {visibleTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((post) => {
            const pConfig = platformIcons[post.platform];
            const PIcon = pConfig?.icon;
            return (
              <div key={post.id} className="break-inside-avoid bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors">
                <div className="relative">
                  <img src={post.thumbnail_url} alt="" className="w-full aspect-video object-cover" />
                  {PIcon && (
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                      <PIcon className="w-3 h-3" style={{ color: pConfig.color }} />
                    </div>
                  )}
                  {post.is_video && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
                        <Play className="w-5 h-5 text-foreground fill-foreground" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-foreground line-clamp-2 mb-2">{post.caption}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>{post.timestamp}</span>
                    <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" /> {formatCount(post.likes)}</span>
                    <span className="flex items-center gap-0.5"><MessageCircle className="w-3 h-3" /> {formatCount(post.comments)}</span>
                  </div>
                  <a href={post.post_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline mt-2 inline-block">
                    View Post →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center mt-6">
          <a href="#" className="text-sm text-primary hover:underline">
            Follow {expertName} on Instagram →
          </a>
        </p>
      </div>
    </section>
  );
}
