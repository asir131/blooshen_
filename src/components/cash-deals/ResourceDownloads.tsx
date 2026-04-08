import { FileText, ClipboardList, Shield, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  { icon: FileText, title: "Bill of Sale Template", desc: "A legally sound bill of sale template pre-formatted for private vehicle sales. Fill in the blanks and both parties sign.", cta: "Download Free PDF →" },
  { icon: ClipboardList, title: "Vehicle Inspection Checklist", desc: "The complete 32-point inspection checklist from Chapter 1 — formatted as a printable single page.", cta: "Download Free PDF →" },
  { icon: Shield, title: "Ca$h Deal Safety Guide", desc: "A condensed one-pager on safe meetup protocols, payment verification, and scam red flags.", cta: "Download Free PDF →" },
  { icon: MapPin, title: "State DMV Quick Links", desc: "Direct links to title transfer and registration information for all 50 states.", cta: "View State Guide →" },
];

// TODO: Generate PDFs server-side using Puppeteer or a PDF library. Store in Supabase Storage. Return signed download URL

const ResourceDownloads = () => (
  <section className="bg-card py-14 md:py-20">
    <div className="max-w-[900px] mx-auto px-4">
      <div className="text-center mb-10">
        <p className="font-heading text-xs uppercase tracking-[0.25em] text-primary mb-2">Free Resources</p>
        <h2 className="font-heading text-2xl md:text-3xl font-black text-foreground mb-2">Everything You Need to Close Safe</h2>
        <div className="w-12 h-1 bg-primary mx-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resources.map((r) => (
          <div key={r.title} className="rounded-xl border border-border bg-[hsl(var(--background))] p-5 hover:border-primary/50 transition-colors group">
            <r.icon className="h-7 w-7 text-primary mb-3" />
            <p className="font-heading text-sm font-bold text-foreground mb-1">{r.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{r.desc}</p>
            <Button variant="outline" size="sm" className="text-xs">{r.cta}</Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ResourceDownloads;
