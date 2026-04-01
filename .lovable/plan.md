

## Fix SEMrush Warnings: Title Length + Missing H1 + Low Content Signals

### Context
SEMrush warnings stem from two real issues and two SPA-rendering false positives. The title fixes must preserve existing keyword targeting — we shorten without removing ranking keywords.

### 1. Fix Title Tags Exceeding 60 Characters (53 pages)

**How it works now:** `SEOComponent` appends `" | Alper Refrigerants"` (22 chars) when the title doesn't already contain "Alper". Many pages already include "Alper" in their title and get passed through as-is — but several still exceed 60 chars.

**Approach:**
- Audit every `title=` prop across all 24 page components
- Trim titles so the **final rendered title** (after suffix logic) is ≤ 60 characters
- Preserve the primary keyword in every title — only cut filler words, emojis, and redundant brand mentions
- Keep the `" | Alper Refrigerants"` suffix logic unchanged (it's already SEO-correct)

**Example trims (keyword-safe):**
| Page | Current Title | Proposed Title | Chars |
|------|--------------|----------------|-------|
| Testimonials | `Customer Testimonials \| Alper Refrigerants Reviews` | `Customer Reviews \| Alper Refrigerants` | 39 |
| EPA | `EPA Compliance - Refrigerant Regulations & Certification` | `EPA Compliance & Certification \| Alper` | 41 |
| Privacy | `Privacy Policy \| Alper Refrigerants` | unchanged (36 chars, fine) | 36 |
| Refund | `Refund & Return Policy - Customer Protection` | `Refund & Return Policy \| Alper` | 32 |
| About | `About Us \| 13+ Years in Refrigerants \| Alper` | unchanged (46 chars, fine) | 46 |
| Freon | `Bulk Freon Wholesale \| R-22, R-410A, R-134a \| Alper` | `Bulk Freon Wholesale \| R-22, R-410A \| Alper` | 45 |

Full audit of all 24 files will be done during implementation — only titles exceeding 60 chars get trimmed.

### 2. Ensure Every Public Page Has Exactly One H1

**Problem:** SEMrush reports "missing H1" on some pages because crawlers see the pre-rendered shell. Some pages may also have multiple H1s.

**Approach:**
- Verify each public page component has exactly one `<h1>` tag
- Admin pages are excluded (not indexed)
- Pages using `HeroBlock` already get an H1 from the block — ensure no duplicate H1 exists in the page component itself

### 3. Low Text-to-HTML Ratio & Low Word Count — No Code Change Needed

These are **false positives** from the SEMrush crawler not executing JavaScript. The Netlify Prerender plugin resolves this. No action required beyond confirming prerendering is active post-deploy.

### Files Changed
1. **~10-15 page components** in `src/components/pages/` — trim title props only (no keyword removal)
2. **A few page components** — add or deduplicate `<h1>` where missing or doubled

### Safety Guardrails
- No keywords removed from any title
- No canonical URLs changed
- No structured data modified
- Existing suffix logic in SEOComponent untouched
- Changes are purely cosmetic trimming and semantic HTML corrections

