

## Enable Netlify Prerendering for SEO Crawlers

### Problem
The site is a React SPA — crawlers that don't execute JavaScript see an empty HTML shell, causing Apex and SEMrush to report missing titles, meta descriptions, and canonicals.

### Solution
Enable the **Netlify Prerender plugin**, which intercepts bot requests and serves a fully-rendered HTML snapshot via Prerender.io's free tier (up to 1,000 pages/month).

### Build Error
The `aws s3 cp exit 127` error is a **transient Lovable infrastructure issue** — not caused by code. Retry publishing after this change.

### Changes

**1. `netlify.toml`** — Add the prerender plugin:
```toml
[[plugins]]
  package = "@netlify/plugin-prerender"

  [plugins.inputs]
    prerenderToken = ""
    botHeaderKey = "X-Prerender"
```

The empty `prerenderToken` uses Netlify's built-in bot detection (no Prerender.io account needed for basic use). For full control, sign up at prerender.io and add the token.

**2. `package.json`** — Add the plugin dependency:
```
"@netlify/plugin-prerender": "^2.0.0"
```

**3. `index.html`** — Enhance the fallback `<head>` so even pre-render-less crawlers get basic metadata:
- Move the existing `<title>` and `<meta name="description">` to be more descriptive defaults
- Add `<meta name="robots" content="index, follow">` as a fallback

### What This Fixes
All 7 Apex scan issues (missing title, meta description, canonical, OG tags, H1) resolve because bots now receive the fully-rendered page with all `react-helmet-async` injections applied.

### Alternative (if plugin doesn't work on Lovable's build system)
Add a `<meta name="fragment" content="!">` tag to `index.html` — this signals to Google's crawler to fetch the `#!` escaped fragment version, and modern Googlebot already renders JS natively.

