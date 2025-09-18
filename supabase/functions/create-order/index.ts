// Supabase Edge Function: create-order
// Creates an order and its items using the service role so guest checkouts work with RLS

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "*",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Client to validate the user from the incoming Authorization header
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });

    // Admin client to bypass RLS for inserts
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const {
      customer_name,
      customer_email,
      status = "pending",
      total_amount,
      shipping_cost = 0,
      tax_amount = 0,
      shipping_address = null,
      notes = null,
      payment_method = "credit_card",
      payment_details = null,
      cashapp_tag = null,
      zelle_tag = null,
      items = [],
    } = await req.json();

    // Basic validation
    if (!customer_name || !customer_email || !total_amount || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid payload: missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // Determine user_id from token if available
    const { data: authData } = await supabase.auth.getUser();
    const user_id = authData?.user?.id ?? null;

    // Insert order
    const { data: orderInsert, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id,
        customer_name,
        customer_email,
        status,
        total_amount,
        shipping_cost,
        tax_amount,
        shipping_address,
        notes,
        payment_method,
        payment_details,
        cashapp_tag,
        zelle_tag,
      })
      .select("*")
      .single();

    if (orderError || !orderInsert) {
      console.error("[EDGE:create-order] Order insert failed", orderError);
      return new Response(
        JSON.stringify({ error: orderError?.message ?? "Order insert failed" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const orderId = orderInsert.id;

    // Prepare and insert order_items
    const itemsPayload = items.map((it: any) => ({
      order_id: orderId,
      product_id: typeof it.product_id === "string" ? it.product_id : null,
      product_name: it.product_name,
      quantity: Number(it.quantity ?? 1),
      price: Number(it.price),
      sku: it.sku ?? null,
      packaging: it.packaging ?? null,
      epa_approved: Boolean(it.epa_approved ?? false),
    }));

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(itemsPayload);
    if (itemsError) {
      // Attempt cleanup to avoid orphan orders
      await supabaseAdmin.from("orders").delete().eq("id", orderId);
      console.error("[EDGE:create-order] Order items insert failed", itemsError);
      return new Response(
        JSON.stringify({ error: itemsError.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // Fetch full order with items to return
    const { data: fullOrder, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select(
        `*, order_items (id, product_id, product_name, quantity, price, sku, packaging, epa_approved)`,
      )
      .eq("id", orderId)
      .single();

    if (fetchError || !fullOrder) {
      return new Response(
        JSON.stringify({ error: fetchError?.message ?? "Failed to fetch created order" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    return new Response(
      JSON.stringify({ order: fullOrder }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (err) {
    console.error("[EDGE:create-order] Unhandled error", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
