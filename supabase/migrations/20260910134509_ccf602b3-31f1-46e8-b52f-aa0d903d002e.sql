CREATE POLICY "kyc_documents_admin_select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'kyc-documents' AND public.is_admin());
CREATE POLICY "kyc_documents_service_all" ON storage.objects FOR ALL TO service_role USING (bucket_id = 'kyc-documents') WITH CHECK (bucket_id = 'kyc-documents');
DROP POLICY IF EXISTS "contact_submissions_public_insert" ON public.contact_submissions;