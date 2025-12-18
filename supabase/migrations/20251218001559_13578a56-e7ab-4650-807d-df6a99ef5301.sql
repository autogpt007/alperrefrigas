-- Create international_tax_rates table for EU VAT, UK VAT, and AU GST
CREATE TABLE public.international_tax_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  tax_type TEXT NOT NULL DEFAULT 'VAT',
  tax_rate NUMERIC NOT NULL DEFAULT 0,
  region TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.international_tax_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage international tax rates"
ON public.international_tax_rates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active international tax rates"
ON public.international_tax_rates
FOR SELECT
USING (is_active = true);

-- Create updated_at trigger
CREATE TRIGGER update_international_tax_rates_updated_at
BEFORE UPDATE ON public.international_tax_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed EU VAT rates (2025 rates)
INSERT INTO public.international_tax_rates (country_code, country_name, tax_type, tax_rate, region, notes) VALUES
-- EU Countries
('AT', 'Austria', 'VAT', 20.00, 'EU', 'Standard VAT rate'),
('BE', 'Belgium', 'VAT', 21.00, 'EU', 'Standard VAT rate'),
('BG', 'Bulgaria', 'VAT', 20.00, 'EU', 'Standard VAT rate'),
('HR', 'Croatia', 'VAT', 25.00, 'EU', 'Standard VAT rate'),
('CY', 'Cyprus', 'VAT', 19.00, 'EU', 'Standard VAT rate'),
('CZ', 'Czech Republic', 'VAT', 21.00, 'EU', 'Standard VAT rate'),
('DK', 'Denmark', 'VAT', 25.00, 'EU', 'Standard VAT rate'),
('EE', 'Estonia', 'VAT', 22.00, 'EU', 'Standard VAT rate'),
('FI', 'Finland', 'VAT', 25.50, 'EU', 'Standard VAT rate'),
('FR', 'France', 'VAT', 20.00, 'EU', 'Standard VAT rate'),
('DE', 'Germany', 'VAT', 19.00, 'EU', 'Standard VAT rate'),
('GR', 'Greece', 'VAT', 24.00, 'EU', 'Standard VAT rate'),
('HU', 'Hungary', 'VAT', 27.00, 'EU', 'Highest VAT rate in EU'),
('IE', 'Ireland', 'VAT', 23.00, 'EU', 'Standard VAT rate'),
('IT', 'Italy', 'VAT', 22.00, 'EU', 'Standard VAT rate'),
('LV', 'Latvia', 'VAT', 21.00, 'EU', 'Standard VAT rate'),
('LT', 'Lithuania', 'VAT', 21.00, 'EU', 'Standard VAT rate'),
('LU', 'Luxembourg', 'VAT', 17.00, 'EU', 'Lowest VAT rate in EU'),
('MT', 'Malta', 'VAT', 18.00, 'EU', 'Standard VAT rate'),
('NL', 'Netherlands', 'VAT', 21.00, 'EU', 'Standard VAT rate'),
('PL', 'Poland', 'VAT', 23.00, 'EU', 'Standard VAT rate'),
('PT', 'Portugal', 'VAT', 23.00, 'EU', 'Standard VAT rate'),
('RO', 'Romania', 'VAT', 19.00, 'EU', 'Standard VAT rate'),
('SK', 'Slovakia', 'VAT', 23.00, 'EU', 'Standard VAT rate'),
('SI', 'Slovenia', 'VAT', 22.00, 'EU', 'Standard VAT rate'),
('ES', 'Spain', 'VAT', 21.00, 'EU', 'Standard VAT rate'),
('SE', 'Sweden', 'VAT', 25.00, 'EU', 'Standard VAT rate'),
-- UK
('GB', 'United Kingdom', 'VAT', 20.00, 'UK', 'Standard VAT rate post-Brexit'),
-- Australia
('AU', 'Australia', 'GST', 10.00, 'AU', 'Goods and Services Tax'),
-- US (no federal VAT, state taxes handled separately)
('US', 'United States', 'SALES_TAX', 0.00, 'US', 'State sales tax calculated separately via ZIP code');