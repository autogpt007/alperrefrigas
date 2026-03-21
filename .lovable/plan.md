

## Plan: Wire Up Apex SEO Redirects

### Context
The `apex-seo-config.json` defines three 301 redirects that are **not currently active** anywhere:

| From | To |
|------|-----|
| `/products/air-conditioners` | `/products/accessories` |
| `/freon-wholesale` | `/products` |
| `/shipping` | `/shipping-policy` |

These need to work at **two levels**: Netlify (server-side, for search engine crawlers) and React Router (client-side, for SPA navigation).

### Changes

**1. Update `public/_redirects`** — Add the three Apex SEO redirects as 301s **before** the SPA catch-all rule:

```text
/products/air-conditioners /products/accessories 301!
/freon-wholesale /products 301!
/shipping /shipping-policy 301!
```

These must appear before the `/* /index.html 200` line so Netlify processes them first.

**2. Update `src/components/seo/MetaRedirects.tsx`** — Add the same three paths to a new `seoRedirects` map so client-side SPA navigation also performs the redirect:

```text
'/products/air-conditioners' → '/products/accessories'
'/freon-wholesale' → '/products'
'/shipping' → '/shipping-policy'
```

**3. Update `src/App.tsx`** — Replace the three existing route components with `<Navigate>` redirects:
- `/freon-wholesale` → `<Navigate to="/products" replace />`
- `/products/air-conditioners` → `<Navigate to="/products/accessories" replace />`
- `/shipping` → `<Navigate to="/shipping-policy" replace />`

This ensures React Router itself performs the redirect even if MetaRedirects doesn't fire fast enough.

**4. Clean up (optional)** — The `FreonWholesalePage` and `AirConditionersPage` imports can be removed from `App.tsx` if they are no longer referenced elsewhere (the `/shipping` route already pointed to `ShippingCalculator`, not `ShippingPolicy`, so that's a genuine content redirect).

### What This Achieves
- **SEO crawlers** hitting the production Netlify site get proper 301 responses (link equity preserved)
- **SPA users** navigating client-side get instant redirects via React Router
- **Apex SEO config** is now fully implemented, not just a static file

