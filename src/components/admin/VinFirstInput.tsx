import { useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export type VinStatus =
  | "idle"
  | "typing"
  | "validating"
  | "success"
  | "error-format"
  | "error-not-found"
  | "duplicate";

export interface DecodedVin {
  vin: string;
  make?: string;
  model?: string;
  year?: number;
  body_style?: string;
  // raw NHTSA results, in case caller wants more
  raw?: Record<string, string>;
}

interface VinFirstInputProps {
  value: string;
  onChange: (vin: string) => void;
  onDecoded: (decoded: DecodedVin) => void;
  onStatusChange?: (status: VinStatus) => void;
  /** Listing id to ignore when running the duplicate check (edit mode). */
  ignoreListingId?: string | null;
  disabled?: boolean;
}

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;
const ALLOWED_CHAR = /[A-HJ-NPR-Z0-9]/i;

const STATUS_COPY: Record<VinStatus, { text: string; tone: string; icon?: string }> = {
  idle: {
    text: "Enter your VIN to automatically populate vehicle details",
    tone: "text-muted-foreground",
  },
  typing: { text: "Keep typing…", tone: "text-muted-foreground" },
  validating: { text: "Looking up VIN", tone: "text-primary", icon: "🔍" },
  success: {
    text: "Vehicle identified — details filled below",
    tone: "text-green-500",
    icon: "✅",
  },
  "error-format": {
    text: "Invalid VIN format — VINs are 17 characters and cannot contain I, O, or Q",
    tone: "text-destructive",
    icon: "❌",
  },
  "error-not-found": {
    text: "VIN not found in NHTSA database — please fill details manually",
    tone: "text-amber-500",
    icon: "⚠️",
  },
  duplicate: {
    text: "This VIN is already registered in AutoWurx — cannot create duplicate listing",
    tone: "text-destructive",
    icon: "🚫",
  },
};

export function VinFirstInput({
  value,
  onChange,
  onDecoded,
  onStatusChange,
  ignoreListingId,
  disabled,
}: VinFirstInputProps) {
  const [status, setStatus] = useState<VinStatus>("idle");
  const [dots, setDots] = useState("");
  const lastLookupRef = useRef<string | null>(null);

  // Animated dots while validating
  useEffect(() => {
    if (status !== "validating") {
      setDots("");
      return;
    }
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 350);
    return () => clearInterval(id);
  }, [status]);

  const updateStatus = (next: VinStatus) => {
    setStatus(next);
    onStatusChange?.(next);
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\s+/g, "").toUpperCase();
    // Drop any disallowed characters defensively
    raw = raw
      .split("")
      .filter((c) => ALLOWED_CHAR.test(c))
      .join("")
      .slice(0, 17);

    onChange(raw);

    if (raw.length === 0) {
      updateStatus("idle");
      lastLookupRef.current = null;
      return;
    }

    if (raw.length < 17) {
      updateStatus("typing");
      lastLookupRef.current = null;
      return;
    }

    if (!VIN_REGEX.test(raw)) {
      updateStatus("error-format");
      return;
    }

    if (lastLookupRef.current === raw) return;
    lastLookupRef.current = raw;
    await runLookup(raw);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Allow control keys
    if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
    if (!ALLOWED_CHAR.test(e.key)) {
      e.preventDefault();
    }
  };

  const runLookup = async (vin: string) => {
    updateStatus("validating");

    // Step 1: Duplicate check
    try {
      let q = supabase
        .from("vehicle_listings")
        .select("id")
        .eq("vin", vin)
        .limit(1);
      if (ignoreListingId) q = q.neq("id", ignoreListingId);
      const { data: dupRows } = await q;
      if (dupRows && dupRows.length > 0) {
        updateStatus("duplicate");
        return;
      }
    } catch {
      // Non-fatal — continue to NHTSA
    }

    // Step 2: NHTSA decode
    try {
      const res = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`,
      );
      const json = (await res.json()) as { Results?: Record<string, string>[] };
      const r = json.Results?.[0];
      if (!r) {
        updateStatus("error-not-found");
        return;
      }
      const make = (r.Make || "").trim();
      const model = (r.Model || "").trim();
      const yearStr = (r.ModelYear || "").trim();
      const year = yearStr ? Number(yearStr) : undefined;
      const body_style = (r.BodyClass || "").trim();
      const errorCode = (r.ErrorCode || "").trim();

      // NHTSA returns ErrorCode "0" on a clean decode. Anything else means partial/invalid.
      if (!make || !model || !year || (errorCode && errorCode !== "0")) {
        updateStatus("error-not-found");
        return;
      }

      onDecoded({ vin, make, model, year, body_style, raw: r });
      updateStatus("success");
    } catch {
      updateStatus("error-not-found");
    }
  };

  const borderClass =
    status === "success"
      ? "border-green-500 focus-visible:ring-green-500"
      : status === "error-format" || status === "duplicate"
        ? "border-destructive focus-visible:ring-destructive"
        : status === "error-not-found"
          ? "border-amber-500 focus-visible:ring-amber-500"
          : "border-border focus-visible:ring-primary";

  const statusCopy = STATUS_COPY[status];
  const statusText =
    status === "validating"
      ? `${statusCopy.icon ?? ""} ${statusCopy.text}${dots}`
      : status === "typing"
        ? `Keep typing… (${value.length} / 17 characters)`
        : statusCopy.icon
          ? `${statusCopy.icon} ${statusCopy.text}`
          : statusCopy.text;

  return (
    <div className="space-y-2">
      <label
        htmlFor="vin-first"
        className="block font-heading text-sm uppercase text-primary"
        style={{ letterSpacing: "2px" }}
      >
        VIN Number
      </label>
      <div className="relative">
        <input
          id="vin-first"
          type="text"
          autoComplete="off"
          spellCheck={false}
          maxLength={17}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter 17-character VIN to auto-fill vehicle details"
          className={cn(
            "flex h-14 w-full rounded-md border bg-secondary pl-4 pr-28 font-mono text-base uppercase tracking-widest text-foreground ring-offset-background placeholder:text-muted-foreground placeholder:normal-case placeholder:tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            borderClass,
          )}
        />
        <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 font-mono text-xs text-muted-foreground">
          {status === "validating" && (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          )}
          <span>{value.length} / 17</span>
        </div>
      </div>
      <div
        className={cn(
          "text-sm",
          statusCopy.tone,
          status === "validating" && "animate-pulse",
        )}
        role="status"
        aria-live="polite"
      >
        {statusText}
      </div>
    </div>
  );
}

export default VinFirstInput;
