import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const RentalFields = () => {
  const [dailyRate, setDailyRate] = useState(50);
  const [weeklyRate, setWeeklyRate] = useState(300);
  const [cashAccepted, setCashAccepted] = useState(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [availFrom, setAvailFrom] = useState<Date | undefined>();
  const [availTo, setAvailTo] = useState<Date | undefined>();

  return (
    <div className="space-y-5 border-t border-border pt-5">
      <h4 className="font-heading font-bold text-foreground text-sm">Rental Details</h4>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Year</label>
          <Input placeholder="2024" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Make</label>
          <Input placeholder="Toyota" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Model</label>
          <Input placeholder="Camry" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Vehicle Type</label>
          <Input placeholder="Sedan, SUV, Truck..." />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Daily Rate: ${dailyRate}</label>
          <Slider value={[dailyRate]} onValueChange={([v]) => setDailyRate(v)} min={20} max={500} step={5} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Weekly Rate: ${weeklyRate}</label>
          <Slider value={[weeklyRate]} onValueChange={([v]) => setWeeklyRate(v)} min={100} max={3000} step={25} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Availability</label>
        <div className="flex gap-3 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("justify-start text-left font-normal", !availFrom && "text-muted-foreground")}>
                <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                {availFrom ? format(availFrom, "MMM d, yyyy") : "Available from"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={availFrom} onSelect={setAvailFrom} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("justify-start text-left font-normal", !availTo && "text-muted-foreground")}>
                <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                {availTo ? format(availTo, "MMM d, yyyy") : "Available to"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={availTo} onSelect={setAvailTo} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Rental Terms</label>
        <Textarea placeholder="Minimum rental period, fuel policy, late return policy, allowed uses..." rows={3} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Cash Accepted</span>
          <Switch checked={cashAccepted} onCheckedChange={setCashAccepted} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Delivery Available</span>
          <Switch checked={deliveryAvailable} onCheckedChange={setDeliveryAvailable} />
        </div>
      </div>
    </div>
  );
};

export default RentalFields;
