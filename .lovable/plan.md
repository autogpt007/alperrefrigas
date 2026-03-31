

## Fix: 1,088 Hreflang Conflicts

### Root Cause
The `SEOComponent.tsx` emits 13+ country-specific hreflang tags (en-US, en-GB, en-DE, en-FR, en-IT, en-ES, en-NL, en-BE, en-AT, en-PT, en-IE, en-FI, en-GR, en-AU, en-CA) that ALL point to the identical URL. Google flags this as a conflict because hreflang is meant to differentiate localized versions — if there's no separate URL per locale, the tags are invalid.

### Fix Strategy
Since the site serves the same English content worldwide (no localized subdomains or URL prefixes), replace all 13 country-specific tags with just two:
- `hreflang="en"` — covers all English-speaking markets
- `hreflang="x-default"` — fallback for unmatched regions

This is the correct approach per Google's documentation when you have one language, one URL, but sell internationally.

### File: `src/components/seo/SEOComponent.tsx`

**Remove** these 13 hreflang link tags (lines ~260-280):
```
en-US, en-GB, en-AU, en-CA, en-DE, en-FR, en-IT, en-ES, en-NL, en-BE, en-AT, en-PT, en-IE, en-FI, en-GR
```

**Replace with** just:
```html
<link rel="alternate" hrefLang="en" href={`${siteUrl}${canonicalUrl || ''}`} />
<link rel="alternate" hrefLang="x-default" href={`${siteUrl}${canonicalUrl || ''}`} />
```

### Impact
- Resolves all 1,088 hreflang conflict errors in one change
- No SEO ranking loss — the per-country tags were actively harmful (conflicts hurt rankings)
- Multi-currency structured data in JSON-LD is unaffected (that's a separate, valid mechanism for GMC)
- The `www` vs non-`www` issue is already handled by the Netlify `_redirects` 301 rules

### Technical Note
The multi-region **structured data** (JSON-LD offers with USD/EUR/GBP/AUD/CAD) remains intact and is the correct way to signal multi-currency support to Google Merchant Center. Hreflang is only for URL-level localization.

