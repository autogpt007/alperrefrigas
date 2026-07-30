CREATE POLICY "Admins manage invoice files"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'customer-invoices' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'customer-invoices' AND public.has_role(auth.uid(), 'admin'));