# Architecture rules

- Buyer quotes are submitted through the server-side submit-quote function and atomic submit_buyer_quote RPC; keep anonymous reads locked and send only reference identifiers back to the browser.
- Share quote input validation between buyer forms, with matching server validation; enforce signed form challenges and persistent IP rate limits before saving leads.
- Product quote sheets submit the current selection independently of the quote basket; mobile assistance opens the same sheet without duplicating leads.
- Keep checkout field validation in a shared helper and preserve destination-specific requirements; mobile order controls use the same guarded submission handler as desktop.