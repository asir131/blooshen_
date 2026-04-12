import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Facebook, Youtube, MessageCircle, Building2, CreditCard, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBrokerApplyStore } from "@/stores/brokerApplyStore";

const socialPlatforms = [
  { id: "instagram", label: "Instagram", desc: "Show your latest posts and reels on your profile", icon: Instagram, color: "#E4405F" },
  { id: "facebook", label: "Facebook", desc: "Share your posts and build local trust", icon: Facebook, color: "#1877F2" },
  { id: "x", label: "X (Twitter)", desc: "Your automotive takes and local insights", icon: MessageCircle, color: "#fff" },
  { id: "tiktok", label: "TikTok", desc: "Your car content reaches buyers where they scroll", icon: MessageCircle, color: "#000" },
  { id: "youtube", label: "YouTube", desc: "Embed your videos directly on your profile", icon: Youtube, color: "#FF0000" },
];

const payoutMethods = [
  { id: "venmo", label: "Venmo", placeholder: "Your Venmo username @" },
  { id: "paypal", label: "PayPal", placeholder: "Your PayPal email address" },
  { id: "cashapp", label: "Cash App", placeholder: "Your $Cashtag" },
  { id: "ach", label: "Bank Transfer (ACH)", placeholder: "" },
  { id: "check", label: "Check by Mail", placeholder: "" },
];

const Step4Connect = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, setCurrentStep } = useBrokerApplyStore();
  const [connected, setConnected] = useState<string[]>(formData.connectedSocials);
  const [whatsapp, setWhatsapp] = useState(formData.whatsappNumber);
  const [payoutMethod, setPayoutMethod] = useState(formData.payoutMethod);
  const [payoutHandle, setPayoutHandle] = useState(formData.payoutHandle);
  const [payoutSchedule, setPayoutSchedule] = useState(formData.payoutSchedule);

  const toggleConnect = (id: string) => {
    setConnected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    updateFormData({
      connectedSocials: connected,
      whatsappNumber: whatsapp,
      payoutMethod,
      payoutHandle,
      payoutSchedule,
    });
    setCurrentStep(5);
    navigate("/experts/apply/review");
  };

  const handleBack = () => {
    setCurrentStep(3);
    navigate("/experts/apply/verify");
  };

  return (
    <div className="max-w-[600px] mx-auto px-4 py-12">
      <h2 className="text-2xl font-heading font-bold text-white mb-1">Connect Your Accounts</h2>
      <p className="text-gray-500 text-sm mb-8">
        Optional but recommended. Brokers with connected social accounts get 3× more profile views.
      </p>

      {/* Social Media */}
      <div className="space-y-3 mb-10">
        <h3 className="text-[#FFE000] text-xs font-bold tracking-widest uppercase mb-3">Social Media</h3>
        {socialPlatforms.map(({ id, label, desc, icon: Icon }) => {
          const isConnected = connected.includes(id);
          return (
            <div key={id} className="bg-[#242424] border border-[#333] rounded-xl p-4 flex items-center gap-3">
              <Icon className="w-8 h-8 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
              <Button
                variant={isConnected ? "ghost" : "outline"}
                size="sm"
                onClick={() => toggleConnect(id)}
                className={isConnected ? "text-green-400 text-xs" : "border-[#555] text-gray-400 text-xs hover:border-[#FFE000] hover:text-[#FFE000]"}
              >
                {isConnected ? "● Connected" : `Connect ${label} →`}
              </Button>
            </div>
          );
        })}

        {/* WhatsApp */}
        <div className="bg-[#242424] border border-[#333] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-8 h-8 text-green-500 shrink-0" />
            <div>
              <p className="text-white text-sm font-medium">WhatsApp Business</p>
              <p className="text-gray-500 text-xs">Let buyers message you directly</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Enter your WhatsApp business number"
              className="bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000] focus:ring-[#FFE000] text-sm"
            />
            <Button size="sm" className="bg-[#FFE000] text-black font-bold shrink-0 text-xs">
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Payout Setup */}
      <div className="mb-10">
        <h3 className="text-[#FFE000] text-xs font-bold tracking-widest uppercase mb-2">Set Up Your Payouts</h3>
        <p className="text-gray-500 text-xs mb-4">Choose how you want to receive your referral fees.</p>

        <RadioGroup value={payoutMethod} onValueChange={setPayoutMethod} className="space-y-3">
          {payoutMethods.map(({ id, label, placeholder }) => (
            <label key={id} className={`block p-4 rounded-xl border cursor-pointer transition-colors ${payoutMethod === id ? "border-[#FFE000] bg-[#FFE000]/5" : "border-[#333] bg-[#242424]"}`}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value={id} />
                <span className="text-white text-sm font-medium">{label}</span>
              </div>
              {payoutMethod === id && placeholder && (
                <Input
                  value={payoutHandle}
                  onChange={(e) => setPayoutHandle(e.target.value)}
                  placeholder={placeholder}
                  className="mt-3 bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000] focus:ring-[#FFE000] text-sm"
                />
              )}
              {payoutMethod === id && id === "ach" && (
                <div className="mt-3 space-y-2">
                  <Input placeholder="Routing number" className="bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000] text-sm" />
                  <Input placeholder="Account number" className="bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000] text-sm" />
                  <p className="text-gray-600 text-[10px]">Payouts process within 3–5 business days</p>
                </div>
              )}
              {payoutMethod === id && id === "check" && (
                <p className="mt-2 text-gray-600 text-[10px]">Minimum $50 payout. Checks mailed on the 1st of each month.</p>
              )}
            </label>
          ))}
        </RadioGroup>

        {/* Schedule toggle */}
        <div className="mt-4">
          <Label className="text-gray-300 text-xs mb-2 block">Pay me:</Label>
          <div className="flex gap-2">
            {["weekly", "monthly"].map((s) => (
              <button
                key={s}
                onClick={() => setPayoutSchedule(s)}
                className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  payoutSchedule === s
                    ? "border-[#FFE000] bg-[#FFE000]/10 text-[#FFE000]"
                    : "border-[#333] text-gray-500"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-gray-600 text-[10px] mt-1">Minimum payout: $25</p>
        </div>

        {/* Tax note */}
        <div className="mt-4 p-3 bg-[#1A1A1A] border border-[#FFE000]/30 rounded-lg">
          <p className="text-gray-400 text-xs">
            📋 You'll need to complete a W-9 form before receiving your first payout. We'll email it once you're approved.
          </p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack} className="flex-1 border-[#333] text-gray-400 hover:bg-[#333]">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="flex-[2] bg-[#FFE000] text-black font-bold hover:bg-[#FFE000]/90"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
};

export default Step4Connect;
