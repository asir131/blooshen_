import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ReferralEarningsCTA() {
  return (
    <section className="bg-primary py-14 px-4">
      <div className="max-w-[860px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground mb-2">
          Your Page Is Working For You.
        </h2>
        <p className="text-sm text-primary-foreground/80 mb-8 max-w-[520px]">
          Every time a visitor clicks a featured vehicle, contacts you, or completes a purchase through your profile, you earn a referral fee. Share your profile link to drive more traffic and increase your earnings.
        </p>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-bold text-primary-foreground mb-3">This Month</h3>
            {[
              ["Profile views", "342"],
              ["Featured vehicle clicks", "89"],
              ["Contact requests", "14"],
              ["Referral earnings", "$425"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-primary-foreground/20 py-1.5">
                <span className="text-xs text-primary-foreground/80">{label}</span>
                <span className="text-sm font-bold text-primary-foreground">{value}</span>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary-foreground mb-3">All Time</h3>
            {[
              ["Total profile views", "8,420"],
              ["Total referrals closed", "127"],
              ["Total earned", "$4,850"],
              ["Current rank", "#12"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-primary-foreground/20 py-1.5">
                <span className="text-xs text-primary-foreground/80">{label}</span>
                <span className="text-sm font-bold text-primary-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/dashboard/promoter">Go to My Earnings Dashboard →</Link>
          </Button>
          <a href="/leaderboard" className="text-sm text-primary-foreground underline underline-offset-4 self-center">
            View My Leaderboard Rank →
          </a>
        </div>
      </div>
    </section>
  );
}
