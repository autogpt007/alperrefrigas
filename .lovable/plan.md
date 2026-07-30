## Goal

Bring the full quote + invoice system from **powersports-catalog-hub** into Alper Refrigerants: an admin document builder, branded PDF generation, storage + email delivery, and a payment-details block where you type in Bank Wire and Zelle details that get printed onto the invoice before it's sent. PDFs carry the Alper logo and an authorized signature.

## What gets built

### 1. Database
New table `public.generated_documents` (ported schema):

- type (`quote` | `invoice`), document number (unique), optional `order_id`
- buyer name/company/email/phone/country/address, ship-to address
- `items` jsonb, subtotal, discount %, shipping, tax, total, amount paid, currency
- notes, payment terms, payment method, validity days, PO number, due date, `pdf_url`, `created_by`
- GRANTs + RLS: admin-only (via existing `has_role(auth.uid(), 'admin')`), `service_role` full access
- `updated_at` trigger using the existing `update_updated_at_column()`
- Number helpers: `INV-YYYY-NNNNN` and `QTE-…` (same style as the existing `generate_quote_number()`)

New private storage bucket `customer-invoices` with admin-only read/write policies.

Seed rows in the existing `site_settings` table (`setting_key` / `setting_value` shape used here) to hold the reusable payment details:
`invoice_bank_beneficiary`, `invoice_bank_name`, `invoice_bank_routing`, `invoice_bank_account`, `invoice_bank_swift`, `invoice_zelle_recipient`, `invoice_zelle_handle`, plus `invoice_logo_url` and `invoice_signature_url`.

### 2. Payment details → invoice (the feature you described)
Inside the invoice builder, exactly like Powersport:

- A **payment method** selector: Bank Wire Transfer, Zelle, Credit Card, Crypto
- A **Bank Wire Details** panel — beneficiary, bank name, routing, account number, SWIFT — editable inline, with a Save button that persists to `site_settings` so it auto-fills on every future document
- A **Zelle Details** panel — recipient name, Zelle email/phone handle — same inline save behaviour
- The panel matching the selected method is highlighted, and its values are injected into the invoice's **Payment Information** section, which renders on the PDF above the totals/signature
- Values can be overridden per-document without changing the saved defaults

### 3. PDF generator — `src/lib/invoice-pdf.ts`
Port the jsPDF renderer and rebrand for Alper:

- Header: Alper logo (from `invoice_logo_url`, falling back to the bundled site logo), title `INVOICE` / `QUOTATION`, doc number, "Prepared for {buyer}" on quotes
- Company block: Alper Refrigerants legal name, address, phone `682-215-2974`, `sales@alperrefrigerants.com`, domain pulled from `src/config/site.ts` so nothing hardcodes it again
- Bill-to / ship-to, line-item table, subtotal / discount / shipping / tax / total / amount paid / balance due
- **Payment Information block** with the bank wire and/or Zelle details from above
- Footer signature area: authorized signature image + "Authorized signatory" line, plus the standard authorization footer
- Refrigerant footnote (EPA 608 / DOT HazMat professional-use wording); omitted for `air_conditioner` items

### 4. Admin UI (`/admin`)
- `InvoiceForm.tsx` — the ported builder: Quote / Invoice toggle, buyer fields, line items, discount/shipping/tax, currency (wired to `CurrencyContext`), payment method + bank/Zelle panels, live PDF preview, save + download + send
- `InvoicesManager.tsx` — list/search/filter all quotes and invoices, re-download, re-send, edit, delete
- `InvoiceEmailPreviewDialog.tsx` — preview the outgoing email before sending
- "Create Invoice from Order" action in the existing `OrderManagement` to pre-fill the form
- New sidebar entry **Quotes & Invoices** at `/admin/invoices`; invoice count/total tile on the admin dashboard
- Branding panel to upload the Alper logo and authorized signature PNG (stored in the `images` bucket, paths saved to `site_settings`)

### 5. Delivery
- `src/lib/uploadInvoiceWithRetry.ts` — 3-attempt upload with backoff, 30-day signed URL, base64 fallback
- `src/lib/sendInvoiceEmail.ts` + a new `invoice-delivery` template registered in the existing `registry.ts`, sent through the existing `send-transactional-email` function (Resend), PDF attached when ≤7 MB
- New edge function `get-invoice-url` + `/i/:docNumber` route so emails link to `alperrefrigerants.com/i/INV-…` instead of a raw Supabase URL; page is `noindex`

## Technical notes

- Powersport is TanStack Start; Alper is Vite/React 18 + react-router. Ported components are rewritten for this project: `react-router-dom`, `@/integrations/supabase/client`, `useToast` (not `sonner`), existing shadcn components.
- Role checks use this project's `app_role` enum (`admin`, `moderator`, `user`); the source project's `super_admin` is dropped.
- `site_settings` here uses `setting_key`/`setting_value` text columns, not `key`/`value` jsonb — all reads/writes adapted.
- `jspdf` added as a dependency.
- Existing `quotes` / `quote_items` tables (customer RFQ flow) are untouched; `generated_documents` is the admin-issued document store, and an existing quote can be pulled in as a starting point.
- The signature image must be supplied by you (transparent PNG). Until uploaded, the PDF prints the signature line and "Authorized signatory" text without an image.

## Out of scope

- No online payment collection — bank/Zelle details are display-only on the document, as requested.
- No changes to the storefront cart, checkout, or KYC flow.
