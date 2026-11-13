import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { sendAndLog } from "../_shared/transactional-email-templates/send-and-log.ts";
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const db = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const UUID = /^[0-9a-f-]{36}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { email, name, subject, contactId } = await req.json();
    if (typeof email !== "string" || !EMAIL.test(email) || email.length > 255) return json({ error: "Invalid email" }, 400);
    const r = await sendAndLog("contact-confirmation", email, {
      templateData: { name: String(name ?? "").slice(0, 100), subject: String(subject ?? "").slice(0, 200) },
      idempotencyKey: `contact-confirm-${String(contactId ?? crypto.randomUUID()).slice(0, 64)}`,
    });
    return json(r);
  } catch { return json({ error: "Invalid request" }, 400); }
});
