-- Create encrypted card storage table for offline processing
CREATE TABLE IF NOT EXISTS public.secure_card_storage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  encrypted_card_number TEXT NOT NULL,
  encrypted_cvv TEXT NOT NULL,
  encrypted_expiry TEXT NOT NULL,
  cardholder_name TEXT NOT NULL,
  billing_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES auth.users(id),
  access_log JSONB DEFAULT '[]'::jsonb
);

-- Enable RLS
ALTER TABLE public.secure_card_storage ENABLE ROW LEVEL SECURITY;

-- Create policies for secure card storage
CREATE POLICY "Admins can manage card storage" 
ON public.secure_card_storage 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create automatic cleanup function for expired cards
CREATE OR REPLACE FUNCTION public.cleanup_expired_cards()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.secure_card_storage 
  WHERE expires_at < now() OR processed = true;
END;
$$;

-- Create trigger to auto-cleanup expired cards daily
CREATE OR REPLACE FUNCTION public.schedule_card_cleanup()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.cleanup_expired_cards();
  RETURN NULL;
END;
$$;

-- Create function to log card access
CREATE OR REPLACE FUNCTION public.log_card_access(
  card_id UUID,
  action TEXT,
  user_id UUID DEFAULT auth.uid()
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_log JSONB;
BEGIN
  new_log := jsonb_build_object(
    'timestamp', now(),
    'user_id', user_id,
    'action', action,
    'ip_address', current_setting('request.headers', true)::jsonb->>'x-real-ip'
  );
  
  UPDATE public.secure_card_storage 
  SET access_log = access_log || new_log
  WHERE id = card_id;
END;
$$;

-- Create indexes for performance
CREATE INDEX idx_secure_card_storage_order_id ON public.secure_card_storage(order_id);
CREATE INDEX idx_secure_card_storage_expires_at ON public.secure_card_storage(expires_at);
CREATE INDEX idx_secure_card_storage_processed ON public.secure_card_storage(processed);