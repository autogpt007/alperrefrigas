

## Feedback Emails + KYC Verification System

### Overview
Build three things: (1) transactional emails via Resend connector for order confirmation, quote confirmation, and contact form acknowledgment, (2) a KYC verification flow triggered when admin sets an order to "pending", and (3) a public KYC submission page where buyers upload card photos, ID, and a selfie.

### Architecture

```text
┌─────────────────────────────────────────────────────────┐
│  ADMIN: Sets order → "pending"                          │
│    ↓                                                     │
│  Edge Function: send-kyc-email                          │
│    → Sends branded KYC email via Resend (connector)     │
│    → Email contains order summary + link to /kyc/:token │
│                                                          │
│  BUYER: Opens /kyc/:token                               │
│    Step 1: Name + Billing Address                        │
│    Step 2: Upload card front & back photos               │
│    Step 3: Upload government ID                          │
│    Step 4: Take/upload selfie holding ID                 │
│    → All files stored in private "kyc-documents" bucket  │
│    → KYC record updated in kyc_verifications table       │
│                                                          │
│  ADMIN: Reviews KYC in Order Management                  │
│    → Views uploaded documents                            │
│    → Approves or rejects → status email sent to buyer    │
└─────────────────────────────────────────────────────────┘
```

### Phase 1: Connect Resend + Create Email Edge Function

**Step 1: Link Resend connector** to the project using the existing workspace connection. This provides `RESEND_API_KEY` via the connector gateway.

**Step 2: Create `send-customer-email` Edge Function** (`supabase/functions/send-customer-email/index.ts`)
- Single Edge Function handling multiple email types via a `type` parameter: `order-confirmation`, `quote-confirmation`, `contact-confirmation`, `kyc-request`, `kyc-approved`, `kyc-rejected`
- Uses Resend via connector gateway (`https://connector-gateway.lovable.dev/resend/emails`)
- Each type has a well-crafted HTML email template inline
- The KYC email includes full order details and a link to `/kyc/{token}`

**Step 3: Wire up triggers in existing code:**
- `OrdersContext.tsx` → after `createOrder` succeeds, invoke `send-customer-email` with type `order-confirmation`
- `QuotesContext.tsx` → after `createQuote` succeeds, invoke with `quote-confirmation`
- `ContactUs.tsx` → after contact form submission succeeds, invoke with `contact-confirmation`

### Phase 2: KYC Database + Storage

**Step 4: Database migration** — create `kyc_verifications` table:
- `id` (uuid, PK)
- `order_id` (uuid, FK → orders)
- `token` (text, unique) — secure random token for the public KYC link
- `status` (text: pending, submitted, approved, rejected)
- `billing_name`, `billing_address` (text)
- `card_front_url`, `card_back_url` (text) — storage paths
- `id_document_url` (text)
- `selfie_url` (text)
- `admin_notes` (text)
- `created_at`, `updated_at`, `submitted_at` (timestamptz)
- RLS: service role only (no public access — all access through edge functions)

**Step 5: Create private storage bucket** `kyc-documents` (NOT public). RLS policy: only authenticated admins can read; uploads go through edge function using service role.

### Phase 3: KYC Trigger from Admin

**Step 6: Update `admin-orders-access` Edge Function** — add a new action `send-kyc`:
- Creates a `kyc_verifications` record with a secure random token
- Updates order status to "pending"
- Invokes `send-customer-email` with type `kyc-request`, passing order details and the KYC link

**Step 7: Update `OrderManagement.tsx`** — add a "Send KYC Request" button in the order detail view. When clicked, calls the `send-kyc` action. Show KYC status badge on orders that have a KYC record.

### Phase 4: Public KYC Submission Page

**Step 8: Create `KYCVerificationPage.tsx`** — a new public page at `/kyc/:token`:
- Multi-step form (4 steps with progress indicator):
  1. **Billing Info**: Full name + billing address fields (street, city, state, zip, country)
  2. **Card Photos**: Upload card front and back (camera capture or file upload)
  3. **ID Document**: Upload government-issued ID (passport, driver's license, national ID)
  4. **Selfie**: Take or upload a selfie clearly holding the ID document
- Each step validates before proceeding
- Shows order summary at the top (fetched via token)
- On final submission, all data is sent to a new `submit-kyc` Edge Function

**Step 9: Create `submit-kyc` Edge Function** (`supabase/functions/submit-kyc/index.ts`):
- Validates the token
- Uploads files to `kyc-documents` bucket using service role
- Updates the `kyc_verifications` record with file URLs and billing info
- Sets status to "submitted"
- `verify_jwt = false` (public access via token)

**Step 10: Add route** in `App.tsx`: `/kyc/:token` → `KYCVerificationPage`

### Phase 5: Admin KYC Review

**Step 11: Add KYC review panel to `OrderManagement.tsx`**:
- When viewing an order with a KYC record, show a "KYC Verification" tab
- Display uploaded images (card front/back, ID, selfie) via signed URLs from the edge function
- Show billing info submitted
- Approve/Reject buttons that update KYC status and send corresponding email to buyer

**Step 12: Create `admin-kyc-access` Edge Function** for admin operations:
- `view` action: returns KYC record + signed URLs for all uploaded documents
- `approve` / `reject` actions: update status, send email notification to buyer

### Files Summary

| Action | File |
|--------|------|
| Create | `supabase/functions/send-customer-email/index.ts` |
| Create | `supabase/functions/submit-kyc/index.ts` |
| Create | `supabase/functions/admin-kyc-access/index.ts` |
| Create | `src/components/pages/KYCVerificationPage.tsx` |
| Modify | `supabase/functions/admin-orders-access/index.ts` |
| Modify | `src/components/admin/OrderManagement.tsx` |
| Modify | `src/contexts/OrdersContext.tsx` |
| Modify | `src/contexts/QuotesContext.tsx` |
| Modify | `src/components/pages/ContactUs.tsx` |
| Modify | `src/App.tsx` |
| Modify | `supabase/config.toml` |
| Migration | `kyc_verifications` table + `kyc-documents` bucket |

### Security Considerations
- KYC documents stored in a private bucket — no public URLs
- Token-based access for the public KYC page (no auth required, but token is single-use and time-limited)
- Admin-only access to view KYC documents via signed URLs (expires in 1 hour)
- All file uploads validated for type (image/jpeg, image/png only) and size (max 10MB)
- Billing info validated with Zod on the edge function

