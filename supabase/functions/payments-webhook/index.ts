import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook, createStripeClient } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Map product_id (human-readable, e.g. "broker_pro") → role to grant
const BROKER_PRODUCTS = new Set(["broker_starter", "broker_pro", "broker_elite"]);

async function sendConfirmationEmail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!RESEND_API_KEY || !LOVABLE_API_KEY) {
    console.log("[email] Resend not configured — skipping confirmation email");
    return;
  }
  try {
    const r = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "Autowurx <onboarding@resend.dev>",
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!r.ok) console.error("[email] Send failed:", await r.text());
  } catch (e) {
    console.error("[email] Error:", e);
  }
}

async function grantBrokerRoleIfNeeded(userId: string, productId: string) {
  if (!BROKER_PRODUCTS.has(productId)) return;
  const { error } = await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role: "broker" as any }, { onConflict: "user_id,role", ignoreDuplicates: true });
  if (error) console.error("[role] grant broker failed:", error);
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const env = (url.searchParams.get("env") || "sandbox") as StripeEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log("[webhook]", event.type, "env:", env);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object, env);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpsert(event.data.object, env);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object, env);
        break;
      case "invoice.payment_failed":
        console.log("[webhook] payment_failed:", event.data.object.id);
        break;
      default:
        console.log("[webhook] unhandled:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("[webhook] error:", e.message);
    return new Response("Webhook error", { status: 400 });
  }
});

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  const userId = session.metadata?.userId || null;
  const productId = session.metadata?.productId || "";
  const priceId = session.metadata?.priceId || "";
  const customerEmail = session.customer_details?.email || session.customer_email;

  if (session.mode === "payment") {
    // One-time purchase
    await supabase.from("purchases").upsert(
      {
        user_id: userId,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        product_id: productId,
        price_id: priceId,
        amount_cents: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
        status: "completed",
        environment: env,
        metadata: session.metadata ?? {},
      },
      { onConflict: "stripe_session_id" }
    );

    if (customerEmail) {
      await sendConfirmationEmail({
        to: customerEmail,
        subject: "Your Autowurx purchase is confirmed",
        html: `<h2>Thanks for your purchase!</h2><p>We've received your payment of $${((session.amount_total ?? 0) / 100).toFixed(2)} for <strong>${productId}</strong>.</p><p>You can view your purchases anytime in your dashboard.</p>`,
      });
    }
  }
}

async function handleSubscriptionUpsert(subscription: any, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("[webhook] no userId in subscription metadata");
    return;
  }

  const item = subscription.items?.data?.[0];
  const stripe = createStripeClient(env);
  const productStripeId = item?.price?.product as string | undefined;

  // Resolve human-readable product_id
  let productId = "";
  let priceId = item?.price?.metadata?.lovable_external_id || item?.price?.id || "";
  if (productStripeId) {
    try {
      const product = await stripe.products.retrieve(productStripeId);
      productId = product.metadata?.lovable_external_id || product.id;
    } catch {
      productId = productStripeId;
    }
  }

  const periodStart = subscription.current_period_start;
  const periodEnd = subscription.current_period_end;

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      product_id: productId,
      price_id: priceId,
      status: subscription.status,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  );

  // Grant role + send welcome on new active sub
  if (subscription.status === "active" || subscription.status === "trialing") {
    await grantBrokerRoleIfNeeded(userId, productId);
    // Fetch user email for welcome
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("user_id", userId)
      .maybeSingle();
    if (profile?.email) {
      await sendConfirmationEmail({
        to: profile.email,
        subject: `Welcome to ${productId.replace(/_/g, " ")}`,
        html: `<h2>Your subscription is active</h2><p>You're now subscribed to <strong>${productId}</strong>. All premium features are unlocked.</p><p>Manage your billing anytime from your dashboard.</p>`,
      });
    }
  }
}

async function handleSubscriptionDeleted(subscription: any, env: StripeEnv) {
  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);
}
