import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Share2, Copy, Check, DollarSign, MessageSquare, Facebook, Twitter, Instagram, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { usePromoterProfile } from "@/hooks/usePromoterProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type ListingCategory = Database["public"]["Enums"]["listing_category_enum"];

interface ShareEarnButtonProps {
  listingId: string;
  listingPath: string;
  category: ListingCategory;
  /** "card" = small icon on card corner, "detail" = full-width CTA, "floating" = fixed FAB */
  variant?: "card" | "detail" | "floating";
}

const COMMISSION_LABEL: Record<ListingCategory, string> = {
  cars_for_sale: "$25 per lead · $150 on sale",
  parts_accessories: "8% of sale price",
  service_providers: "$10 per lead · $35 per booking",
  rentals: "12% of booking value",
  neighborhood_experts: "$8 per contact",
  events_meetups: "$5 per RSVP · $20 per ticket",
};

const COMMISSION_SHORT: Record<ListingCategory, string> = {
  cars_for_sale: "$25–$150",
  parts_accessories: "8%",
  service_providers: "$10–$35",
  rentals: "12%",
  neighborhood_experts: "$8",
  events_meetups: "$5–$20",
};

const CATEGORY_LABELS: Record<ListingCategory, string> = {
  cars_for_sale: "Cars for Sale",
  parts_accessories: "Parts & Accessories",
  service_providers: "Service Providers",
  rentals: "Rentals",
  neighborhood_experts: "Neighborhood Experts",
  events_meetups: "Events & Meetups",
};

const ShareEarnButton = ({ listingId, listingPath, category, variant = "card" }: ShareEarnButtonProps) => {
  const { data: profile } = usePromoterProfile();
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  const referralUrl = profile
    ? `${window.location.origin}${listingPath}?ref=${profile.promoter_code}`
    : `${window.location.origin}${listingPath}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSignup = async () => {
    if (!signupEmail.trim()) return;
    setSignupLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email: signupEmail.trim() });
    setSignupLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email for a magic link!");
    }
  };

  const shareToSMS = () => {
    window.open(`sms:?body=${encodeURIComponent(`Check this out on AutoWurx: ${referralUrl}`)}`, "_blank");
  };
  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`, "_blank", "width=600,height=400");
  };
  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent("Check this out on AutoWurx!")}`, "_blank", "width=600,height=400");
  };
  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check this out on AutoWurx: ${referralUrl}`)}`, "_blank");
  };
  const shareToInstagram = () => {
    navigator.clipboard.writeText(referralUrl);
    toast.success("Link copied — paste it in your Instagram story or bio!");
  };

  /* ─── Not logged in modal content ─── */
  const signupContent = (
    <div className="space-y-5 pt-2">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <DollarSign className="h-7 w-7 text-primary" />
        </div>
        <h3 className="font-heading text-lg font-bold text-foreground">Sign up free to start earning</h3>
        <p className="text-sm text-muted-foreground font-body mt-1">
          Earn <span className="text-primary font-bold">{COMMISSION_SHORT[category]}</span> when someone you refer converts.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-1">
        <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Commission for {CATEGORY_LABELS[category]}</p>
        <p className="text-sm font-body font-medium text-foreground">{COMMISSION_LABEL[category]}</p>
      </div>
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSignup()}
        />
        <Button className="w-full" onClick={handleSignup} disabled={signupLoading}>
          {signupLoading ? "Sending…" : "Get Started — It's Free"}
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground text-center font-body">
        We'll send you a magic link. No password needed.
      </p>
    </div>
  );

  /* ─── Logged in modal content ─── */
  const shareContent = (
    <div className="space-y-5 pt-2">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <Check className="h-7 w-7 text-primary" />
        </div>
        <h3 className="font-heading text-lg font-bold text-foreground">Your affiliate link is ready</h3>
      </div>

      {/* Referral URL */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground font-heading uppercase tracking-wider">Your Tracking URL</label>
        <div className="flex gap-2">
          <Input
            readOnly
            value={referralUrl}
            className="text-xs font-body"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <Button size="sm" onClick={handleCopy} className="gap-1.5 shrink-0 min-w-[100px]">
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </div>

      {/* Social sharing */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground font-heading uppercase tracking-wider">Share To</label>
        <div className="flex items-center gap-2">
          <button onClick={shareToSMS} className="h-11 w-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors" title="Text/SMS">
            <Phone className="h-5 w-5 text-foreground" />
          </button>
          <button onClick={shareToFacebook} className="h-11 w-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors" title="Facebook">
            <Facebook className="h-5 w-5 text-foreground" />
          </button>
          <button onClick={shareToTwitter} className="h-11 w-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors" title="X (Twitter)">
            <Twitter className="h-5 w-5 text-foreground" />
          </button>
          <button onClick={shareToInstagram} className="h-11 w-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors" title="Instagram (copy link)">
            <Instagram className="h-5 w-5 text-foreground" />
          </button>
          <button onClick={shareToWhatsApp} className="h-11 w-11 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors" title="WhatsApp">
            <MessageSquare className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Earnings callout */}
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="h-4 w-4 text-primary" />
          <span className="font-heading text-sm font-bold text-foreground">Potential Earnings</span>
        </div>
        <p className="text-sm font-body text-foreground">
          Earn <span className="font-bold text-primary">{COMMISSION_LABEL[category]}</span> if this listing converts.
        </p>
        <p className="text-xs text-muted-foreground font-body mt-1">30-day cookie attribution window.</p>
      </div>

      {/* Link to dashboard */}
      <Link
        to="/dashboard/affiliates"
        className="flex items-center justify-center gap-2 text-sm font-heading font-bold text-primary hover:underline"
      >
        <ExternalLink className="h-4 w-4" /> View all your earnings
      </Link>
    </div>
  );

  const modalContent = isLoggedIn ? shareContent : signupContent;

  /* ─── Card variant: small icon in top-right ─── */
  if (variant === "card") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md bg-background/90 backdrop-blur-sm px-2 py-1.5 text-[10px] font-heading font-bold uppercase tracking-wider text-foreground hover:bg-primary hover:text-primary-foreground transition-colors min-h-[32px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="h-3.5 w-3.5" />
            Earn
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" /> Share & Earn
            </DialogTitle>
          </DialogHeader>
          {modalContent}
        </DialogContent>
      </Dialog>
    );
  }

  /* ─── Detail variant: full-width CTA button ─── */
  if (variant === "detail") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="w-full gap-2 text-sm">
            <Share2 className="h-4 w-4" />
            Share This Listing & Earn {COMMISSION_SHORT[category]}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" /> Share & Earn
            </DialogTitle>
          </DialogHeader>
          {modalContent}
        </DialogContent>
      </Dialog>
    );
  }

  /* ─── Floating variant: persistent FAB ─── */
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="fixed bottom-24 md:bottom-8 right-4 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-heading text-sm font-bold text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all">
          <DollarSign className="h-5 w-5" />
          Refer & Earn
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" /> Share & Earn
          </DialogTitle>
        </DialogHeader>
        {modalContent}
      </DialogContent>
    </Dialog>
  );
};

export default ShareEarnButton;
