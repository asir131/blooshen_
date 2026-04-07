import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileFilterSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const MobileFilterSheet = ({ open, onClose, children }: MobileFilterSheetProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between z-10">
          <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </h3>
          <button onClick={onClose} className="h-11 w-11 flex items-center justify-center rounded-md hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <div className="p-4 pb-24">
          {children}
        </div>
        <div className="sticky bottom-0 bg-card border-t border-border p-4">
          <Button onClick={onClose} className="w-full" size="lg">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterSheet;
