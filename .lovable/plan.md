# Fix GMC Guard: missing street address + return shipping clarity

## Why the scanner reports "no street address anywhere"

The scanner reads the raw HTML that the server returns, not the page after React renders. Verified:

- `index.html` Organization structured data has **no `streetAddress`**, and the city/state is wrong: it says `Houston, TX 77001` while the real address is `382 NE 191st St, Miami, FL 33179`.
- The `<noscript>` crawler fallback in `index.html` lists phone and emails but **no address at all**.
- The real address only appears inside React components (Footer, Contact, About, policies), which the scanner never executes.

So the address exists for humans but is invisible to the audit — and where it does appear in static markup it contradicts the real location, which is itself a Misrepresentation risk.

Second finding: the refund policy only says "Return shipping costs deducted unless defective" under Refund Method. It never states plainly who pays return shipping, so it reads as ambiguous.

## Fixes

### 1. Static HTML business identity (`index.html`)
- Correct the Organization schema address to the real one: `382 NE 191st St`, Miami, FL, `33179`, US — including `streetAddress`.
- Add `legalName`, `telephone`, and `email` at the Organization level so identity is complete without JS.
- Add a Contact section to the `<noscript>` fallback with the full postal address block (company legal name, street, city, state, ZIP, country) alongside the existing phone/email.

### 2. Dynamic structured data (`src/components/seo/SEOComponent.tsx`)
- Fix the Organization/LocalBusiness address blocks to carry `streetAddress` and the correct Miami locality, matching `index.html` exactly (Google flags mismatches between static and rendered data).

### 3. Footer address as machine-readable markup (`src/components/layout/Footer.tsx`)
- Keep the current visual block, wrap it in semantic `<address>` with schema microdata (`itemprop="streetAddress"`, `addressLocality`, `addressRegion`, `postalCode`) so it is unambiguous to any crawler that does render.

### 4. Return shipping responsibility (`src/components/pages/RefundPolicy.tsx`)
- Add an explicit "Who Pays Return Shipping" subsection stating:
  - Customer pays return shipping for change-of-mind / ordering-error returns.
  - Alper pays return shipping (prepaid label) for defective, damaged, or incorrectly shipped items.
  - Restocking fee conditions restated in the same place.
- Mirror the same statement on `ShippingPolicy.tsx` so both policy pages agree.

### 5. Contact page completeness (`src/components/pages/ContactUs.tsx`)
- Ensure the address, legal entity name, phone, email, and business hours all appear together in one contact block, since GMC audits look for address + contact on the same page.

### 6. Crawler-visible extras
- Update `public/llms.txt` legal entity naming to match, and confirm the address string is identical everywhere (one canonical format, no variants) to avoid mismatch flags.

## Verification
- Fetch the built HTML and confirm `382 NE 191st St` appears in both the JSON-LD and the noscript fallback.
- Validate the Organization JSON-LD parses with a complete `PostalAddress`.
- Re-run the GMC guard scan after publishing so it re-reads live HTML.

## Note
The guard re-scans the **published** site, so these changes only clear the finding after publishing.
