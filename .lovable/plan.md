# Generate pallet product images for every refrigerant

Your R-404A pallet photo becomes the master template. I recreate the same shot for each refrigerant, changing only the label text, then attach the result to the product so it shows on the store and in the Merchant Center feed.

## What I confirmed first

- All 17 refrigerant products currently have no image at all (`thumbnail_url` and `images` are both empty), which is why the grid shows blanks.
- Product images are stored in the private `images` bucket and served publicly through the existing `product-image` edge function, so generated files go there and products point at that proxy URL.

## Scope

The 17 refrigerant products:

R-22, R-134A, R-404A, R-407A, R-407C, R-410A, R-422B (NU-22), R-422D (MO29), R-427A, R-438A (MO99), R-448A (N40), R-449A, R-452A, R-453A (RS-44B), R-507A, R-513A, Solstice EZ Flush.

The 6 accessories and 6 air conditioners are out of scope here — they need real product photos, not pallet renders.

## Steps

1. **Lock the template.** Use your uploaded R-404A photo as the source image and edit it per product so only the printed refrigerant designation changes — same white boxes, orange cylinder cutouts, green hazard diamond, wooden pallet, grey studio backdrop, same camera angle and lighting.
2. **Generate one image per refrigerant.** 17 images, named by SKU (e.g. `refrigerants/ALP-R-410A-25LB.jpg`). Solstice EZ Flush gets its own label wording rather than an "R-" code.
3. **Review pass.** I check each render for a legible, correct label before it goes live; anything that comes back with garbled or wrong text gets regenerated. If a label stays unreliable after retries, I report that SKU instead of shipping a wrong photo.
4. **Upload and attach.** Files go into the `images` bucket; each product's `thumbnail_url` and `images` array is set to its `product-image` proxy URL.
5. **Verify.** Confirm the refrigerants grid, a product detail page, and the merchant feed all render the new images.

## Notes

- Renders are generic Alper-style pallet visuals, not photos of specific manufacturer packaging — no third-party brand marks are added, which keeps the Merchant Center image policy safe.
- No pricing, catalog fields, cart, or checkout changes.
- The R-404A product reuses your uploaded photo as its image.
