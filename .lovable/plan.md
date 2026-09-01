# Google Ads keyword plan — top 50 search terms for Alper

All volumes, CPC and difficulty below come from Semrush (US database). Reality check first: Semrush shows alperrefrigerants.com with 31 organic keywords and effectively no organic traffic, ranking positions 20–90. So paid search is the right lever for fast top-of-page presence, and the winning strategy is **product-code specificity** — competitors (refrigerantscenter.com, refrigerantdepot.com, refrigerantguys.com, youngsupply.com) dominate broad terms, but dozens of specific gas-code terms have real volume with very low difficulty and CPCs under $2.

## The 50 terms, grouped into ad groups

### Tier 1 — high volume, low competition (start here, ~60% of budget)
| Term | Vol/mo | CPC |
|---|---|---|
| r410a refrigerant for sale | 2,900 | $1.86 |
| r22 freon for sale | 880 | $1.34 |
| r438a refrigerant | 880 | $1.20 |
| freon near me | 880 | $5.12 |
| 410a freon for sale | 720 | $1.72 |
| r410a price | 720 | $0.66 |
| r32 refrigerant for sale | 720 | $1.22 |
| r513a refrigerant | 720 | $2.02 |
| r422b refrigerant | 480 | $1.56 |
| mini split refrigerant | 480 | $3.29 |
| r134a refrigerant for sale | 390 | $0.83 |
| r421a refrigerant | 320 | $2.00 |
| r452a refrigerant | 320 | $1.96 |
| refrigerant recovery cylinder | 320 | $0.94 |
| r454b price | 260 | $1.27 |
| r134a price | 260 | $0.47 |
| freon for sale | 260 | $1.58 |
| refrigerant near me | 210 | $1.38 |
| r290 propane refrigerant | 170 | $0.57 |
| r410a near me | 140 | $2.86 |

### Tier 2 — commercial intent, cheap clicks
| Term | Vol/mo | CPC |
|---|---|---|
| refrigerant supplier | 140 | $2.32 |
| refrigerant for sale | 110 | $2.35 |
| r-454b refrigerant for sale | 110 | $1.24 |
| refrigerant distributor | 90 | $2.35 |
| r1234yf for sale | 70 | $0.47 |
| ductless mini split for sale | 70 | $3.05 |
| r404a for sale | 50 | $1.85 |
| r407c for sale | 40 | $1.69 |
| window air conditioner wholesale | 40 | $1.07 |
| co2 refrigerant r744 | 30 | $0.00 |
| r507a refrigerant | 30 | $1.96 |
| buy r454b | 30 | $1.66 |
| bulk refrigerant | 20 | $2.39 |
| buy freon online | 20 | $1.77 |
| wholesale freon | 20 | $1.79 |
| refrigerant gas price | 20 | $0.00 |
| refrigerant cylinder price | 20 | $0.00 |
| hvac supplies wholesale | 20 | $2.49 |
| refrigerant wholesale | 70 | $1.26 |
| hvac contractor supplies | 10 | $0.00 |

### Tier 3 — long-tail question and zero-competition terms (exact match, pennies per click)
| Term | Vol/mo |
|---|---|
| where can i buy r 410a | 20 |
| can i still buy r-410a refrigerant | 20 |
| where to buy r-410a refrigerant | 10 |
| where can i find refrigerant gas wholesale | 10 |
| what certification do i need to buy r-410a | low |
| r454b refrigerant for sale near me | 50 |
| refrigerant pallet pricing | low |
| refrigerant container load pricing | low |
| epa 608 certified refrigerant supplier | low |
| bulk r134a cylinders for sale | low |

## Match-type and structure rules
- Tier 1 gas codes: phrase + exact match, one ad group per gas code (R-410A, R-22, R-454B, R-134a, R-32, R-513A, R-438A, R-422B, R-421A, R-452A, R-404A, R-407C, R-1234yf, R-290, R-744, R-507A).
- Tier 2 wholesale/distributor terms: one "Wholesale & Bulk" ad group pointing at `/bulk-pricing`.
- Tier 3: exact match only, low bids, high-converting long-tail.
- Landing pages: gas-code ad groups → the matching `/products/...` page; wholesale terms → `/bulk-pricing`; AC terms → `/products/air-conditioners`.

## Negative keywords (must-have, ~35 terms)
free, diy, car, automotive recharge, ac pro, walmart, home depot, autozone, amazon, jobs, salary, msds only, recycling, how to recharge, refill my car, leak sealant, refrigerator, fridge, water filter, course, certification exam, training, epa test, calculator, chart, pt chart, msds pdf, used, rental, repair near me, technician jobs, wikipedia, reddit, forum, youtube.

## What gets built in this project
1. `docs/google-ads-keyword-plan.md` — the full 50-term plan above with tiers, match types, ad-group mapping, landing pages and negatives, ready to hand to Google Ads.
2. Pre-load the Google Ads Engine defaults so generating an asset pack starts from this research: seed the Brief step with Alper's real audience/geography/USPs, and add a keyword-tier hint to the `generate-google-ads` prompt so generated keyword lists and negatives match this plan.
3. Add the negative-keyword list as a reusable constant in `src/lib/adsCompliance.ts` so every generated pack includes it.

## Technical notes
- No schema or pricing changes. Work is limited to a new docs file, the Brief step defaults, the ads edge-function prompt, and a negatives constant.
- Landing pages for every Tier 1 gas code already exist, except confirm R-32, R-513A, R-438A and R-744 have live product pages — if any are missing, those ad groups point at `/products/refrigerants` until pages exist.
- Semrush numbers are estimates; treat CPCs as starting bid guidance, not guaranteed costs.
