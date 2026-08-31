# Import products, images and pricing from the Merchant Center export

Rebuild the catalog from the product export you download out of Merchant Center: feed prices win, and I attempt to recover each product image from the feed's image links.

## What I confirmed first

- The database has 29 products. Only the 6 air conditioners have any image; the 17 refrigerants and 6 accessories have none, and no product has a thumbnail.
- The old backend host (the one every legacy image URL points at) no longer resolves, so images cannot be pulled from old storage.
- There is no `images` storage bucket in the current backend — only `customer-invoices`. Product image storage has to be recreated before anything can be saved.
- The `merchant-feed` function currently fails with a worker error, so Google is not being served a working feed right now either.

## What you need to give me

In Merchant Center: Products > All products > download/export (CSV or TSV). Upload that file here. I need at minimum the `id`/SKU, `title`, `price`, `image_link`, `additional_image_link`, `availability`; anything else in the export I map where a matching column exists.

## Steps

**1. Recreate product image storage**
Create a public `images` bucket with a per-file size cap, plus rules so only admins can upload or replace files and anyone can read them. Product images must be publicly readable or Google rejects them.

**2. Parse the export and match to the catalog**
Match each export row to an existing product by SKU first, then by exact title. Report three groups before writing anything: matched, new (in the export, not in the database), and orphaned (in the database, not in the export). Orphaned products are left untouched — nothing gets deleted.

**3. Import prices and fields (feed wins)**
For matched products, overwrite price, availability and stock with the export values, plus title, brand, GTIN/MPN and Google category where present. New products are inserted with the columns the export provides. Bulk/pallet pricing columns are left alone — the feed carries only the per-unit price, and pallet tiers are derived from it by existing logic.

**4. Recover images**
For every `image_link` and `additional_image_link` in the export, fetch the URL. Whatever still loads gets downloaded, uploaded into the new `images` bucket under a per-SKU path, and written back to the product as `thumbnail_url` plus the `images` array. Dead links are skipped, never guessed or substituted. You get a list of exactly which SKUs still have no image so you can upload those yourself.

**5. Fix the feed and verify**
Repair the failing `merchant-feed` function, then confirm it emits every product with a live image and matching per-unit price, and spot-check the storefront product grid, a product detail page and the admin inventory list against the imported values.

## Report you get at the end

A table of every product: SKU, old price, new price, whether an image was recovered, and which of the three match groups it fell into.

## Technical notes

- Export parsed in the sandbox (duckdb for CSV/TSV), rows written via `run_sql`; no schema changes beyond the storage bucket and its `storage.objects` policies.
- Image fetches are best-effort with a timeout; failures are logged per SKU, not retried indefinitely.
- Price written to `products.price` as the per-unit (per-cylinder) value, keeping the existing rule that the feed price and the product page price are the same number.
- Currency assumed USD from the export's price field; non-USD rows would be flagged, not converted.

## Out of scope

- No cart, checkout, tax or payment changes.
- No writes back to Google (no Content API); Google picks the corrected data up from the feed.
- No invented prices, stock levels or placeholder images.
