# Finish the Cloud Backend Restoration

The new Cloud backend currently only has the auth foundation (`profiles`, `user_roles`, roles enum, role-check helpers). The other 39 tables the app depends on are still missing, so most admin screens and storefront queries fail type checking and would fail at runtime.

## What will be done

1. **Restore the remaining tables** in batches, grouped so dependencies land in the right order:
   - Catalog & content: products, featured_products, hero_images, page_content_blocks, blog_posts, blog_post_views, blog_post_stats, adverts, team_members, testimonials, certificates
   - Commerce: orders, order_items, quotes, quote_items, coupons, generated_documents, kyc_verifications
   - Config & rates: site_settings, contact_info, shipping_zones, state_tax_rates, international_tax_rates, exchange_rates, payment_wallet_addresses, notification_settings, newsletter_subscribers
   - Mining/wallet legacy set: asic_miners, miner_ownerships, mining_payouts, mining_stats, user_wallets
   - Security logs: security_audit, security_audit_log, contact_submissions
   - Ads engine: ad_campaigns, ad_generations, ad_assets
2. **Drop the bogus `public.table` entry** produced by the schema generator — it is an artifact, not a real table.
3. **Access rules for every table**, matching the documented behaviour of this project:
   - Public read-only for catalog/content (products, blog, testimonials, hero images, rates, shipping zones, settings).
   - Owner-only access on anything with a customer link (orders, quotes, KYC, wallets, documents) — customers see only their own records.
   - Admin-only full control everywhere, via the existing role check.
   - Security/audit logs writable only by server-side functions, readable only by admins.
4. **Timestamps and update triggers** on tables that carry an updated date.
5. **Storage buckets** re-created: the private `customer-invoices` bucket and the `images` bucket with user-scoped upload folders.
6. **Security tightening** on the auth helper functions so anonymous visitors cannot execute them directly.
7. **Seed the essential config rows** so the site renders: site settings (phone 682-215-2974, domain alperrefrigerants.com, bank/Zelle payment details), contact info, and default shipping/tax rows.
8. **Regenerate the database types** and run a full typecheck, then fix any component mismatches that surface.
9. **Run the database security linter** and resolve findings tied to the restored schema.

## Notes / technical details

- Source of truth is `supabase/migrations/baseline_restore.sql`, derived from the pre-migration generated types (commit `c4dfe73`). Column types were inferred, so date-like and id-like columns are mapped to timestamptz/uuid, and unique constraints are added where the app relies on upserts (`site_settings.setting_key`, `coupons.code`, `products.sku`).
- Migrations are applied in several approval steps rather than one 950-line block, so a failure in one group does not block the rest.
- Existing product/order/blog **data** is not recoverable from the type definitions — this restores structure plus essential config seeds. Catalog and historical order content will need to be re-entered or re-imported.
- Edge functions and app code stay as-is; only schema, policies, buckets, and generated types change.
