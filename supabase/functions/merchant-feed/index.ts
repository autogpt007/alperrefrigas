// Google Merchant Center product feed (RSS 2.0 + g: namespace).
// Public endpoint — GMC fetches it on a schedule, so links always match the
// live domain and there is nothing to update by hand after a domain change.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://alperrefrigerants.com";
const SHOP_TITLE = "Alper Refrigerants";
const SHOP_DESCRIPTION =
  "Wholesale refrigerants and HVAC equipment for licensed professionals. EPA 608 certification required for refrigerant purchases.";

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Strips HTML and clamps to Google's 5000-char description limit. */
function plainText(value: unknown, limit = 5000): string {
  const text = String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > limit ? `${text.slice(0, limit - 1)}\u2026` : text;
}

function absoluteImage(url: unknown): string | null {
  const raw = String(url ?? "").trim();
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `${BASE_URL}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, description, price, sku, gtin, mpn, brand, condition, availability, " +
          "stock_quantity, images, thumbnail_url, google_product_category, product_type, " +
          "weight_kg, length_cm, width_cm, height_cm, identifier_exists, updated_at",
      )
      .order("name");

    if (error) {
      console.error(`products query failed: ${error.message}`);
      return new Response(
        JSON.stringify({ error: "Failed to load products", details: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const products = (data ?? []).filter((p) => Number(p.price) > 0);
    const items: string[] = [];

    for (const p of products) {
      const slug = createSlug(p.name);
      const link = `${BASE_URL}/products/${slug}`;

      const imageList = Array.isArray(p.images) ? p.images : [];
      const primaryImage =
        absoluteImage(p.thumbnail_url) ?? absoluteImage(imageList[0]) ?? null;
      // Google requires an image_link; skip items that have none.
      if (!primaryImage) continue;

      const additionalImages = imageList
        .map(absoluteImage)
        .filter((url): url is string => !!url && url !== primaryImage)
        .slice(0, 10);

      const inStock =
        p.availability === "out_of_stock"
          ? false
          : p.stock_quantity === null || p.stock_quantity === undefined
            ? true
            : Number(p.stock_quantity) > 0;

      const hasIdentifier = !!(p.gtin || (p.brand && p.mpn));

      const parts: string[] = [
        `      <g:id>${esc(p.sku || p.id)}</g:id>`,
        `      <g:title>${esc(plainText(p.name, 150))}</g:title>`,
        `      <g:description>${esc(plainText(p.description || p.name))}</g:description>`,
        `      <g:link>${esc(link)}</g:link>`,
        `      <g:image_link>${esc(primaryImage)}</g:image_link>`,
        ...additionalImages.map((url) => `      <g:additional_image_link>${esc(url)}</g:additional_image_link>`),
        `      <g:availability>${inStock ? "in_stock" : "out_of_stock"}</g:availability>`,
        // Per-cylinder / per-unit price only — must match the price shown on the
        // product page, otherwise GMC reports a mismatched-price violation.
        `      <g:price>${Number(p.price).toFixed(2)} USD</g:price>`,
        `      <g:condition>${esc(p.condition || "new")}</g:condition>`,
        `      <g:brand>${esc(p.brand || SHOP_TITLE)}</g:brand>`,
      ];

      if (p.gtin) parts.push(`      <g:gtin>${esc(p.gtin)}</g:gtin>`);
      if (p.mpn) parts.push(`      <g:mpn>${esc(p.mpn)}</g:mpn>`);
      parts.push(
        `      <g:identifier_exists>${
          p.identifier_exists === false || !hasIdentifier ? "no" : "yes"
        }</g:identifier_exists>`,
      );

      if (p.google_product_category) {
        parts.push(`      <g:google_product_category>${esc(p.google_product_category)}</g:google_product_category>`);
      }
      if (p.weight_kg) parts.push(`      <g:shipping_weight>${Number(p.weight_kg).toFixed(2)} kg</g:shipping_weight>`);
      if (p.length_cm) parts.push(`      <g:shipping_length>${Number(p.length_cm).toFixed(0)} cm</g:shipping_length>`);
      if (p.width_cm) parts.push(`      <g:shipping_width>${Number(p.width_cm).toFixed(0)} cm</g:shipping_width>`);
      if (p.height_cm) parts.push(`      <g:shipping_height>${Number(p.height_cm).toFixed(0)} cm</g:shipping_height>`);

      // B2B / professional-only catalogue.
      parts.push(`      <g:adult>no</g:adult>`);
      parts.push(`      <g:product_type>${esc(p.product_type === "air_conditioner" ? "Air Conditioners" : "Refrigerants")}</g:product_type>`);

      items.push(`    <item>\n${parts.join("\n")}\n    </item>`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(SHOP_TITLE)}</title>
    <link>${BASE_URL}</link>
    <description>${esc(SHOP_DESCRIPTION)}</description>
${items.join("\n")}
  </channel>
</rss>`;

    console.log(`merchant-feed: ${items.length} of ${products.length} products emitted`);

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`merchant-feed failed: ${message}`);
    return new Response(JSON.stringify({ error: "Feed generation failed", details: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
