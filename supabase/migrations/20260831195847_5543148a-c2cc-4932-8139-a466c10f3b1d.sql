-- Storage access rules for the private customer-invoices bucket
CREATE POLICY "invoices_admin_select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'customer-invoices' AND public.is_admin());
CREATE POLICY "invoices_admin_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'customer-invoices' AND public.is_admin());
CREATE POLICY "invoices_admin_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'customer-invoices' AND public.is_admin())
  WITH CHECK (bucket_id = 'customer-invoices' AND public.is_admin());
CREATE POLICY "invoices_admin_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'customer-invoices' AND public.is_admin());

-- Admin audit log
CREATE TABLE public.admin_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid,
  admin_email text,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  resource_label text,
  old_value jsonb,
  new_value jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX admin_audit_log_created_at_idx ON public.admin_audit_log (created_at DESC);
CREATE INDEX admin_audit_log_admin_idx ON public.admin_audit_log (admin_id);
CREATE INDEX admin_audit_log_resource_idx ON public.admin_audit_log (resource_type, resource_id);

GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_admin_read" ON public.admin_audit_log FOR SELECT TO authenticated
  USING (public.is_admin());
