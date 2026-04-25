import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  ShieldCheck,
  Sparkles,
  Clock,
  Workflow,
  CheckCircle2,
  Car,
} from "lucide-react";

const BODY_STYLES = ["Car", "Sedan", "Van", "Truck", "SUV", "Hatchback"] as const;

const orderSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Phone is required").max(30),
  make_model: z.string().trim().min(2, "Make and model required").max(120),
  year_range: z.string().trim().max(60).optional().or(z.literal("")),
  color: z.string().trim().max(60).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  mileage_range: z.string().trim().max(60).optional().or(z.literal("")),
  body_style_other: z.string().trim().max(60).optional().or(z.literal("")),
  payment_method: z.enum(["Cash", "Preapproved Financing", "Needs Financing"]),
  comments: z.string().trim().max(2000).optional().or(z.literal("")),
});

type FormState = z.infer<typeof orderSchema> & { body_styles: string[] };

const initialState: FormState = {
  full_name: "",
  email: "",
  phone: "",
  make_model: "",
  year_range: "",
  color: "",
  budget: "",
  mileage_range: "",
  body_styles: [],
  body_style_other: "",
  payment_method: "Cash",
  comments: "",
};

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openCheckout, isOpen, CheckoutDialog } = useStripeCheckout();
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleBodyStyle = (value: string) => {
    setForm((prev) => ({
      ...prev,
      body_styles: prev.body_styles.includes(value)
        ? prev.body_styles.filter((v) => v !== value)
        : [...prev.body_styles, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = orderSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((iss) => {
        if (iss.path[0]) fieldErrors[String(iss.path[0])] = iss.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);
    try {
      const orderId = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from("special_orders")
        .insert({
          id: orderId,
          user_id: user?.id ?? null,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          make_model: form.make_model,
          year_range: form.year_range || null,
          color: form.color || null,
          budget: form.budget || null,
          mileage_range: form.mileage_range || null,
          body_styles: form.body_styles,
          body_style_other: form.body_style_other || null,
          payment_method: form.payment_method,
          comments: form.comments || null,
        });

      if (insertError) throw insertError;

      // Fire-and-forget confirmation email
      supabase.functions
        .invoke("send-transactional-email", {
          body: {
            templateName: "special-order-confirmation",
            recipientEmail: form.email,
            idempotencyKey: `special-order-${orderId}`,
            templateData: {
              fullName: form.full_name,
              makeModel: form.make_model,
              yearRange: form.year_range,
              color: form.color,
              budget: form.budget,
              paymentMethod: form.payment_method,
              orderId,
            },
          },
        })
        .catch((err) => console.warn("Confirmation email failed:", err));

      // Open Stripe checkout for the $500 deposit
      openCheckout({
        priceId: "special_order_deposit_500",
        quantity: 1,
        customerEmail: form.email,
        userId: user?.id,
        returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}&order=${orderId}`,
        title: "Special Order Deposit — $500",
      });

      toast.success("Order submitted! Complete your $500 deposit.");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to submit order. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PaymentTestModeBanner />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="border-b border-border bg-card">
          <div className="container py-16 md:py-20 max-w-4xl">
            <div className="flex items-center gap-2 text-cta text-xs font-bold tracking-widest uppercase mb-3">
              <Sparkles className="h-4 w-4" />
              Special Vehicle Orders
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">
              Can't Find It? <span className="text-cta">We'll Source It.</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Looking for a specific vehicle that isn't currently listed? Tell us
              what you want and our sourcing team will hunt it down — typically
              within 3-14 days.
            </p>
          </div>
        </section>

        {/* Why Choose */}
        <section className="container py-12 max-w-5xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
            Why Choose Our Special Order Service
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: ShieldCheck,
                title: "Personalized",
                desc: "We work closely with you to match your exact requirements.",
              },
              {
                icon: Sparkles,
                title: "Expertise",
                desc: "Deep market knowledge — we know where the deals are.",
              },
              {
                icon: Workflow,
                title: "Streamlined",
                desc: "Simple, transparent process. Updates every step.",
              },
              {
                icon: Clock,
                title: "Fast Turnaround",
                desc: "Most orders fulfilled in 3-14 days based on availability.",
              },
            ].map((item) => (
              <Card key={item.title} className="border-border bg-card">
                <CardContent className="p-5 space-y-2">
                  <item.icon className="h-6 w-6 text-cta" />
                  <h3 className="font-heading text-base font-bold text-foreground uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Form */}
        <section className="container pb-16 max-w-3xl">
          <Card className="border-border bg-card">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <Car className="h-6 w-6 text-cta" />
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Place Your Special Order
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-heading text-xs font-bold text-cta tracking-widest uppercase mb-3">
                    Customer Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field
                      label="Full Name *"
                      error={errors.full_name}
                      input={
                        <Input
                          value={form.full_name}
                          onChange={(e) => setField("full_name", e.target.value)}
                          maxLength={100}
                          placeholder="Jane Doe"
                        />
                      }
                    />
                    <Field
                      label="Email *"
                      error={errors.email}
                      input={
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => setField("email", e.target.value)}
                          maxLength={255}
                          placeholder="you@example.com"
                        />
                      }
                    />
                    <Field
                      label="Phone Number *"
                      error={errors.phone}
                      input={
                        <Input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setField("phone", e.target.value)}
                          maxLength={30}
                          placeholder="(555) 123-4567"
                        />
                      }
                    />
                  </div>
                </div>

                {/* Vehicle Preferences */}
                <div>
                  <h3 className="font-heading text-xs font-bold text-cta tracking-widest uppercase mb-3">
                    Vehicle Preferences
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field
                      label="Make and Model *"
                      error={errors.make_model}
                      input={
                        <Input
                          value={form.make_model}
                          onChange={(e) => setField("make_model", e.target.value)}
                          maxLength={120}
                          placeholder="Ford Bronco"
                        />
                      }
                    />
                    <Field
                      label="Year Range"
                      error={errors.year_range}
                      input={
                        <Input
                          value={form.year_range}
                          onChange={(e) => setField("year_range", e.target.value)}
                          maxLength={60}
                          placeholder="2021-2023"
                        />
                      }
                    />
                    <Field
                      label="Color"
                      input={
                        <Input
                          value={form.color}
                          onChange={(e) => setField("color", e.target.value)}
                          maxLength={60}
                          placeholder="Cactus Gray"
                        />
                      }
                    />
                    <Field
                      label="Budget"
                      input={
                        <Input
                          value={form.budget}
                          onChange={(e) => setField("budget", e.target.value)}
                          maxLength={60}
                          placeholder="$45,000-$55,000"
                        />
                      }
                    />
                    <Field
                      label="Mileage Range"
                      input={
                        <Input
                          value={form.mileage_range}
                          onChange={(e) =>
                            setField("mileage_range", e.target.value)
                          }
                          maxLength={60}
                          placeholder="0 - 30,000"
                        />
                      }
                    />
                  </div>
                </div>

                {/* Body Style */}
                <div>
                  <h3 className="font-heading text-xs font-bold text-cta tracking-widest uppercase mb-3">
                    Body Style
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {BODY_STYLES.map((style) => (
                      <label
                        key={style}
                        className="flex items-center gap-2 p-3 border border-border rounded-md bg-secondary/40 cursor-pointer hover:border-cta transition-colors"
                      >
                        <Checkbox
                          checked={form.body_styles.includes(style)}
                          onCheckedChange={() => toggleBodyStyle(style)}
                        />
                        <span className="text-sm text-foreground">{style}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Label className="text-xs text-muted-foreground">
                      Other (optional)
                    </Label>
                    <Input
                      value={form.body_style_other}
                      onChange={(e) =>
                        setField("body_style_other", e.target.value)
                      }
                      maxLength={60}
                      placeholder="e.g. Coupe, Wagon, Convertible"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="font-heading text-xs font-bold text-cta tracking-widest uppercase mb-3">
                    Payment Method
                  </h3>
                  <RadioGroup
                    value={form.payment_method}
                    onValueChange={(v) =>
                      setField("payment_method", v as FormState["payment_method"])
                    }
                    className="space-y-2"
                  >
                    {(["Cash", "Preapproved Financing", "Needs Financing"] as const).map(
                      (opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-3 p-3 border border-border rounded-md bg-secondary/40 cursor-pointer hover:border-cta transition-colors"
                        >
                          <RadioGroupItem value={opt} />
                          <span className="text-sm text-foreground">{opt}</span>
                        </label>
                      )
                    )}
                  </RadioGroup>
                </div>

                {/* Comments */}
                <div>
                  <h3 className="font-heading text-xs font-bold text-cta tracking-widest uppercase mb-3">
                    Additional Information
                  </h3>
                  <Label className="text-sm text-muted-foreground">
                    Comments or Special Requests
                  </Label>
                  <Textarea
                    value={form.comments}
                    onChange={(e) => setField("comments", e.target.value)}
                    maxLength={2000}
                    rows={4}
                    placeholder="Tell us anything else that matters — features, deal-breakers, preferred dealers, etc."
                    className="mt-1"
                  />
                </div>

                {/* Deposit Notice */}
                <div className="border border-cta/40 bg-cta/5 rounded-md p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cta shrink-0 mt-0.5" />
                  <div>
                    <p className="font-heading text-sm font-bold text-foreground uppercase tracking-wide">
                      $500 Refundable Deposit
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submitting this form will open secure payment for your $500
                      deposit. Once paid, our team begins sourcing your vehicle
                      and you'll receive an email confirmation.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-cta hover:bg-cta/85 text-cta-foreground font-bold uppercase tracking-wider"
                >
                  {submitting ? "Submitting..." : "Submit Order & Pay $500 Deposit"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Confirmation info */}
          <Card className="mt-6 border-border bg-card">
            <CardContent className="p-6">
              <h3 className="font-heading text-lg font-bold text-foreground uppercase tracking-wide mb-2">
                Order Confirmation
              </h3>
              <p className="text-sm text-muted-foreground">
                Once you submit your special order form along with the $500
                deposit, our team will begin the search for your vehicle. You'll
                receive a confirmation email with all the details of your order.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
      <CheckoutDialog />
    </div>
  );
}

function Field({
  label,
  error,
  input,
}: {
  label: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <div className="mt-1">{input}</div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
