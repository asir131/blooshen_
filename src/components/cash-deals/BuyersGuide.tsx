import { useState, useEffect } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Search, Tag, FileText, ClipboardCheck, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "cash-deal-checklist";

const ProTip = ({ children }: { children: React.ReactNode }) => (
  <div className="border-l-4 border-primary bg-secondary rounded-r-lg p-4 my-4 text-xs text-muted-foreground leading-relaxed">
    <span className="text-primary font-bold">💡 Pro Tip:</span> {children}
  </div>
);

interface CheckItemProps {
  id: string;
  text: string;
  checked: Record<string, boolean>;
  toggle: (id: string) => void;
}

const CheckItem = ({ id, text, checked, toggle }: CheckItemProps) => (
  <label className="flex items-start gap-2.5 cursor-pointer group py-1">
    <input
      type="checkbox"
      checked={!!checked[id]}
      onChange={() => toggle(id)}
      className="mt-0.5 h-4 w-4 rounded border-border accent-[hsl(var(--primary))] shrink-0"
    />
    <span className={`text-xs leading-relaxed transition-all ${checked[id] ? "line-through text-muted-foreground/50" : "text-foreground"}`}>
      {text}
    </span>
  </label>
);

const BuyersGuide = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = (id: string) => setChecked((p) => ({ ...p, [id]: !p[id] }));

  // Checklist items for chapter 4
  const phase1 = [
    "Run the AutoWurx Auto Report on the VIN",
    "Check the market value on KBB and Edmunds",
    "Note the Deal Score and what it means",
    "Research common problems for this year/make/model",
    "Prepare your cash or payment app",
    "Tell a trusted person where you're going",
    "Bring a flashlight and gloves",
    "Download or print the Bill of Sale template",
  ];
  const phase2 = [
    "Verify the VIN matches: dashboard + door jamb + title",
    "Check the title is in the seller's name (match their ID)",
    "Inspect title for alterations or lien holder",
    "Complete full exterior inspection",
    "Complete under-hood inspection",
    "Test all electronics and features",
    "Complete test drive checklist",
    "Request pre-purchase inspection (mechanic shop)",
  ];
  const phase3 = [
    "Negotiate based on your inspection findings",
    "Agree on final price in writing before payment",
    "Complete the Bill of Sale (both parties sign)",
    "Complete Odometer Disclosure",
    "Obtain Lien Release if applicable",
    "Seller signs the title over to you",
    "Exchange payment and title simultaneously",
    "Take photos of all signed documents immediately",
  ];
  const phase4 = [
    "Register the vehicle at the DMV within your state's timeframe",
    "Obtain insurance before driving",
    "Keep all paperwork in a safe place",
    "Run a post-purchase VIN check to confirm clean transfer",
  ];

  const allItems = [...phase1, ...phase2, ...phase3, ...phase4];
  const totalChecked = allItems.filter((_, i) => checked[`ch4-${i}`]).length;
  const progress = Math.round((totalChecked / allItems.length) * 100);

  let itemIdx = 0;
  const renderPhase = (label: string, items: string[]) => (
    <div className="mb-6">
      <p className="text-xs font-heading font-bold uppercase tracking-wider text-primary mb-3">{label}</p>
      <div className="space-y-1">
        {items.map((text) => {
          const idx = itemIdx++;
          return <CheckItem key={idx} id={`ch4-${idx}`} text={text} checked={checked} toggle={toggle} />;
        })}
      </div>
    </div>
  );

  return (
    <section id="guide-section" className="bg-[hsl(var(--background))] py-14 md:py-20">
      <div className="max-w-[760px] mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-primary mb-3">The Ca$h Buyer's Guide</p>
          <h2 className="font-heading text-3xl md:text-4xl font-black text-foreground leading-tight mb-3">
            Buy Smart. Stay Protected.<br />Drive Away Winning.
          </h2>
          <div className="w-12 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm max-w-[560px] mx-auto leading-relaxed">
            Cash deals move fast. Sellers expect knowledgeable buyers. Here's everything
            you need to know to inspect any vehicle, spot a real deal, and protect yourself from start to finish.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {/* Chapter 1 */}
          <AccordionItem value="ch1" className="border border-border rounded-xl overflow-hidden bg-card">
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Search className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="font-heading text-base font-bold text-foreground">Chapter 1 — How to Inspect a Vehicle</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Never buy a car you haven't physically inspected. Here's exactly what to check.</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <p className="text-xs font-heading font-bold uppercase tracking-wider text-primary mb-3">🚗 Walk the Exterior</p>
              <div className="space-y-1 mb-4">
                {[
                  "Walk around the entire vehicle in daylight — look for mismatched paint panels (sign of accident repair)",
                  "Run your fingers along door seams and panel gaps — uneven gaps indicate frame damage",
                  "Check for rust on wheel arches, rocker panels, and under door edges",
                  "Look at the car from front and rear — does it sit level?",
                  "Inspect all glass for chips, cracks, and delamination",
                  "Check all lights (headlights, taillights, turn signals, reverse)",
                  "Look under the car for oil drips, rust, bent components",
                  "Check all four tires for even wear — uneven wear indicates alignment problems",
                ].map((t, i) => <CheckItem key={i} id={`ch1-ext-${i}`} text={t} checked={checked} toggle={toggle} />)}
              </div>
              <ProTip>Inspect in daylight and bring a flashlight. A car that looks perfect at night can reveal a lot more in full sun.</ProTip>

              <p className="text-xs font-heading font-bold uppercase tracking-wider text-primary mb-3 mt-6">🔧 Under the Hood</p>
              <div className="space-y-1 mb-4">
                {[
                  "Check engine oil — pull dipstick, wipe clean, reinsert. Black/gritty = poor maintenance. Milky = head gasket leak.",
                  "Check coolant reservoir — should be between MIN/MAX, clear or slightly tinted",
                  "Inspect brake fluid reservoir — should be clear to light yellow",
                  "Check power steering fluid (if not electric steering)",
                  "Look for oil stains or wet spots on the engine block",
                  "Check all belts for cracking, fraying, or glazing",
                  "Inspect battery terminals for corrosion (white/blue powder)",
                  "Look for any warning tags or notes left by a mechanic",
                ].map((t, i) => <CheckItem key={i} id={`ch1-hood-${i}`} text={t} checked={checked} toggle={toggle} />)}
              </div>
              <ProTip>Ask the seller to start the car cold. Hard cold starts, rough idle, and exhaust smoke are much easier to catch on a cold engine.</ProTip>

              <p className="text-xs font-heading font-bold uppercase tracking-wider text-primary mb-3 mt-6">🛣️ The Test Drive</p>
              <div className="space-y-1 mb-4">
                {[
                  "Drive at slow speed — listen for clunks, rattles, or groaning",
                  "Test brakes hard from 30mph — should stop straight without pulling",
                  "Accelerate hard from a stop — check for hesitation or misfires",
                  "Drive at highway speed — check for vibration or steering wander",
                  "Test all electronics: AC, heat, windows, locks, radio, backup camera",
                  "Turn steering wheel lock to lock at slow speed — listen for clicking",
                  "Test the parking brake on an incline",
                  "Check all dash warning lights — should go off once running",
                ].map((t, i) => <CheckItem key={i} id={`ch1-drive-${i}`} text={t} checked={checked} toggle={toggle} />)}
              </div>
              <ProTip>If the seller won't let you test drive it, that's a red flag. A seller with nothing to hide will let you drive it.</ProTip>

              <p className="text-xs font-heading font-bold uppercase tracking-wider text-primary mb-3 mt-6">🔩 The $100 That Could Save You $5,000</p>
              <p className="text-xs text-foreground leading-relaxed mb-4">
                A professional pre-purchase inspection (PPI) by an independent mechanic is the single best $100–$150 you can spend.
                It reveals hidden frame damage, engine/transmission issues, and problems a seller hoped you wouldn't notice.
                If the seller refuses a PPI, walk away immediately.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/service-providers">Find Service Providers Near Me →</Link>
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* Chapter 2 */}
          <AccordionItem value="ch2" className="border border-border rounded-xl overflow-hidden bg-card">
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Tag className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="font-heading text-base font-bold text-foreground">Chapter 2 — How to Spot a Real Deal</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Not every cheap car is a good deal. Here's how to know when the price is right.</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <p className="text-xs font-heading font-bold uppercase tracking-wider text-primary mb-3">📊 Know the Number Before You Negotiate</p>
              <p className="text-xs text-foreground leading-relaxed mb-4">
                Every used vehicle has a market value. Before you look at a single listing, know this number.
                Check: KBB (Kelley Blue Book), Edmunds, CarGurus Market Analysis, NADA Guides.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { title: "Mileage Rule of Thumb", desc: "Average US driver: 12K–15K miles/year. A 5-year-old car should have 60K–75K miles." },
                  { title: "Condition Multiplier", desc: "'Excellent' adds 5–10%. 'Fair' subtracts 10–20%. 'Poor' subtracts 25–40%." },
                  { title: "The Seasonal Effect", desc: "Convertibles peak in spring. 4WD trucks peak before winter. Buy off-season to save 8–15%." },
                  { title: "Private vs. Dealer", desc: "Private sellers are typically 15–25% below dealer price for the same vehicle." },
                ].map((t) => (
                  <div key={t.title} className="rounded-lg bg-secondary p-4">
                    <p className="font-heading text-xs font-bold text-primary mb-1">{t.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs font-heading font-bold uppercase tracking-wider text-primary mb-3">🎯 What is the AutoWurx Deal Score?</p>
              <p className="text-xs text-foreground leading-relaxed mb-3">
                Every cash listing has a Deal Score (0–100) comparing asking price to market value.
                Calculation: Price vs. market (50%), Mileage vs. avg (25%), Condition (15%), Days on market (10%).
              </p>
              <div className="relative h-6 rounded-full overflow-hidden mb-6" style={{ background: "linear-gradient(to right, hsl(0 72% 51%), hsl(var(--primary)), hsl(142 71% 45%))" }}>
                <div className="absolute inset-0 flex items-center justify-between px-3 text-[9px] font-bold text-primary-foreground">
                  <span>0</span><span>40</span><span>60</span><span>80</span><span>100</span>
                </div>
              </div>

              <p className="text-xs font-heading font-bold uppercase tracking-wider text-primary mb-3">🚩 Walk Away Immediately If You See:</p>
              <div className="space-y-2">
                {[
                  "Price too good to be true — a $15K vehicle listed for $6K is usually stolen or salvaged",
                  "Seller won't meet in person or wants to ship — 100% scam",
                  "Title not in seller's name — may be stolen or have a lien",
                  "Seller claims the title is 'lost' or 'at the DMV'",
                  "Refuses pre-purchase inspection or won't let you check the VIN",
                  "Pressure tactics — 'I have 3 other buyers coming today'",
                  "Odometer seems too low for age/condition — check pedal and seat wear",
                ].map((t, i) => (
                  <div key={i} className="border-l-4 border-destructive bg-secondary rounded-r-lg p-3 text-xs text-foreground leading-relaxed">
                    🚩 {t}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Chapter 3 */}
          <AccordionItem value="ch3" className="border border-border rounded-xl overflow-hidden bg-card">
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><FileText className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="font-heading text-base font-bold text-foreground">Chapter 3 — Paperwork: Doing It Right</p>
                  <p className="text-xs text-muted-foreground mt-0.5">The wrong paperwork can cost you thousands or leave you without legal ownership.</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <p className="text-xs font-heading font-bold uppercase tracking-wider text-primary mb-3">📋 The Non-Negotiable Documents</p>

              {[
                { title: "Certificate of Title", badge: "CRITICAL", badgeClass: "bg-destructive", content: "The title is legal proof of ownership. Verify: seller's name matches ID, VIN matches dashboard and door jamb, no lien holder listed, title type (Clean, Salvage, Rebuilt), no alterations. Both buyer and seller sign; take to DMV within 10–30 days." },
                { title: "Bill of Sale", badge: "HIGHLY RECOMMENDED", badgeClass: "bg-primary text-primary-foreground", content: "Proof that a transaction occurred. Include: full legal names, contact info, vehicle details, VIN, agreed sale price (actual amount), payment method, date, 'As-Is' statement, both signatures." },
                { title: "Odometer Disclosure Statement", badge: "REQUIRED BY LAW", badgeClass: "bg-destructive", content: "Federal law requires written odometer disclosure for most vehicles under 10 years old. Seller must certify the current reading and whether it reflects actual mileage." },
                { title: "Lien Release", badge: "IF LIEN EXISTS", badgeClass: "bg-primary text-primary-foreground", content: "If the vehicle was financed, the lender holds a lien. Without a lien release, the bank can legally repossess the vehicle even after you've paid." },
                { title: "As-Is Addendum", badge: "RECOMMENDED", badgeClass: "bg-secondary text-foreground", content: "Most private sales are 'as-is'. Include 'Sold As-Is, No Warranty' in your bill of sale. Both parties should initial." },
              ].map((doc) => (
                <div key={doc.title} className="border-t-2 border-primary bg-secondary rounded-b-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-heading text-sm font-bold text-foreground">{doc.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${doc.badgeClass} text-foreground`}>{doc.badge}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{doc.content}</p>
                </div>
              ))}

              {/* TODO: Generate PDFs server-side using Puppeteer or a PDF library. Store in Supabase Storage. Return signed download URL */}
              <Button variant="outline" size="sm" className="mb-6">Download Free Bill of Sale Template →</Button>

              <p className="text-xs font-heading font-bold uppercase tracking-wider text-primary mb-3 mt-4">💵 How to Pay and Stay Safe</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { title: "Cash", desc: "Count together at the sale. Meet at a bank so the seller can deposit and verify. Use cashier's check for $5K+.", risk: "Low", riskClass: "text-[hsl(142_71%_45%)]" },
                  { title: "Venmo / CashApp", desc: "Instant and traceable. Screenshot confirmations. Split amounts over $2,500 across two days to avoid holds.", risk: "Low-Medium", riskClass: "text-primary" },
                  { title: "Bank Transfer", desc: "Best for large amounts. Fully traceable. Allow 1–2 business days for transfer to clear before exchanging keys.", risk: "Low", riskClass: "text-[hsl(142_71%_45%)]" },
                  { title: "Money Orders", desc: "Verify cashier's checks at the issuing bank before accepting. Counterfeits are a common scam.", risk: "Medium", riskClass: "text-primary" },
                ].map((c) => (
                  <div key={c.title} className="rounded-lg bg-card border border-border p-4">
                    <p className="font-heading text-xs font-bold text-primary mb-1">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{c.desc}</p>
                    <span className={`text-[10px] font-bold ${c.riskClass}`}>Risk: {c.risk}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs font-heading font-bold uppercase tracking-wider text-primary mb-3">📍 Where and How to Meet</p>
              <div className="space-y-2">
                {[
                  "🏦 Meet at a bank — neutral, surveilled, seller can deposit immediately",
                  "🚔 Meet at a police station — many have designated 'safe exchange zones'",
                  "☀️ Daytime only — avoid evening or late-night for cash transactions",
                  "👥 Bring someone with you — never transact alone",
                  "📹 Most bank and police parking lots have cameras — this protects you",
                  "❌ Never meet at your home address",
                ].map((t, i) => (
                  <div key={i} className="border-l-4 border-primary bg-secondary rounded-r-lg p-3 text-xs text-foreground leading-relaxed">{t}</div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Chapter 4 — Checklist */}
          <AccordionItem value="ch4" className="border border-border rounded-xl overflow-hidden bg-card">
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><ClipboardCheck className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="font-heading text-base font-bold text-foreground">Chapter 4 — Your Ca$h Deal Checklist</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Complete start-to-finish checklist for a safe, smart cash purchase.</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{totalChecked} / {allItems.length} complete</span>
                  <span className="text-xs font-bold text-primary">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {(() => { itemIdx = 0; return null; })()}
              {renderPhase("Phase 1: Before You Go", phase1)}
              {renderPhase("Phase 2: At the Vehicle", phase2)}
              {renderPhase("Phase 3: Closing the Deal", phase3)}
              {renderPhase("Phase 4: After the Sale", phase4)}

              {/* TODO: Generate PDFs server-side using Puppeteer or a PDF library. Store in Supabase Storage. Return signed download URL */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => window.print()}>Print This Checklist</Button>
                <Button variant="outline" size="sm">Share Checklist</Button>
                <Button size="sm">Download as PDF</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default BuyersGuide;
