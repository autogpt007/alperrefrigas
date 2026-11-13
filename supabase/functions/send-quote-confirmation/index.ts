import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { sendAndLog } from "../_shared/transactional-email-templates/send-and-log.ts";
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const db = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const UUID = /^[0-9a-f-]{36}$/i;
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { quoteId } = await req.json();
    if (typeof quoteId !== "string" || !UUID.test(quoteId)) return json({ error: "Invalid quote" }, 400);
    const { data: q } = await db().from("quotes").select("id, customer_email, customer_name, quote_number").eq("id", quoteId).maybeSingle();
    if (!q?.customer_email) return json({ error: "Quote not found" }, 404);
    return json(await sendAndLog("quote-confirmation", q.customer_email, {
      templateData: { customerName: q.customer_name, quoteNumber: q.quote_number },
      idempotencyKey: `quote-confirm-${q.id}`,
    }));
  } catch { return json({ error: "Invalid request" }, 400); }
});
