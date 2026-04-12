import { useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ZipSearchInputProps {
  onSubmit: (zip: string) => void;
  className?: string;
}

const ZipSearchInput = ({ onSubmit, className = "" }: ZipSearchInputProps) => {
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.trim()) onSubmit(zip.trim());
  };

  const handleUseLocation = async () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // TODO: Replace with production geocoding API
          const res = await fetch(
            `https://api.zippopotam.us/us/${Math.round(pos.coords.latitude)}/${Math.round(pos.coords.longitude)}`
          );
          if (res.ok) {
            const data = await res.json();
            const code = data?.places?.[0]?.["post code"] || "30301";
            setZip(code);
            onSubmit(code);
          } else {
            setZip("30301");
            onSubmit("30301");
          }
        } catch {
          setZip("30301");
          onSubmit("30301");
        }
        setLoading(false);
      },
      () => {
        setZip("30301");
        onSubmit("30301");
        setLoading(false);
      }
    );
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="Enter your zip code"
          className="flex-1 font-mono tracking-widest bg-secondary border-border focus:border-primary text-foreground"
          maxLength={5}
        />
        <Button type="submit" className="whitespace-nowrap px-6">
          Find My Broker →
        </Button>
      </form>
      <button
        type="button"
        onClick={handleUseLocation}
        disabled={loading}
        className="mt-2 text-xs text-primary hover:underline flex items-center gap-1 mx-auto"
      >
        <MapPin className="w-3 h-3" />
        {loading ? "Detecting location…" : "Use my current location instead"}
      </button>
    </div>
  );
};

export default ZipSearchInput;
