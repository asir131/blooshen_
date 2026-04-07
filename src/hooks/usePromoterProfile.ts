import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePromoterProfile() {
  return useQuery({
    queryKey: ["promoter-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("promoter_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}

export function usePromoterCommissions() {
  return useQuery({
    queryKey: ["promoter-commissions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: profile } = await supabase
        .from("promoter_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile) return [];

      const { data, error } = await supabase
        .from("commissions")
        .select("*")
        .eq("promoter_id", profile.id)
        .order("converted_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function usePromoterClicks() {
  return useQuery({
    queryKey: ["promoter-clicks"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: profile } = await supabase
        .from("promoter_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile) return [];

      const { data, error } = await supabase
        .from("referral_clicks")
        .select("*")
        .eq("promoter_id", profile.id)
        .order("clicked_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data ?? [];
    },
  });
}
