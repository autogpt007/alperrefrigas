REVOKE INSERT, UPDATE, DELETE ON public.payment_wallet_addresses FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_wallet_addresses TO authenticated;
GRANT ALL ON public.payment_wallet_addresses TO service_role;