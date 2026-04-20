import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BrokerApplication, ApplicationStatus } from "@/data/mockBrokerApplications";

type Row = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  distance_mi: number | null;
  source: "Organic" | "Referral" | "Social";
  status: ApplicationStatus;
  step_reached: number;
  score: number;
  score_breakdown: Record<string, number>;
  username: string | null;
  tagline: string | null;
  bio: string | null;
  specialties: string[];
  self_description: string | null;
  heard_from: string | null;
  prior_referral: string | null;
  phone_verified: boolean;
  phone_verified_at: string | null;
  id_verified: boolean;
  id_method: string | null;
  id_verified_at: string | null;
  id_confidence: number | null;
  connected_socials: string[];
  payout_method: string | null;
  payout_schedule: string;
  featured_vehicles: number;
  avatar_url: string | null;
  banner_url: string | null;
  badge_tier: "Starter" | "Pro" | "Elite" | "Legend";
  admin_notes: { admin: string; note: string; createdAt: string }[];
  activity_log: { event: string; timestamp: string }[];
  applied_at: string;
};

const daysSince = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const toApplication = (r: Row): BrokerApplication => ({
  id: r.id,
  name: r.name,
  email: r.email,
  phone: r.phone ?? "",
  city: r.city ?? "",
  state: r.state ?? "",
  zip: r.zip ?? "",
  distanceMi: r.distance_mi ?? 0,
  appliedDate: formatDate(r.applied_at),
  daysAgo: daysSince(r.applied_at),
  source: r.source,
  status: r.status,
  stepReached: r.step_reached,
  score: r.score,
  scoreBreakdown: {
    profileCompleteness: r.score_breakdown?.profileCompleteness ?? 0,
    bioQuality: r.score_breakdown?.bioQuality ?? 0,
    specialties: r.score_breakdown?.specialties ?? 0,
    identityVerified: r.score_breakdown?.identityVerified ?? 0,
    socialConnected: r.score_breakdown?.socialConnected ?? 0,
  },
  username: r.username ?? "",
  tagline: r.tagline ?? "",
  bio: r.bio ?? "",
  specialties: r.specialties ?? [],
  selfDescription: r.self_description ?? "",
  heardFrom: r.heard_from ?? "",
  priorReferral: r.prior_referral ?? "",
  phoneVerified: r.phone_verified,
  phoneVerifiedAt: r.phone_verified_at,
  idVerified: r.id_verified,
  idMethod: r.id_method,
  idVerifiedAt: r.id_verified_at,
  idConfidence: r.id_confidence,
  connectedSocials: r.connected_socials ?? [],
  payoutMethod: r.payout_method,
  payoutSchedule: r.payout_schedule,
  featuredVehicles: r.featured_vehicles,
  avatarUrl: r.avatar_url,
  bannerUrl: r.banner_url,
  badgeTier: r.badge_tier,
  adminNotes: r.admin_notes ?? [],
  activityLog: r.activity_log ?? [],
});

export const useBrokerApplications = () => {
  return useQuery({
    queryKey: ["broker_applications"],
    queryFn: async (): Promise<BrokerApplication[]> => {
      const { data, error } = await supabase
        .from("broker_applications")
        .select("*")
        .order("applied_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as Row[]).map(toApplication);
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const { error } = await supabase
        .from("broker_applications")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["broker_applications"] });
    },
  });
};
