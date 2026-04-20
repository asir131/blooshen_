import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ListingCategory = Database["public"]["Enums"]["listing_category_enum"];

export const useWatchlist = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["watchlist", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("watchlist")
        .select("listing_id, listing_category");
      if (error) throw error;
      return new Set((data ?? []).map((r) => `${r.listing_category}:${r.listing_id}`));
    },
  });
};

export const useIsWatched = (listingId: string, category: ListingCategory) => {
  const { data } = useWatchlist();
  return data?.has(`${category}:${listingId}`) ?? false;
};

export const useToggleWatch = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      listingId,
      category,
      watched,
    }: {
      listingId: string;
      category: ListingCategory;
      watched: boolean;
    }) => {
      if (!user) throw new Error("Not signed in");
      if (watched) {
        const { error } = await supabase
          .from("watchlist")
          .delete()
          .eq("user_id", user.id)
          .eq("listing_id", listingId)
          .eq("listing_category", category);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("watchlist").insert({
          user_id: user.id,
          listing_id: listingId,
          listing_category: category,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist", user?.id] });
    },
    onError: (err: any) => {
      toast({
        title: "Could not update watchlist",
        description: err.message ?? "Please sign in and try again.",
        variant: "destructive",
      });
    },
  });
};
