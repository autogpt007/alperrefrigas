

## Fix All 6 SEMrush Errors

### Priority Order (by ranking impact)

**1. Fix 91 broken CSS references**
- `src/components/seo/CriticalCSS.tsx`: Remove the `/src/index.css` preload and noscript fallback. Vite bundles CSS into hashed `/assets/*.css` files — this source path doesn't exist in production.

**2. Fix 85 duplicate canonicals**
- `index.html`: Remove the hardcoded `<link rel="canonical" href="https://alperrefrigas.com/" />` — it conflicts with the page-specific canonical that `react-helmet-async` injects per page.

**3. Fix 72 slow load speed — remove TinyMCE from public pages**
- `index.html`: Remove the TinyMCE `<script>` tag (line 66). It's only needed in the admin panel.
- Load TinyMCE dynamically only in admin components that use it (lazy import).

**4. Fix 55 hreflang conflicts**
- `index.html`: Add fallback hreflang tags matching what SEOComponent injects:
  ```html
  <link rel="alternate" hreflang="en" href="https://alperrefrigas.com/" />
  <link rel="alternate" hreflang="x-default" href="https://alperrefrigas.com/" />
  ```
  These will be overridden by react-helmet-async per page, but provide a consistent fallback.

**5. Fix 81 invalid structured data**
- `src/components/seo/SEOComponent.tsx`:
  - Change `"@type": ["Organization", "LocalBusiness"]` to just `"@type": "Organization"` (not a physical storefront)
  - Remove the standalone `merchantReturnPolicy` object with its own `@context` from inside the Organization — it's already embedded in product offers
  - Remove `priceRange` (only valid for LocalBusiness)
  - Ensure `MerchantReturnPolicy` referenced in product offers doesn't have nested `@context`

**6. Fix 19 incorrect sitemap URLs**
- `public/sitemap.xml`:
  - Change `/shipping` → `/shipping-policy`
  - Remove `/freon-wholesale` (redirects to `/products`, which is already listed)
  - Change `/products/air-conditioners` → `/products/accessories`

### Files Changed
1. `src/components/seo/CriticalCSS.tsx` — remove broken preload
2. `index.html` — remove hardcoded canonical, remove TinyMCE, add hreflang fallbacks
3. `src/components/seo/SEOComponent.tsx` — fix structured data types
4. `public/sitemap.xml` — fix redirect URLs
5. Admin component(s) using TinyMCE — add dynamic import

