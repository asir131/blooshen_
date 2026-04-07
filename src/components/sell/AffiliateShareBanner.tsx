import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AffiliateShareBanner = () => (
  <section className="w-full py-14 md:py-20 bg-primary">
    <div className="container grid md:grid-cols-2 gap-10 items-center">
      {/* Left text */}
      <div>
        <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4 font-heading uppercase">
          List it. Share it. Let AutoWurx Sell It For You.
        </h2>
        <p className="text-primary-foreground/80 mb-6 leading-relaxed">
          Every listing comes with a built-in affiliate share button. When promoters in the AutoWurx network share your car and it sells, they earn a commission — and you sell faster.
        </p>
        <Button asChild variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold">
          <Link to="/promoters">Learn How It Works →</Link>
        </Button>
      </div>

      {/* Right animated SVG */}
      <div className="flex justify-center">
        <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm">
          {/* Car card */}
          <rect x="10" y="50" width="80" height="80" rx="8" fill="hsl(0,0%,10%)" opacity="0.9"/>
          <rect x="20" y="60" width="60" height="30" rx="4" fill="hsl(0,0%,18%)"/>
          <text x="50" y="105" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">Listing</text>

          {/* Share icon */}
          <circle cx="140" cy="90" r="18" fill="hsl(0,0%,10%)" opacity="0.9">
            <animate attributeName="r" values="18;20;18" dur="2s" repeatCount="indefinite"/>
          </circle>
          <path d="M134 90h12M143 84l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>

          {/* Connector lines */}
          <line x1="90" y1="90" x2="122" y2="90" stroke="hsl(0,0%,10%)" strokeWidth="2" strokeDasharray="4 3"/>

          {/* Network nodes */}
          {[{x:220,y:40},{x:240,y:90},{x:220,y:140}].map((n, i) => (
            <g key={i}>
              <line x1="158" y1="90" x2={n.x} y2={n.y} stroke="hsl(0,0%,10%)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6"/>
              <circle cx={n.x} cy={n.y} r="12" fill="hsl(0,0%,10%)" opacity="0.8">
                <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2.5s" begin={`${i * 0.4}s`} repeatCount="indefinite"/>
              </circle>
              <circle cx={n.x} cy={n.y} r="5" fill="white" opacity="0.7"/>
            </g>
          ))}

          {/* Dollar sign */}
          <circle cx="290" cy="90" r="20" fill="hsl(0,0%,10%)" opacity="0.9"/>
          <text x="290" y="96" textAnchor="middle" fontSize="18" fontWeight="bold" fill="hsl(50,100%,50%)">$</text>
          {[{x:240,y:40},{x:260,y:90},{x:240,y:140}].map((n, i) => (
            <line key={`d${i}`} x1={n.x + 12} y1={n.y} x2="270" y2="90" stroke="hsl(0,0%,10%)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>
          ))}
        </svg>
      </div>
    </div>
  </section>
);

export default AffiliateShareBanner;
