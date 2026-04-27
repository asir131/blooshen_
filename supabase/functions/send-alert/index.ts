// AutoWurx Send Alert
// Sends an email notification for a critical system alert. Uses Lovable's
// transactional email queue when available; falls back gracefully if not.
// Authenticated; admin / master_admin only.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface SendAlertBody {
  alert_id?: string;
  to?: string;
  subject?: string;
  message?: string;
  alert_type?: "critical" | "warning" | "info";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // ---- Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }
    const userId = claimsData.claims.sub as string;

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: roleRows } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const roles = (roleRows ?? []).map((r) => r.role);
    if (!roles.includes("admin") && !roles.includes("master_admin")) {
      return jsonResponse({ success: false, error: "Forbidden" }, 403);
    }

    const body = (await req.json().catch(() => ({}))) as SendAlertBody;

    // ---- Resolve alert content (either passed in or loaded from system_alerts)
    let subject = body.subject ?? "";
    let message = body.message ?? "";
    let alertType = body.alert_type ?? "info";

    if (body.alert_id) {
      const { data: alert } = await admin
        .from("system_alerts")
        .select("alert_type, title, message")
        .eq("id", body.alert_id)
        .maybeSingle();
      if (alert) {
        subject = subject || `[AutoWurx ${alert.alert_type.toUpperCase()}] ${alert.title}`;
        message = message || alert.message;
        alertType = (alert.alert_type as typeof alertType) || alertType;
      }
    }

    if (!subject || !message) {
      return jsonResponse(
        { success: false, error: "subject and message (or alert_id) are required" },
        400,
      );
    }

    // ---- Resolve recipients
    let recipients: string[] = [];
    if (body.to) {
      recipients = [body.to];
    } else {
      // Fan out to all master_admins
      const { data: masterRoles } = await admin
        .from("user_roles")
        .select("user_id")
        .eq("role", "master_admin");
      const ids = (masterRoles ?? []).map((r) => r.user_id);
      if (ids.length > 0) {
        const { data: profs } = await admin
          .from("profiles")
          .select("email")
          .in("user_id", ids);
        recipients = (profs ?? [])
          .map((p) => p.email)
          .filter((e): e is string => !!e);
      }
    }

    // ---- Try to enqueue via the email queue (Lovable Emails). If not
    // available, just record the attempt and return success.
    let queued = 0;
    for (const to of recipients) {
      try {
        const { error: enqErr } = await admin.rpc("enqueue_email", {
          queue_name: "transactional_emails",
          payload: {
            to,
            subject,
            html: `<div style="font-family:DM Sans,sans-serif;background:#0A0A0A;color:#fff;padding:24px;">
              <h1 style="color:#FFE000;font-family:'Bebas Neue',sans-serif;letter-spacing:2px;">AutoWurx Alert</h1>
              <p><strong>${subject}</strong></p>
              <p>${message}</p>
              <p style="color:#888;font-size:12px;margin-top:24px;">
                Severity: ${alertType.toUpperCase()}
              </p>
            </div>`,
            text: `${subject}\n\n${message}\n\nSeverity: ${alertType.toUpperCase()}`,
            template_name: "system_alert",
          } as never,
        });
        if (!enqErr) queued += 1;
      } catch (err) {
        console.warn("[send-alert] enqueue failed for", to, err);
      }
    }

    // ---- Audit log
    await admin.from("audit_logs").insert({
      user_id: userId,
      action: "ALERT_DISPATCHED",
      entity_type: body.alert_id ? "system_alert" : "system",
      entity_id: body.alert_id ?? null,
      metadata: {
        recipients,
        queued,
        alert_type: alertType,
        subject,
      } as never,
    });

    return jsonResponse({
      success: true,
      data: { recipients: recipients.length, queued },
    });
  } catch (err) {
    console.error("[send-alert] error", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse({ success: false, error: message }, 500);
  }
});
