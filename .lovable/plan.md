# Price cut, wire/Zelle discount, and feed refresh

## 1. Silent 25% price cut

Reduce every stored product price by 25% directly in the database, so the new price is simply "the price" everywhere — catalog, product pages, cart, checkout, invoices, and the Google feed. No "was/now" strikethrough, no sale badge, nothing that reveals a cut happened.

Columns reduced on every product (only where a value exists):
- `price` (per cylinder / per unit — the number Google reads)
- `base_unit_price`
- `pallet_price`, `container_20ft_price`, `container_40ft_price`

Rounding: keep 2 decimals for the per-unit price, round bulk/container totals to whole dollars.

Bulk ladder math (pallet tiers, AC MOQ tiers, accessory packs) is all derived from `price`, so those tiers drop by 25% automatically with no code change.

## 2. 15% discount for bank wire and Zelle

At checkout, when the shopper selects **Bank Wire** or **Zelle**, a 15% discount is applied to the order subtotal:
- A clearly labelled "Bank wire / Zelle discount (15%)" line appears in the order summary, and disappears if they switch to card, Cash App, or crypto.
- Tax and shipping are calculated after the discount, consistent with how the coupon discount behaves today.
- It stacks with a coupon if one is applied (coupon first, then the payment discount on the remainder) — say the word if you'd rather they not stack.
- The discount is recomputed server-side from the chosen payment method when the order is created, so it can't be faked by editing the page. Orders record the discount amount and reason in payment details.
- The invoice/quote PDF shows the same discount line when the payment method is wire or Zelle.

## 3. Google Merchant Center feed

The feed URL does not change — it's the same live endpoint GMC already pulls, generated on demand straight from the database. So after the price cut you just click **Fetch now** (Merchant Center → Data sources → your feed) and the new prices and the 16 new AC products come through. GMC also re-fetches on its own schedule, typically daily.

Important: the feed and the product page must show the same number, and the feed publishes the per-cylinder/per-unit price. The 15% wire/Zelle discount is a payment-method promotion applied at checkout only — it is deliberately not in the feed, which keeps GMC's price-mismatch check happy.

## 4. Side fix found while checking

`public/_redirects` still contains a `/products/air-conditioners → /products/accessories` 301, left over from before the AC page was restored. On the published domain that redirect still hijacks the AC page. I'll remove it from the generator (`scripts/generate-redirects.ts`) so it stops being regenerated.

## Technical notes

- Price cut: one data migration over `public.products`, guarded so re-running it can't double-apply.
- `src/components/pages/CheckoutPage.tsx`: derive `paymentDiscount` from `formData.paymentMethod`, include it in the totals chain and the summary UI.
- `supabase/functions/create-order/index.ts`: recompute the payment discount from `payment_method` alongside the existing coupon verification, before the total-match check.
- `src/lib/invoice-pdf.ts`: add the discount row when payment method is `bank_wire` / `zelle`.
- `merchant-feed` edge function stays as is (emits `price` only).
