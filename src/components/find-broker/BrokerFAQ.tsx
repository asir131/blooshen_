import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is it free to connect with a broker?",
    a: "Yes — connecting with and consulting an AutoWurx Neighborhood Broker is completely free for buyers. Brokers earn referral fees when a deal closes, paid through the AutoWurx platform. You never pay your broker directly.",
  },
  {
    q: "How is a broker different from a dealer?",
    a: "A dealer works for the seller and profits from charging you more. Your AutoWurx broker works for you — their referral fee comes from the platform when a deal closes, so their incentive is to find you the best vehicle at the best price, not to maximize their margin.",
  },
  {
    q: "Can my broker help with financing?",
    a: "Many of our brokers have finance industry backgrounds and can walk you through financing options, pre-approval, and what terms to negotiate. They don't arrange financing directly, but they'll make sure you understand every number before you sign.",
  },
  {
    q: "What if there are no brokers near me?",
    a: "Expand your search radius to 50 miles — many AutoWurx brokers work remotely and can handle paperwork digitally and arrange vehicle delivery to your door. You can also join the waitlist for broker coverage in your area.",
  },
  {
    q: "How do brokers find vehicles for me?",
    a: "Your broker searches all AutoWurx listings plus their personal network of sellers, dealers, and private contacts in your area. Many deals they surface never even appear in public listings — that's the neighborhood advantage.",
  },
  {
    q: "Can I become a broker?",
    a: (
      <>
        Absolutely. If you know cars and your community, apply to become an AutoWurx Neighborhood Broker. You set your
        own hours, build your own profile, and earn referral fees for every deal you close.{" "}
        <Link to="/experts/apply" className="text-primary hover:underline">
          Apply to Become a Broker →
        </Link>
      </>
    ),
  },
];

const BrokerFAQ = () => {
  return (
    <section className="bg-card py-16 px-4">
      <div className="max-w-[720px] mx-auto">
        <h2 className="font-heading text-xl font-bold text-foreground mb-6 border-l-4 border-primary pl-4">
          Questions About Working With a Broker
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 text-sm font-heading text-foreground hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 text-sm text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default BrokerFAQ;
