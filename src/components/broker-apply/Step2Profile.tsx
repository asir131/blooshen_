import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBrokerApplyStore } from "@/stores/brokerApplyStore";

const allSpecialties = [
  "Cash Deals", "Used Cars", "New Cars", "Trucks & SUVs",
  "Luxury Vehicles", "First-Time Buyers", "Budget Builds", "Rentals",
  "Parts Sourcing", "Financing Guidance", "Remote/Paperwork", "Classic Cars",
  "Electric Vehicles", "Fleet Vehicles",
];

const Step2Profile = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, setCurrentStep } = useBrokerApplyStore();

  const [displayName, setDisplayName] = useState(formData.displayName);
  const [username, setUsername] = useState(formData.username);
  const [tagline, setTagline] = useState(formData.tagline);
  const [cityNeighborhood, setCityNeighborhood] = useState(formData.cityNeighborhood);
  const [bio, setBio] = useState(formData.bio);
  const [specialties, setSpecialties] = useState<string[]>(formData.specialties);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  // Debounced username availability check
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    const timer = setTimeout(() => {
      // TODO: Query experts table for username availability
      // For now, simulate — "taken" if "marcus-atlanta", else available
      setUsernameStatus(username === "marcus-atlanta" ? "taken" : "available");
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const toggleSpecialty = useCallback((s: string) => {
    setSpecialties((prev) => {
      if (prev.includes(s)) return prev.filter((x) => x !== s);
      if (prev.length >= 6) return prev;
      return [...prev, s];
    });
  }, []);

  const canContinue =
    displayName &&
    username &&
    username.length >= 3 &&
    usernameStatus === "available" &&
    tagline &&
    cityNeighborhood &&
    bio &&
    bio.length >= 80 &&
    specialties.length >= 1;

  const handleContinue = () => {
    updateFormData({ displayName, username, tagline, cityNeighborhood, bio, specialties });
    setCurrentStep(3);
    navigate("/experts/apply/verify");
  };

  const handleBack = () => {
    setCurrentStep(1);
    navigate("/experts/apply");
  };

  return (
    <div className="max-w-[640px] mx-auto px-4 py-12">
      <h2 className="text-2xl font-heading font-bold text-white mb-1">Build Your Broker Profile</h2>
      <p className="text-gray-500 text-sm mb-8">
        This becomes your public profile page at autowurx.com/experts/[username]. Make it count.
      </p>

      <div className="space-y-8">
        {/* Identity */}
        <div>
          <h3 className="text-[#FFE000] text-xs font-bold tracking-widest uppercase mb-4">Your Identity</h3>

          {/* Profile photo */}
          <div className="flex justify-center mb-6">
            <label className="w-[120px] h-[120px] rounded-full border-2 border-dashed border-[#FFE000] flex flex-col items-center justify-center cursor-pointer hover:bg-[#FFE000]/5 transition-colors">
              <Camera className="w-6 h-6 text-[#FFE000] mb-1" />
              <span className="text-[#FFE000] text-[10px]">Upload Photo</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
          <p className="text-center text-gray-600 text-[10px] mb-6">Square photo, min 300×300px</p>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 text-xs">Display Name <span className="text-[#FFE000]">*</span></Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000] focus:ring-[#FFE000]" />
            </div>

            <div>
              <Label className="text-gray-300 text-xs">Username / Vanity URL <span className="text-[#FFE000]">*</span></Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 30))}
                placeholder="e.g. marcus-atlanta"
                className="mt-1 bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000] focus:ring-[#FFE000] font-mono"
              />
              <div className="mt-1 text-[10px]">
                {username && (
                  <span className="text-gray-500">
                    autowurx.com/experts/<span className="text-white">{username}</span>
                  </span>
                )}
                {usernameStatus === "checking" && <span className="text-gray-500 ml-2">Checking...</span>}
                {usernameStatus === "available" && <span className="text-green-500 ml-2">✓ Available!</span>}
                {usernameStatus === "taken" && <span className="text-red-500 ml-2">✕ Taken — try another</span>}
              </div>
              <p className="text-gray-600 text-[10px] mt-0.5">Lowercase letters, numbers, and hyphens only. 3–30 characters.</p>
            </div>

            <div>
              <Label className="text-gray-300 text-xs">Professional Title / Tagline <span className="text-[#FFE000]">*</span></Label>
              <Input
                value={tagline}
                onChange={(e) => setTagline(e.target.value.slice(0, 80))}
                placeholder="e.g. East Atlanta Car Guy · Cash Deals & Trucks"
                className="mt-1 bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000] focus:ring-[#FFE000]"
              />
              <p className="text-right text-gray-600 text-[10px] mt-0.5">{tagline.length}/80</p>
            </div>

            <div>
              <Label className="text-gray-300 text-xs">City & Neighborhood <span className="text-[#FFE000]">*</span></Label>
              <Input value={cityNeighborhood} onChange={(e) => setCityNeighborhood(e.target.value)} placeholder="e.g. East Atlanta, GA" className="mt-1 bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000] focus:ring-[#FFE000]" />
            </div>
          </div>
        </div>

        {/* Your Story */}
        <div>
          <h3 className="text-[#FFE000] text-xs font-bold tracking-widest uppercase mb-4">Your Story</h3>
          <div>
            <Label className="text-gray-300 text-xs">Bio <span className="text-[#FFE000]">*</span></Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 400))}
              placeholder="Tell buyers who you are, what you specialize in, and why they should trust you with their next vehicle purchase..."
              className="mt-1 bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000] focus:ring-[#FFE000] min-h-[120px]"
            />
            <div className="flex justify-between mt-1">
              <p className="text-gray-600 text-[10px]">Write in first person. Min 80 chars.</p>
              <p className={`text-[10px] ${bio.length < 80 ? "text-red-400" : "text-gray-600"}`}>{bio.length}/400</p>
            </div>
          </div>
          {/* TODO: AI Bio Helper — call Lovable AI Gateway edge function to generate bio */}
          <Button variant="outline" size="sm" className="mt-2 border-[#FFE000] text-[#FFE000] hover:bg-[#FFE000]/10 text-xs">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Help me write my bio
          </Button>
        </div>

        {/* Specialties */}
        <div>
          <h3 className="text-[#FFE000] text-xs font-bold tracking-widest uppercase mb-4">Your Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {allSpecialties.map((s) => {
              const selected = specialties.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSpecialty(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selected
                      ? "border-[#FFE000] text-[#FFE000] bg-[#2a1a00]"
                      : "border-[#333] text-gray-500 bg-[#2a2a2a] hover:border-[#FFE000]/50"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <p className="text-gray-600 text-[10px] mt-2">{specialties.length} of 6 specialties selected</p>
        </div>

        {/* Banner */}
        <div>
          <h3 className="text-[#FFE000] text-xs font-bold tracking-widest uppercase mb-4">Your Banner</h3>
          <label className="block w-full h-[160px] border-2 border-dashed border-[#333] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FFE000]/50 transition-colors">
            <ImageIcon className="w-6 h-6 text-gray-600 mb-1" />
            <span className="text-gray-600 text-xs">Upload a cover banner (optional)</span>
            <span className="text-gray-700 text-[10px] mt-1">1200 × 300px recommended</span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={handleBack} className="flex-1 border-[#333] text-gray-400 hover:bg-[#333]">
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="flex-[2] bg-[#FFE000] text-black font-bold hover:bg-[#FFE000]/90 disabled:opacity-40"
          >
            Continue →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step2Profile;
