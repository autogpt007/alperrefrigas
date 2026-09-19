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

### 4. Remove Zelle, CashApp, and crypto as payment methods (user decision)
Keep **credit/debit card (Stripe)** and **bank wire** as the only payment methods. Removal is customer-facing only — no destructive database changes, so historical orders that used the old methods still render correctly.

- **Checkout (`CheckoutPage.tsx`, `PaymentMethodSelector.tsx`)**: offer only Card and Bank Wire; strip Zelle/CashApp/crypto flows, wallet lookups, and the wire/Zelle 15% discount becomes wire-only (no Zelle branch).
- **Order confirmation (`OrderConfirmation.tsx`)**: remove crypto/Zelle payment instructions; card and wire orders keep their existing confirmation flows.
- **Routes & pages (`App.tsx`, `CryptoPaymentPage.tsx`, `CryptoPaymentSection.tsx`)**: remove the crypto payment route and components.
- **Admin (`PaymentManagement.tsx`, `InvoiceForm.tsx`, `InvoicesManager.tsx`)**: hide wallet-address management; invoice payment instructions limited to card and wire.
- **Invoice PDFs (`invoice-pdf.ts`)**: payment details block shows card + wire only.
- **Backend (`create-order` edge function)**: reject order submissions with payment methods other than card/wire (server-side enforcement, not just UI).
- **Content sweep**: remove Zelle/CashApp/crypto mentions from `PaymentInformation.tsx`, `FAQ.tsx`, `ContactUs.tsx`, `ProductDetails.tsx`, `index.html` noscript ("credit card, Zelle, CashApp, cryptocurrency" → "credit card and bank transfer"), and any feed/description text. Historical order/invoice records in the database are left untouched.

## What is intentionally NOT done (per the audit's hard rules)
- No invented reviews, ratings, certifications, or policy text; no feed attributes added.
- No Merchant Center / Content API calls from the storefront.
- No placeholder text: every value used is verified real (address, phone, email, $45.00 base, $25.00 HazMat). **No placeholders remain needing your input.**
- Note: the payment-logic exception above is now lifted for task 4, which the user explicitly ordered.

## Verification
1. Build passes; cart page renders the disclosure block above the checkout button on desktop and mobile.
2. Playwright on the published site: product page head contains parseable Product JSON-LD whose price equals the feed price for that SKU.
3. Raw HTML fetch of the homepage still shows the full address in JSON-LD and noscript, and no longer mentions Zelle/CashApp/crypto.
4. Checkout flow offers only Card and Bank Wire end-to-end; a test order completes on card.
5. Site-wide search shows no remaining customer-facing Zelle/CashApp/crypto mentions.
6. Publish, then re-run the GMC guard so it re-scans the live site; then request the Merchant Center re-review to lift the misrepresentation suspension.
