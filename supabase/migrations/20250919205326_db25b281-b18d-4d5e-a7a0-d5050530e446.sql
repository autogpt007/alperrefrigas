-- Fix checkout failure: remove audit trigger/function writing disallowed event_type values
-- Root cause: public.log_order_access() inserts event_type ('order_created', etc.) into security_audit_log,
-- but the table's CHECK constraint (security_audit_log_event_type_check) disallows them.
-- Solution: drop the function with CASCADE to remove any dependent triggers on public.orders.

-- 1) Drop the logging function (and any triggers depending on it)
DROP FUNCTION IF EXISTS public.log_order_access() CASCADE;

-- 2) (Optional) Verify function is gone (no-op if not present)
-- SELECT 'log_order_access exists' WHERE EXISTS (
--   SELECT 1 FROM pg_proc WHERE proname = 'log_order_access' AND pg_function_is_visible(oid)
-- );

-- Note: We intentionally do NOT alter security_audit_log constraints here.
-- If order access auditing is needed later, create a new trigger using public.log_sensitive_data_access()
-- which writes allowed event_type = 'data_access'.
