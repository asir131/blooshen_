import { Shield, Lock, Umbrella, FileSearch } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const trustCards = [
  { icon: Shield, title: "Verified Sellers", desc: "Every seller is identity-verified before listing. No anonymous listings, ever." },
  { icon: Lock, title: "Secure Bidding", desc: "All bids are encrypted and timestamped. Bid history is immutable and visible to all participants." },
  { icon: Umbrella, title: "No-Sale Protection", desc: "If a seller fails to complete a verified sale, AutoWurx removes them and you owe nothing." },
  { icon: FileSearch, title: "Auto Report Available", desc: "Every auctioned vehicle has a free AutoWurx Auto Report available before you bid." },
];

const faqs = [
  { q: "Is there a buyer's premium or fee?", a: "AutoWurx charges no buyer's premium. What you bid is what you pay. The seller pays a small platform fee on successful sales — never the buyer." },
  { q: "What happens if I win and the seller doesn't follow through?", a: "Sellers who fail to complete verified sales are permanently banned. If you've paid a deposit and the sale falls through, your deposit is refunded in full within 3 business days." },
  { q: "How does Auto-Bid work?", a: "Set your maximum and AutoWurx automatically places the minimum required bid to keep you in the lead, up to your maximum amount. If your maximum is reached and you're outbid, you'll be notified immediately." },
  { q: "Can I inspect a vehicle before bidding?", a: "Yes — contact the seller before bidding to arrange an inspection. You can also run a free AutoWurx Auto Report on any listed vehicle before placing a single bid." },
  { q: "What payment methods are accepted?", a: "Payment is arranged directly between buyer and seller after auction close. AutoWurx supports cash, Venmo, CashApp, and bank transfer." },
  { q: "How do I list my vehicle for auction?", a: "Click 'Start Auction Listing' and complete the form. Set your reserve price or list with no reserve, choose duration (24hr, 48hr, 72hr, or 7 days), and your auction goes live after review." },
];

const AuctionTrustFAQ = () => (
  <section className="bg-[#1A1A1A] py-16">
    <div className="max-w-[900px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Trust */}
      <div>
        <p className="font-heading text-xs uppercase tracking-[0.2em] text-primary mb-4">Buyer Protection</p>
        <div className="space-y-3">
          {trustCards.map((c) => (
            <div key={c.title} className="flex gap-3 bg-card border-l-[3px] border-primary rounded-r-lg p-3.5">
              <c.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-heading font-bold text-foreground text-left py-3">{f.q}</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground pb-3 leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

export default AuctionTrustFAQ;
