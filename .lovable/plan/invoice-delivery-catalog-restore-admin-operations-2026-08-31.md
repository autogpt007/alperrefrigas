# Invoice Delivery, Catalog Restore & Admin Operations

Three pieces of work: make invoice emails actually land in the client's inbox with the PDF attached, put products back into the restored commerce tables, and extend the existing admin with Customers, Inventory, real dashboard numbers and an audit log.

---

## 1. Invoice email actually reaches the client

The email code itself is fine — it already builds the message and attaches the PDF. What's broken is everything around it, caused by the backend rebuild:

- The `customer-invoices` storage bucket **no longer exists** (the backend currently has zero buckets). The PDF upload fails, so `pdf_path` is never saved and the send step has nothing to attach.
- There are **no storage access rules** at all, so even once the bucket exists nothing may write to it.
- The sender address falls back to `onboarding@resend.dev`. Resend only delivers from that test address to your own account email — that is why the client never receives anything.
- The send function isn't registered in the backend config.

Fixes:

- Create a **private** `customer-invoices` bucket with a 25MB per-file cap.
- Add access rules on it: only admins can upload, read or replace invoice PDFs; server-side processes get full access. Nothing is publicly readable.
- Set the sender to **invoices@alperrefrigerants.com** and register the send function so it deploys.
- Surface real failures in the admin UI. Today a failed upload or send can look like "queued". After this, the dialog reports exactly what failed (upload, missing PDF, sender rejected) instead of a generic success.
- Add a "Resend email" action on already-generated documents so you can retry without regenerating the PDF.
- Run a live end-to-end test send and confirm delivery before I hand it back.

**Requires your action:** `invoices@alperrefrigerants.com` must be on a Resend-verified sending domain. I'll check the domain status as part of this work and tell you if verification is still pending — until it is, Resend will reject the send no matter what the code does.

---

## 2. Restore the product catalog

The `products` table is empty, and every commerce table with it (0 orders, 0 order items, 0 quotes). The old backend is unreachable, and the published site already points at the new empty one — so the live store currently has no catalog.

Recovery source, as agreed: the **product seed migrations preserved in this repo's history**. Five of them contain full product inserts covering refrigerants, accessories and air-conditioner units, including SKUs, prices, packaging, applications, technical specs, bulk-pricing tiers and Merchant Center fields.

Approach:

- Pull all product inserts from those five historical migrations.
- Where the same product appears more than once, keep the **latest** version (later migrations corrected earlier prices and added fields).
- Map every column onto the current `products` schema, dropping any field that no longer exists rather than guessing a replacement.
- Load the rows, then re-check the storefront, admin product pages and the Merchant Center feed against the restored data.

**Important caveat:** these prices and stock levels are whatever they were when those migrations were written — they are not guaranteed to match what you were selling at last week. I will give you a table of every restored product with its price and stock so you can correct anything stale in the admin UI. Nothing about pricing will be invented; it comes verbatim from your own history.

I will not touch cart, checkout or payment logic as part of this.

---

## 3. Extend the admin

Keeping every existing page as-is and filling the gaps.

**New: Customers page** (`/admin/customers`)
- One row per customer, built from registered profiles plus the contact details on their orders.
- Columns: name, email, phone, order count, total spent, last order date.
- Search by name or email, sortable, paginated 20 per page.
- Row click opens a read-only panel: full contact details, KYC status, and their order history with links through to each order.

**New: Inventory page** (`/admin/inventory`)
- Stock level per product with a low-stock threshold and an "out of stock" filter.
- Inline stock adjustment with the reason recorded to the audit log.
- Availability toggle (in stock / out of stock) that drives both the storefront badge and the product structured data.
- Filter by product type (refrigerant, accessory, air conditioner).

**Upgraded: Dashboard** (`/admin`)
- Today it only counts products from static category lists. Replaced with live figures: order count and revenue for the selected period, pending orders, unpaid invoices, low-stock item count, new customers.
- Recent orders list and recent invoices list, each linking to its detail view.
- Period switch: 7 / 30 / 90 days.

**New: Audit log** (`/admin/audit-log`)
- New table recording who did what: admin, action, what was affected, before and after values, timestamp.
- Written on order status changes, stock and price edits, deletes, and invoice sends.
- Filterable by admin and date range. Readable by admins only; entries cannot be edited or deleted from the app.

Existing Orders and Payments pages get navigation links to the new sections but keep their current behaviour.

---

## Technical notes

- Bucket created with the storage tool (`customer-invoices`, private, 25MB); `storage.objects` policies added by migration, scoped to `bucket_id = 'customer-invoices'` and gated on `is_admin()`, plus full `service_role` access.
- `INVOICE_FROM_EMAIL` stored as a secret; `send-invoice-document` registered in `supabase/config.toml` and redeployed. Domain status read through the existing `check-email-domain` function.
- Product rows loaded with `run_sql` (data, not schema) after extracting and de-duplicating the inserts from git history. Column set reconciled against the live `products` table first.
- New `admin_audit_log` table: admin id, action, resource type, resource id, old/new values as JSON, timestamp. GRANTs to `authenticated` (select only) and `service_role`; RLS restricts reads to `is_admin()` and blocks client-side inserts so entries are written server-side only.
- Customers view derives from `profiles` joined to `orders` aggregates — no new customer table, no duplicated identity data.
- New admin pages reuse the existing shadcn table, card, badge, slide-over and toast components and the project's current tokens. No new colors or fonts.
- Admin access stays enforced in two places: the route guard in `AdminLayout` and `is_admin()` in the row-level policies.
- All new pages are responsive: tables collapse to stacked cards on mobile, sidebar stays collapsible.

## Out of scope

- No changes to cart, checkout or payment processing.
- No Google Merchant Center or Content API writes.
- No policy text, address or contact changes (that's the separate GMC audit work still waiting on your confirmed wording).
