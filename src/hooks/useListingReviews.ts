import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ListingCategory = Database["public"]["Enums"]["listing_category_enum"];

export interface ListingReview {
  id: string;
  user_id: string;
  listing_id: string;
  listing_category: ListingCategory;
  rating: number;
  comment: string | null;
  created_at: string;
  author?: { display_name: string | null; avatar_url: string | null } | null;
}

export const useListingReviews = (listingId: string, category: ListingCategory) => {
  return useQuery({
    queryKey: ["listing_reviews", category, listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listing_reviews")
        .select("*")
        .eq("listing_id", listingId)
        .eq("listing_category", category)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const rows = (data ?? []) as ListingReview[];
      const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
      if (userIds.length) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, display_name, avatar_url")
          .in("user_id", userIds);
        const map = new Map(profiles?.map((p) => [p.user_id, p]));
        return rows.map((r) => ({
          ...r,
          author: map.get(r.user_id) ?? null,
        }));
      }
      return rows;
    },
  });
};

export const useSubmitReview = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      listingId,
      category,
      rating,
      comment,
    }: {
      listingId: string;
      category: ListingCategory;
      rating: number;
      comment: string;
    }) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("listing_reviews")
        .upsert(
          {
            user_id: user.id,
            listing_id: listingId,
            listing_category: category,
            rating,
            comment: comment.trim() || null,
          },
          { onConflict: "user_id,listing_id,listing_category" },
        );
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["listing_reviews", vars.category, vars.listingId] });
      toast({ title: "Review submitted", description: "Thanks for sharing your feedback." });
    },
    onError: (err: any) => {
      toast({
        title: "Could not submit review",
        description: err.message ?? "Please sign in and try again.",
        variant: "destructive",
      });
    },
  });
};
