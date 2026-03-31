

## Plan: Full Mobile Responsive Upgrade

### Problems Identified

After reviewing the codebase, here are the key mobile issues:

**Header (most critical)**
- Top bar with phone/email and login buttons shows everything on one row — overflows on mobile
- Logo + company name + tagline row doesn't stack on small screens
- Currency/Language switchers crowd the top bar on mobile
- `h1` tag in the header uses `text-2xl` regardless of screen size

**Homepage**
- Hero heading uses `text-6xl` as base (way too large for mobile)
- Hero stats grid uses `grid-cols-2` minimum — fine, but text sizes are oversized
- SEO content cards have `flex items-start gap-6` with large icons that don't stack on mobile
- Emergency support card has horizontal layout that doesn't wrap
- "How to Order" and "Seamless Sourcing" steps use `md:grid-cols-3`/`md:grid-cols-4` — OK, but icon sizes and padding are excessive
- CTA button groups use `inline-flex gap-4` that can overflow on narrow screens
- Featured products grid doesn't have a single-column mobile fallback

**Footer**
- Payment methods row overflows horizontally on mobile
- Bottom bar legal links don't wrap well
- Contact info section is fine but could be tighter

**Product Card**
- Image height is fixed at `h-64` — too tall on small mobile screens
- Price/quantity row can feel cramped

**Index.tsx**
- The standalone `h1` uses `text-3xl md:text-4xl` which is reasonable but competes with the hero `h1` inside `HomePage.tsx` (duplicate H1 issue)

---

### Implementation Plan

#### 1. Fix Header mobile layout
- Hide top bar phone/email on mobile (`hidden sm:flex`), keep them in mobile menu instead
- Hide Currency/Language switchers on mobile top bar, move to mobile menu
- Make logo section responsive: hide tagline on very small screens
- Change the header `h1` to a `span` (the real H1 is on the page content)

#### 2. Fix Homepage hero section
- Reduce hero heading from `text-6xl` base to `text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl`
- Reduce hero description from `text-xl` to `text-base sm:text-lg md:text-xl`
- Reduce stats numbers from `text-3xl` to `text-2xl sm:text-3xl`
- Reduce container padding from `py-20` to `py-10 sm:py-16 md:py-20`

#### 3. Fix Homepage content cards
- Make card icon+text layouts stack vertically on mobile: change `flex items-start gap-6` to `flex flex-col sm:flex-row items-start gap-4 sm:gap-6`
- Hide large decorative icons on mobile or shrink them (`w-12 h-12 sm:w-16 sm:h-16`)
- Reduce card padding from `p-8` to `p-4 sm:p-6 md:p-8`
- Emergency support card: stack vertically on mobile
- CTA button groups: make full-width on mobile (`flex flex-col sm:flex-row`)

#### 4. Fix Homepage sections spacing
- Reduce section `py-20` to `py-10 sm:py-16 md:py-20` throughout
- Reduce section headings from `text-4xl md:text-5xl` to `text-2xl sm:text-3xl md:text-4xl lg:text-5xl`
- "Why Choose Us" grid: add `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Services grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Sourcing steps: `grid-cols-1 sm:grid-cols-2 md:grid-cols-4`

#### 5. Fix Featured Products grid
- Change from `md:grid-cols-3` to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

#### 6. Fix Product Card
- Reduce image height from `h-64` to `h-48 sm:h-56 md:h-64`

#### 7. Fix Footer mobile
- Payment methods: use `flex-wrap` properly with smaller gaps on mobile
- Ensure bottom bar links wrap cleanly

#### 8. Fix Index.tsx duplicate H1
- Remove the standalone `h1` in `Index.tsx` since `HomePage.tsx` already renders one in the hero — or change it to a visually-hidden `h1` for SEO while removing the hero `h1` tag to `h2`

### Files to Modify
1. `src/components/layout/Header.tsx` — mobile top bar, logo, switchers
2. `src/components/pages/HomePage.tsx` — hero, cards, sections, grids
3. `src/components/ProductCard.tsx` — image height
4. `src/components/layout/Footer.tsx` — payment row, bottom links
5. `src/pages/Index.tsx` — H1 hierarchy fix

### Technical Details
All changes are Tailwind responsive class adjustments. No new dependencies, no structural refactoring. The pattern is consistently: reduce base sizes and add `sm:`/`md:`/`lg:` breakpoint overrides for larger screens.

