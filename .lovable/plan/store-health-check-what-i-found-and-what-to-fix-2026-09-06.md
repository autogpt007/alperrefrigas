# Store health check: what I found, and what to fix

I went through the site as a brand-new visitor (not signed in) on desktop and on a phone-sized screen, added a product, and walked into checkout.

## Answers to your four questions

**1. Ads running and spending** — noted, no work needed here.

**2. Are prices visible to visitors who are not signed in?** Yes. The catalog shows a price on every one of the 45 products, and product pages show pricing without logging in. But three things are working against you:

- **The same air conditioner shows three different prices.** Catalog says $468.38 per unit, the product page headline says "Full Container Base Price $382.50/unit", and the order box then says $516.38 per unit. A shopper comparing them assumes a bait-and-switch.
- **The cart says "Qty: 1" but charges for 5 units** ($2,581.88). The minimum order of 5 is never stated as the thing being priced, so the total looks like an error.
- **Refrigerant legal warning appears on air-conditioner orders.** Buying a PTAC heat pump makes the visitor certify EPA 608 refrigerant certification and accept hazardous-material terms. Most AC buyers will stop there.

**3. Is checkout smooth end-to-end?** Mostly yes. A guest can add to cart, reach checkout, fill address, pick a payment method, and reach the order review without signing in — no crashes or dead ends. The friction is the wording above plus the compliance block, not broken plumbing.

**4. Does it look trustworthy on mobile?** Not yet. On a phone: the "Alper Refrigerants" name in the header runs underneath the quote and cart buttons and gets cut off; the homepage opens with a very long keyword-stuffed paragraph instead of a clear offer; the floating WhatsApp circle sits on top of page text; and on a product page the price and Add to Cart sit far below the photo and a specs box, so a phone shopper scrolls a long way before seeing a price.

## What I propose to change

### Pricing clarity (highest impact)
- Make the product page lead with the exact same price the catalog and Google feed show, per unit.
- Move the bulk ladder below it as "buy more, pay less" savings instead of a competing headline price.
- Label quantity honestly everywhere: show "5 units (minimum order)" in cart and checkout lines rather than "Qty: 1".

### Compliance wording
- Show the EPA 608 / hazardous-material certification block only when an actual refrigerant is in the cart. Air conditioners and accessories get a short, calm shipping-and-warranty note instead.

### Mobile trust
- Fix the header so the brand name never collides with the buttons; shorten it on small screens.
- Replace the homepage opening wall of text with a short value line plus the buttons, keeping the long keyword text lower on the page for search.
- On phones, put price and Add to Cart directly under the product photo, above the specs box.
- Nudge the WhatsApp button so it stops covering page content.
- Add a compact trust strip near the buy button: EPA-certified, ships from US warehouses, secure payment, phone number.

### Checkout polish
- Keep guest checkout as-is, and add a short "what happens next" line after the order review so bank-wire and Zelle buyers know how they will be contacted.

## Technical notes
- `src/components/pages/CheckoutPage.tsx` lines 90 and 1239 use `product_type !== 'accessory'` to decide the refrigerant compliance block; change to `product_type === 'refrigerant'`.
- `src/components/pages/ProductDetails.tsx` (~line 701) renders "Full Container Base Price" from `base_unit_price`, while `ProductCard.tsx` (~line 236) renders `getCurrentPrice()`; align both on one source so the catalog, product page, and merchant feed agree.
- Mobile header and hero live in the layout header component and `HomePage.tsx`; product page ordering handled with responsive ordering classes only (no logic change).
- WhatsApp button offset in `src/components/ui/ChatToggle.tsx`.
- Console noise seen locally (Cookiebot 404, Tawk.to CORS) is expected on localhost only and needs no fix.
