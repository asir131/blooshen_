import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  { q: "How do I list my car on AutoWurx?", a: "It takes less than 3 minutes. Enter your license plate or VIN, add your mileage, upload a few photos, and set your asking price. Your listing goes live immediately and starts reaching buyers right away." },
  { q: "Do I need photos to get offers?", a: "At least one photo is required, but more is always better. Listings with clear exterior, interior, and detail shots get significantly more views and stronger offers. Natural lighting and a clean background go a long way." },
  { q: "How should I price my car?", a: "Use our built-in valuation estimator to get a baseline. From there, factor in your car's condition, mileage, recent service history, and any upgrades. Set your price slightly above your floor — you can always negotiate down, but you can't negotiate up." },
  { q: "What happens after I list?", a: "Buyers and local dealers see your listing and submit offers directly to your dashboard. You can review, compare, and respond on your own timeline. No pressure, no follow-up calls from strangers." },
  { q: "Am I obligated to sell after listing?", a: "Not at all. You stay in full control. Decline any offer, pause your listing, or remove it entirely at any time — no questions asked." },
  { q: "How do I handle payment safely?", a: "Meet buyers in public, well-lit locations. For large transactions, use bank transfer or a verified payment app. AutoWurx supports Venmo, CashApp, and ACH. Never hand over the title until payment clears." },
  { q: "Can I edit my listing after posting?", a: "Yes — log into your dashboard anytime to update photos, adjust pricing, add details, or deactivate your listing if your car sells elsewhere." },
  { q: "Are there any fees?", a: "Listing on AutoWurx is completely free. There are no fees to list, edit, message buyers, or accept an offer. Optional promoted listing upgrades will be available in the future." },
  { q: "What paperwork do I need?", a: "At minimum: your vehicle title, a bill of sale, and any lien release documents if applicable. Requirements vary by state — we provide a state-by-state paperwork guide in the seller resource center." },
  { q: "What's the difference between selling and trading in?", a: "Trading in is convenient but typically nets you 20–40% less than selling directly. On AutoWurx, you skip the dealership entirely — keeping that difference in your pocket." },
];

const SellerFAQ = () => (
  <section className="w-full py-16 md:py-20 bg-[hsl(0,0%,10%)]">
    <div className="container max-w-[780px]">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2 font-heading uppercase">
        Have More Questions?
      </h2>
      <div className="w-16 h-0.5 bg-primary mx-auto mb-10" />

      <Accordion type="single" collapsible className="space-y-2">
        {faqItems.map((item, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border border-border rounded-lg overflow-hidden bg-card px-5"
          >
            <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline data-[state=open]:text-primary [&>svg]:text-primary">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed border-l-2 border-primary pl-4">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default SellerFAQ;
