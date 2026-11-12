import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

// Admin-only: emails ONE buyer the Zelle details for ONE order on request.
// Zelle is never shown on the storefront, checkout, feeds or PDF invoices (GMC rule).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const SENDER_DOMAIN = "notify.alperrefrigerants.com";
const FROM_EMAIL = "Alper Refrigerants <invoices@alperrefrigerants.com>";
const REPLY_TO = "sales@alperrefrigerants.com";

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

const Body = z.object({
  orderId: z.string().uuid(),
  recipientEmail: z.string().trim().email().max(255),
  zelleName: z.string().trim().min(1).max(120),
  zelleContact: z.string().trim().min(3).max(120),
  note: z.string().trim().max(1000).optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const url = Deno.env.get("SUPABASE_URL")!;
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) return json({ error: "Server configuration error" }, 500);

    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "").trim();
    if (!token) return json({ error: "Unauthorized" }, 401);
    const admin = createClient(url, key);
    const { data: u } = await admin.auth.getUser(token);
    if (!u?.user) return json({ error: "Unauthorized" }, 401);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Forbidden" }, 403);

    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const { orderId, recipientEmail, zelleName, zelleContact, note } = parsed.data;

    const { data: order } = await admin.from("orders")
      .select("id, order_number, customer_name, total_amount").eq("id", orderId).maybeSingle();
    if (!order) return json({ error: "Order not found" }, 404);

    const total = `USD ${Number(order.total_amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:#0f172a;padding:28px;text-align:center;">
    <h1 style="color:#22d3ee;margin:0;font-size:22px;">Payment details for order #${esc(order.order_number)}</h1>
  </div>
  <div style="padding:24px;color:#334155;font-size:14px;">
    <p>Dear ${esc(order.customer_name)},</p>
    <p>As discussed, here are the Zelle details to pay for your order.</p>
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="margin:0 0 6px;"><strong>Order:</strong> #${esc(order.order_number)}</p>
      <p style="margin:0 0 6px;"><strong>Amount due:</strong> ${esc(total)}</p>
      <p style="margin:0 0 6px;"><strong>Zelle name:</strong> ${esc(zelleName)}</p>
      <p style="margin:0;"><strong>Zelle email / phone:</strong> ${esc(zelleContact)}</p>
    </div>
    <p>Please put <strong>#${esc(order.order_number)}</strong> in the Zelle memo so we can match your payment.</p>
    ${note ? `<p style="white-space:pre-line;">${esc(note)}</p>` : ""}
    <p style="color:#64748b;">Questions? Reply to this email or contact ${REPLY_TO} · +1-786-987-0501.</p>
  </div>
  <div style="background:#f8fafc;padding:14px;text-align:center;border-top:1px solid #e2e8f0;">
    <p style="margin:0;color:#94a3b8;font-size:12px;">Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</p>
  </div>
</div>`;
    const text = `Payment details for order #${order.order_number}\nAmount due: ${total}\nZelle name: ${zelleName}\nZelle email/phone: ${zelleContact}\nMemo: #${order.order_number}\n${note ?? ""}`;

    const r = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}`, "X-Connection-Api-Key": RESEND_API_KEY },
      body: JSON.stringify({
        from: FROM_EMAIL, sender_domain: SENDER_DOMAIN, to: [recipientEmail], reply_to: REPLY_TO,
        subject: `Payment details for order #${order.order_number} - Alper Refrigerants`, html, text,
      }),
    });
    const result = await r.json().catch(() => ({}));
    if (!r.ok) return json({ error: (result as any)?.message || `Email provider rejected the send (${r.status})` }, 502);

    await admin.from("admin_audit_log").insert({
      admin_id: u.user.id, admin_email: u.user.email, action: "order.zelle_details_sent",
      resource_type: "order", resource_id: order.id, resource_label: order.order_number,
      new_value: { recipient: recipientEmail, zelle_name: zelleName, zelle_contact: zelleContact },
    });
    return json({ success: true });
  } catch (e) {
    console.error("send-zelle-details error", e);
    return json({ error: "Internal server error" }, 500);
  }
});
