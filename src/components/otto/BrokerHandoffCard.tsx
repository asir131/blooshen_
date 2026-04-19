import { useEffect, useState } from "react";
import { Star, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Expert {
  id: string;
  name: string;
  username: string | null;
  photo_url: string | null;
  tagline: string | null;
  specialties: string[] | null;
  city: string | null;
  state: string | null;
  rating: number | null;
  response_time_hours: number | null;
  is_verified: boolean | null;
}

interface BrokerHandoffCardProps {
  preferredSpecialties?: string[];
}

export function BrokerHandoffCard({ preferredSpecialties }: BrokerHandoffCardProps) {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let query = supabase
        .from("experts")
        .select(
          "id,name,username,photo_url,tagline,specialties,city,state,rating,response_time_hours,is_verified",
        )
        .eq("is_active", true)
        .order("rating", { ascending: false })
        .order("response_time_hours", { ascending: true })
        .limit(1);

      if (preferredSpecialties?.length) {
        query = query.overlaps("specialties", preferredSpecialties);
      }

      const { data, error } = await query;
      if (cancelled) return;
      if (error || !data?.length) {
        // Fallback: any active expert
        const { data: any } = await supabase
          .from("experts")
          .select(
            "id,name,username,photo_url,tagline,specialties,city,state,rating,response_time_hours,is_verified",
          )
          .eq("is_active", true)
          .order("rating", { ascending: false })
          .limit(1);
        setExpert(any?.[0] ?? null);
      } else {
        setExpert(data[0]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [preferredSpecialties?.join(",")]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground">
        Finding the best broker for you…
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="rounded-xl border border-border bg-card p-3 space-y-2">
        <p className="text-xs text-foreground">
          No brokers available in your area right now. Want me to add you to the waitlist?
        </p>
        <Button
          size="sm"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => navigate("/find-my-broker")}
        >
          Join Waitlist
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/60 bg-card p-3 space-y-3">
      <div className="flex gap-3">
        <div className="shrink-0 w-12 h-12 rounded-full bg-muted ring-2 ring-primary overflow-hidden flex items-center justify-center text-sm font-bold text-primary">
          {expert.photo_url ? (
            <img src={expert.photo_url} alt={expert.name} className="w-full h-full object-cover" />
          ) : (
            expert.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold text-foreground truncate">{expert.name}</p>
            {expert.is_verified && (
              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {expert.rating?.toFixed(1) ?? "—"}
            </span>
            <span className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" />~{expert.response_time_hours ?? 1}h
            </span>
            {expert.city && (
              <span className="flex items-center gap-0.5 truncate">
                <MapPin className="h-3 w-3" />
                {expert.city}, {expert.state}
              </span>
            )}
          </div>
          {expert.tagline && (
            <p className="mt-0.5 text-[11px] text-muted-foreground truncate">{expert.tagline}</p>
          )}
        </div>
      </div>

      {expert.specialties && expert.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {expert.specialties.slice(0, 3).map((s) => (
            <Badge
              key={s}
              variant="outline"
              className="text-[10px] border-primary/40 text-primary"
            >
              {s.replace(/_/g, " ")}
            </Badge>
          ))}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">
        I'll send {expert.name.split(" ")[0]} a summary so you don't have to start from scratch.
      </p>

      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() =>
            navigate(
              expert.username ? `/experts/${expert.username}` : "/find-my-broker",
            )
          }
        >
          Connect Now
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-primary/50 text-primary hover:bg-primary/10"
          onClick={() => navigate("/find-my-broker")}
        >
          Choose another
        </Button>
      </div>
    </div>
  );
}
