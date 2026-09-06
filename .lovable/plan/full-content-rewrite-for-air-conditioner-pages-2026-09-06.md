# Full content rewrite for air conditioner pages

Right now the 20 air conditioner pages are thin: each has a single 100-180 character blurb, no applications list, no specification table rows that apply to air conditioners (the table only fills in refrigerant fields like CAS number and hazard class), five generic "use cases" repeated on every page, and only four short questions. Four units (Black+Decker 14,000 BTU portable, Frigidaire 10,000 BTU window, LG 8,000 BTU window, Pioneer 12,000 BTU mini-split) are also missing BTU, voltage, room size, efficiency and refrigerant values entirely.

## What each air conditioner page will have after this

1. **A real description (250-400 words), unique per unit** — what it is, the space it cools, how it installs, electrical needs, efficiency, refrigerant used, and who buys it (contractor, property manager, hotel, distributor). Written per unit from its actual specs, not one template with the name swapped.
2. **Complete specification table** — BTU, unit type, coverage area, efficiency rating, refrigerant, voltage, plug type, phase, frequency, brand, SKU, availability, and what ships in the box.
3. **"Who this unit is for" section** — 5-6 use cases specific to the unit type (window, portable, mini-split, multi-zone, ceiling cassette, PTAC), replacing today's identical five bullets.
4. **Buying guide block** — sizing guidance (BTU vs. square footage), installation notes, and what to order alongside it, with links to the air conditioners hub, the matching category, and the refrigerant that unit uses.
5. **Expanded FAQ (7-8 questions)** — sizing, electrical requirements, single unit vs. bulk pricing, installation, refrigerant type, shipping and freight, ordering process. Marked up so Google can show them.
6. **Unique page title and meta description per unit**, built from brand, BTU, unit type and coverage, instead of one shared pattern.
7. **Missing data filled in** for the four incomplete units so their pages are not blank in the specification table.

## Where the content lives

Descriptions, applications and specification values go into the product records in the database, so the same text feeds the pages, the Google Merchant feed and the catalog. The page layout changes (spec rows for air conditioners, use cases per unit type, buying guide, wider FAQ, per-unit titles) go into the product page code.

## Two things I need from you

- **Warranty**: I will not invent warranty lengths. Unless you give me the terms, the pages will say "manufacturer warranty — contact us for coverage details" as they do today.
- **Installation**: same for installation services. Current wording ("we recommend professional installation, contact us for installer referrals") stays unless you tell me otherwise.

## Technical notes

- Content migration over `public.products` where `product_type = 'air_conditioner'`: fill `description`, `applications` (jsonb), `technical_specs` (jsonb), plus `btu`, `ac_type`, `voltage`, `max_room_size`, `efficiency_label`, `refrigerant_type` for the four incomplete rows. Guarded by a `site_settings` key so it cannot double-apply.
- `ProductDetails.tsx`: extend `specsTableData` with air conditioner fields; branch `useCases` on `ac_type`; extend `productFAQ` for air conditioners; add a buying-guide card with internal links; build `seoTitle`/`seoDescription` for air conditioners from brand + BTU + type.
- FAQ and Product structured data already exist via `SEOComponent` — the new questions flow into the existing FAQ schema.
- No pricing, checkout or cart logic changes.
