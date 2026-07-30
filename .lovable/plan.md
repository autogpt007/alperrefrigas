## Goal

Replace every reference to `alperrefrigas.com` with `alperrefrigerants.com` across code, config, SEO metadata, structured data, emails, and stored settings. Business name, phone (`1-787-965-8975`), and the Miami address stay exactly as they are.

Scope confirmed by a repo-wide search: 37 files contain the old domain, plus 59 email addresses on `@alperrefrigas.com`.

## 1. Base URL, config, and crawler files

- `index.html` (17 refs): `og:url`, `og:image`, `twitter:image`, hreflang `x-default`, JSON-LD `url`/`logo`, noscript fallback links and emails.
- `public/robots.txt` — `Sitemap:` directive.
- `public/sitemap.xml` (99 refs) — all `<loc>` entries.
- `public/_redirects` and `public/.htaccess` — canonicalization rules rewritten to force `https://alperrefrigerants.com` (non-www), and add 301s from both `alperrefrigas.com` and `www.alperrefrigas.com` to the new apex so old inbound links and Google's index migrate without 404s.
- `public/llms.txt` (13 refs).
- `src/utils/sitemapGenerator.ts`, `supabase/functions/generate-sitemap/index.ts` — base URL constants.

## 2. Structured data and meta tags

- `src/components/seo/SEOComponent.tsx` — canonical/og default base URL.
- JSON-LD generators across `HomePage`, `ProductDetails`, `FreonWholesalePage`, `HFOLandingPage`, `Certifications`, `AboutUs`, `BulkPricing`, `Sitemap` — update `url`, `@id`, `logo`, `sameAs` (site links only) and breadcrumb item URLs. `name` / `legalName` untouched.
- Static Organization, WebSite (incl. `SearchAction` target) and ItemList schemas in `index.html`.

## 3. Emails

Every `@alperrefrigas.com` address keeps its local part and moves to the new domain (`sales@`, `support@`, `info@`, `wholesale@`, `legal@`, `privacy@`, `dpo@`, `compliance@`, `hazmat@`, `credit@`, `billing@`, `shipping@`, `technical@`, `certifications@`, `admin@`). Affected: Footer, Header, ContactUs, all policy pages (Privacy, Terms, Shipping, Refund, Cookie, Payment Information, EPA Compliance, Certifications, FAQ, Support), plus edge functions `send-transactional-email`, `send-customer-email`, `send-notification-email`, `send-order-notification`, and the shared email templates (order/quote confirmation, KYC).

## 4. Database-stored values

A migration will update `site_settings` rows that hold the old domain or email (contact email, admin email, website URL), so admin-managed content matches the code. The Twitter handle `twitter.com/alperrefrigas` is a social account name, not a domain — left unchanged unless you say otherwise.

## 5. Internal links

Sweep for hardcoded absolute in-app links (e.g. `https://alperrefrigas.com/products`) and convert them to relative router paths so they never depend on the host. External-facing URLs (canonical, og, sitemap, schema, emails) stay absolute on the new domain.

## Technical notes / things outside the code

- Resend sending domain must be verified for `alperrefrigerants.com` or outbound transactional email will start failing; I'll flag the exact from-addresses used.
- `alperrefrigerants.com` needs to be connected in Project Settings → Domains (both apex and `www`) and set as primary; keep `alperrefrigas.com` connected pointing at the same project so the 301s can fire.
- After deploy: resubmit the sitemap in Search Console, add the new domain in Merchant Center, and re-verify the site (Bing `msvalidate.01` and Apex tags are domain-agnostic and stay as-is).
