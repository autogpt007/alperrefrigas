

## Diagnosis: Admin Login Issue

### Root cause

The admin login is **not broken in code**. The console logs reveal the actual problem:

```
TypeError: Failed to fetch
  at SupabaseAuthClient._refreshAccessToken
  at SupabaseAuthClient._recoverAndRefresh
AuthRetryableFetchError: Failed to fetch
```

These errors occurred between **16:40–16:41 UTC**. Looking at the Supabase auth service logs, GoTrue (the auth service) went through a **graceful shutdown and restart** at exactly **16:57 UTC**, with similar restart cycles earlier. During those restart windows, the browser cannot reach the auth endpoint, so:

1. The session cannot be refreshed → user appears stuck on the login screen.
2. New `signInWithPassword` calls fail with `Failed to fetch`.
3. The auth state never settles, so the admin layout stays in "Loading admin panel..." forever.

This is the same class of transient platform event noted in your project memory under `infrastructure/deployment-troubleshooting`.

### Confirmed working

- Admin users exist in the database with the correct `admin` role:
  - `eddy3597@gmail.com` (Admin User)
  - `eddy35@gmail.com` (Jones Truett)
  - `alicemarcurzo782@gmail.com`
- `user_roles` table, `has_role()` function, and `AuthContext` role-fetch logic are all correct.
- Supabase URL and anon key in `src/integrations/supabase/client.ts` match `.env`.
- No edge function 4xx/5xx errors in recent logs.
- GoTrue is currently up and healthy (latest restart finished cleanly).

### What to do right now (no code change required)

1. Hard-refresh the admin page (Ctrl/Cmd + Shift + R) to drop any stale failed-refresh state from local storage.
2. If still stuck, open DevTools → Application → Local Storage → clear the `sb-ohfkcxwwvksrjymkgloo-auth-token` entry, then reload and sign in again.
3. Sign in using one of the known admin emails above with the correct password.

### Defensive code improvements to make the admin login resilient

Even though the underlying cause was infrastructure, the UI handles the failure poorly: it shows an infinite "Loading admin panel..." spinner with no recovery path. Plan to harden this:

1. **Add fetch-failure handling in `AuthContext`**
   - Detect `AuthRetryableFetchError` / `Failed to fetch` from `getSession` and `_refreshAccessToken`.
   - Surface a non-blocking error state (e.g., `authError`) instead of leaving `isLoading` true.
   - Stop the loader after a bounded retry window (e.g., 8 seconds) so the UI never hangs.

2. **Improve `AdminLayout` loading UX**
   - When auth has finished loading but `profile` is still null after a short timeout, show a "Could not reach authentication service. Retry" button instead of a perpetual spinner.
   - Add a "Sign out and retry" escape hatch.

3. **Add a "Forgot password / reset session" link on `AuthPage`**
   - Lets a stuck admin clear local session and start fresh without DevTools.
   - Wires `supabase.auth.signOut({ scope: 'local' })` + reload.

4. **Surface the real error on login failure**
   - Currently `setError(result?.error?.message)` will say "Failed to fetch" with no context. Map network errors to: "Authentication service is temporarily unavailable. Please try again in a moment."

5. **Optional: password reset flow**
   - If the admin genuinely forgot the password, add `resetPasswordForEmail` + a `/reset-password` route (currently missing). This is the recommended flow per the auth knowledge.

### Files that will change

- `src/contexts/AuthContext.tsx` — bounded loading, fetch-error detection, friendlier error mapping.
- `src/components/admin/AdminLayout.tsx` — timeout-based fallback UI with retry/sign-out actions.
- `src/components/auth/AuthPage.tsx` — friendlier error messages, "Reset session" helper, optional "Forgot password" link.
- (Optional) `src/components/auth/ResetPasswordPage.tsx` + route in `App.tsx` for password reset.

### What this will NOT do

- It will not change Supabase project configuration, RLS, or the `user_roles` table.
- It will not bypass authentication or weaken security.
- It will not fix a forgotten password by itself — only the optional reset flow does that.

### Verification after implementation

- Simulate offline (DevTools → Network → Offline) on the admin login page → UI shows clear error and recovery, not infinite spinner.
- Sign in with a valid admin account → dashboard loads.
- Sign in with a non-admin account → "Access Denied" card (existing behavior preserved).
- Trigger a stale token by editing the auth token in localStorage → "Reset session" button clears it cleanly.

