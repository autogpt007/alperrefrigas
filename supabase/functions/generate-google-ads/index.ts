// Edge function: generate Google Ads asset pack via Lovable AI Gateway.
// Admin-only: requires authenticated admin user (verified via has_role).

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AD_PACK_TOOL = {
  type: "function",
  function: {
    name: "generate_ad_pack",
    description: "Return a complete, Google-Ads-compliant asset pack.",
    parameters: {
      type: "object",
      properties: {
        campaignNames: { type: "array", items: { type: "string" } },
        campaignTypeRecommendation: {
          type: "object",
          properties: { type: { type: "string" }, rationale: { type: "string" } },
          required: ["type", "rationale"],
        },
        geoTargeting: { type: "array", items: { type: "string" } },
        bidStrategy: {
          type: "object",
          properties: { strategy: { type: "string" }, rationale: { type: "string" } },
          required: ["strategy", "rationale"],
        },
        budgetGuidance: {
          type: "object",
          properties: {
            dailyMin: { type: "number" },
            dailyMax: { type: "number" },
            currency: { type: "string" },
          },
          required: ["dailyMin", "dailyMax", "currency"],
        },
        adGroups: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              theme: { type: "string" },
              intentStage: { type: "string", enum: ["TOFU", "MOFU", "BOTM"] },
              finalUrl: { type: "string" },
              headlines: { type: "array", items: { type: "string" }, minItems: 15, maxItems: 15 },
              descriptions: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
              paths: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2 },
              sitelinks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    text: { type: "string" },
                    desc1: { type: "string" },
                    desc2: { type: "string" },
                    url: { type: "string" },
                  },
                  required: ["text", "desc1", "desc2", "url"],
                },
              },
              callouts: { type: "array", items: { type: "string" } },
              snippets: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    header: { type: "string" },
                    values: { type: "array", items: { type: "string" } },
                  },
                  required: ["header", "values"],
                },
              },
              promotions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    occasion: { type: "string" },
                    item: { type: "string" },
                    discountType: { type: "string", enum: ["PERCENT", "MONETARY"] },
                    discountValue: { type: "number" },
                  },
                  required: ["item", "discountType", "discountValue"],
                },
              },
              keywords: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    keyword: { type: "string" },
                    match: { type: "string", enum: ["BROAD", "PHRASE", "EXACT"] },
                    intent: { type: "string" },
                  },
                  required: ["keyword", "match", "intent"],
                },
              },
              negatives: {
                type: "array",
                items: {
                  type: "object",
                  properties: { keyword: { type: "string" }, reason: { type: "string" } },
                  required: ["keyword", "reason"],
                },
              },
              seo: {
                type: "object",
                properties: {
                  h1: { type: "string" },
                  metaTitle: { type: "string" },
                  metaDescription: { type: "string" },
                  schemaType: { type: "string" },
                },
                required: ["h1", "metaTitle", "metaDescription", "schemaType"],
              },
            },
            required: [
              "name", "theme", "intentStage", "finalUrl",
              "headlines", "descriptions", "paths",
              "sitelinks", "callouts", "snippets", "promotions",
              "keywords", "negatives", "seo",
            ],
          },
        },
        imageAssetPrompts: { type: "array", items: { type: "string" } },
        leadFormAssets: {
          type: "array",
          items: {
            type: "object",
            properties: { headline: { type: "string" }, cta: { type: "string" } },
            required: ["headline", "cta"],
          },
        },
      },
      required: ["campaignNames", "adGroups"],
    },
  },
};

