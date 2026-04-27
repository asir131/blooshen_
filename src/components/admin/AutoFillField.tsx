import { ReactNode, useEffect, useRef, useState } from "react";
import { Lock as LockIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type FieldFillState = "manual" | "autofilled" | "edited" | "missing";

interface AutoFillFieldProps {
  /** Field key — used for stable React keys / labels. */
  name: string;
  label: string;
  required?: boolean;
  /** Whether this group of fields is locked (VIN not yet decoded). */
  locked?: boolean;
  /** Current fill state for this field. */
  state: FieldFillState;
  /** Optional helper text shown below the input. */
  helper?: string;
  /** Render-prop receives the autofill flash class name to attach to the input. */
  children: (props: { flashClassName: string; locked: boolean }) => ReactNode;
}

/**
 * Wrapper that:
 * - Shows a 🔒 overlay placeholder when locked
 * - Triggers a yellow flash whenever the state transitions to "autofilled"
 * - Renders the appropriate badge (Auto-filled / Edited / Missing)
 */
export function AutoFillField({
  name,
  label,
  required,
  locked,
  state,
  helper,
  children,
}: AutoFillFieldProps) {
  const prevState = useRef<FieldFillState>(state);
  const [flashKey, setFlashKey] = useState(0);

  useEffect(() => {
    if (prevState.current !== "autofilled" && state === "autofilled") {
      setFlashKey((k) => k + 1);
    }
    prevState.current = state;
  }, [state]);

  const flashClassName = flashKey > 0 ? "vin-autofill-flash" : "";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-xs font-heading uppercase tracking-wider">
          {label} {required && <span className="text-primary">*</span>}
        </Label>
        {!locked && state === "autofilled" && (
          <span className="rounded bg-success px-1.5 py-0.5 text-[10px] font-bold uppercase text-background">
            Auto-filled
          </span>
        )}
        {!locked && state === "edited" && (
          <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-background">
            Edited
          </span>
        )}
        {!locked && state === "missing" && (
          <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-300">
            Fill in
          </span>
        )}
      </div>

      {locked ? (
        <div
          className="flex h-10 w-full items-center justify-between rounded-md border border-dashed border-border bg-secondary/30 px-3 text-sm text-muted-foreground/80"
          aria-disabled
        >
          <span>Auto-fills after VIN entry</span>
          <LockIcon className="h-3.5 w-3.5" />
        </div>
      ) : (
        <div key={flashKey}>{children({ flashClassName, locked: false })}</div>
      )}

      {helper && !locked && <p className="text-xs text-muted-foreground">{helper}</p>}
    </div>
  );
}

export default AutoFillField;

/** Helper to derive a fill state for a field. */
export function deriveFillState(opts: {
  hasValue: boolean;
  wasAutofilled: boolean;
  edited: boolean;
  required?: boolean;
}): FieldFillState {
  if (opts.edited) return "edited";
  if (opts.wasAutofilled && opts.hasValue) return "autofilled";
  if (opts.required && !opts.hasValue) return "missing";
  return "manual";
}

// Keep cn referenced for downstream consumers using the same module.
void cn;
