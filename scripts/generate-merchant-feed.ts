/**
 * Regenerates public/merchant-feed.xml so Google Merchant Center can fetch the
 * product feed from a permanent, domain-stable URL:
 *
 *   https://alperrefrigerants.com/merchant-feed.xml
 *
 * The feed body is produced by the `merchant-feed` backend function (single
 * source of truth for feed rules: per-unit price, live image link, availability,
 * identifiers, shipping dimensions, B2B product type). This script only snapshots
 * it into the static build output.
 *
 * Runs automatically before `vite dev` and `vite build` via predev / prebuild.
 * If the backend is unreachable the existing file is kept so a transient failure
 * can never publish an empty feed.
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const REQUIRED_ITEM_TAGS = ["id", "link", "image_link", "availability", "price"] as const;
const ALLOWED_AVAILABILITY = new Set(["in_stock", "out_of_stock", "preorder", "backorder"]);

function assertCompleteFeed(xml: string): number {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  if (items.length === 0) throw new Error("feed contains no products");

  items.forEach((item, index) => {
    for (const tag of REQUIRED_ITEM_TAGS) {
      const match = item.match(new RegExp(`<g:${tag}>([\\s\\S]*?)<\\/g:${tag}>`));
      if (!match?.[1]?.trim()) throw new Error(`product ${index + 1} is missing ${tag}`);
    }
    const availability = item.match(/<g:availability>([^<]+)<\/g:availability>/)?.[1]?.trim();
    if (!availability || !ALLOWED_AVAILABILITY.has(availability)) {
      throw new Error(`product ${index + 1} has invalid availability`);
    }
  });

  return items.length;
}

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
const SUPABASE_URL = (env.VITE_SUPABASE_URL || "").replace(/\/+$/, "");
const OUT_PATH = resolve("public/merchant-feed.xml");

async function main() {
  if (!SUPABASE_URL) {
    console.warn("[merchant-feed] backend URL not configured — keeping existing feed file");
    return;
  }

  const endpoint = `${SUPABASE_URL}/functions/v1/merchant-feed`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);
    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[merchant-feed] fetch returned ${res.status} — keeping existing feed file`);
      return;
    }

    const xml = await res.text();
    if (!xml.trim().startsWith("<?xml")) {
      console.warn("[merchant-feed] response was not a usable feed — keeping existing feed file");
      return;
    }

    const itemCount = assertCompleteFeed(xml);

    writeFileSync(OUT_PATH, xml.endsWith("\n") ? xml : `${xml}\n`, "utf8");
    console.log(`[merchant-feed] wrote public/merchant-feed.xml (${itemCount} items)`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[merchant-feed] generation skipped: ${message}`);
  }
}

await main();
