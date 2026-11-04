# Payment policy + manufacturer product details

## Part 1 — "Payment before shipping" policy (no credit terms)

Remove every offer of credit terms and state one clear rule site-wide: **We do not offer Net 15, Net 30 or any credit/deferred payment. All orders ship only after payment is confirmed (card or bank wire).**

Changes:
- Payment Information page: delete the "Commercial Credit Terms" section (Net 30 / Net 15 / credit@ email) and replace it with a "Payment before shipment" notice.
- Terms of Service: change "Payment is due upon order confirmation unless credit terms are pre-approved" to "Full payment is required before shipment. We do not offer credit terms."
- Homepage text (and its translation): replace "flexible payment terms" with "clear upfront pricing".
- Checkout payment area, Cart, and the RFQ/quote page: add one short line, "Orders ship after payment is confirmed. No credit or Net terms."
- FAQ: add "Do you offer Net 30 or credit terms?" with a "No" answer.
- Admin invoice form: the default payment terms read "Due before shipment" (admins can still edit the field).

## Part 2 — Fill in missing product details from manufacturer data

Current gaps in the catalog:

```text
type            products  no dimensions  no weight
air_conditioner     77         77            71
accessory           58         52            58
refrigerant         20         20            20
```

How it works, in batches of about 15 products, starting with ACs:
1. For each product, get the official manufacturer spec sheet, submittal or manual by exact model number.
2. Fill in only values the manufacturer publishes: indoor/outdoor unit sizes and weights, shipping weight, SEER2/EER2/HSPF2, cooling and heating range, voltage, amps/MCA/MOP, refrigerant type and factory charge, line-set size and max length/lift, noise level (dB), max room size, warranty, and what's in the box.
3. Save each value with its source link. Anything that can't be confirmed stays blank and goes on a list for you. Nothing gets guessed.
4. Refrigerants: cylinder size and weight, DOT spec, and the safety class from the SDS. Accessories: size and weight from the maker's listing.

**Product Q&A for technicians and homeowners:** each AC page gets 5–8 questions built from that model's verified specs. For example: "What breaker size?", "Max line-set length?", "Does it heat below 5°F?", "Is it DIY or does it need a pro install?", "Which refrigerant does it use, and is the line set pre-charged?", "What does the warranty cover, and does it need a licensed installer?". Every answer comes from that model's data. Answers never invent claims.

**Product page display:** the specs table shows the new fields grouped as Size & Weight, Performance, Electrical, Refrigerant & Installation, and Warranty. The Q&A section on the product page also feeds the FAQ structured data. Empty fields stay hidden.

**Shopping feed:** product weight and dimensions are added only where verified. The feed is still generated from the site only, with no direct Merchant Center writes.

## Report back
- A list of products where details are still missing, with the reason.
- The two Midea models from before whose specs couldn't be confirmed.

## Technical details
- Files: `PaymentInformation.tsx`, `TermsOfService.tsx`, `HomePage.tsx`, `i18n.ts`, checkout, cart, RFQ, FAQ, and the `InvoiceForm.tsx` default.
- Data: new values go in the existing `products` columns (`dimensions`, `weight_kg`, `length_cm`/`width_cm`/`height_cm`, `shipping_weight`) and in `technical_specs` (keyed, with a `sources` list). Q&A is stored in `technical_specs.faq`, so the database structure doesn't change.
- `ProductDetails` renders the grouped specs and the FAQ, and adds FAQPage JSON-LD.
