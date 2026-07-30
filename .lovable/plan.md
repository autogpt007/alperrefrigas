## What I checked

I scanned the whole codebase, all edge functions, and every content table in the database for the old domain.

**Already correct — no change needed:**
- No `alperrefrigas.com` link remains anywhere in `src/`, `supabase/functions/`, `index.html`, `robots.txt`, `sitemap.xml`, or in the `products`, `blog_posts`, `contact_info`, `adverts`, `certificates`, `hero_images`, `testimonials`, or `page_content_blocks` tables.
- All in-app navigation (Header, Footer, product cards, product pages) uses **relative** paths (`/products`, `/about`, …), so it follows whatever domain the site is served on automatically. Nothing to migrate there.
- Canonicals, og:url, and product JSON-LD already resolve against `https://alperrefrigerants.com`.
- The only remaining `alperrefrigas` string is the X/Twitter handle `twitter.com/alperrefrigas` (in `site_settings.twitter_url` and `SocialMediaLinks.tsx`) — that's your real social handle, not a domain, so it stays until you rename it on X.

## What is actually broken

The `ItemList` structured data in `index.html` points Google at **three URLs that don't exist or redirect**:

| JSON-LD URL | Reality |
|---|---|
| `/hfo-refrigerants` | 404 — real route is `/products/hfo-refrigerants` |
| `/r454b` | 404 — real route is `/products/r-454b` |
| `/products/air-conditioners` | 301 to `/products/accessories` |

Also, the domain string `https://alperrefrigerants.com` is hardcoded in five separate places (`index.html`, `SEOComponent.tsx`, `src/utils/sitemapGenerator.ts`, `src/pages/BulkPricing.tsx`, `supabase/functions/generate-sitemap`), so a future domain change means another manual sweep.

## Plan

1. **Fix the stale structured-data links in `index.html`** — point the ItemList entries at the live routes (`/products/hfo-refrigerants`, `/products/r-454b`, `/products/accessories`) so Merchant Center and Search Console stop seeing 404/redirect targets.
2. **Fix the footer link `/shipping`** → `/shipping-policy` to remove an unnecessary 301 hop.
3. **Add a single source of truth `src/config/site.ts`** exporting `SITE_URL` / `SITE_DOMAIN` (reading `VITE_SITE_URL` with the new domain as fallback), and use it in `SEOComponent.tsx`, `src/utils/sitemapGenerator.ts`, and `src/pages/BulkPricing.tsx` instead of hardcoded strings.
4. **Extend the existing build validator** (`scripts/generate-redirects.ts`) with a link audit that fails the build if any absolute URL in `index.html` or `src/` uses a non-primary domain, or if a JSON-LD `url` points at a path that isn't a real route or is a known redirect source.

## Technical notes

- `index.html` is static and can't read Vite env vars, so its domain stays literal; the new validator is what keeps it honest.
- No database writes are needed — content tables are already clean.
- The edge function `generate-sitemap` keeps its own `BASE_URL` constant (functions can't import from `src/`); the validator will check it too.
