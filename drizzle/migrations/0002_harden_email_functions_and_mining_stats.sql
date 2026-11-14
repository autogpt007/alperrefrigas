DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT p.oid::regprocedure AS sig FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
    WHERE n.nspname='public' AND p.proname IN ('move_to_dlq','read_email_batch','enqueue_email','delete_email')
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = public, pgmq', r.sig);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "mining_stats_public_read" ON public.mining_stats;
CREATE POLICY "mining_stats_owner_read" ON public.mining_stats
FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.miner_ownerships mo
    WHERE mo.miner_id = mining_stats.miner_id AND mo.user_id = auth.uid()
  )
);