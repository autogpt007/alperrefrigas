
-- Create kyc_verifications table
CREATE TABLE public.kyc_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved', 'rejected')),
  billing_name TEXT,
  billing_address JSONB,
  card_front_url TEXT,
  card_back_url TEXT,
  id_document_url TEXT,
  selfie_url TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;

-- No public/authenticated access policies - all access through service role edge functions only

-- Create index on token for fast lookups
CREATE INDEX idx_kyc_verifications_token ON public.kyc_verifications (token);
CREATE INDEX idx_kyc_verifications_order_id ON public.kyc_verifications (order_id);

-- Trigger for updated_at
CREATE TRIGGER update_kyc_verifications_updated_at
  BEFORE UPDATE ON public.kyc_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create private storage bucket for KYC documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', false);

-- Only admins can read KYC documents
CREATE POLICY "Admins can view KYC documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'kyc-documents'
    AND public.has_role(auth.uid(), 'admin')
  );

-- No public upload policy - uploads go through service role in edge functions
