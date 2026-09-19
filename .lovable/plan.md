# Correct all six Google Merchant issues

## Confirmed diagnosis

- The published homepage returns 200 and already contains crawlable Organization JSON-LD with Alper Refrigerants, Alper Chemical Group, the Miami address, sales email, and phone.
- The published HTML fallback and React footer both contain the complete legal entity and Miami contact details.
- The published feed contains 73 products and all 73 currently include an `availability` value.
- The 35 HVAC products are incorrectly forced to Google category `2364`. Google's official taxonomy defines `2364` as **Brandy**; **Air Conditioners is `605`**. This explains the alcohol-policy classification.
- Those same 35 products receive a blanket AHRI certification. Google Merchant's `certification` field only accepts supported authority/name combinations; `AHRI` / `AHRI Certified` / `AHRI-CERTIFIED` is not a supported Merchant certification combination.
- The site also publishes a blanket AHRI claim in Product JSON-LD without product-specific certification evidence.
- The reported R-134A offer ID does not match the ID in the current 73-item feed, so Google may be reporting a stale or second data source. This must be verified in Merchant Center after the corrected feed is published; it cannot be safely inferred or fixed by inventing an ID.

## Store and feed corrections

1. **Correct product taxonomy**
   - Change HVAC units, mini-splits, PTACs, and heat pumps from category `2364` to official Google category `605`.
   - Audit every tool and refrigerant category against Google's official taxonomy.
   - Replace broad text paths or missing values only with verified taxonomy IDs appropriate to each product; do not classify tools as air conditioners.

2. **Remove invalid certification submissions**
   - Remove the unsupported blanket AHRI certification block from the Merchant feed.
   - Remove the blanket AHRI Product JSON-LD claim unless a product has an actual, product-specific AHRI reference stored in its record.
   - Do not substitute ENERGY STAR or another accepted Google certification unless the exact product has verified authority, name, and code/value data.
   - Keep legitimate certification information as ordinary product specifications only when supported by real product data; do not send it through Google's restricted certification attribute.

3. **Make availability complete and stable**
   - Preserve explicit `in_stock` / `out_of_stock` output for every exported item.
   - Add feed-generation validation that rejects a snapshot if any item lacks ID, link, price, or availability.
   - Verify all refrigerant products, including R-134A, in the regenerated feed and ensure availability matches the landing page.

4. **Keep identity markup consistent**
   - Preserve the existing valid Organization JSON-LD and complete crawlable footer.
   - Compare every identity field in the static HTML, React footer, Contact page, and Organization schema so name, legal name, address, phone, email, and domain remain identical.
   - Remove unsupported or unverified Organization claims if found; no new business facts or placeholders will be introduced.

5. **Regenerate and deploy the feed**
   - Update the feed function as the single source of truth, deploy it, regenerate the static `merchant-feed.xml`, and publish the site.
   - Validate XML structure and assert: 73/73 availability values, zero category `2364`, HVAC category `605`, and zero unsupported AHRI certification fields.
   - Check representative HVAC, tool, and refrigerant landing pages against feed price and availability.

## Merchant Center cleanup and verification

These are account-side actions and cannot be replaced by storefront code:

1. In account **5804699123**, keep only the corrected `https://alperrefrigerants.com/merchant-feed.xml` source for these products, or remove/exclude stale duplicate offers such as the numeric R-134A ID.
2. Re-fetch the corrected source and wait for item processing.
3. Confirm the alcohol-category, invalid-certification, missing-certification, and missing-availability item issues have cleared or now identify a different active source.
4. Confirm Merchant Center Business Information exactly matches the published footer and Organization schema.
5. Request review for Misrepresentation only after item diagnostics and business information are clean. The account-policy disapproval is downstream of the suspension and cannot clear until Google approves that review.

## Verification report

Provide a final concise report listing:

- Every changed file and exact feed-rule correction.
- Published URL checks and item counts.
- Remaining Merchant Center-only actions, if any.
- Any unresolved product-specific certification data requiring human evidence.
- No findings will be marked resolved until the corrective change is complete and verified.
