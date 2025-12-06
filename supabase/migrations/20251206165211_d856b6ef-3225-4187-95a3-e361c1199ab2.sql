-- Restrict product-images bucket to admin-only write access
DROP POLICY IF EXISTS "Admin can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

CREATE POLICY "Admin can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admin can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admin can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Restrict product-documents bucket to admin-only write access
DROP POLICY IF EXISTS "Admin can upload product documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update product documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete product documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product documents" ON storage.objects;

CREATE POLICY "Admin can upload product documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-documents' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admin can update product documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-documents' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admin can delete product documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-documents' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);