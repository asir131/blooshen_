import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import ApplyWizardShell from "@/components/broker-apply/ApplyWizardShell";
import Step1Eligibility from "@/components/broker-apply/Step1Eligibility";
import Step2Profile from "@/components/broker-apply/Step2Profile";
import Step3Verify from "@/components/broker-apply/Step3Verify";
import Step4Connect from "@/components/broker-apply/Step4Connect";
import Step5Review from "@/components/broker-apply/Step5Review";
import Step6Approved from "@/components/broker-apply/Step6Approved";
import { useBrokerApplyStore } from "@/stores/brokerApplyStore";

const stepRoutes: Record<number, string> = {
  1: "/experts/apply",
  2: "/experts/apply/profile",
  3: "/experts/apply/verify",
  4: "/experts/apply/connect",
  5: "/experts/apply/review",
  6: "/experts/apply/approved",
};

const routeToStep: Record<string, number> = {
  "/experts/apply": 1,
  "/experts/apply/profile": 2,
  "/experts/apply/verify": 3,
  "/experts/apply/connect": 4,
  "/experts/apply/review": 5,
  "/experts/apply/approved": 6,
};

const BrokerApply = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentStep, setCurrentStep } = useBrokerApplyStore();

  // Sync step from URL on mount
  useEffect(() => {
    const step = routeToStep[location.pathname];
    if (step && step !== currentStep) {
      setCurrentStep(step);
    }
  }, [location.pathname]);

  return (
    <ApplyWizardShell>
      <Routes>
        <Route index element={<Step1Eligibility />} />
        <Route path="profile" element={<Step2Profile />} />
        <Route path="verify" element={<Step3Verify />} />
        <Route path="connect" element={<Step4Connect />} />
        <Route path="review" element={<Step5Review />} />
        <Route path="approved" element={<Step6Approved />} />
      </Routes>
    </ApplyWizardShell>
  );
};

export default BrokerApply;
