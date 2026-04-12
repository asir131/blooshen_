import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useBrokerApplyStore } from "@/stores/brokerApplyStore";

const Step5Review = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, setCurrentStep } = useBrokerApplyStore();
  const [checks, setChecks] = useState(formData.reviewChecks);
  const [submitting, setSubmitting] = useState(false);

  const toggleCheck = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  const allChecked = checks.every(Boolean);

  const handleSubmit = () => {
    updateFormData({ reviewChecks: checks });
    setSubmitting(true);
    // TODO: POST to /api/experts/submit-application
    setTimeout(() => {
      setCurrentStep(6);
      navigate("/experts/apply/approved");
    }, 2000);
  };

  const editStep = (step: number, route: string) => {
    setCurrentStep(step);
    navigate(route);
  };

  if (submitting) {
    return (
      <div className="max-w-[560px] mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-3 border-[#FFE000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white font-bold">Submitting your application...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[680px] mx-auto px-4 py-12">
      <h2 className="text-2xl font-heading font-bold text-white mb-1">Review Your Application</h2>
      <p className="text-gray-500 text-sm mb-8">Check everything over before you submit.</p>

      <div className="space-y-4">
        {/* Profile Card */}
        <div className="bg-[#242424] border-t-[3px] border-t-[#FFE000] border border-[#333] rounded-xl p-5 relative">
          <button onClick={() => editStep(2, "/experts/apply/profile")} className="absolute top-4 right-4 text-gray-500 hover:text-[#FFE000]">
            <Pencil className="w-4 h-4" />
          </button>
          <h3 className="text-white text-sm font-bold mb-3">Your Profile</h3>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-[#333] shrink-0" />
            <div>
              <p className="text-white text-sm font-medium">{formData.displayName || "—"}</p>
              <p className="text-gray-500 text-xs">autowurx.com/experts/{formData.username || "—"}</p>
              <p className="text-gray-500 text-xs italic mt-0.5">{formData.tagline || "—"}</p>
              <p className="text-gray-600 text-xs mt-1">{formData.cityNeighborhood}</p>
              <p className="text-gray-600 text-xs mt-1 line-clamp-2">{formData.bio}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.specialties.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-full text-[10px] border border-[#FFE000] text-[#FFE000]">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="bg-[#242424] border border-[#333] rounded-xl p-5 relative">
          <button onClick={() => editStep(3, "/experts/apply/verify")} className="absolute top-4 right-4 text-gray-500 hover:text-[#FFE000]">
            <Pencil className="w-4 h-4" />
          </button>
          <h3 className="text-white text-sm font-bold mb-3">Verification Status</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full ${formData.phoneVerified ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"}`}>
                {formData.phoneVerified ? "✓ Verified" : "⚠ Pending"}
              </span>
              <span className="text-gray-500 text-xs">Phone ···{formData.phone.slice(-4)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full ${formData.idVerified ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"}`}>
                {formData.idVerified ? "✓ Verified" : "⚠ Pending"}
              </span>
              <span className="text-gray-500 text-xs">ID Check</span>
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="bg-[#242424] border border-[#333] rounded-xl p-5 relative">
          <button onClick={() => editStep(4, "/experts/apply/connect")} className="absolute top-4 right-4 text-gray-500 hover:text-[#FFE000]">
            <Pencil className="w-4 h-4" />
          </button>
          <h3 className="text-white text-sm font-bold mb-3">Connected Accounts</h3>
          <div className="flex gap-3 mb-2">
            {["instagram", "facebook", "x", "tiktok", "youtube"].map((p) => (
              <div key={p} className={`w-2 h-2 rounded-full ${formData.connectedSocials.includes(p) ? "bg-green-400" : "bg-gray-600"}`} />
            ))}
          </div>
          {formData.payoutMethod && (
            <p className="text-gray-500 text-xs">
              Payout: {formData.payoutMethod} {formData.payoutHandle && `· ${formData.payoutHandle}`} · {formData.payoutSchedule} payouts
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="bg-[#242424] border border-[#FFE000] rounded-xl p-5 space-y-3">
          {[
            "I confirm all information provided is accurate and truthful.",
            "I understand that AutoWurx will verify my identity and may contact me for additional information.",
            "I agree to the Broker Code of Conduct — I will always act in buyers' best interests.",
            "I understand referral fees are paid only on verified completed transactions.",
            "I consent to AutoWurx displaying my profile publicly at autowurx.com/experts/" + (formData.username || "[username]") + ".",
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-2">
              <Checkbox checked={checks[i]} onCheckedChange={() => toggleCheck(i)} className="mt-0.5" />
              <span className="text-gray-400 text-xs leading-relaxed">{text}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!allChecked}
          className="w-full bg-[#FFE000] text-black font-bold hover:bg-[#FFE000]/90 disabled:opacity-40 h-12 text-sm"
        >
          Submit My Application →
        </Button>

        <p className="text-center text-gray-600 text-xs">
          Questions? Email brokers@autowurx.com
        </p>
      </div>

      <div className="pt-6">
        <Button variant="outline" onClick={() => editStep(4, "/experts/apply/connect")} className="border-[#333] text-gray-400 hover:bg-[#333]">
          Back
        </Button>
      </div>
    </div>
  );
};

export default Step5Review;
