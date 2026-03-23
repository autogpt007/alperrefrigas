

## Plan: Update Phone Number Site-Wide (409-995-3623 → 787-965-8975)

### Summary
Replace every occurrence of the old phone number `409-995-3623` with `787-965-8975` across all 11 source files plus update the database `site_settings` record. This is a straightforward find-and-replace with format matching.

### Files to Update

**1. Database migration** — Update `site_settings.main_phone` to `1-787-965-8975`

**2. SEO & Layout (global impact):**
- `src/components/seo/SEOComponent.tsx` — `mainPhone` constant
- `src/components/layout/Header.tsx` — fallback value
- `src/components/layout/Footer.tsx` — fallback values (2 occurrences)

**3. Page components (hardcoded phone numbers):**
- `src/components/pages/ContactUs.tsx` — JSON-LD structured data + visible text (3 occurrences)
- `src/components/pages/AboutUs.tsx` — JSON-LD + visible link (2 occurrences)
- `src/components/pages/Certifications.tsx` — visible link + text (2 occurrences)
- `src/components/pages/TermsOfService.tsx` — banner + contact section (2 occurrences)
- `src/components/pages/PrivacyPolicy.tsx` — banner + contact section (2 occurrences)
- `src/components/pages/ShippingPolicy.tsx` — banner + contact section (2 occurrences)
- `src/components/pages/PaymentInformation.tsx` — banner + contact section (2 occurrences)
- `src/pages/NotFound.tsx` — tel: link + display text

### Format Mapping
| Old format | New format |
|---|---|
| `+1-409-995-3623` | `+1-787-965-8975` |
| `1-409-995-3623` | `1-787-965-8975` |
| `+1 (409) 995-3623` | `+1 (787) 965-8975` |
| `tel:+14099953623` | `tel:+17879658975` |

### SEO Preservation
- All JSON-LD structured data telephone fields updated consistently
- `site_settings` DB record updated so Header/Footer dynamic fetches show the new number immediately
- No URL changes, no content restructuring — rankings unaffected

