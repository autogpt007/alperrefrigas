# Fix the Merchant Center feed: dead feed host, stable feed URL on your own domain

## What I confirmed

- The feed URL currently configured in Merchant Center points at the **old, decommissioned backend** for this project. That hostname no longer resolves in DNS at all — that is exactly the "Server DNS Address Not Found" error. Google has not been able to fetch a feed since the backend was rebuilt.
- The current feed endpoint works: it returns 200 and emits **45 items**, all with live images and per-unit prices.
- The store database holds **45 products** (17 refrigerants + 1 specialty, 6 accessories, 21 air conditioners). Google's 48 is stale inventory from the last successful fetch of the old feed — those 3 extras no longer exist in the catalog and will drop off after one good fetch.

## The fix

**1. Publish the feed on your own domain**

Instead of handing Google a backend URL that changes whenever the backend is rebuilt, the feed gets written out as a real file at:

```text
https://alperrefrigerants.com/merchant-feed.xml
```

A build step generates that file from the live product table on every publish, using the same rules the current feed endpoint uses (per-unit price, live image link, availability, GTIN/MPN, identifier_exists, shipping dimensions, B2B product type). The file lands next to the sitemap generation that already runs before each build.

This makes the feed URL permanent: domain-stable, no backend hostname in it, and it can never DNS-fail while the site itself is up.

**2. Keep the on-demand feed endpoint as the live fallback**

The existing feed function stays deployed and unchanged, so nothing breaks in the transition and prices can still be verified between publishes.

**3. Verify every item passes Google's requirements before you re-fetch**

Before handing you the new URL I check all 45 items for: price > 0, an image link that returns 200 with a real image content type, a product link that resolves to a live product page, availability, brand, and an identifier (GTIN or brand+MPN, otherwise `identifier_exists: no`). Anything failing gets fixed, and you get a per-SKU pass/fail table.

**4. What you then do in Merchant Center**

- Data sources > your product source > edit the fetch URL to `https://alperrefrigerants.com/merchant-feed.xml`
- Click **Fetch now**
- The 3 stale items disappear automatically once the fetch succeeds (Google removes items absent from the new feed); no manual deletion needed.

## Notes

- Feed contents refresh when the site is published. If you want the file to also refresh on a schedule without a publish, say so and I'll add a daily regeneration instead.
- Product images are served through the existing public image route; the plan verifies each one returns a valid image, since a broken image link is the most common cause of item-level disapproval.
- No price, tax, shipping, or checkout logic changes here — this is feed delivery and item-data validation only.
