import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Check } from "lucide-react";

interface InviteBrokerModalProps {
  onClose: () => void;
}

const InviteBrokerModal = ({ onClose }: InviteBrokerModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState(
    "Hey! I think you'd make a great AutoWurx Neighborhood Broker. I'm inviting you to apply — it's free and you earn referral fees on every deal you help close. Check it out:"
  );
  const [source, setSource] = useState<"admin" | "broker">("admin");
  const [sent, setSent] = useState(false);

  const canSend = name.trim() && email.trim();

  if (sent) {
    return (
      <>
        <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-[#242424] rounded-xl border border-[hsl(var(--primary))] p-6 max-w-md w-full text-center">
            <div className="h-12 w-12 mx-auto mb-3 rounded-full bg-green-600/20 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-sm font-bold text-foreground mb-1">Invitation Sent!</p>
            <p className="text-xs text-muted-foreground mb-4">
              {email} will receive a link to apply.
            </p>
            <Button size="sm" onClick={onClose}>Done</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#242424] rounded-xl border border-[hsl(var(--primary))] p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-heading font-bold text-foreground">Invite Someone to Apply</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Full Name *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="bg-[#1a1a1a] border-[#333] text-xs" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Email Address *</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="bg-[#1a1a1a] border-[#333] text-xs" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">City, State</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Atlanta, GA" className="bg-[#1a1a1a] border-[#333] text-xs" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Personal Message</label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="bg-[#1a1a1a] border-[#333] text-xs min-h-[80px]" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Referral source</label>
              <div className="flex gap-3">
                {(["admin", "broker"] as const).map((s) => (
                  <label key={s} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="source" checked={source === s} onChange={() => setSource(s)} className="accent-[hsl(var(--primary))]" />
                    <span className="text-xs text-foreground capitalize">{s === "admin" ? "Admin invite" : "Broker referral"}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <Button variant="secondary" size="sm" onClick={onClose} className="text-xs flex-1">Cancel</Button>
            <Button size="sm" className="text-xs flex-1" disabled={!canSend} onClick={() => setSent(true)}>
              Send Invitation
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteBrokerModal;
