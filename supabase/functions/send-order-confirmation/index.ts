import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { sendAndLog } from "../_shared/transactional-email-templates/send-and-log.ts";
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const db = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const UUID = /^[0-9a-f-]{36}$/i;
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { orderId } = await req.json();
    if (typeof orderId !== "string" || !UUID.test(orderId)) return json({ error: "Invalid order" }, 400);
    const { data: o } = await db().from("orders").select("id, customer_email, customer_name, order_number, total_amount, order_items(*)").eq("id", orderId).maybeSingle();
    if (!o?.customer_email) return json({ error: "Order not found" }, 404);
    return json(await sendAndLog("order-confirmation", o.customer_email, {
      templateData: { customerName: o.customer_name, orderNumber: o.order_number, totalAmount: o.total_amount, items: o.order_items ?? [] },
      idempotencyKey: `order-confirm-${o.id}`,
    }));
  } catch { return json({ error: "Invalid request" }, 400); }
});
