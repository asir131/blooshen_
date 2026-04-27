import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyVinProps {
  vin: string;
  className?: string;
}

export function CopyVin({ vin, className }: CopyVinProps) {
  const [copied, setCopied] = useState(false);
  const handle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(vin);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* noop */
    }
  };
  return (
    <button
      type="button"
      onClick={handle}
      title={`Copy VIN ${vin}`}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded font-mono text-xs text-primary hover:text-primary/80",
        className,
      )}
    >
      <span>{vin}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
      )}
    </button>
  );
}
