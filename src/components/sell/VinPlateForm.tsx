import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC"
];

interface VinPlateFormProps {
  onSubmit?: (data: { type: "plate" | "vin"; value: string; state?: string }) => void;
  compact?: boolean;
}

const VinPlateForm = ({ onSubmit, compact }: VinPlateFormProps) => {
  const [tab, setTab] = useState<"plate" | "vin">("plate");
  const [value, setValue] = useState("");
  const [state, setState] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ type: tab, value, state: tab === "plate" ? state : undefined });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "bg-card border border-primary rounded-2xl mx-auto w-full",
        compact ? "max-w-md p-4" : "max-w-[560px] p-6 md:p-8"
      )}
    >
      {/* Tabs */}
      <div className="flex border-b border-border mb-5">
        {(["plate", "vin"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setValue(""); }}
            className={cn(
              "flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-colors",
              tab === t
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "plate" ? "License Plate" : "VIN Number"}
          </button>
        ))}
      </div>

      {/* State selector for plate tab */}
      {tab === "plate" && (
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full mb-3 rounded-lg bg-secondary border border-border text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select State</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}

      {/* Input */}
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={tab === "plate" ? "Enter license plate number" : "Enter 17-character VIN"}
        className="mb-4 bg-secondary border-border h-12 text-foreground placeholder:text-muted-foreground"
      />

      {/* CTA */}
      <Button
        type="submit"
        className="w-full h-12 bg-primary text-primary-foreground font-bold text-base rounded-lg hover:scale-[1.02] transition-transform"
      >
        Get My Cash Offer →
      </Button>

      {/* Sign in link */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        Already have a listing?{" "}
        <Link to="/login" className="text-primary underline hover:text-primary/80">
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default VinPlateForm;
