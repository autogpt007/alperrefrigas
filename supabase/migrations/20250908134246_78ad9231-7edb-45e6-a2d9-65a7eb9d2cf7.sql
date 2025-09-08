-- Create payment wallet addresses table for admin-managed payment methods
CREATE TABLE public.payment_wallet_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('bitcoin', 'usdt', 'litecoin', 'ethereum', 'cashapp', 'zelle')),
  wallet_address TEXT NOT NULL,
  qr_code_url TEXT,
  label TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add cashapp and zelle tag fields to orders table
ALTER TABLE public.orders 
ADD COLUMN cashapp_tag TEXT,
ADD COLUMN zelle_tag TEXT;

-- Enable RLS for payment wallet addresses
ALTER TABLE public.payment_wallet_addresses ENABLE ROW LEVEL SECURITY;

-- Create policies for payment wallet addresses
CREATE POLICY "Anyone can view active wallet addresses" 
ON public.payment_wallet_addresses 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage wallet addresses" 
ON public.payment_wallet_addresses 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Add trigger for updated_at on payment_wallet_addresses
CREATE TRIGGER update_payment_wallet_addresses_updated_at
BEFORE UPDATE ON public.payment_wallet_addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();