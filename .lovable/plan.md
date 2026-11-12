# AI search accessibility

## Goal
Make Alper’s public information easier for ChatGPT search, Claude, Perplexity, Google AI search and Bing/Copilot to discover and read, without exposing buyer records or changing purchases, prices or shipping.

Allowing access does not guarantee indexing, rankings or inclusion in AI answers. Each platform chooses its own sources.

## Findings
- Public crawler files and the 195-URL sitemap return HTTP 200.
- The OpenAI search crawler is incorrectly named `OpenAI-SearchBot`; the current name is `OAI-SearchBot`. Claude search and user-fetch agents are not named explicitly.
- Private-page exclusions currently belong only to the final crawler group rather than all groups.
- The existing AI summary contains unsupported certification claims, inconsistent contact information and outdated blanket quantity/shipping statements.
- Product URLs return an empty application container and shared homepage HTML before JavaScript runs. AI services that do not run JavaScript cannot reliably read individual products or articles.
- Cookiebot is already first in the current HTML; leave consent and tracking unchanged.

## Phase 1 — Safe improvements on the existing website
1. Correct crawler names and allow public pages for search and user-fetch crawlers. Apply the same private-page exclusions to every group, including account, admin, checkout, verification, authentication and confirmation pages. Preserve existing training-crawler access; search access and model training are distinct.
2. Replace the existing `/llms.txt` with a concise, standards-shaped directory of public categories, guides, policies and contact pages. Use only verified business information; do not duplicate volatile prices, inventory, freight rates or unsupported certifications. This file is supplementary guidance, not a guaranteed AI ranking mechanism.
3. Update the sitemap generator to include existing AC, heat-pump, tool, brand and guide pages, published articles and public products; exclude private and confirmation URLs. Ensure generation does not overwrite the corrected crawler rules on the next deployment.
4. Align the non-JavaScript fallback with the actual store, remove unsupported certification claims, and improve public guide/policy discovery. Preserve existing page-specific canonical management and valid structured data.
5. Add crawler access and public-directory regression tests. Verify representative pages, sitemap links, crawler responses and the buyer experience before saving the changes.

## Phase 2 — Full product and article readability
The current website depends on JavaScript for individual product and article content. A separate, explicitly approved upgrade to Lovable’s latest server-rendered template is needed to address this limitation comprehensively.

Before that upgrade, assess checkout, quote forms, admin access, consent, payments and existing Cloud functions. Preserve their behavior and verify the critical journeys after migration. Do not start this migration as part of Phase 1 approval.

## Technical approach
- Keep crawler policy in one shared generator used by predeployment sitemap generation and tests.
- Keep `llms.txt` limited to unauthenticated public content and established canonical URLs on `https://alperrefrigerants.com`.
- Do not weaken database permissions, publish private data, add crawler-only fake content, or write to Merchant Center.
- Keep checkout, quote processing, pricing, shipping and advertising configuration unchanged.

## Publication and verification
Phase 1 changes reach the live website on the next publish. Check the published crawler files again afterward. Search Console is already connected; request a fresh sitemap crawl if necessary. Bing ownership and platform-specific inclusion remain external verification steps, not promises.

## Approval scope
Approve Phase 1 to apply the safe changes above, including refreshing the existing AI directory. Phase 2 remains a separate decision because it changes how the website is rendered.