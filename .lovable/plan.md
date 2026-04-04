
Fix the KYC flow in 3 layers so it stops breaking in preview and becomes stable in production.

1. Confirmed root cause
- The browser request is sending `{"action":"verify-token","token":":token"}`.
- Real KYC tokens in the database are 64-character hex strings.
- So the page is currently calling the edge function with the route placeholder `:token`, not a real verification token.
- That guarantees the `submit-kyc` function returns `404 {"error":"Invalid or expired verification link"}`.
- I also found a second reliability issue: `admin-orders-access` inserts a new `kyc_verifications` row every time “Send KYC” is clicked, so one order can end up with multiple valid records and inconsistent links.

2. Frontend fix: stop calling the edge function with fake tokens
Files:
- `src/components/pages/KYCVerificationPage.tsx`

Changes:
- Validate the route param before any network call.
- Reject empty tokens, placeholder tokens like `:token`, and anything not matching the generated token format (`/^[a-f0-9]{64}$/i`).
- If invalid, show a friendly “Use the full verification link from the email” state instead of hitting the edge function.
- Keep this as a normal page state, not an exception path, so no blank screen/runtime noise.

3. Edge function fix: make token verification safe and non-noisy
Files:
- `supabase/functions/submit-kyc/index.ts`

Changes:
- Add early token format validation for both JSON verify requests and multipart submit requests.
- For `action: "verify-token"`, return a non-error payload for invalid/used links, for example:
  - `{ valid: false, reason: "invalid_token" }`
  - `{ valid: false, reason: "already_submitted", status: "submitted" }`
- Reserve 4xx/5xx only for real request failures, not expected business states.
- Keep full CORS headers on every response.
- This permanently prevents expected invalid-link cases from surfacing as runtime errors.

4. Backend fix: enforce one KYC record per order
Files:
- `supabase/functions/admin-orders-access/index.ts`
- new migration in `supabase/migrations/`

Changes:
- Change “send-kyc” from blind insert to “create or replace/reset” for the order’s existing KYC record.
- On resend:
  - generate a fresh token
  - update the existing row to `pending`
  - clear old uploaded document paths, notes, and `submitted_at`
- Add a database uniqueness rule on `kyc_verifications.order_id` so one order cannot accumulate multiple KYC rows.
- Add a migration step to deduplicate existing rows before adding the unique constraint, keeping the newest row per order.

5. UX hardening
Files:
- `src/components/pages/KYCVerificationPage.tsx`
- optionally `src/components/admin/OrderManagement.tsx`

Changes:
- Show a clearer invalid-link message with next steps: “Request a new verification email” / “Contact support”.
- If the token is a route placeholder in preview, explain that a real emailed link is required.
- Optionally expose the generated KYC link in admin after “Send KYC” so testing is direct and reliable.

6. Regression checks after implementation
- Open `/kyc/:token` in preview: page shows friendly invalid-link state and makes no verify request.
- Open a real emailed KYC link: form loads normally.
- Submit KYC documents: record moves to `submitted`.
- Click “Send KYC” multiple times for the same order: only one DB row exists for that order, newest link is the active one.
- Verify no runtime error is emitted for invalid placeholder tokens.

Technical details
- The current failure is not a missing route; it is a bad token value reaching the function.
- The real permanent fix is not just “handle the error better” — it is:
  1) block placeholder tokens in the client,
  2) stop using 404 for expected invalid verification states,
  3) prevent duplicate KYC records per order.
