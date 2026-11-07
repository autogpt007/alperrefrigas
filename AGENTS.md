# Architecture rules

- Buyer quotes are submitted through the server-side submit-quote function and atomic submit_buyer_quote RPC; keep anonymous reads locked and send only reference identifiers back to the browser.
- Share quote input validation between buyer forms, with matching server validation; enforce signed form challenges and persistent IP rate limits before saving leads.