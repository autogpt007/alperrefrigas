# Quote builder: import products and received quote requests

Today the "New quote" screen only offers "Import from order", which is wrong for quotes — most quotes are written before any order exists. Quotes should be built from the product catalogue, and when a customer has already sent in a quote request, that request should fill the form.

## What changes

In the admin Quotes & Invoices screen, the top of the quote form gets two sources instead of the order picker:

1. **Add products** — searchable catalogue picker (name, SKU, category, price). Picking a product adds a line item with its name, packaging/unit and current unit price; quantity starts at 1 and stays editable. Multiple products can be added, and the same product can be added twice with different quantities.
2. **Import a received quote request** — searchable list of customer quote requests (newest first), showing request number, company, contact name and date. Selecting one fills buyer name, company, email, phone and shipping address, and loads each requested product as a line item with quantity and packaging. Because customer requests carry no pricing, each line's unit price is filled from the matching catalogue product where one exists and left at 0 (highlighted as needing a price) where it does not.

For invoices the existing "Import from order" picker stays exactly as it is. Invoices additionally get the product picker, so an invoice can be built from scratch too.

After either import, every field remains editable — nothing is locked. Totals, discount, shipping, tax and payment instructions keep working as they do now.

## Notes and edge cases

- Importing a quote request replaces the current line items and shows how many lines were added and how many need a price.
- Adding products appends to the existing lines and does not touch buyer details.
- A quote created from a request records which request it came from, so the same request isn't quoted twice by accident; the request list marks entries that already have a quote.
- Product prices are read live at import time, so later catalogue price changes don't alter an already saved quote.

## Technical detail

- `src/components/admin/InvoiceForm.tsx`
  - Add a product picker (Popover + Command) fed by `products` (`id, name, sku, category, price, packaging`, ordered by name, limit ~500) that appends an `InvoiceItem`.
  - Add a quote-request picker fed by `quotes` joined with `quote_items` (`product_id, product_name, quantity, packaging`), ordered `created_at desc`, limit 100.
  - `importFromQuoteRequest(id)` sets buyer fields (`customer_name`, `company_name`, `customer_email`, `phone`, `shipping_address`) and maps `quote_items` to line items; resolves unit prices with one `products` lookup on the collected `product_id`s, falling back to a name match, else 0.
  - Render the order picker only when `documentType === 'invoice'`; render both new pickers for quotes, product picker also for invoices.
- Persist the source request in `generated_documents.notes`? No — add a nullable `quote_request_id uuid references public.quotes(id)` column to `public.generated_documents` via migration, and set it on save. The request list uses it to flag already-quoted requests.
- No RLS changes needed: `quotes`, `quote_items` and `products` are already admin-readable.
