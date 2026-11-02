# Plan: 10 SEO articles for the blog

The blog has no posts right now. This plan publishes 10 long-form articles that target the content gaps found in the saved market research, so the store can rank for guide-style searches.

## The 10 articles
1. R-454B vs R-32: Which A2L Refrigerant Should Contractors Choose in 2026?
2. R-22 Replacement Chart: R-407C, MO99, NU-22B and XP40 Compared
3. EPA Section 608 Rules for Buying Refrigerant: Who Can Buy and What Documents You Need
4. R-454B Pressure-Temperature Chart and Reverse-Thread Adapter Guide
5. R-410A Availability and Pricing in 2026: What the AIM Act Phasedown Means for You
6. A2L Refrigerant Safety: Handling, Storage and Charging Basics for HVAC Technicians
7. How to Size a Mini-Split: BTU per Square Foot, Climate Zone and Room Layout
8. PTAC Units Explained: Buying Guide for Hotels, Apartments and Senior Living
9. Buying Refrigerant by the Cylinder, Pallet or Container: How Bulk Ordering Works
10. HEPA Air Scrubbers and Negative Air Machines for Mold, Duct Cleaning and Construction

## Each article will include
- About 1,500 to 2,200 words, written to the "top article" SEO standard: one clear search intent, an H1/H2/H3 outline, a quick answer near the top, comparison tables where useful, an FAQ section, and a short buying next step.
- A title of 60 characters or fewer, a meta description of 155 characters or fewer, a URL slug, an excerpt, tags and a reading time.
- 2 images: a featured/banner image plus one image inside the article. All images will be newly generated (equipment, cylinders, technicians). No brand logos and no fake product photos.
- 4 to 6 links to our own pages: the matching product or category pages (R-454B, R-32, R-410A, R-22 replacements, PTAC, MRCOOL, Senville, HVAC tools, air scrubbers), RFQ, the guides and other articles.
- 2 to 4 links to trusted outside sources, such as EPA, AHRI, ASHRAE, DOE/ENERGY STAR or manufacturer technical sheets. These open in a new tab with `rel="noopener"`.

## Accuracy rules
- No invented facts, prices, reviews, certifications or dealer claims.
- Pressure-temperature figures and regulations will come only from published manufacturer or EPA sources, with the source linked. If a figure can't be verified, it stays out.
- Prices will only point to our product pages, never to figures typed into the article.
- Compliance wording will follow our current rules: refrigerants are sold to EPA 608-certified buyers only, and nothing is promised about shipping.

## Technical details
- Rows go into the existing `blog_posts` table (`published = true`) using the existing fields: `body` (HTML), `featured_image_url`, `banner_image_url`, `tags`, `reading_time` and `slug`.
- Images are generated to project assets and served by URL.
- Check that the blog page's rendering and sanitization keep links and images, then add `target="_blank" rel="noopener"` handling for outside links if it's missing.
- Check that the sitemap function already includes published blog posts, and that the blog index and post pages set title, description and canonical tags plus Article and FAQPage structured data. Fill any gap.
- Verify with Playwright: open the blog index and 2 or 3 articles, confirm the images load, the links work and there are no console errors.
