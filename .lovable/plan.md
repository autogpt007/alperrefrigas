

## Fix KYC Emails Going to Spam

### Root Cause

All emails are sent from `onboarding@resend.dev` — this is Resend's shared test sender domain. Every major email provider (Gmail, Outlook, Yahoo) flags emails from shared test domains as spam. This is expected behavior and cannot be fixed without using your own verified domain.

### Solution: Set Up Your Own Email Domain

Your project already has a custom domain (`alperrefrigas.com`). We need to configure it as a verified sender domain so emails come from something like `noreply@alperrefrigas.com` instead of `onboarding@resend.dev`.

**Step 1:** Set up the email domain through Lovable's built-in email system. This will create DNS records you'll need to add at your domain registrar to verify ownership.

**Step 2:** Once the domain is configured, update the `send-customer-email` Edge Function to use the verified domain as the sender (e.g., `Alper Refrigerants <noreply@alperrefrigas.com>`).

**Step 3:** Redeploy the edge function.

### What You'll Need to Do

- Add DNS records (NS records) at your domain registrar when prompted — this proves you own the domain
- DNS verification can take up to 72 hours, but usually completes within minutes

### Impact

Once verified, all emails (order confirmations, quote confirmations, KYC requests, KYC approvals/rejections, contact confirmations) will send from your branded domain and land in the inbox instead of spam.

