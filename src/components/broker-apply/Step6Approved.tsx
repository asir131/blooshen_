import { useState, useEffect } from "react";
import { Eye, Car, Share2, LayoutDashboard, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useBrokerApplyStore } from "@/stores/brokerApplyStore";

const Step6Approved = () => {
  const { formData } = useBrokerApplyStore();
  const firstName = formData.fullName.split(" ")[0] || "Broker";
  const profileUrl = `autowurx.com/experts/${formData.username || "you"}`;
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [animateCheck, setAnimateCheck] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateCheck(true), 100);
  }, []);

  const copyUrl = () => {
    navigator.clipboard.writeText(`https://${profileUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actionCards = [
    { icon: Eye, title: "View Your Live Profile", desc: "See exactly what buyers see when they find you on AutoWurx.", btn: "View My Profile →", href: `/experts/${formData.username}` },
    { icon: Car, title: "Add Featured Vehicles", desc: "Add up to 12 vehicles to feature on your profile.", btn: "Add Vehicles →", href: "/dashboard/my-listings" },
    { icon: Share2, title: "Share Your Profile", desc: "Share your broker profile link on social media and in your community.", btn: "Share My Profile →", onClick: () => setShowShareModal(true) },
    { icon: LayoutDashboard, title: "Go to Dashboard", desc: "Track your earnings, manage listings, and climb the leaderboard.", btn: "Open My Dashboard →", href: "/dashboard/promoter" },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A1A] relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(50_100%_50%/0.06)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 py-16 text-center">
        {/* Animated checkmark */}
        <div className="mb-6">
          <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#FFE000" strokeWidth="3"
              strokeDasharray="226" strokeDashoffset={animateCheck ? "0" : "226"}
              style={{ transition: "stroke-dashoffset 0.8s ease-in" }}
            />
            <path d="M24 40 L35 51 L56 30" fill="none" stroke="#FFE000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="50" strokeDashoffset={animateCheck ? "0" : "50"}
              style={{ transition: "stroke-dashoffset 0.6s ease-in 0.4s" }}
            />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
          You're In, {firstName}! 🎉
        </h1>
        <p className="text-[#FFE000] font-medium mb-6">Welcome to the AutoWurx Broker Network.</p>

        <p className="text-gray-400 text-sm mb-3">Your profile is live at:</p>
        <div className="inline-flex items-center gap-2 bg-[#FFE000] text-black font-mono font-bold text-sm px-5 py-2.5 rounded-full mb-10">
          {profileUrl}
          <button onClick={copyUrl} className="hover:opacity-70 transition-opacity">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Action cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10 text-left">
          {actionCards.map(({ icon: Icon, title, desc, btn, href, onClick }) => (
            <div key={title} className="bg-[#242424] border border-[#333] rounded-xl p-5 hover:border-[#FFE000] transition-colors">
              <Icon className="w-6 h-6 text-[#FFE000] mb-3" />
              <h3 className="text-white text-sm font-bold mb-1">{title}</h3>
              <p className="text-gray-500 text-xs mb-4 leading-relaxed">{desc}</p>
              {href ? (
                <a href={href} target={href.startsWith("/experts") ? "_blank" : undefined}>
                  <Button size="sm" className="bg-[#FFE000] text-black font-bold text-xs hover:bg-[#FFE000]/90 w-full">
                    {btn}
                  </Button>
                </a>
              ) : (
                <Button onClick={onClick} size="sm" className="bg-[#FFE000] text-black font-bold text-xs hover:bg-[#FFE000]/90 w-full">
                  {btn}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Earnings kickstart */}
        <div className="bg-[#FFE000] text-black rounded-xl p-6 mb-8 text-left">
          <h3 className="font-bold text-lg mb-1">Your First Deal Could Be Today.</h3>
          <p className="text-sm opacity-80 mb-4">
            The AutoWurx affiliate network is already promoting your profile. Every listing has a 'Share & Earn' button — use yours now.
          </p>
          <a href="/cars-for-sale">
            <Button className="bg-black text-white font-bold hover:bg-black/80 text-xs">
              Browse Listings to Feature →
            </Button>
          </a>
        </div>

        {/* Leaderboard callout */}
        <p className="text-gray-600 text-xs">
          You're currently unranked on the leaderboard. Close your first deal to claim your spot.{" "}
          <a href="/dashboard/promoter" className="text-[#FFE000] hover:underline">View Leaderboard →</a>
        </p>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-[#1A1A1A] border border-[#FFE000] rounded-[14px] max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white font-bold text-lg mb-3">Share Your Broker Profile</h3>
            <Textarea
              defaultValue={`🔑 I'm now an official AutoWurx Neighborhood Broker! If you or anyone you know is looking to buy, sell, or rent a vehicle in ${formData.cityState || "my area"}, I can help — no dealership drama, no pressure. Check out my profile and let's talk: https://${profileUrl} #AutoWurx #CarBuying`}
              className="bg-[#242424] border-[#FFE000] text-white text-sm min-h-[120px] mb-4"
            />
            <div className="flex flex-wrap gap-2">
              {["Copy Link", "Instagram", "Facebook", "X", "WhatsApp", "SMS"].map((label) => (
                <Button
                  key={label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (label === "Copy Link") copyUrl();
                  }}
                  className="border-[#333] text-gray-400 text-xs hover:border-[#FFE000] hover:text-[#FFE000]"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step6Approved;
