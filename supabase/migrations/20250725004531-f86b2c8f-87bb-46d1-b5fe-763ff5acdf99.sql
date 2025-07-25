-- Create contact_info table for managing various contact details
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- e.g., 'emergency', 'general', 'returns', 'compliance'
  contact_type TEXT NOT NULL, -- e.g., 'phone', 'email', 'hours'
  label TEXT NOT NULL, -- display label like 'Emergency Hotline', 'General Support'
  value TEXT NOT NULL, -- the actual contact value
  description TEXT, -- additional description
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage contact info" 
ON public.contact_info 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Anyone can view active contact info" 
ON public.contact_info 
FOR SELECT 
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_contact_info_updated_at
BEFORE UPDATE ON public.contact_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default contact information
INSERT INTO public.contact_info (category, contact_type, label, value, description, order_index) VALUES
('emergency', 'phone', 'Emergency Hotline', '1-800-734-HELP', '24/7 Emergency Support', 1),
('emergency', 'phone', 'Critical HVAC Emergency', '+1 (800) 555-HELP', '24/7 access to refrigerant supply and technical support', 2),
('general', 'phone', 'General Support', '1-800-734-7443', 'Main customer service line', 3),
('general', 'phone', 'Refrigerant Line', '1-800-REFRIGERANT', 'Direct refrigerant support line', 4),
('general', 'phone', 'Cool Line', '+1 (800) 555-COOL', 'General inquiries', 5),
('general', 'hours', 'Business Hours', 'Monday - Friday: 7:00 AM - 6:00 PM EST', 'Standard operating hours', 6),
('returns', 'email', 'Returns Email', 'returns@alperrefrigerants.com', 'For return requests and processing', 7),
('returns', 'phone', 'Returns Phone', '1-800-REFRIGERANT', 'Returns and exchanges', 8),
('support', 'email', 'General Support', 'support@alperrefrigerants.com', 'General technical support', 9),
('legal', 'email', 'Legal Inquiries', 'legal@frigidflow.com', 'Terms, compliance, and legal questions', 10),
('compliance', 'email', 'EPA Compliance', 'compliance@frigidflow.com', 'Environmental and regulatory compliance', 11);