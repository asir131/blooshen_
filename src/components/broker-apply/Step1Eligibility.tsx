import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBrokerApplyStore } from "@/stores/brokerApplyStore";

const selfDescOptions = [
  "Car enthusiast with strong local knowledge",
  "Former or current automotive professional",
  "Active buyer/seller in my community",
  "Social media creator in the auto space",
  "Other — I'll explain in my bio",
];

const hearAboutOptions = [
  "TikTok", "Instagram", "Facebook", "X (Twitter)",
  "YouTube", "Google Search", "Friend/Referral",
  "AutoWurx Listing", "Other",
];

const referredOptions = [
  "Yes, informally (friends, family, community)",
  "Yes, professionally (licensed broker/dealer)",
  "No, but I'm ready to start",
  "I'm not sure what counts",
];

const Step1Eligibility = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, setCurrentStep } = useBrokerApplyStore();
  const [local, setLocal] = useState({
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    cityState: formData.cityState,
    zipCode: formData.zipCode,
    selfDescription: formData.selfDescription,
    hearAbout: formData.hearAbout,
    referredBefore: formData.referredBefore,
    agreedToTerms: formData.agreedToTerms,
  });

  const update = (field: string, value: string | boolean) =>
    setLocal((p) => ({ ...p, [field]: value }));

  const canContinue =
    local.fullName &&
    local.email &&
    local.phone &&
    local.cityState &&
    local.zipCode &&
    local.selfDescription &&
    local.referredBefore &&
    local.agreedToTerms;

  const handleContinue = () => {
    // TODO: POST to /api/experts/check-eligibility
    // Returns: { eligible: bool, reason?: string, waitlist?: bool }
    // For now, all submissions advance to Step 2.
    updateFormData({
      ...local,
      displayName: local.fullName,
      cityNeighborhood: local.cityState,
    });
    setCurrentStep(2);
    navigate("/experts/apply/profile");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
      {/* Left — Hero */}
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white leading-tight mb-4">
          Become an AutoWurx<br />Neighborhood Broker.
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
          Turn your automotive knowledge and local connections into a real income stream.
          Build your free broker profile, feature hand-picked vehicles, publish content,
          and earn referral fees every time a deal closes — with zero upfront cost.
        </p>

        <div className="space-y-4 mb-8">
          {[
            { icon: DollarSign, text: "Earn $50–$300 per closed deal" },
            { icon: Clock, text: "Set your own hours, work your own way" },
            { icon: MapPin, text: "Serve your neighborhood — people trust people they know" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-[#FFE000] shrink-0" />
              <span className="text-gray-300 text-sm">{text}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-[#333] border-2 border-[#FFE000]" />
            ))}
          </div>
          <span className="text-gray-500 text-xs">Join 340+ active brokers already earning on AutoWurx</span>
        </div>
      </div>

      {/* Right — Form Card */}
      <div className="bg-[#242424] border border-[#FFE000] rounded-[14px] p-7">
        <h2 className="text-white font-bold text-lg mb-1">Let's See If You Qualify</h2>
        <p className="text-gray-500 text-xs mb-6">Takes 2 minutes. No commitment.</p>

        <div className="space-y-4">
          <div>
            <Label className="text-gray-300 text-xs">Full Name <span className="text-[#FFE000]">*</span></Label>
            <Input value={local.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Your full legal name" className="mt-1 bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000] focus:ring-[#FFE000]" />
          </div>
          <div>
            <Label className="text-gray-300 text-xs">Email Address <span className="text-[#FFE000]">*</span></Label>
            <Input type="email" value={local.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className="mt-1 bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000] focus:ring-[#FFE000]" />
          </div>
          <div>
            <Label className="text-gray-300 text-xs">Phone Number <span className="text-[#FFE000]">*</span></Label>
            <Input type="tel" value={local.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(555) 000-0000" className="mt-1 bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000] focus:ring-[#FFE000]" />
            <p className="text-gray-600 text-[10px] mt-1">We'll verify this number in step 3</p>
          </div>
          <div>
            <Label className="text-gray-300 text-xs">Your City & State <span className="text-[#FFE000]">*</span></Label>
            <Input value={local.cityState} onChange={(e) => update("cityState", e.target.value)} placeholder="e.g. Atlanta, GA" className="mt-1 bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000] focus:ring-[#FFE000]" />
          </div>
          <div>
            <Label className="text-gray-300 text-xs">Zip Code <span className="text-[#FFE000]">*</span></Label>
            <Input value={local.zipCode} onChange={(e) => update("zipCode", e.target.value.slice(0, 5))} placeholder="30301" className="mt-1 bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000] focus:ring-[#FFE000] font-mono tracking-widest" />
          </div>

          <div>
            <Label className="text-gray-300 text-xs mb-2 block">How would you describe yourself? <span className="text-[#FFE000]">*</span></Label>
            <RadioGroup value={local.selfDescription} onValueChange={(v) => update("selfDescription", v)} className="space-y-2">
              {selfDescOptions.map((opt) => (
                <div key={opt} className="flex items-center gap-2">
                  <RadioGroupItem value={opt} id={opt} />
                  <Label htmlFor={opt} className="text-gray-400 text-xs cursor-pointer">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-gray-300 text-xs">How did you hear about AutoWurx?</Label>
            <Select value={local.hearAbout} onValueChange={(v) => update("hearAbout", v)}>
              <SelectTrigger className="mt-1 bg-[#1A1A1A] border-[#333] text-white focus:border-[#FFE000]">
                <SelectValue placeholder="Select one..." />
              </SelectTrigger>
              <SelectContent>
                {hearAboutOptions.map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300 text-xs mb-2 block">Have you referred a vehicle purchase before? <span className="text-[#FFE000]">*</span></Label>
            <RadioGroup value={local.referredBefore} onValueChange={(v) => update("referredBefore", v)} className="space-y-2">
              {referredOptions.map((opt) => (
                <div key={opt} className="flex items-center gap-2">
                  <RadioGroupItem value={opt} id={`ref-${opt}`} />
                  <Label htmlFor={`ref-${opt}`} className="text-gray-400 text-xs cursor-pointer">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-start gap-2 pt-2">
            <Checkbox
              checked={local.agreedToTerms}
              onCheckedChange={(v) => update("agreedToTerms", !!v)}
              className="mt-0.5"
            />
            <Label className="text-gray-400 text-xs leading-relaxed cursor-pointer">
              I agree to the{" "}
              <a href="/legal/broker-terms" target="_blank" className="text-[#FFE000] underline">
                AutoWurx Broker Terms of Service
              </a>{" "}
              and understand that referral fees are paid only upon verified deal completion.
            </Label>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="w-full bg-[#FFE000] text-black font-bold hover:bg-[#FFE000]/90 disabled:opacity-40 h-12 text-sm"
          >
            Check My Eligibility →
          </Button>

          <p className="text-center text-xs">
            <a href="/experts/apply/status" className="text-[#FFE000] hover:underline">
              Already applied? Check your status →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step1Eligibility;
