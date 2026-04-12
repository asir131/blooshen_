import { Link } from "react-router-dom";
import { CheckCircle, Star, MapPin, Shield, Search, Car, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Broker } from "@/data/mockBrokers";

const badgeStyles: Record<string, string> = {
  Starter: "bg-muted text-muted-foreground",
  Pro: "bg-primary/20 text-primary",
  Elite: "bg-primary text-primary-foreground",
  Legend: "bg-primary text-primary-foreground",
};

const BrokerCard = ({ broker }: { broker: Broker }) => {
  return (
    <div className="bg-card border border-border rounded-[14px] overflow-hidden hover:border-primary transition-all duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0">
      {/* Top section */}
      <div className="p-4 flex gap-4">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative">
            <div className="w-[88px] h-[88px] rounded-full bg-secondary border-2 border-primary flex items-center justify-center text-2xl font-heading font-bold text-primary">
              {broker.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <span
              className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-card ${broker.online ? "bg-green-500" : "bg-muted-foreground"}`}
            />
          </div>
          <span className={`text-[9px] font-heading uppercase tracking-wider px-2 py-0.5 rounded-sm ${badgeStyles[broker.badge]}`}>
            {broker.badge === "Elite" ? "⭐ " : broker.badge === "Legend" ? "👑 " : ""}
            {broker.badge}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-heading text-base font-bold text-foreground truncate">{broker.name}</span>
            {broker.verified && <CheckCircle className="w-4 h-4 text-primary shrink-0" />}
          </div>
          <p className="text-[12px] italic text-muted-foreground mb-2 truncate">{broker.tagline}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {broker.specialties.map((s) => (
              <span key={s} className="text-[10px] font-heading uppercase tracking-wider bg-primary/15 text-primary px-2 py-0.5 rounded-sm">
                {s}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="text-foreground font-semibold">{broker.deals} deals</span>
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3 text-primary fill-primary" />
              {broker.rating}
            </span>
            <span>{broker.responseTime} response</span>
            <span>{broker.years} yrs</span>
          </div>
        </div>

        {/* Actions */}
        <div className="hidden md:flex flex-col gap-2 shrink-0 w-[180px]">
          <Link to={`/experts/${broker.username}#consult`}>
            <Button size="sm" className="w-full text-xs">Schedule Free Consult</Button>
          </Link>
          <Link to={`/experts/${broker.username}`} className="text-primary text-xs text-center hover:underline">
            View Full Profile →
          </Link>
          <Button variant="secondary" size="icon" className="mx-auto">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bio */}
      <div className="border-t border-border px-4 py-3">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{broker.bio}</p>
      </div>

      {/* Services */}
      <div className="border-t border-border px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {[
          { icon: Shield, label: "Buyer Advocacy", desc: "Protects you from high-pressure dealer tactics." },
          { icon: Search, label: "Vehicle Search", desc: "Searches AutoWurx + their personal network." },
          { icon: Car, label: "Test Drive Delivery", desc: "Vehicles brought to you for test drives." },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="bg-background rounded-lg p-2.5">
            <Icon className="w-4 h-4 text-primary mb-1" />
            <p className="text-[11px] font-heading font-bold text-foreground">{label}</p>
            <p className="text-[10px] text-muted-foreground leading-snug">{desc}</p>
          </div>
        ))}
      </div>

      {/* Featured vehicles */}
      <div className="border-t border-border px-4 py-3">
        <p className="text-primary text-[10px] font-heading uppercase tracking-wider mb-2">
          This broker's current picks →
        </p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {broker.featuredVehicles.map((v) => (
            <Link
              key={v.name}
              to={`/experts/${broker.username}`}
              className="shrink-0 w-[120px] bg-background rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
            >
              <div className="h-16 bg-secondary" />
              <div className="p-2">
                <p className="text-[11px] text-foreground truncate">{v.name}</p>
                <p className="text-xs font-bold text-primary">{v.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile actions */}
      <div className="md:hidden border-t border-border p-4 flex gap-2">
        <Link to={`/experts/${broker.username}#consult`} className="flex-1">
          <Button size="sm" className="w-full text-xs">Schedule Free Consult</Button>
        </Link>
        <Link to={`/experts/${broker.username}`}>
          <Button variant="secondary" size="sm" className="text-xs">Profile</Button>
        </Link>
      </div>
    </div>
  );
};

export default BrokerCard;
