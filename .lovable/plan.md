# International buyer experience and packaging fix (product pages)

## Issues found
1. **"Ships from US warehouses"** is hardcoded in the trust strip on every product page, and the AC FAQ answer says the same. EU, UK and Australian buyers are told the wrong origin.
2. **Country detection is weak.** The site guesses country only from the browser language (e.g. "en-US"), so most buyers default to the US. There is no way to see or change "shipping to" on the product page.
3. **Empty Packaging Type dropdown.** 4 accessories (including the HEPA air scrubber pages) have an empty packaging list in the catalog. The page then shows an empty dropdown and still blocks "Add to Cart" until a packaging is picked, so those products can't be bought.

## Country: auto-detect plus buyer confirms (recommended)
Use both approaches:
- **First visit:** detect the country automatically from the visitor's location, with the browser language as a fallback.
- **Always visible "Shipping to: Germany (change)" selector** on product pages, cart and checkout. The buyer's choice is saved and overrides detection everywhere, including the checkout country.
- If detection fails, the default is "United States", shown with a prompt to confirm.

This avoids silently assuming a country (people browse from VPNs, offices and travel) while still personalising instantly.

## Product page changes (driven by the selected country)
- **Trust strip:** "Ships from Miami, USA", "Ships from Poland/Turkey hub" (EU/UK), "Ships from Thailand hub" (AU/NZ), or "Ships from nearest regional hub" for other countries.
- **New small delivery box** under the price showing:
  - Ships to: [country]
  - Estimated delivery: 0-3 business days handling + 0-10 business days transit
  - Import duties line: VAT/GST included at checkout (EU/UK/AU) or duties on delivery (other countries), matching current checkout tax logic
  - Compliance hint for refrigerants: EPA 608 (US), F-Gas (EU/UK), ARC licence (AU)
- The AC FAQ answer switches from "US warehouses" to region-aware wording.

## Packaging fix
- If a product has no packaging options, hide the dropdown, use "Individual" automatically and allow Add to Cart.
- Fall back to the second packaging list when the first is empty, instead of showing a blank menu.
- Fill in the 4 empty accessory records with "Individual / 5-Pack / 10-Pack" so the price ladder works. The admin product form keeps editing them.
- Same guard on catalog cards and direct-checkout links.

## Out of scope / pending your confirmation
- Shipping costs: no changes now and no cost line on product pages. A single flat rate for all product types (accessories, AC, refrigerant) will be built later and added to the roadmap.
- No Merchant Center changes from the site.

## Technical details
- A new shipping-country context (localStorage-persisted) feeds ProductDetails, Cart and Checkout; CheckoutPage initialises `countryCode` from it.
- IP lookup: a lightweight free geo endpoint called once and cached; CSP `connect-src` updated. Falls back to `navigator.language`. The CurrencyContext auto-currency reuses the same detected country.
- A shared `getDispatchHub(countryCode)` helper replaces the inline logic in CheckoutPage.
- In ProductDetails: compute `options = nonEmpty(packaging_options) ?? nonEmpty(packaging) ?? []`. When the list is empty, auto-set packaging to "Individual" and skip the required check.
- A data update sets packaging_options for the 4 empty accessories.
- Playwright check: the scrubber page adds to cart, and the trust strip changes when the country is switched to DE or AU.
