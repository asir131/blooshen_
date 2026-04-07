import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ExpertDirectoryCTA() {
  return (
    <section className="bg-background py-16 px-4">
      <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-heading font-bold text-foreground mb-2">Looking for a Different Expert?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Browse all AutoWurx Neighborhood Experts and Brokers near you — filter by specialty, location, rating, and response time.
          </p>
          <Button asChild>
            <Link to="/reviews">Browse All Experts →</Link>
          </Button>
        </div>
        <div>
          <h3 className="text-xl font-heading font-bold text-foreground mb-2">Are You a Car Expert?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Build your free AutoWurx broker profile, feature your vehicle picks, publish content, and start earning referral fees today.
          </p>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link to="/experts/apply">Become an Expert →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
