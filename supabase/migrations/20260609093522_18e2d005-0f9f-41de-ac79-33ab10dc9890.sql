
-- 1) Replace the blanket INSERT-block on quotes with a proper authenticated-user policy.
--    Guest quote submissions continue to go through the submit-contact edge function (service role).
DROP POLICY IF EXISTS quotes_insert_system_only ON public.quotes;

CREATE POLICY quotes_authenticated_insert
  ON public.quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 2) Remove the "table" table from the realtime publication so row changes are no longer broadcast.
ALTER PUBLICATION supabase_realtime DROP TABLE public."table";
