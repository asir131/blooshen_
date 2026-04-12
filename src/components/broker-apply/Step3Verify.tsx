import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Phone, Camera, Link as LinkIcon, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useBrokerApplyStore } from "@/stores/brokerApplyStore";

const Step3Verify = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, setCurrentStep } = useBrokerApplyStore();
  const [subStep, setSubStep] = useState<"phone" | "id">(formData.phoneVerified ? "id" : "phone");
  const [codeSent, setCodeSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(formData.phoneVerified);
  const [resendTimer, setResendTimer] = useState(0);
  const [idMethod, setIdMethod] = useState(formData.idMethod || "");
  const [verifying, setVerifying] = useState(false);
  const [idVerified, setIdVerified] = useState(formData.idVerified);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((r) => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleSendCode = () => {
    // TODO: Integrate SMS OTP via Twilio or Supabase Auth
    setCodeSent(true);
    setResendTimer(30);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError(false);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    const code = newOtp.join("");
    if (code.length === 6) {
      // TODO: Verify OTP via backend. For now accept "123456"
      if (code === "123456") {
        setPhoneVerified(true);
        updateFormData({ phoneVerified: true });
        setTimeout(() => setSubStep("id"), 1000);
      } else {
        setOtpError(true);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleIdSubmit = () => {
    // TODO: Integrate identity verification via Persona or Stripe Identity
    setVerifying(true);
    setTimeout(() => {
      setIdVerified(true);
      updateFormData({ idVerified: true, idMethod });
      setVerifying(false);
    }, 3000);
  };

  const canContinue = phoneVerified && idVerified;

  const handleContinue = () => {
    setCurrentStep(4);
    navigate("/experts/apply/connect");
  };

  const handleBack = () => {
    setCurrentStep(2);
    navigate("/experts/apply/profile");
  };

  if (verifying) {
    return (
      <div className="max-w-[560px] mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-3 border-[#FFE000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white font-bold">Verifying your identity...</p>
        <p className="text-gray-500 text-sm mt-1">This usually takes under 60 seconds.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[560px] mx-auto px-4 py-12">
      <h2 className="text-2xl font-heading font-bold text-white mb-1">Verify Your Identity</h2>
      <p className="text-gray-500 text-sm mb-6">
        We verify all brokers to protect our buyers and maintain trust. Less than 5 minutes.
      </p>

      {/* Mini progress */}
      <div className="flex items-center gap-2 mb-8">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ${phoneVerified ? "bg-green-900/30 text-green-400" : subStep === "phone" ? "bg-[#FFE000]/10 text-[#FFE000]" : "bg-[#333] text-gray-500"}`}>
          <Phone className="w-3 h-3" /> Phone
          {phoneVerified && " ✓"}
        </div>
        <div className="w-4 h-0.5 bg-[#333]" />
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ${idVerified ? "bg-green-900/30 text-green-400" : subStep === "id" ? "bg-[#FFE000]/10 text-[#FFE000]" : "bg-[#333] text-gray-500"}`}>
          <Shield className="w-3 h-3" /> ID Check
          {idVerified && " ✓"}
        </div>
      </div>

      {subStep === "phone" && !phoneVerified && (
        <div className="space-y-4">
          <p className="text-white text-sm font-medium">Verify your phone number</p>
          <div className="bg-[#2E2E2E] px-4 py-2 rounded-lg inline-block text-white text-sm font-mono">
            {formData.phone || "(555) 000-0000"}
          </div>

          {!codeSent ? (
            <Button onClick={handleSendCode} className="w-full bg-[#FFE000] text-black font-bold hover:bg-[#FFE000]/90 h-12">
              Send Code
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-green-400 text-xs">Code Sent ✓</p>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`w-11 h-12 text-center text-lg font-mono bg-[#1A1A1A] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FFE000] ${otpError ? "border-red-500" : "border-[#333]"}`}
                  />
                ))}
              </div>
              {otpError && <p className="text-red-400 text-xs text-center">Invalid code. Try again.</p>}
              <p className="text-center text-xs">
                {resendTimer > 0 ? (
                  <span className="text-gray-600">Resend in {resendTimer}s</span>
                ) : (
                  <button onClick={handleSendCode} className="text-gray-400 hover:text-[#FFE000]">Resend code</button>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {phoneVerified && !idVerified && subStep === "phone" && (
        <div className="text-center py-4">
          <p className="text-green-400 font-bold">✓ Phone verified!</p>
        </div>
      )}

      {subStep === "id" && !idVerified && (
        <div className="space-y-4">
          <p className="text-white text-sm font-medium">Confirm your identity</p>
          <p className="text-gray-500 text-xs">
            Quick, secure ID check. Does not affect your credit score.
          </p>

          <RadioGroup value={idMethod} onValueChange={setIdMethod} className="space-y-3">
            {[
              { value: "gov-id", icon: Shield, label: "Government-Issued ID", desc: "Upload a photo of your driver's license, passport, or state ID." },
              { value: "selfie", icon: Camera, label: "Selfie Verification", desc: "Take or upload a selfie holding your ID next to your face." },
              { value: "social", icon: LinkIcon, label: "Social Media Verification", desc: "Verify via LinkedIn or Facebook with 50+ connections." },
            ].map(({ value, icon: Icon, label, desc }) => (
              <label key={value} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${idMethod === value ? "border-[#FFE000] bg-[#FFE000]/5" : "border-[#333] bg-[#242424]"}`}>
                <RadioGroupItem value={value} className="mt-1" />
                <div>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#FFE000]" />
                    <span className="text-white text-sm font-medium">{label}</span>
                    {value === "gov-id" && <span className="text-[10px] text-[#FFE000] bg-[#FFE000]/10 px-1.5 py-0.5 rounded">Recommended</span>}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </label>
            ))}
          </RadioGroup>

          {idMethod === "gov-id" && (
            <div className="grid grid-cols-2 gap-3">
              {["Front of ID", "Back of ID"].map((label) => (
                <label key={label} className="flex flex-col items-center justify-center h-28 border border-dashed border-[#333] rounded-xl cursor-pointer hover:border-[#FFE000]/50 transition-colors">
                  <Camera className="w-5 h-5 text-gray-600 mb-1" />
                  <span className="text-gray-600 text-[10px]">{label}</span>
                  <input type="file" accept="image/*,.pdf" className="hidden" />
                </label>
              ))}
            </div>
          )}

          {idMethod === "selfie" && (
            <label className="flex flex-col items-center justify-center h-28 border border-dashed border-[#333] rounded-xl cursor-pointer hover:border-[#FFE000]/50 transition-colors">
              <Camera className="w-5 h-5 text-gray-600 mb-1" />
              <span className="text-gray-600 text-[10px]">Upload selfie with ID</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          )}

          <div className="flex items-center gap-2 justify-center pt-2">
            <Lock className="w-3 h-3 text-[#FFE000]" />
            <p className="text-gray-600 text-[10px] italic">
              Your ID is encrypted and never stored after verification. AutoWurx is SOC 2 compliant.
            </p>
          </div>

          <Button
            onClick={handleIdSubmit}
            disabled={!idMethod}
            className="w-full bg-[#FFE000] text-black font-bold hover:bg-[#FFE000]/90 disabled:opacity-40 h-12"
          >
            Submit for Verification →
          </Button>
        </div>
      )}

      {idVerified && (
        <div className="text-center py-4">
          <p className="text-green-400 font-bold text-lg">✓ Identity Verified</p>
          <p className="text-gray-500 text-xs mt-1">You're all clear. Let's keep going.</p>
        </div>
      )}

      {/* Nav */}
      <div className="flex gap-3 pt-8">
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
  );
};

export default Step3Verify;
