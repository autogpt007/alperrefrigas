/**
 * Regenerates public/sitemap.xml and public/robots.txt so they always match the
 * active domain configuration. Runs automatically before `vite dev` and
 * `vite build` via the predev / prebuild npm hooks.
 *
 * Domain source of truth (first match wins):
 *   1. SITE_URL env var (build secret / CI override)
 *   2. VITE_SITE_URL from .env
 *   3. DEFAULT_SITE_URL below
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const DEFAULT_SITE_URL = "https://alperrefrigerants.com";

function loadEnvFile(): Record<string, string> {
  const path = resolve(".env");
  if (!existsSync(path)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (match) out[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = { ...loadEnvFile(), ...process.env } as Record<string, string>;
const BASE_URL = (env.SITE_URL || env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const today = new Date().toISOString().split("T")[0];

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/about", changefreq: "weekly", priority: "0.8" },
  { path: "/products", changefreq: "daily", priority: "0.9" },
  { path: "/products/refrigerants", changefreq: "daily", priority: "0.9" },
  { path: "/products/accessories", changefreq: "weekly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/rfq", changefreq: "weekly", priority: "0.8" },
  { path: "/bulk-pricing", changefreq: "weekly", priority: "0.8" },
  { path: "/products/category/hfc", changefreq: "weekly", priority: "0.8" },
  { path: "/products/category/hfo", changefreq: "weekly", priority: "0.8" },
  { path: "/products/category/natural", changefreq: "weekly", priority: "0.8" },
  { path: "/products/category/automotive", changefreq: "weekly", priority: "0.8" },
  { path: "/products/category/commercial", changefreq: "weekly", priority: "0.8" },
  { path: "/products/category/industrial", changefreq: "weekly", priority: "0.8" },
  { path: "/products/r-454b", changefreq: "weekly", priority: "0.9" },
  { path: "/products/hfo-refrigerants", changefreq: "weekly", priority: "0.9" },
  { path: "/certifications", changefreq: "monthly", priority: "0.6" },
  { path: "/compliance", changefreq: "monthly", priority: "0.6" },
  { path: "/shipping-policy", changefreq: "monthly", priority: "0.5" },
  { path: "/support", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/testimonials", changefreq: "monthly", priority: "0.6" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/refund-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/payment-info", changefreq: "monthly", priority: "0.5" },
  { path: "/cookies", changefreq: "yearly", priority: "0.3" },
  { path: "/sitemap", changefreq: "monthly", priority: "0.3" },
];

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

async function restQuery(path: string): Promise<any[]> {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return (await res.json()) as any[];
}

async function dynamicEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  try {
    const products = await restQuery("products?select=name,updated_at&order=name");
    for (const p of products) {
      if (!p?.name) continue;
      entries.push({
        path: `/products/${createSlug(p.name)}`,
        lastmod: (p.updated_at || "").split("T")[0] || today,
        changefreq: "weekly",
        priority: "0.7",
      });
    }
  } catch (error) {
    console.warn("sitemap: could not fetch products —", (error as Error).message);
  }
  try {
    const posts = await restQuery("blog_posts?select=slug,updated_at&published=eq.true&order=updated_at.desc");
    for (const b of posts) {
      if (!b?.slug) continue;
      entries.push({
        path: `/blog/${b.slug}`,
        lastmod: (b.updated_at || "").split("T")[0] || today,
        changefreq: "monthly",
        priority: "0.6",
      });
    }
  } catch (error) {
    console.warn("sitemap: could not fetch blog posts —", (error as Error).message);
  }
  return entries;
}

function renderSitemap(entries: SitemapEntry[]): string {
  const urls = entries.map((e) =>
    [
      "  <url>",
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

function renderRobots(): string {
  return `User-agent: *
Allow: /

# Search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Social preview crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

# AI crawlers
User-agent: GPTBot
Allow: /

User-agent: OpenAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

# Private / utility areas
Disallow: /admin
Disallow: /admin/
Disallow: /account
Disallow: /checkout
Disallow: /cart
Disallow: /order-confirmation
Disallow: /kyc/
Disallow: /crypto-payment
Disallow: /unsubscribe
Disallow: /health

Sitemap: ${BASE_URL}/sitemap.xml
`;
}

async function main() {
  const entries = [
    ...staticEntries.map((e) => ({ lastmod: today, ...e })),
    ...(await dynamicEntries()),
  ];
  writeFileSync(resolve("public/sitemap.xml"), renderSitemap(entries));
  writeFileSync(resolve("public/robots.txt"), renderRobots());
  console.log(`sitemap.xml written for ${BASE_URL} (${entries.length} URLs) + robots.txt`);
}

main().catch((error) => {
  // Never break the build over sitemap generation.
  console.error("sitemap generation failed:", error);
});
