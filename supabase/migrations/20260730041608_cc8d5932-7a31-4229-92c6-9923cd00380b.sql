CREATE TABLE IF NOT EXISTS public.generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type text NOT NULL CHECK (document_type IN ('quote','invoice')),
  document_number text NOT NULL UNIQUE,
  order_id uuid NULL,
  buyer_name text NOT NULL,
  buyer_company text,
  buyer_email text,
  buyer_phone text,
  buyer_country text,
  buyer_address text,
  ship_to_address text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  discount_percent numeric NOT NULL DEFAULT 0,
  shipping_cost numeric NOT NULL DEFAULT 0,
  tax_amount numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  amount_paid numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  notes text,
  payment_terms text,
  payment_method text,
  validity_days integer NOT NULL DEFAULT 30,
  po_number text,
  due_date date,
  pdf_url text,
  pdf_path text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_generated_documents_created_at ON public.generated_documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_documents_order_id ON public.generated_documents(order_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.generated_documents TO authenticated;
GRANT ALL ON public.generated_documents TO service_role;

ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage generated documents"
ON public.generated_documents
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS trg_generated_documents_updated_at ON public.generated_documents;
CREATE TRIGGER trg_generated_documents_updated_at
BEFORE UPDATE ON public.generated_documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();