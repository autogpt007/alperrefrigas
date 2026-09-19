# GMC Guard: close the remaining audit gaps (cart disclosure + product data parity check) + misrepresentation re-review prep

## Context update (from the user)
The store IS on Google Merchant Center and was approved; Google issued an actual **misrepresentation suspension yesterday**. The Guardian findings are its re-scan of the checks that feed that suspension. Goal: fix the verifiable gaps on-site so the Merchant Center re-review has the best possible case. Google does not disclose the exact trigger, so this plan closes every gap we can control.


## What the audit found vs. what is actually live (verified)

1. **Business identity — no street address** → **Already fixed and live.** The published `index.html` (raw HTML, confirmed by fetching https://alperrefrigerants.com) contains the full Organization JSON-LD with `382 NE 191st St, Miami, FL 33179, US`, legal name, phone and email, plus the same address in the `<noscript>` fallback. The footer renders microdata markup and the Contact page shows the address + its own JSON-LD. No code change needed — the guard just needs a re-scan after publishing.
2. **Organization JSON-LD in the site head** → **Already present**, matching the spec exactly (name Alper Refrigerants, legalName Alper Chemical Group, url, logo, email sales@alperrefrigerants.com, telephone +1-682-215-2974, full postal address). No change needed.
3. **Product Data Parity — product pages don't expose Product structured data** → Product JSON-LD **is** emitted on every product page via the SEO component (name, sku, brand, single USD price, availability, priceValidUntil, offer URL, image, seller). It appears in the rendered page head, not the raw HTML, because the site is a single-page app. The fix here is verification, not new markup: confirm the JSON-LD renders and that its price matches the merchant feed for the same SKU (example check: R-134A 30LB, sku ALP-R-134A-30LB, $110.98).
4. **Checkout Integrity — no shipping or tax disclosure before payment** → **Real gap, the only code change.** The cart summary only says "Calculated at checkout" and "+ shipping & taxes".

## Changes

### 1. Estimated shipping & tax disclosure in the cart summary (`src/components/pages/CartPage.tsx`)
Insert a disclosure block directly above the checkout button in the Order Summary card, display-only (no cart/checkout logic touched):

- "Estimated Shipping: Calculated at checkout — US Continental base rate $45.00 plus $25.00 HazMat surcharge for refrigerants. Rates for other regions shown at checkout."
- "Estimated Tax: Calculated at checkout based on delivery ZIP code (US) or destination country VAT/GST (international)."
- One-line note: final shipping and taxes are confirmed on the checkout page before payment.

All values are real, taken from the live shipping zones table (US Continental: base_rate 45.00, hazmat_surcharge 25.00). Note: the audit prompt's example text said "$45.00 HazMat" — that conflated the base rate with the surcharge, so the block uses the true split ($45.00 base + $25.00 HazMat) rather than publishing an invented figure.

### 2. Product structured-data parity verification (no markup rewrite)
- Render a live product page head-on and confirm the Product JSON-LD block (name, sku, brand, price, availability, priceValidUntil, offer URL, image, seller) is present and parses.
- Compare its price against the same product's entry in `public/merchant-feed.xml` — the page and feed must show one identical price and availability state. Fix any mismatch found.

### 3. Address consistency sweep (read-only verification)
- Confirm the exact address string `382 NE 191st St, Miami, FL 33179` is identical across `index.html` (JSON-LD + noscript), footer microdata, Contact page, and `public/llms.txt`. Correct `llms.txt` only if it deviates.

### 4. Misrepresentation re-review prep (audit-driven, safe changes only)
- **Payment-method messaging audit**: Zelle / CashApp / crypto are the strongest known Google misrepresentation triggers when advertised on a Shopping-facing storefront. List where they appear (homepage, footer, cart, product pages, policies) and report back — removal or rewording is a business decision, presented to the user before any change.
- **Identity consistency**: confirm the Merchant Center account's verified business name, address, and phone exactly match the site (Alper Chemical Group / Alper Refrigerants, Miami address, 682-215-2974) — mismatched identity is a common suspension cause.
- **Price parity**: confirm feed prices equal page prices for all products (part of step 2, extended to a spot-check across categories).
- Note for the user: the domain migrated ~2 months ago; young-domain trust is a Google factor we cannot change, only mitigate with consistent, verifiable info.

## What is intentionally NOT done (per the audit's hard rules)
- No checkout, payment, or cart **logic** changes — only the visible disclosure block.
- No invented reviews, ratings, certifications, or policy text; no feed attributes added.
- No Merchant Center / Content API calls from the storefront.
- No placeholder text: every value used is verified real (address, phone, email, $45.00 base, $25.00 HazMat). **No placeholders remain needing your input.**

## Verification
1. Build passes; cart page renders the disclosure block above the checkout button on desktop and mobile.
2. Playwright on the published site: product page head contains parseable Product JSON-LD whose price equals the feed price for that SKU.
3. Raw HTML fetch of the homepage still shows the full address in JSON-LD and noscript.
4. Publish, then re-run the GMC guard so it re-scans the live site and clears the findings.
