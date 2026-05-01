## Google Ads Engine — Admin Tool

An AI-powered admin tool that turns a marketing brief into a complete, Google-Ads-compliant, SEO-optimized campaign asset pack. Lives inside `/admin`, gated by the existing `admin` role.

---

### 1. User flow

```
Step 1: Goal & Intent (questions + free text)
   ↓
Step 2: Audience, Offer & Compliance brief (wizard)
   ↓
Step 3: AI Generation (Lovable AI via edge function)
   ↓
Step 4: Reviewable Asset Pack with per-field compliance badges
   ↓
Step 5: Save / Export (JSON, CSV for Google Ads Editor) + version history
```

#### Step 1 — What do we want to achieve?
A guided panel that asks the user, in plain language:
- Primary goal (Leads / Sales / Quote requests / Wholesale inquiries / Brand awareness / Re-engagement)
- Conversion action they want (form, call, checkout, RFQ)
- Success metric (CPL, ROAS, CTR, conversions)
- Time horizon (always-on, seasonal push, launch)
- Budget tier (small / medium / large) — only used to inform copy aggressiveness, not bid strategy
- Free-text "anything else we should know" box

#### Step 2 — Brief wizard
Structured fields:
- Product / service to advertise (dropdown of existing products from `products` table + manual entry)
- Product type auto-detected (`refrigerant` vs `air_conditioner`) → drives compliance ruleset
- Target audience (HVAC contractors, wholesalers, EPA-certified techs, facility managers, etc.)
- Geography (US states, EU countries, worldwide) — used for hreflang/locale hints
- USPs (multi-line)
- Offer / promo (optional, e.g. bulk discount, free shipping over X)
- Tone (Professional / Technical / Urgent / Friendly)
- Banned terms / "do not say" list
- Free-text supplemental brief

---

### 2. Generated asset pack ("intelligent + all of the above")

For each generation the engine returns:

**Campaign-level**
- 3 suggested campaign names
- Recommended campaign type (Search / PMax / Display) with rationale
- Suggested geo + language targeting
- Bid strategy recommendation (Max Conversions / tCPA / tROAS) with rationale
- Daily budget guidance band

**Ad group structure (themed, SKAG/STAG)**
- 3–6 themed ad groups, each with:
  - Theme + intent stage (TOFU/MOFU/BOTM)
  - Final URL recommendation (mapped to existing site routes)

**Per ad group — Responsive Search Ads**
- 15 Headlines (≤30 chars) — pinned suggestions for H1/H2/H3
- 4 Descriptions (≤90 chars)
- 2 Display Paths (≤15 chars each)
- Final URL + Mobile Final URL
- Tracking template suggestion

