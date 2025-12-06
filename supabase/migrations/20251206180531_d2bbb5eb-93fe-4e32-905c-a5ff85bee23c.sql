-- Create state_tax_rates table with all US states and current tax rates
CREATE TABLE public.state_tax_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state_code TEXT NOT NULL UNIQUE,
  state_name TEXT NOT NULL,
  tax_rate NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.state_tax_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage tax rates" 
ON public.state_tax_rates 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active tax rates" 
ON public.state_tax_rates 
FOR SELECT 
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_state_tax_rates_updated_at
BEFORE UPDATE ON public.state_tax_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert all US states with current 2024-2025 tax rates
INSERT INTO public.state_tax_rates (state_code, state_name, tax_rate, notes) VALUES
('AL', 'Alabama', 4.00, 'State rate only, local rates may apply'),
('AK', 'Alaska', 0.00, 'No state sales tax'),
('AZ', 'Arizona', 5.60, 'State rate only, local rates may apply'),
('AR', 'Arkansas', 6.50, 'State rate only'),
('CA', 'California', 7.25, 'State rate only, local rates may apply'),
('CO', 'Colorado', 2.90, 'State rate only, local rates may apply'),
('CT', 'Connecticut', 6.35, NULL),
('DE', 'Delaware', 0.00, 'No state sales tax'),
('DC', 'District of Columbia', 6.00, NULL),
('FL', 'Florida', 6.00, 'State rate only, local rates may apply'),
('GA', 'Georgia', 4.00, 'State rate only, local rates may apply'),
('HI', 'Hawaii', 4.00, 'General excise tax'),
('ID', 'Idaho', 6.00, NULL),
('IL', 'Illinois', 6.25, 'State rate only, local rates may apply'),
('IN', 'Indiana', 7.00, NULL),
('IA', 'Iowa', 6.00, NULL),
('KS', 'Kansas', 6.50, 'State rate only, local rates may apply'),
('KY', 'Kentucky', 6.00, NULL),
('LA', 'Louisiana', 4.45, 'State rate only, local rates may apply'),
('ME', 'Maine', 5.50, NULL),
('MD', 'Maryland', 6.00, NULL),
('MA', 'Massachusetts', 6.25, NULL),
('MI', 'Michigan', 6.00, NULL),
('MN', 'Minnesota', 6.875, NULL),
('MS', 'Mississippi', 7.00, NULL),
('MO', 'Missouri', 4.225, 'State rate only, local rates may apply'),
('MT', 'Montana', 0.00, 'No state sales tax'),
('NE', 'Nebraska', 5.50, 'State rate only, local rates may apply'),
('NV', 'Nevada', 6.85, 'State rate only, local rates may apply'),
('NH', 'New Hampshire', 0.00, 'No state sales tax'),
('NJ', 'New Jersey', 6.625, NULL),
('NM', 'New Mexico', 5.125, 'Gross receipts tax'),
('NY', 'New York', 4.00, 'State rate only, local rates may apply'),
('NC', 'North Carolina', 4.75, 'State rate only, local rates may apply'),
('ND', 'North Dakota', 5.00, 'State rate only, local rates may apply'),
('OH', 'Ohio', 5.75, 'State rate only, local rates may apply'),
('OK', 'Oklahoma', 4.50, 'State rate only, local rates may apply'),
('OR', 'Oregon', 0.00, 'No state sales tax'),
('PA', 'Pennsylvania', 6.00, 'State rate only, local rates may apply'),
('RI', 'Rhode Island', 7.00, NULL),
('SC', 'South Carolina', 6.00, 'State rate only, local rates may apply'),
('SD', 'South Dakota', 4.50, 'State rate only, local rates may apply'),
('TN', 'Tennessee', 7.00, 'State rate only, local rates may apply'),
('TX', 'Texas', 6.25, 'State rate only, local rates may apply'),
('UT', 'Utah', 6.10, 'State rate only, local rates may apply'),
('VT', 'Vermont', 6.00, 'State rate only, local rates may apply'),
('VA', 'Virginia', 5.30, 'State rate only, local rates may apply'),
('WA', 'Washington', 6.50, 'State rate only, local rates may apply'),
('WV', 'West Virginia', 6.00, NULL),
('WI', 'Wisconsin', 5.00, 'State rate only, local rates may apply'),
('WY', 'Wyoming', 4.00, 'State rate only, local rates may apply'),
('PR', 'Puerto Rico', 10.50, 'Combined state and local rate'),
('GU', 'Guam', 4.00, 'Use tax'),
('VI', 'U.S. Virgin Islands', 0.00, 'No sales tax');