// Refrigerant advisor: recommends refrigerants for a contractor's equipment via Lovable AI Gateway.
// Requires a signed-in user. Grounds suggestions in the live product catalog.
import { createClient } from "npm:@supabase/supabase-js@2";
import { generateResponse, GatewayError } from "npm:@lovable.dev/ai-gateway";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "recommendations", "cautions", "standards"],
  properties: {
    summary: { type: "string" },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["refrigerant", "fit", "safety_class", "gwp", "reasons", "considerations", "in_catalog"],
        properties: {
          refrigerant: { type: "string" },
          fit: { type: "string", enum: ["best", "good", "conditional"] },
          safety_class: { type: "string" },
          gwp: { type: "string" },
          reasons: { type: "array", items: { type: "string" } },
          considerations: { type: "array", items: { type: "string" } },
          in_catalog: { type: "boolean" },
        },
      },
    },
    cautions: { type: "array", items: { type: "string" } },
    standards: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["code", "title", "relevance"],
        properties: { code: { type: "string" }, title: { type: "string" }, relevance: { type: "string" } },
      },
    },
  },
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return json({ error: "Please sign in to use the refrigerant advisor." }, 401);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }
  const equipment = str(body.equipment, 300);
  const application = str(body.application, 100);
  const currentRefrigerant = str(body.currentRefrigerant, 60);
  const region = str(body.region, 60);
  const details = str(body.details, 1500);
  if (!equipment || !application) return json({ error: "Equipment and application are required." }, 400);

  const { data: products } = await supabase
    .from("products").select("name").eq("product_type", "refrigerant").limit(60);
  const catalog = (products ?? []).map((p) => p.name).join("; ") || "(catalog unavailable)";

  const instructions = `You are a senior HVAC/R refrigerant engineer advising licensed contractors.
Recommend 1-4 suitable refrigerants for the described equipment. Be technically accurate and conservative.
- Cite only real, well-known standards and regulations (e.g. ASHRAE 15, ASHRAE 34, UL 60335-2-40, UL 60335-2-89, EPA Section 608, EPA SNAP, AIM Act Technology Transitions rule, EU F-Gas Regulation 2024/573, ISO 5149, IEC 60335-2-40). Never invent standard numbers or clauses; if unsure, cite at the standard level only.
- Use ASHRAE 34 safety classes (A1, A2L, A3, B1...) and approximate AR5/AR4 GWP values; state the basis.
- Never recommend dropping a flammable (A2L/A3) refrigerant into equipment not designed for it; flag retrofits needing manufacturer approval.
- Mark in_catalog true only if the refrigerant appears in this supplier catalog: ${catalog}.
- Remind that EPA 608 certification is required to purchase/handle regulated refrigerants and that the equipment manufacturer's specifications take precedence.
Return JSON matching the schema.`;

  const input = `Return JSON.
Equipment: ${equipment}
Application: ${application}
Current refrigerant: ${currentRefrigerant || "not stated"}
Region/jurisdiction: ${region || "United States"}
Additional details: ${details || "none"}`;

  try {
    const res = await generateResponse({
      model: "openai/gpt-6-astra",
      instructions,
      input,
      text: { format: { type: "json_schema", name: "refrigerant_advice", strict: true, schema: SCHEMA } },
    });
    // deno-lint-ignore no-explicit-any
    const r = res as any;
    const text: string = r.output_text ??
      (r.output ?? []).flatMap((o: any) => o.content ?? []).filter((c: any) => c.type === "output_text").map((c: any) => c.text).join("");
    if (!text) return json({ error: "The advisor returned no answer. Please try again." }, 502);
    return json({ advice: JSON.parse(text) });
  } catch (e) {
    if (e instanceof GatewayError) {
      console.error("advisor gateway error", e.code, e.httpStatus, e.ids);
      const status = e.httpStatus === 429 ? 429 : e.httpStatus === 402 ? 402 : 502;
      const msg = status === 429 ? "The advisor is busy. Please wait a moment and try again."
        : status === 402 ? "The advisor is temporarily unavailable." : "The advisor could not complete this request.";
      return json({ error: msg }, status);
    }
    console.error("advisor error", e);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
