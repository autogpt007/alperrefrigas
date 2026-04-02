

## Improve Refrigerant Pricing UI — Make Selected Tier Price Prominent

### Problem
When a customer selects a packaging tier (e.g., "1-5 Pallets"), the total price for their selection is shown at the same visual weight as the "Best Price (Full Load)" label. The per-cylinder price is buried as small gray text. Buyers cannot immediately confirm what they will pay.

### Solution
Redesign the pricing display section for refrigerants so that:

1. **Selected tier price is the hero** — large, bold, unmissable total with per-cylinder breakdown
2. **Best price shown as a secondary reference** — smaller "Best price at full load: $X/cyl" hint below, encouraging upsell without competing visually
3. **Pricing tier card** — a styled card that shows the tier name, total price, per-cylinder price, and cylinder count in a clear layout
4. **Before packaging is selected** — show a clean pricing tier table so buyers see all tiers at a glance

### Changes

**File: `src/components/pages/ProductDetails.tsx`**

- **Remove** the static "Best Price (Full Load)" blue box at the top (lines 581-594) for refrigerants — move it inline as a subtle hint
- **Replace** the pricing display block (lines 598-629) with a prominent pricing card:
  - When a tier is selected: large total price (e.g., "$3,400"), tier label badge, per-cylinder price in medium text, cylinder/pallet breakdown, and a small "Best price at full load: $X/cyl" upsell note
  - When no tier selected: show a 3-row pricing summary table (Tier 1 / Tier 2 / Full Load) with per-cylinder prices and total ranges so buyers see the spread immediately
- **Style**: use a gradient-bordered card similar to the existing site aesthetic (blue/cyan tones), with the total in `text-4xl font-bold text-blue-600` and per-cylinder in `text-lg`

**File: `src/components/ProductCard.tsx`**

- Make the displayed price on the catalog card reflect the selected packaging's total in larger text
- Show per-cylinder price more visibly beneath it
- Add a small "From $X/cyl at full load" line to encourage clicks

### What the Customer Sees
- Before selecting: a clean tier comparison showing price-per-cylinder at each level
- After selecting: their exact total is the biggest number on the page, with clear unit breakdown
- A subtle nudge toward full-load pricing without hiding their current tier cost

