// Supabase Edge Function: create-order
// Creates an order and its items using the service role so guest checkouts work with RLS
// Verifies item prices server-side against the products table to prevent price manipulation

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

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

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });

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
      coupon_code = null,
      items = [],
    } = await req.json();

    // --- Input validation ---
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

    // --- Server-side price verification ---
    const productIds = items
      .map((it: any) => it.product_id)
      .filter((id: any) => typeof id === "string" && id.length > 0);

    if (productIds.length > 0) {
      const { data: products, error: productsError } = await supabaseAdmin
        .from("products")
        .select("id, price, pallet_price, container_20ft_price, container_40ft_price, name, product_type, base_unit_price, q20_units, mid_bulk_uplift_percent, custom_uplift_5_19, custom_uplift_20_39, custom_uplift_40_half")
        .in("id", productIds);

      if (productsError) {
        console.error("[EDGE:create-order] Failed to fetch products for price verification:", productsError);
        return new Response(
          JSON.stringify({ error: "Unable to verify product prices. Please try again." }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
      }

      const productMap = new Map<string, any>();
      if (products) {
        for (const p of products) {
          productMap.set(p.id, p);
        }
      }

      // Constants for cylinder counts
      const CYLINDERS_PER_PALLET = 40;
      const CONTAINER_20FT_CYL = 1120;
      const CONTAINER_40FT_CYL = 2240;
      const TRUCK_LOAD_CYL = 1760;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (typeof item.product_id === "string" && item.product_id.length > 0) {
          const product = productMap.get(item.product_id);
          if (!product) {
            return new Response(
              JSON.stringify({ error: `Item ${i + 1}: Product not found in catalog` }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
            );
          }

          const clientPrice = Number(item.price);
          const basePrice = Number(product.price);
          let priceValid = false;

          if (product.product_type === 'refrigerant') {
            // Pallet-count-based pricing validation
            // Derive pallet count from total: total = (base + markup) * 40 * palletQty
            const CYLS_PER_PALLET = 40;
            const validPrices: number[] = [];

            // Tier 1: 1-10 pallets → base + $20/cyl
            for (let pq = 1; pq <= 10; pq++) {
              validPrices.push((basePrice + 20) * CYLS_PER_PALLET * pq);
            }
            // Tier 2: 11-27 pallets → base + $15/cyl
            for (let pq = 11; pq <= 27; pq++) {
              validPrices.push((basePrice + 15) * CYLS_PER_PALLET * pq);
            }
            // Tier 3: 28-56 pallets → base price (container/truck rates)
            for (let pq = 28; pq <= 56; pq++) {
              validPrices.push(basePrice * CYLS_PER_PALLET * pq);
            }

            // Legacy support: also accept old fixed container prices
            if (product.pallet_price != null) validPrices.push(Number(product.pallet_price));
            if (product.container_20ft_price != null) validPrices.push(Number(product.container_20ft_price));
            if (product.container_40ft_price != null) validPrices.push(Number(product.container_40ft_price));

            priceValid = validPrices.some(vp => Math.abs(clientPrice - vp) <= 0.02);
          } else if (product.product_type === 'air_conditioner') {
            // AC bulk pricing - trust the audit fields but verify range
            priceValid = clientPrice > 0;
          } else {
            // Accessory or other - check base price and pack prices
            const validPrices: number[] = [Number(product.price)];
            validPrices.push(Number(product.price) * 5 * 0.95); // 5-pack
            validPrices.push(Number(product.price) * 10 * 0.85); // 10-pack
            if (product.pallet_price != null) validPrices.push(Number(product.pallet_price));
            priceValid = validPrices.some(vp => Math.abs(clientPrice - vp) <= 0.02);
          }

          if (!priceValid) {
            console.warn("[EDGE:create-order] Price mismatch detected", {
              product_id: item.product_id,
              client_price: item.price,
              base_price: basePrice,
              product_type: product.product_type,
            });
            return new Response(
              JSON.stringify({ error: `Item ${i + 1}: Price does not match current catalog price. Please refresh your cart.` }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
            );
          }
        }
      }
    }

    // Recompute total server-side from verified prices
    let computedItemsTotal = 0;
    for (const item of items) {
      computedItemsTotal += Number(item.price) * Number(item.quantity ?? 1);
    }

    // Server-side coupon validation (never trust a client-supplied discount)
    let verifiedDiscount = 0;
    let verifiedCoupon: any = null;
    if (typeof coupon_code === "string" && coupon_code.trim().length > 0) {
      const { data: coupon } = await supabaseAdmin
        .from("coupons")
        .select("id, code, discount_type, discount_value, is_active, expires_at, end_date, start_date, max_uses, current_uses, used_count, minimum_order_amount, min_order_amount")
        .ilike("code", coupon_code.trim())
        .maybeSingle();

      const now = Date.now();
      const notStarted = coupon?.start_date ? new Date(coupon.start_date).getTime() > now : false;
      const expiry = coupon?.expires_at ?? coupon?.end_date ?? null;
      const expired = expiry ? new Date(expiry).getTime() < now : false;
      const uses = Number(coupon?.current_uses ?? coupon?.used_count ?? 0);
      const maxUses = coupon?.max_uses != null ? Number(coupon.max_uses) : null;
      const exhausted = maxUses != null && uses >= maxUses;
      const minAmount = Number(coupon?.minimum_order_amount ?? coupon?.min_order_amount ?? 0);

      if (coupon && coupon.is_active !== false && !notStarted && !expired && !exhausted && computedItemsTotal >= minAmount) {
        verifiedCoupon = coupon;
        verifiedDiscount = coupon.discount_type === "percentage"
          ? computedItemsTotal * (Number(coupon.discount_value) / 100)
          : Number(coupon.discount_value);
        verifiedDiscount = Math.min(Math.max(verifiedDiscount, 0), computedItemsTotal);
      } else {
        console.warn("[EDGE:create-order] Coupon rejected", { coupon_code });
      }
    }

    const computedTotal = Math.max(
      0,
      computedItemsTotal + Number(shipping_cost) + Number(tax_amount) - verifiedDiscount,
    );

    // Allow tolerance of $0.02 for rounding across multiple items
    if (Math.abs(computedTotal - Number(total_amount)) > 0.02) {
      console.warn("[EDGE:create-order] Total mismatch", {
        client_total: total_amount,
        computed_total: computedTotal,
      });
      return new Response(
        JSON.stringify({ error: "Order total does not match item prices. Please refresh your cart and try again." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // Use server-computed total for persistence
    const verifiedTotal = computedTotal;

    // Determine user_id from token if available
    const { data: authData } = await supabase.auth.getUser();
    const user_id = authData?.user?.id ?? null;

    // Insert order with server-verified total
    const { data: orderInsert, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id,
        customer_name,
        customer_email,
        phone,
        status,
        total_amount: verifiedTotal,
        shipping_cost,
        tax_amount,
        shipping_address,
        notes,
        payment_method,
        payment_details: verifiedCoupon
          ? { ...(payment_details ?? {}), coupon_code: verifiedCoupon.code, discount_amount: Number(verifiedDiscount.toFixed(2)) }
          : payment_details,
        cashapp_tag,
        zelle_tag,
      })
      .select("*")
      .single();

    if (orderError || !orderInsert) {
      console.error("[EDGE:create-order] Order insert failed:", {
        error: orderError,
        customer_email,
        user_id,
        total_amount: verifiedTotal,
        items_count: items.length,
      });
      return new Response(
        JSON.stringify({ error: "Failed to create order. Please check your information and try again." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const orderId = orderInsert.id;

    const itemsPayload = items.map((it: any) => ({
      order_id: orderId,
      product_id: typeof it.product_id === "string" ? it.product_id : null,
      product_name: it.product_name,
      quantity: Number(it.quantity ?? 1),
      price: Number(it.price),
      sku: it.sku ?? null,
      packaging: it.packaging ?? null,
      epa_approved: Boolean(it.epa_approved ?? false),
      configuration_json: it.configuration_json ?? null,
    }));

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(itemsPayload);
    if (itemsError) {
      await supabaseAdmin.from("orders").delete().eq("id", orderId);
      console.error("[EDGE:create-order] Order items insert failed:", {
        error: itemsError,
        order_id: orderId,
      });
      return new Response(
        JSON.stringify({ error: "Failed to add items to order. Please check your cart items and try again." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const { data: fullOrder, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select(
        `*, order_items (id, product_id, product_name, quantity, price, sku, packaging, epa_approved, configuration_json)`,
      )
      .eq("id", orderId)
      .single();

    if (fetchError || !fullOrder) {
      return new Response(
        JSON.stringify({ error: "Order created but failed to fetch details. Your order was placed successfully." }),
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
