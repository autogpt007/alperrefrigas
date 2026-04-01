

## Full SEO Gap Analysis & Optimization Plan

### Goal: Rank 50+ keywords on Google page 1

---

### Critical Gaps Found

**GAP 1: Certifications page has NO SEO metadata**
`Certifications.tsx` has zero `SEOComponent` or `Helmet` usage — no title, description, canonical, or structured data. This is an important E-E-A-T page.

**GAP 2: Missing `<h1>` on Certifications page**
No `<h1>` tag exists — only `<h2>` elements. This hurts relevance signals.

**GAP 3: FreonWholesalePage canonical points to `/freon-wholesale` (a 301 redirect)**
The canonical URL should be `/products` since that's where the redirect sends users, or the page should be removed from the router entirely.

**GAP 4: ShippingCalculator canonical is `/shipping` (a redirect URL)**
Should be `/shipping-policy` or its own dedicated URL.

**GAP 5: Homepage has TWO competing SEOComponents**
Both `Index.tsx` and `HomePage.tsx` inject `SEOComponent` with different titles/descriptions. `react-helmet-async` uses last-in-wins, so `HomePage.tsx` overrides `Index.tsx`, meaning the carefully crafted HFO-focused meta from Index is wasted.

**GAP 6: robots.txt is too minimal**
The generated `generateRobotsTxt()` function has comprehensive bot rules, but the actual `public/robots.txt` is only 4 lines. Missing: admin disallow, AI crawler rules, crawl-delay.

**GAP 7: Missing breadcrumb structured data on most pages**
Only `ProductCatalog` passes breadcrumbs to `SEOComponent`. Key pages (About, FAQ, Contact, Blog, Certifications, Shipping) have no breadcrumb schema.

**GAP 8: No internal linking strategy**
Pages don't cross-link to each other. Footer and navigation are the only linking paths. Key money pages (products, freon-wholesale) need contextual internal links from content pages.

**GAP 9: Description contains emoji (⭐) on HomePage and AboutUs**
Google strips or ignores emojis in meta descriptions. The `⭐` wastes character space and looks unprofessional in SERPs.

**GAP 10: `og:image` is `/placeholder.svg` on most pages**
No real Open Graph image for social sharing — reduces CTR from social/referral traffic.

**GAP 11: Duplicate structured data on homepage**
`Index.tsx` injects a `WholesaleStore` schema, `HomePage.tsx` injects a `WebSite` schema, and `SEOComponent` always injects an `Organization` schema. Three conflicting entities on one page.

---

### Implementation Plan (by impact)

#### Phase 1 — Fix broken/conflicting metadata (highest impact)

1. **Remove duplicate SEOComponent from `Index.tsx`** — let `HomePage.tsx` be the single source. Move the HFO-focused title/description into `HomePage.tsx` and merge the `WholesaleStore` schema into the existing homepage structured data.

2. **Add SEOComponent to `Certifications.tsx`** with title "EPA Certifications & Compliance | Alper", description targeting "refrigerant EPA certification", canonical `/certifications`, and add an `<h1>`.

3. **Fix canonical on `ShippingCalculator.tsx`** — change from `/shipping` to `/shipping-calculator` or remove the component if it's redundant with `ShippingPolicy.tsx`.

4. **Fix or remove `FreonWholesalePage.tsx`** — since `/freon-wholesale` 301s to `/products`, this page is unreachable. Either remove the canonical conflict or make it a real landing page at a non-redirected URL like `/wholesale`.

5. **Remove emojis from meta descriptions** in `HomePage.tsx` and `AboutUs.tsx`.

#### Phase 2 — Enhance robots.txt & structured data

6. **Replace `public/robots.txt`** with the comprehensive version from `generateRobotsTxt()` — add admin disallow, AI crawler rules, crawl-delay.

7. **Add breadcrumb structured data** to About, FAQ, Contact, Blog, Certifications, Shipping Policy, EPA Compliance, Testimonials pages.

8. **Clean up homepage structured data** — consolidate to one `Organization` + one `WebSite` + FAQ schema. Remove the competing `WholesaleStore` from Index.tsx.

#### Phase 3 — Content & linking signals

9. **Add contextual internal links** — add "Related" sections at the bottom of content pages (FAQ, About, EPA, Blog) linking to product catalog, certifications, and contact pages.

10. **Add a real `og:image`** — use the site logo or a branded hero image URL instead of `/placeholder.svg` for the default `ogImage` in `SEOComponent.tsx`.

### Files Changed
1. `src/pages/Index.tsx` — remove duplicate SEOComponent, keep only the wrapper
2. `src/components/pages/HomePage.tsx` — merge HFO title, remove emoji from description
3. `src/components/pages/Certifications.tsx` — add SEOComponent + `<h1>`
4. `src/components/pages/AboutUs.tsx` — remove emoji from description
5. `src/components/pages/ShippingCalculator.tsx` — fix canonical
6. `src/components/pages/FreonWholesalePage.tsx` — fix canonical or update route
7. `public/robots.txt` — replace with comprehensive version
8. `src/components/seo/SEOComponent.tsx` — change default `ogImage`
9. ~8 page components — add `breadcrumbs` prop to SEOComponent calls
10. ~5 page components — add internal link sections

