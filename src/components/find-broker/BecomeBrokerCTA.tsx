import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BecomeBrokerCTA = () => {
  return (
    <section className="bg-primary py-14 px-4">
      <div className="max-w-[900px] mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2 className="font-heading text-lg md:text-xl font-bold text-primary-foreground mb-2">
            Are You a Car Person? Get Paid For It.
          </h2>
          <p className="text-primary-foreground/80 text-xs leading-relaxed mb-4 max-w-md">
            Build your free AutoWurx broker profile, feature your vehicle picks, earn referral fees on every deal you
            close, and climb the leaderboard. Your neighborhood needs a car expert — that could be you.
          </p>
          <Link to="/experts/apply">
            <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Apply to Become a Broker →
            </Button>
          </Link>
        </div>
        <div className="flex gap-8 text-center">
          {[
            { num: "$0", label: "Cost to join" },
            { num: "$150 avg", label: "Per closed deal" },
            { num: "#1", label: "Leaderboard position up for grabs" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-heading text-2xl font-bold text-primary-foreground">{s.num}</p>
              <p className="text-[10px] text-primary-foreground/70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BecomeBrokerCTA;
