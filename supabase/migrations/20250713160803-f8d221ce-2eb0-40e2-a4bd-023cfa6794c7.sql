-- Create storage bucket for product documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-documents', 'product-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for product document uploads
CREATE POLICY "Anyone can view product documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-documents');

CREATE POLICY "Admins can upload product documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'product-documents' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update product documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'product-documents' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete product documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'product-documents' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);