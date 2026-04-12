import { Check } from "lucide-react";
import { useBrokerApplyStore } from "@/stores/brokerApplyStore";

const stepLabels = [
  "Eligibility Check",
  "Build Your Profile",
  "Verify Your Identity",
  "Connect Your Accounts",
  "Review & Submit",
  "You're Approved!",
];

const ApplyWizardShell = ({ children }: { children: React.ReactNode }) => {
  const { currentStep } = useBrokerApplyStore();

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-[#242424] border-b border-[#333] px-5 py-3.5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <span className="font-heading text-[#FFE000] font-bold text-lg tracking-wider hidden sm:block">A</span>

          {/* Step pills */}
          <div className="flex items-center gap-0 flex-1 justify-center px-4">
            {stepLabels.map((_, i) => {
              const stepNum = i + 1;
              const completed = stepNum < currentStep;
              const active = stepNum === currentStep;
              return (
                <div key={i} className="flex items-center">
                  {i > 0 && (
                    <div
                      className={`w-6 sm:w-10 h-0.5 ${completed ? "bg-[#FFE000]" : "bg-[#333]"}`}
                    />
                  )}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      completed
                        ? "bg-[#FFE000] text-[#1A1A1A]"
                        : active
                        ? "bg-[#FFE000] text-white"
                        : "bg-[#333] text-gray-500"
                    }`}
                  >
                    {completed ? <Check className="w-3.5 h-3.5" /> : stepNum}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save & Exit */}
          <a href="/" className="text-gray-500 hover:text-gray-300 text-xs whitespace-nowrap hidden sm:block">
            Save & Exit
          </a>
        </div>

        {/* Step label */}
        <p className="text-center text-gray-500 text-xs mt-2">
          {stepLabels[currentStep - 1]}
        </p>
      </div>

      {/* Content */}
      <div className="motion-safe:animate-fade-in">{children}</div>
    </div>
  );
};

export default ApplyWizardShell;
