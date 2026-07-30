import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Must stay in sync with supabase/functions/send-transactional-email/index.ts
const EXPECTED_SENDER_DOMAIN = "notify.alperrefrigerants.com";
const EXPECTED_FROM_DOMAIN = "alperrefrigerants.com";
const EXPECTED_FROM_ADDRESS = `noreply@${EXPECTED_FROM_DOMAIN}`;

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    // --- Admin-only ---
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) return json({ error: "Unauthorized" }, 401);

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "Forbidden" }, 403);

    const expected = {
      sender_domain: EXPECTED_SENDER_DOMAIN,
      from_domain: EXPECTED_FROM_DOMAIN,
      from_address: EXPECTED_FROM_ADDRESS,
    };

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!lovableApiKey || !resendApiKey) {
      return json({
        expected,
        provider_reachable: false,
        status: "unknown",
        message: "Resend connector credentials are not configured for this project.",
        domains: [],
      });
    }

    const response = await fetch(`${GATEWAY_URL}/domains`, {
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": resendApiKey,
      },
    });

    if (!response.ok) {
      const details = await response.text();
      console.error(`Resend domains lookup failed [${response.status}]: ${details}`);
      return json({
        expected,
        provider_reachable: false,
        status: "error",
        message: `Resend request failed (${response.status})`,
        details,
        domains: [],
      });
    }

    const payload = await response.json();
    const domains: Array<{ name?: string; status?: string; region?: string; id?: string }> =
      payload?.data ?? payload?.domains ?? [];

    const normalized = domains.map((d) => ({
      id: d.id ?? null,
      name: d.name ?? "",
      status: d.status ?? "unknown",
      region: d.region ?? null,
    }));

    const senderMatch = normalized.find((d) => d.name === EXPECTED_SENDER_DOMAIN);
    const rootMatch = normalized.find((d) => d.name === EXPECTED_FROM_DOMAIN);
    const usable = senderMatch ?? rootMatch;
    const verified = usable?.status === "verified";

    return json({
      expected,
      provider_reachable: true,
      status: !usable ? "missing" : verified ? "verified" : "pending",
      matched_domain: usable ?? null,
      sender_domain_found: Boolean(senderMatch),
      root_domain_found: Boolean(rootMatch),
      message: !usable
        ? `Neither ${EXPECTED_SENDER_DOMAIN} nor ${EXPECTED_FROM_DOMAIN} exists in Resend. Add and verify it before transactional email will send.`
        : verified
          ? `${usable.name} is verified in Resend. Transactional email sends as ${EXPECTED_FROM_ADDRESS}.`
          : `${usable.name} exists in Resend but its status is "${usable.status}". Finish the DNS records to verify it.`,
      domains: normalized,
    });
  } catch (error) {
    console.error("check-email-domain error", error);
    return json({ error: (error as Error).message }, 500);
  }
});
