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
      phone = null,
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

    // Enhanced validation with clearer error messages
    if (!customer_name?.trim()) {
      return new Response(
        JSON.stringify({ error: "Customer name is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }
    
    if (!customer_email?.trim() || !customer_email.includes('@')) {
      return new Response(
        JSON.stringify({ error: "Valid customer email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    if (typeof total_amount !== 'number' || total_amount < 0) {
      return new Response(
        JSON.stringify({ error: "Total amount must be a valid positive number" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Order must contain at least one item" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // Validate each order item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.product_name?.trim()) {
        return new Response(
          JSON.stringify({ error: `Item ${i + 1}: Product name is required` }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
      }
      if (typeof item.price !== 'number' || item.price < 0) {
        return new Response(
          JSON.stringify({ error: `Item ${i + 1}: Price must be a valid positive number` }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return new Response(
          JSON.stringify({ error: `Item ${i + 1}: Quantity must be a positive integer` }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
      }
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
        phone,
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
      console.error("[EDGE:create-order] Order insert failed:", {
        error: orderError,
        customer_email: customer_email,
        user_id: user_id,
        total_amount: total_amount,
        items_count: items.length
      });
      return new Response(
        JSON.stringify({ 
          error: orderError?.message ?? "Failed to create order. Please check your information and try again." 
        }),
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
      console.error("[EDGE:create-order] Order items insert failed:", {
        error: itemsError,
        order_id: orderId,
        items_payload: itemsPayload
      });
      return new Response(
        JSON.stringify({ 
          error: "Failed to add items to order. Please check your cart items and try again." 
        }),
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
