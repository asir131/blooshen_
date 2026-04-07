import { Input } from "@/components/ui/input";
import { type ListingCategory } from "@/data/mockDashboard";

interface CategoryFieldsProps {
  category: ListingCategory;
}

const CategoryFields = ({ category }: CategoryFieldsProps) => {
  if (category === "Cars for Sale") {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Year</label>
          <Input placeholder="2024" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Price</label>
          <Input placeholder="$0" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Make</label>
          <Input placeholder="Toyota" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Model</label>
          <Input placeholder="Camry" />
        </div>
      </div>
    );
  }

  if (category === "Parts & Accessories") {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Price</label>
          <Input placeholder="$0" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Condition</label>
          <Input placeholder="New / Used" />
        </div>
      </div>
    );
  }

  if (category === "Service Providers") {
    return (
      <div className="space-y-1">
        <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Service Type</label>
        <Input placeholder="e.g. Oil Change, Body Shop, Detailing" />
      </div>
    );
  }

  if (category === "Neighborhood Experts") {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Specialty</label>
          <Input placeholder="e.g. Engine Diagnostics" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Hourly Rate</label>
          <Input placeholder="$0 or Free" />
        </div>
      </div>
    );
  }

  if (category === "Events & Meetups") {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Event Date</label>
          <Input type="date" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Ticket Price</label>
          <Input placeholder="$0 or Free" />
        </div>
      </div>
    );
  }

  return null;
};

export default CategoryFields;
