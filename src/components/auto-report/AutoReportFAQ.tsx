import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  { q: "What is NMVTIS and why does it matter?", a: "NMVTIS stands for the National Motor Vehicle Title Information System — a federal database established in 1996 under the Anti-Car Theft Act. All U.S. states, insurance companies, and salvage yards are required by law to report vehicle data to NMVTIS. It's the most authoritative source of vehicle title history available to consumers." },
  { q: "Is the basic AutoWurx Auto Report really free?", a: "Yes, completely free — no credit card, no signup required. Our basic report gives you title status, theft checks, salvage history, and ownership count at zero cost. The Full Report ($9.99) adds odometer detail, accident records, listing history, and a PDF download." },
  { q: "What vehicles are covered?", a: "Our reports cover approximately 96% of all titled vehicles in the United States — including cars, trucks, SUVs, vans, motorcycles, RVs, and buses manufactured in 1981 or later. Some commercial vehicles and pre-1981 models may have limited or no data available." },
  { q: "Can I trust this report to make a purchase decision?", a: "Our reports are a powerful due-diligence tool, but they are not a substitute for a professional pre-purchase inspection. NMVTIS data reflects what has been officially reported — some incidents, especially minor private repairs, may not appear. Always pair your report with an independent mechanic inspection." },
  { q: "What does a clean title actually mean?", a: "A clean title means the vehicle has not been branded with any damage, theft, or total-loss designations. It does not necessarily mean the car is damage-free — it means no such damage was officially reported to the state titling agency." },
  { q: "How do I find my VIN?", a: "The most common location is the lower-left corner of the dashboard, visible through the windshield. It's also on the driver-side door jamb sticker, your vehicle registration, insurance card, and sometimes stamped on the engine block." },
  { q: "Can I run a report on a car I'm selling?", a: "Absolutely — and we recommend it. Running a report on your own vehicle before listing it on AutoWurx builds buyer trust and can help you price it more accurately. You can attach your report directly to your AutoWurx listing." },
  { q: "How do I read the odometer history section?", a: "The odometer history table shows every mileage reading recorded at each title transfer. Look for a consistent upward trend. Any decrease in mileage between readings is a serious red flag for odometer rollback fraud." },
];

const AutoReportFAQ = () => (
  <section className="w-full py-16 md:py-20 bg-[hsl(0,0%,14%)]">
    <div className="container max-w-[780px]">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-heading border-l-4 border-primary pl-4">
        Frequently Asked Questions
      </h2>
      <div className="mb-8" />

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

export default AutoReportFAQ;
