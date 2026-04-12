import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BrokerFormData {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  cityState: string;
  zipCode: string;
  selfDescription: string;
  hearAbout: string;
  referredBefore: string;
  agreedToTerms: boolean;

  // Step 2
  profilePhoto: string | null;
  displayName: string;
  username: string;
  tagline: string;
  cityNeighborhood: string;
  bio: string;
  specialties: string[];
  coverPhoto: string | null;

  // Step 3
  phoneVerified: boolean;
  idVerified: boolean;
  idMethod: string;

  // Step 4
  connectedSocials: string[];
  whatsappNumber: string;
  payoutMethod: string;
  payoutHandle: string;
  payoutSchedule: string;
  featuredVehicles: { title: string; price: string; image: string }[];

  // Step 5
  reviewChecks: boolean[];
}

interface BrokerApplyState {
  currentStep: number;
  formData: BrokerFormData;
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<BrokerFormData>) => void;
  resetForm: () => void;
}

const initialFormData: BrokerFormData = {
  fullName: '',
  email: '',
  phone: '',
  cityState: '',
  zipCode: '',
  selfDescription: '',
  hearAbout: '',
  referredBefore: '',
  agreedToTerms: false,
  profilePhoto: null,
  displayName: '',
  username: '',
  tagline: '',
  cityNeighborhood: '',
  bio: '',
  specialties: [],
  coverPhoto: null,
  phoneVerified: false,
  idVerified: false,
  idMethod: '',
  connectedSocials: [],
  whatsappNumber: '',
  payoutMethod: '',
  payoutHandle: '',
  payoutSchedule: 'monthly',
  featuredVehicles: [],
  reviewChecks: [false, false, false, false, false],
};

export const useBrokerApplyStore = create<BrokerApplyState>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: { ...initialFormData },
      setCurrentStep: (step) => set({ currentStep: step }),
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetForm: () => set({ currentStep: 1, formData: { ...initialFormData } }),
    }),
    { name: 'broker-apply-store' }
  )
);
