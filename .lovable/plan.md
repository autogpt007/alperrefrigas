

## SEO Optimization — 3 Phases, Executed Sequentially

### Phase 1: Enhance index.html Fallback Metadata

**Why:** Non-JS crawlers (Bing, social previews, some SEO tools) only see the raw HTML shell. Right now `index.html` has a single generic title and description — no structured data, no OG image, minimal content.

**Changes to `index.html`:**
- Add Organization JSON-LD structured data inline (same data as SEOComponent but static)
- Add WebSite schema with SearchAction for sitelinks search box
- Add comprehensive OG tags (og:image pointing to logo/banner, og:type, og:site_name)
- Add Twitter card meta tags
- Add a `<noscript>` content block inside `<body>` with key business info, product categories, and contact details — gives non-JS crawlers actual text content instead of an empty div
- Add ItemList structured data covering top product categories (HFC, HFO, Natural refrigerants)

### Phase 2: Audit and Fix All Pages for SEO Completeness

**Pages missing SEOComponent (currently using raw Helmet or nothing):**
- `CartPage.tsx` — uses raw `<Helmet>`, convert to `SEOComponent` with noindex
- `AirConditionersPage.tsx` — uses raw `<Helmet>`, convert to `SEOComponent` with proper title/description/breadcrumbs
- `AccountDashboard.tsx` — add `SEOComponent` with noindex
- `CustomerPortal.tsx` — add `SEOComponent` with noindex
- `AdminDashboard.tsx` — already behind auth, add noindex
- `BlogPostDetail.tsx` — uses `BlogSEO` (fine, no change needed)
- `Index.tsx` — wrapper component, delegates to HomePage (fine)

**Fixes across existing pages:**
- Ensure every public-facing page has `canonicalUrl` set (many currently omit it)
- Ensure every public page has `breadcrumbs` data for breadcrumb rich snippets
- Add `keywords` prop to pages that currently omit it (ProductCatalog, landing pages)
- Set `robotsContent="noindex, nofollow"` on utility/auth pages (Cart, Checkout, Account, Admin, OrderConfirmation, CryptoPayment)

### Phase 3: Create 5 Long-Tail SEO Blog Posts

**Target keywords (realistic page-1 candidates within 30 days):**

1. **"R-454B refrigerant wholesale price 2026"** — emerging replacement refrigerant, low competition
2. **"R-410A phase down schedule commercial HVAC"** — informational, buyers researching transition timelines
3. **"HFO-1234yf bulk supplier USA"** — transactional long-tail, aligns with existing product
4. **"refrigerant container load pricing guide"** — matches your pricing structure, attracts bulk buyers
5. **"EPA 608 certification requirements refrigerant purchase"** — educational, captures top-of-funnel HVAC contractors

**Implementation:** Create blog posts via Supabase insert (the blog system already reads from the `blog_posts` table). Each post will include:
- SEO-optimized title, meta description, and excerpt
- 800-1200 words of original content with proper H2/H3 structure
- Internal links to relevant product pages
- FAQ section at the bottom (triggers FAQ rich snippets via BlogSEO component)

### Execution Order
Phase 1 first (index.html, single file, immediate impact). Phase 2 next (audit ~6 files). Phase 3 last (blog content insertion).

