import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  { q: "Is it legal to sell a car for cash?", a: "Absolutely — private cash vehicle sales are completely legal in all 50 states. What matters is that you complete the proper title transfer paperwork and both parties agree to the terms. Cash is simply a payment method." },
  { q: "How do I avoid buying a stolen vehicle?", a: "Run an AutoWurx Auto Report before purchasing any vehicle. The report checks the NMVTIS database for theft flags. Also verify the VIN on the dashboard, door jamb, and title all match — a mismatched VIN is a serious red flag." },
  { q: "What if the seller says the title is 'in the mail' or 'at the DMV'?", a: "Do not complete the purchase. No title = no deal, period. A seller who doesn't have the title in hand may have an outstanding loan, a salvage issue, or worse. Wait until they produce the physical title." },
  { q: "Do I need to pay taxes on a private car purchase?", a: "Yes — in most states you pay sales tax when you register the vehicle, not at the point of sale. Do not agree to write a lower sale price on the bill of sale to avoid taxes — this is tax fraud." },
  { q: "What's the safest way to pay for a cash deal?", a: "Under $2,500: Venmo or CashApp. $2,500–$5,000: Zelle or bank transfer. Over $5,000: cashier's check or bank wire — meet at the issuing bank so the seller can verify immediately." },
  { q: "What happens if I find problems after I buy?", a: "Private cash sales are typically 'as-is'. Once paid and signed, the sale is final. This is why inspection and PPI are critical before purchase. If the seller actively misrepresented the vehicle, you may have legal recourse, but it's difficult to pursue." },
];

const CashDealFAQ = () => (
  <section className="bg-[hsl(var(--background))] py-14 md:py-20">
    <div className="max-w-[720px] mx-auto px-4">
      <div className="border-l-4 border-primary pl-4 mb-8">
        <h2 className="font-heading text-xl md:text-2xl font-black text-foreground">Ca$h Deal FAQs</h2>
      </div>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg overflow-hidden bg-card">
            <AccordionTrigger className="px-5 py-4 text-left text-sm font-heading font-bold text-foreground hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default CashDealFAQ;