function buildSystemPrompt(productType: string) {
  const refrigerantRules = `
REFRIGERANT-SPECIFIC RULES (this campaign IS for refrigerants):
- Every ad group's copy must include EPA 608 / certified-buyer / B2B / wholesale language somewhere across headlines or descriptions.
- Never target consumers / DIY / home-use audiences.
- Reference DOT HazMat-compliant shipping where natural.
- Add negative keywords: "diy", "home use", "household", "consumer", "free sample".`;
  const acRules = `
AIR CONDITIONER RULES (this campaign IS for air conditioners):
- Do NOT include EPA 608, DOT HazMat, or F-Gas disclaimers.
- Keep copy focused on the AC product/install benefits.`;

  return `You are a senior Google Ads strategist generating a fully compliant, SEO-optimized ad asset pack.

GOOGLE ADS EDITORIAL LIMITS (HARD):
- Headline ≤ 30 chars
- Description ≤ 90 chars
- Display path ≤ 15 chars
- Sitelink text ≤ 25 chars; sitelink description ≤ 35 chars
- Callout ≤ 25 chars
- Promotion item ≤ 20 chars
- Meta title ≤ 60 chars; meta description ≤ 155 chars

GOOGLE ADS EDITORIAL POLICY:
- Maximum one "!" per asset (none in headlines).
- No more than one ALL-CAPS word per asset; brand acronyms (EPA, DOT, HVAC, B2B, HFO, HFC, USA) are exempt.
- No phone numbers in headlines.
- No prohibited superlatives without proof ("cheapest", "#1", "guaranteed").
- No competitor trademarks.
- Each asset must be unique within its group.

OUTPUT REQUIREMENTS:
- Return EXACTLY 15 headlines, 4 descriptions, 2 display paths per ad group.
- Provide 3-6 themed ad groups covering different intent stages.
- Each ad group includes: 6 sitelinks, 8 callouts, 2 structured snippets, 2-4 promotions, 10-20 keywords (mixed match types), 8+ negatives, full SEO meta.
- finalUrl must be a relative path on alperrefrigerants.com (e.g. /products/r-454b).
- Suggest a Schema.org type (Product, Service, or Offer).

${productType === "refrigerant" ? refrigerantRules : ""}
${productType === "air_conditioner" ? acRules : ""}

You MUST call the generate_ad_pack tool. Do NOT return free text.`;
}

function serverComplianceCheck(pack: any) {
  const issues: any[] = [];
  const limits: Record<string, number> = {
    headlines: 30, descriptions: 90, paths: 15,
  };
  (pack.adGroups || []).forEach((g: any, gi: number) => {
    ["headlines", "descriptions", "paths"].forEach((k) => {
      (g[k] || []).forEach((v: string, i: number) => {
        if (typeof v === "string" && v.length > limits[k]) {
          issues.push({
            field: `adGroups[${gi}].${k}[${i}]`,
            level: "blocked",
            reason: `${v.length} chars — exceeds ${limits[k]}`,
          });
        }
      });
    });
  });
  const summary = {
    pass: 0,
    warning: issues.filter((i) => i.level === "warning").length,
    blocked: issues.filter((i) => i.level === "blocked").length,
  };
  return { issues, summary };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI gateway not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth check — require admin
    const authHeader = req.headers.get("Authorization") || "";
    const supa = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userRes, error: userErr } = await supa.auth.getUser();
    if (userErr || !userRes.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roleData } = await supa
      .from("user_roles")
      .select("role")
      .eq("user_id", userRes.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { goal, brief } = body;
    const model = body.model || "google/gemini-3-flash-preview";

    if (!goal || !brief || !brief.productName) {
      return new Response(JSON.stringify({ error: "Missing goal or brief" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = `
GOAL
- Campaign name: ${goal.campaignName}
- Primary goal: ${goal.primaryGoal}
- Conversion action: ${goal.conversionAction}
- Success metric: ${goal.successMetric}
- Time horizon: ${goal.timeHorizon}
- Budget tier: ${goal.budgetTier}
- Notes: ${goal.freeText || "(none)"}

BRIEF
- Product/service: ${brief.productName}
- Product type: ${brief.productType}
- Audience: ${brief.audience}
- Geography: ${brief.geography}
- Tone: ${brief.tone}
- Offer: ${brief.offer || "(none)"}
- USPs:\n${brief.usps || "(none)"}
- Do-not-say: ${brief.bannedTerms || "(none)"}
- Additional context: ${brief.freeText || "(none)"}

Now call the generate_ad_pack tool with a complete asset pack for this campaign.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: buildSystemPrompt(brief.productType) },
          { role: "user", content: userPrompt },
        ],
        tools: [AD_PACK_TOOL],
        tool_choice: { type: "function", function: { name: "generate_ad_pack" } },
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited (429). Please retry." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted (402). Top up in workspace settings." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, t);
      return new Response(JSON.stringify({ error: `AI gateway error ${aiRes.status}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const toolCall = aiJson?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in AI response", JSON.stringify(aiJson).slice(0, 500));
      return new Response(JSON.stringify({ error: "AI did not return a structured pack" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let pack: any;
    try {
      pack = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Failed to parse AI output" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const report = serverComplianceCheck(pack);

    return new Response(JSON.stringify({ pack, report, model }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-google-ads error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
