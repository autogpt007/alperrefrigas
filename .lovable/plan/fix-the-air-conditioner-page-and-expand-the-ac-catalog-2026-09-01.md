# Fix the Air Conditioner page and expand the AC catalog

## The problem (confirmed)

The air conditioner URL is hard-redirected to the accessories page in two places:

- `src/App.tsx` — `/products/air-conditioners` renders `<Navigate to="/products/accessories" />`
- `src/components/seo/MetaRedirects.tsx` — same mapping, so even direct hits bounce

`AirConditionersPage.tsx` already exists and is fully built, but nothing routes to it. That is why the header's "Air Conditioners" link lands on accessories tools (leak detectors, vacuum pumps, recovery machines). The accessories products themselves are already correctly typed `accessory` and already live at `/products/accessories` — nothing needs moving in the database.

The store currently has only 6 air conditioners: 2 mini-splits, 2 window, 2 portable.

## What will change

### 1. Route the AC page properly
- `/products/air-conditioners` renders the existing `AirConditionersPage` (category landing page with the three subcategory cards).
- Remove the accessories redirect from `MetaRedirects`.
- Subcategory pages (`/products/air-conditioners/mini-splits`, `/window-ac`, `/portable-ac`) keep using the catalog with AC-only filtering, plus two new subcategories below.

### 2. Add the highest-demand AC categories
Extend the landing page from 3 to 5 subcategories, covering what wholesale HVAC buyers order most:

| Category | Slug | Why |
| --- | --- | --- |
| Ductless Mini-Splits | `mini-splits` | existing, highest volume |
| Window AC Units | `window-ac` | existing |
| Portable AC Units | `portable-ac` | existing |
| Multi-Zone Mini-Split Systems | `multi-zone` | dual/tri/quad-zone, high ticket |
| PTAC & Commercial Units | `ptac-commercial` | hotels, apartments, light commercial |

### 3. Add new AC products with images
Roughly 14 new products so every category has real depth, spanning the BTU sizes that actually sell (9k / 12k / 18k / 24k / 36k), 115V and 230V, single and multi-zone, with SEER/efficiency labels, room-size coverage, refrigerant type (R-410A / R-32 / R-454B), and the existing bulk MOQ-5 pricing ladder filled in per product.

Coverage:
- Mini-splits: 9k, 18k, 24k, 36k single-zone
- Multi-zone: 18k dual-zone, 27k tri-zone, 36k quad-zone
- Window: 5k, 12k, 15k, plus a 12k inverter/U-shaped unit
- Portable: 8k and 14k dual-hose
- PTAC / commercial: 9k and 15k PTAC with heat, 36k ceiling cassette

Each product gets a generated studio product photo in the same clean style as the existing catalog imagery, uploaded to the images bucket and served through the existing public `product-image` proxy so Merchant Center can fetch them.

### 4. Keep AC compliance rules intact
Air conditioners stay `product_type = 'air_conditioner'`, so they continue to omit EPA 608 / DOT HazMat disclaimers, and keep using the AC configurator checkout flow and the AC bulk-pricing tiers already in place.

## Technical notes

- Product rows inserted into `products` with `product_type = 'air_conditioner'`, `category` matching the subcategory slug, plus `btu`, `ac_type`, `voltage`, `frequency`, `plug_type`, `phase`, `refrigerant_type`, `max_room_size`, `efficiency_label`, `comes_with_base`, `comes_with_accessories`, and the `q20_units` / `q40_units` / uplift columns so the tier calculator works.
- `ProductCatalog.tsx` subcategory matching already reads the slug from the path; the two new slugs need adding to its category label map.
- `AirConditionersPage.tsx` subcategory array grows to 5 entries; SEO title/description and breadcrumbs updated to reflect the wider range.
- Images generated at product-photo aspect, uploaded via storage upload, and referenced as `product-image` proxy URLs (not signed URLs).
- Nothing changes for accessories or refrigerants.
