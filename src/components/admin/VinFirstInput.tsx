import { useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from "react";
import { Loader2, Lock as LockIcon, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useVinDecode,
  type DecodedVehicleData,
  type VinDecodeStatus,
} from "@/hooks/useVinDecode";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/* Re-export legacy types so existing imports keep working. */
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
  raw?: Record<string, string>;
}

export interface VinFirstInputProps {
  value: string;
  onChange: (vin: string) => void;
  onDecoded: (decoded: DecodedVehicleData) => void;
  onStatusChange?: (status: VinStatus) => void;
  /** Listing id to ignore during duplicate check (edit mode). */
  ignoreListingId?: string | null;
  disabled?: boolean;
  /** Called when the user confirms the "Change VIN" flow. */
  onChangeVinRequested?: () => void;
}

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;
const ALLOWED_CHAR = /[A-HJ-NPR-Z0-9]/i;

/** Map our internal hook status onto the legacy VinStatus the form consumes. */
function toLegacyStatus(s: VinDecodeStatus, hasValue: boolean, len: number): VinStatus {
  if (s === "validating") return "validating";
  if (s === "duplicate") return "duplicate";
  if (s === "format_error") return "error-format";
  if (s === "not_found" || s === "timeout" || s === "offline" || s === "error") return "error-not-found";
  if (s === "success" || s === "partial") return "success";
  if (s === "typing") return "typing";
  if (!hasValue) return "idle";
  if (len < 17) return "typing";
  return "idle";
}

const STATUS_BAR_STYLES: Record<VinStatus, string> = {
  idle: "border-border bg-secondary/40 text-muted-foreground",
  typing: "border-border bg-secondary/40 text-muted-foreground",
  validating: "border-primary/40 bg-primary/10 text-primary animate-pulse",
  success: "border-success/40 bg-success/10 text-success",
  "error-format": "border-destructive/40 bg-destructive/10 text-destructive",
  "error-not-found": "border-amber-500/40 bg-amber-500/10 text-amber-300",
  duplicate: "border-destructive/40 bg-destructive/10 text-destructive",
};

export function VinFirstInput({
  value,
  onChange,
  onDecoded,
  onStatusChange,
  ignoreListingId,
  disabled,
  onChangeVinRequested,
}: VinFirstInputProps) {
  const decode = useVinDecode({ ignoreListingId });
  const [dots, setDots] = useState("");
  const [confirmChangeOpen, setConfirmChangeOpen] = useState(false);
  const lastLookupRef = useRef<string | null>(null);

  const legacyStatus = toLegacyStatus(decode.status, !!value, value.length);

  // Notify parent of status transitions
  useEffect(() => {
    onStatusChange?.(legacyStatus);
  }, [legacyStatus, onStatusChange]);

  // Animated dots while validating
  useEffect(() => {
    if (decode.status !== "validating") {
      setDots("");
      return;
    }
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 350);
    return () => clearInterval(id);
  }, [decode.status]);

  // Forward decoded payload up
  useEffect(() => {
    if (decode.data && (decode.status === "success" || decode.status === "partial")) {
      onDecoded(decode.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decode.data, decode.status]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\s+/g, "").toUpperCase();
    raw = raw
      .split("")
      .filter((c) => ALLOWED_CHAR.test(c))
      .join("")
      .slice(0, 17);

    onChange(raw);

    if (raw.length === 0) {
      decode.resetVin();
      lastLookupRef.current = null;
      return;
    }

    if (raw.length < 17) {
      decode.setTyping();
      lastLookupRef.current = null;
      return;
    }

    if (!VIN_REGEX.test(raw)) {
      // Hook will set format_error
      await decode.decodeVin(raw);
      return;
    }

    if (lastLookupRef.current === raw) return;
    lastLookupRef.current = raw;
    await decode.decodeVin(raw);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
    if (!ALLOWED_CHAR.test(e.key)) e.preventDefault();
  };

  const handleConfirmChangeVin = () => {
    setConfirmChangeOpen(false);
    onChange("");
    decode.resetVin();
    lastLookupRef.current = null;
    onChangeVinRequested?.();
  };

  /* ----- Border color by state ----- */
  const borderClass =
    decode.status === "success" || decode.status === "partial"
      ? "border-success focus-visible:ring-success"
      : decode.status === "format_error" || decode.status === "duplicate"
        ? "border-destructive focus-visible:ring-destructive"
        : decode.status === "not_found" ||
            decode.status === "timeout" ||
            decode.status === "offline"
          ? "border-amber-500 focus-visible:ring-amber-500"
          : decode.status === "validating"
            ? "border-primary focus-visible:ring-primary"
            : "border-border focus-visible:ring-primary";

  /* ----- Status bar text ----- */
  let statusIcon = "";
  let statusText = "";
  switch (legacyStatus) {
    case "idle":
      statusText = "Enter your VIN to automatically populate vehicle details";
      break;
    case "typing":
      statusText = `Keep typing… (${value.length} / 17 characters)`;
      break;
    case "validating":
      statusIcon = "🔍";
      statusText = `Looking up VIN${dots}`;
      break;
    case "success":
      statusIcon = decode.status === "partial" ? "⚠️" : "✅";
      statusText =
        decode.status === "partial"
          ? "Some fields couldn't be auto-filled — please complete them manually"
          : "Vehicle identified — details filled below";
      break;
    case "error-format":
      statusIcon = "❌";
      statusText = "Invalid VIN format — VINs are 17 characters and cannot contain I, O, or Q";
      break;
    case "error-not-found":
      statusIcon = "⚠️";
      statusText =
        decode.status === "timeout"
          ? "VIN lookup timed out — fill in details manually"
          : decode.status === "offline"
            ? "No internet connection — fill details manually"
            : "VIN not found in NHTSA database — please fill details manually";
      break;
    case "duplicate":
      statusIcon = "🚫";
      statusText = "This VIN is already registered in AutoWurx — cannot create duplicate listing";
      break;
  }

  const isLocked =
    decode.status === "success" || decode.status === "partial" || decode.status === "duplicate";

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
          disabled={disabled || isLocked}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter 17-character VIN to auto-fill vehicle details"
          className={cn(
            "flex h-14 w-full rounded-md border bg-secondary pl-4 pr-28 font-mono text-base uppercase tracking-widest text-foreground ring-offset-background placeholder:text-muted-foreground placeholder:normal-case placeholder:tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
            isLocked ? "opacity-90" : "disabled:opacity-50",
            borderClass,
            decode.status === "validating" && "animate-pulse",
          )}
        />
        <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 font-mono text-xs text-muted-foreground">
          {decode.isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          {isLocked && <LockIcon className="h-3.5 w-3.5 text-success" />}
          <span>{value.length} / 17</span>
        </div>
      </div>

      {/* Status bar */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
          STATUS_BAR_STYLES[legacyStatus],
        )}
        role="status"
        aria-live="polite"
      >
        {statusIcon && <span aria-hidden>{statusIcon}</span>}
        <span>{statusText}</span>
      </div>

      {/* Change VIN affordance */}
      {isLocked && decode.status !== "duplicate" && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>VIN locked after decode.</span>
          <button
            type="button"
            onClick={() => setConfirmChangeOpen(true)}
            className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
          >
            <Pencil className="h-3 w-3" /> Change VIN
          </button>
        </div>
      )}

      <AlertDialog open={confirmChangeOpen} onOpenChange={setConfirmChangeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change VIN?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing the VIN will clear all auto-filled vehicle details. Any manual edits you made
              will also be lost. Continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmChangeVin}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Yes, change VIN
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default VinFirstInput;

// Keep Button import marked as used for future inline actions.
void Button;
