// Public, read-only image proxy for product photos held in the private
// `images` storage bucket. Product images must be fetchable without any
// headers (Google Merchant Center, social crawlers), and this workspace
// blocks public buckets — so serving goes through this endpoint.
//
// GET /product-image/<path/inside/bucket>
// or  /product-image?path=<path/inside/bucket>

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const BUCKET = "images";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Only forward-slash separated, safe object keys. No traversal, no absolute URLs.
const PATH_RE = /^[A-Za-z0-9._\-/]+$/;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  const url = new URL(req.url);
  // Everything after the function name is treated as the object key.
  const afterName = url.pathname.replace(/^.*\/product-image\/?/, "");
  const raw = decodeURIComponent(url.searchParams.get("path") || afterName || "");
  const path = raw.replace(/^\/+/, "");

  if (!path || path.includes("..") || !PATH_RE.test(path)) {
    return new Response("Invalid image path", { status: 400, headers: cors });
  }

  const upstream = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } },
  );

  if (!upstream.ok || !upstream.body) {
    return new Response("Image not found", { status: upstream.status === 404 ? 404 : 502, headers: cors });
  }

  return new Response(req.method === "HEAD" ? null : upstream.body, {
    headers: {
      ...cors,
      "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
});
