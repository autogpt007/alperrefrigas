-- Add header email setting to site_settings table
INSERT INTO site_settings (setting_key, setting_value, description)
VALUES (
  'header_email',
  'info@frigidflow.com',
  'Email address displayed in the website header'
)
ON CONFLICT (setting_key) DO NOTHING;