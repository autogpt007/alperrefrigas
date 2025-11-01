-- Update RLS policy to allow public read of Tawk and phone settings
DROP POLICY IF EXISTS "Public can view safe site settings" ON public.site_settings;

CREATE POLICY "Public can view safe site settings"
ON public.site_settings
FOR SELECT
USING (
  setting_key = ANY (ARRAY[
    'company_name',
    'company_description',
    'business_hours',
    'timezone',
    'currency',
    'language',
    'free_shipping_threshold',
    'social_media_facebook',
    'social_media_linkedin',
    'social_media_twitter',
    'public_phone',
    'public_email',
    'public_address',
    -- Newly allowed keys
    'tawk_enabled',
    'tawk_property_id',
    'tawk_widget_id',
    'tawk_snippet',
    'main_phone',
    'whatsapp_number',
    'logo_url',
    'company_tagline',
    'header_email'
  ])
);

-- Ensure main_phone is set to the new value
INSERT INTO public.site_settings (setting_key, setting_value, description)
VALUES ('main_phone', '1-409-995-3623', 'Primary phone number displayed across the site')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = now();