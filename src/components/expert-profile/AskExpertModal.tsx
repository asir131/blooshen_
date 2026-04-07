import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { FeaturedVehicle, ExpertProfile } from "@/data/mockExpertProfile";

interface AskExpertModalProps {
  open: boolean;
  onClose: () => void;
  vehicle: FeaturedVehicle | null;
  expert: ExpertProfile;
}

export default function AskExpertModal({ open, onClose, vehicle, expert }: AskExpertModalProps) {
  const [message, setMessage] = useState("");

  if (!vehicle) return null;

  const subject = `${vehicle.year} ${vehicle.make} ${vehicle.model} (Listing #${vehicle.listing_id})`;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Ask {expert.display_name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Send a message about this vehicle
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">To</label>
            <Input readOnly value={expert.display_name} className="bg-muted border-border" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Re</label>
            <Input readOnly value={subject} className="bg-muted border-border" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Your Message</label>
            <Textarea
              placeholder={`Hi ${expert.display_name.split(" ")[0]}, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          <Button className="w-full" onClick={onClose}>
            Send Message
          </Button>
          <p className="text-[10px] text-muted-foreground text-center">
            {/* Sending fires affiliate attribution: promoter_id: {expert.affiliate_id}, listing_id: {vehicle.listing_id}, source: expert_profile_ask */}
            Your message will be sent to {expert.display_name}'s inbox.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
