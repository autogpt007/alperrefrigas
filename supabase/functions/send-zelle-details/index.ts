import { sendAndLog } from "../_shared/transactional-email-templates/send-and-log.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

// Admin-only: emails ONE buyer the Zelle details for ONE order on request.
// Zelle is never shown on the storefront, checkout, feeds or PDF invoices (GMC rule).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const REPLY_TO = "sales@alperrefrigerants.com";

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

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
    const url = Deno.env.get("SUPABASE_URL")!;
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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
    const r = await sendAndLog("zelle-payment-details", recipientEmail, {
      templateData: { customerName: order.customer_name, orderNumber: order.order_number, total, zelleName, zelleContact, note },
      replyTo: REPLY_TO,
    });
    if (!r.sent) return json({ error: r.reason === "recipient_suppressed" ? "This buyer's email is blocked (bounced or unsubscribed earlier)." : (r.error || "Email could not be sent") }, 502);

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
