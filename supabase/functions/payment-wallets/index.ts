import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ORDER_NUMBER_REGEX = /^ORD-\d{8}-[a-z0-9]{4,12}$/i;

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let orderNumber: string | null = null;
    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (typeof body?.order_number === "string") {
          orderNumber = body.order_number.trim();
        }
      } catch {
        // no body — treat as a public availability lookup
      }
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    // Receiving addresses are only released once a real order exists for them.
    let revealAddresses = false;
    if (orderNumber) {
      if (!ORDER_NUMBER_REGEX.test(orderNumber)) {
        return jsonResponse({ error: "Invalid order reference" }, 400);
      }
      const { data: order, error: orderError } = await serviceClient
        .from("orders")
        .select("order_number")
        .eq("order_number", orderNumber)
        .maybeSingle();

      if (orderError) {
        console.error("Order lookup failed:", orderError);
        return jsonResponse({ error: "Unable to verify order" }, 500);
      }
      if (!order) {
        return jsonResponse({ error: "Order not found" }, 404);
      }
      revealAddresses = true;
    }

    const { data: wallets, error } = await serviceClient
      .from("payment_wallet_addresses")
      .select("id, payment_type, wallet_address, qr_code_url, label, is_active, created_at, updated_at")
      .eq("is_active", true)
      .order("payment_type", { ascending: true });

    if (error) {
      console.error("Wallet lookup failed:", error);
      return jsonResponse({ error: "Unable to load payment methods" }, 500);
    }

    const payload = (wallets ?? []).map((wallet) => ({
      ...wallet,
      wallet_address: revealAddresses ? wallet.wallet_address : "",
      qr_code_url: revealAddresses ? wallet.qr_code_url : null,
    }));

    return jsonResponse({ wallets: payload, addresses_included: revealAddresses });
  } catch (err) {
    console.error("payment-wallets error:", err);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});