**Extensions / Assets**
- 6 Sitelinks (text ≤25, two descriptions ≤35 each, URL)
- 8 Callouts (≤25 chars)
- 2 Structured Snippets (header from Google's allowed list + 4–10 values)
- 4 Promotion assets (occasion, item, monetary/percent off)
- 4 Image asset prompts (for designer / PMax)
- 2 Lead form headlines + CTAs

**Keywords**
- Per ad group: 10–20 keywords with match type (broad/phrase/exact) and intent label
- 30+ negative keywords (universal + theme-specific) with rationale
- Brand vs non-brand split

**SEO crossover**
- Suggested H1, meta title (≤60), meta description (≤155) for the landing page that matches each ad group
- Schema.org snippet recommendation (Product / Service / Offer)
- Internal-link suggestions to existing site routes

**Compliance & QA report**
- Per-field validation badges: ✅ pass / ⚠️ warning / ❌ blocked
- Reasons listed inline (e.g. "Headline 4: 31 chars — exceeds 30")
- Refrigerant rule report: EPA 608, DOT HazMat, B2B-only language enforced
- Air-conditioner products skip EPA/DOT lines (per project memory)
- Editorial checks: no double "!", no ALL CAPS words >1, no phone numbers in headlines, no superlatives without proof, no trademarks of competitors, no prohibited claims ("cheapest", "guaranteed", etc.)

---

### 3. Compliance ruleset (enforced both client + server side)

Char limits and editorial rules baked into a shared validator:

```
Headline ≤ 30
Description ≤ 90
Path ≤ 15
Sitelink text ≤ 25, sitelink desc ≤ 35
Callout ≤ 25
Promo: occasion enum, item ≤ 20
Meta title ≤ 60, meta desc ≤ 155
```

Plus regex-based blockers for:
- Excessive punctuation `!!`, `??`, `..`
- Excessive capitalization (>1 fully-capitalized word per asset, brand exceptions allowlist)
- Phone numbers in headlines
- Prohibited superlatives without proof terms
- Refrigerant-specific: must include EPA 608 / B2B / certified-buyer language; must not target consumers
- AC-specific: omit refrigerant disclaimers entirely

If the AI returns assets that fail validation, the edge function automatically requests a regeneration of just the failing fields (max 2 retries) before surfacing them as ⚠️.

---

### 4. Persistence

New tables (admin-only RLS via existing `has_role(auth.uid(),'admin')`):

```
ad_campaigns
  id, created_by, name, goal, brief_json, product_type, status,
  created_at, updated_at

ad_generations
  id, campaign_id, prompt_payload, ai_response, compliance_report,
  model, created_at

ad_assets
  id, campaign_id, ad_group, asset_type (rsa|sitelink|callout|snippet|
    promo|keyword|negative|seo_meta), payload_json, compliance_status,
  created_at
```

All three: `ENABLE ROW LEVEL SECURITY` + admin-only SELECT/INSERT/UPDATE/DELETE policies using `has_role`.

---

### 5. Files to create / edit

**New**
- `src/components/admin/GoogleAdsEngine.tsx` — main page (wizard + results)
- `src/components/admin/ads/GoalStep.tsx`
- `src/components/admin/ads/BriefStep.tsx`
- `src/components/admin/ads/AssetPackView.tsx` (tabs: RSA, Extensions, Keywords, SEO, Compliance)
- `src/components/admin/ads/ComplianceBadge.tsx`
- `src/components/admin/ads/CampaignHistory.tsx`
- `src/lib/adsCompliance.ts` — shared validator (limits, regex, refrigerant rules)
- `src/lib/adsExport.ts` — Google Ads Editor CSV export
- `supabase/functions/generate-google-ads/index.ts` — calls Lovable AI Gateway with structured tool-calling output, runs server-side compliance pass, retries failing fields
- Migration: 3 tables above + admin RLS

**Edited**
- `src/components/admin/AdminSidebar.tsx` — add "Google Ads Engine" entry
- `src/components/pages/AdminDashboard.tsx` — register route

---

### 6. AI integration

- Provider: Lovable AI Gateway (no extra setup; `LOVABLE_API_KEY` already present).
- Default model: `google/gemini-3-flash-preview` for cost; allow toggle to `openai/gpt-5` for hardest briefs.
- Structured output via tool calling (`generate_ad_pack` function with strict JSON schema covering all asset categories above) — never free-form JSON parsing.
- System prompt encodes: Google Ads editorial policy summary, character limits, the project's refrigerant/B2B compliance rules, and an instruction to always return all required fields.
- Edge function handles 429 (rate-limit toast) and 402 (credits exhausted toast) per Lovable AI guidance.

---

### 7. Export

- Copy-to-clipboard per field
- Bulk CSV in Google Ads Editor format (separate CSVs for RSA, Sitelinks, Callouts, Snippets, Keywords, Negatives)
- JSON export of full pack + compliance report
- Files written to a download in-browser (no server storage needed beyond DB record)

---

### 8. Out of scope (intentional)

- No live push to the Google Ads API (would require OAuth2 + Ads API access; can be a follow-up).
- No bid management or live performance metrics.
- No public-facing version (admin-only as confirmed).

---

### Acceptance criteria

- Admin can complete Goal + Brief, click Generate, and within ~15s receive a full compliant asset pack.
- Every asset shows a green / amber / red badge with reason.
- Refrigerant briefs include EPA 608 + B2B language; AC briefs do not include refrigerant disclaimers.
- Saved campaigns are listed in a history panel and can be re-opened, re-generated, and exported.
- Non-admin users cannot see the sidebar entry, hit the route, or call the edge function.
