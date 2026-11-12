import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://alperrefrigerants.com";

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch all products and published blog posts in parallel
    const [productsRes, blogsRes] = await Promise.all([
      supabase.from("products").select("name, product_type, updated_at").order("name"),
      supabase.from("blog_posts").select("slug, updated_at").eq("published", true).order("updated_at", { ascending: false }),
    ]);

    const products = productsRes.data || [];
    const blogs = blogsRes.data || [];
    const today = new Date().toISOString().split("T")[0];

    // Static pages
    const staticUrls = [
      { loc: "/", changefreq: "daily", priority: "1.0" },
      { loc: "/about", changefreq: "weekly", priority: "0.8" },
      { loc: "/products", changefreq: "daily", priority: "0.9" },
      { loc: "/products/refrigerants", changefreq: "daily", priority: "0.9" },
      { loc: "/products/accessories", changefreq: "weekly", priority: "0.8" },
      { loc: "/products/air-conditioners", changefreq: "weekly", priority: "0.8" },
      { loc: "/contact", changefreq: "monthly", priority: "0.7" },
      { loc: "/rfq", changefreq: "weekly", priority: "0.8" },
      { loc: "/bulk-pricing", changefreq: "weekly", priority: "0.8" },
      { loc: "/products/category/hfc", changefreq: "weekly", priority: "0.8" },
      { loc: "/products/category/hfo", changefreq: "weekly", priority: "0.8" },
      { loc: "/products/category/natural", changefreq: "weekly", priority: "0.8" },
      { loc: "/products/category/automotive", changefreq: "weekly", priority: "0.8" },
      { loc: "/products/category/commercial", changefreq: "weekly", priority: "0.8" },
      { loc: "/products/category/industrial", changefreq: "weekly", priority: "0.8" },
      { loc: "/products/r-454b", changefreq: "weekly", priority: "0.9" },
      { loc: "/products/hfo-refrigerants", changefreq: "weekly", priority: "0.9" },
      { loc: "/certifications", changefreq: "monthly", priority: "0.6" },
      { loc: "/compliance", changefreq: "monthly", priority: "0.7" },
      { loc: "/shipping-policy", changefreq: "monthly", priority: "0.6" },
      { loc: "/support", changefreq: "weekly", priority: "0.7" },
      { loc: "/faq", changefreq: "monthly", priority: "0.6" },
      { loc: "/blog", changefreq: "weekly", priority: "0.7" },
      { loc: "/testimonials", changefreq: "weekly", priority: "0.6" },
      { loc: "/privacy", changefreq: "yearly", priority: "0.3" },
      { loc: "/terms", changefreq: "yearly", priority: "0.3" },
      { loc: "/refund-policy", changefreq: "yearly", priority: "0.3" },
      { loc: "/payment-info", changefreq: "yearly", priority: "0.5" },
      { loc: "/cookies", changefreq: "yearly", priority: "0.3" },
      { loc: "/sitemap", changefreq: "monthly", priority: "0.3" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Static pages
    for (const page of staticUrls) {
      xml += `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Product pages
    for (const p of products) {
      const slug = createSlug(p.name);
      const lastmod = p.updated_at ? p.updated_at.split("T")[0] : today;
      const priority = p.product_type === "refrigerant" ? "0.8" : "0.7";
      xml += `  <url>
    <loc>${BASE_URL}/products/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>
`;
    }

    // Blog posts
    for (const b of blogs) {
      const lastmod = b.updated_at ? b.updated_at.split("T")[0] : today;
      xml += `  <url>
    <loc>${BASE_URL}/blog/${b.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        ...corsHeaders,
      },
    });
  } catch (err) {
    console.error("[generate-sitemap] Error:", err);
    return new Response("Internal Server Error", { status: 500, headers: corsHeaders });
  }
});
