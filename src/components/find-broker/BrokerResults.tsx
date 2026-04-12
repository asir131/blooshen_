import { useState } from "react";
import BrokerCard from "./BrokerCard";
import { mockBrokers } from "@/data/mockBrokers";

// TODO: Replace with live geolocation query
// Input: zip_code or lat/lng
// Query: SELECT * FROM experts
//   WHERE ST_Distance(location, point) <= 25mi
//   AND is_active = true
//   ORDER BY rating DESC, deals_closed DESC
//   LIMIT 3

interface BrokerResultsProps {
  city: string;
}

const sortOptions = ["Highest Rated", "Most Experienced", "Fastest Response", "Most Deals Closed"] as const;

const BrokerResults = ({ city }: BrokerResultsProps) => {
  const [sort, setSort] = useState<string>(sortOptions[0]);

  const sorted = [...mockBrokers].sort((a, b) => {
    if (sort === "Highest Rated") return b.rating - a.rating;
    if (sort === "Most Experienced") return b.years - a.years;
    if (sort === "Most Deals Closed") return b.deals - a.deals;
    return 0; // Fastest Response — keep default
  });

  return (
    <section id="broker-results" className="bg-background py-14 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <h2 className="font-heading text-xl font-bold text-foreground">
            3 Brokers Near {city}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-secondary border border-border text-foreground text-xs rounded-md px-2 py-1 focus:border-primary outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-6">
          Showing 3 of 14 brokers within 25 miles ·{" "}
          <button className="text-primary hover:underline">Expand radius to 50 miles →</button>
        </p>

        <div className="flex flex-col gap-5">
          {sorted.map((b) => (
            <BrokerCard key={b.id} broker={b} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrokerResults;
