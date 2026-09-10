DROP POLICY IF EXISTS "payment_wallet_addresses_public_read" ON public.payment_wallet_addresses;
REVOKE SELECT ON public.payment_wallet_addresses FROM anon;
GRANT ALL ON public.payment_wallet_addresses TO service_role;

ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;