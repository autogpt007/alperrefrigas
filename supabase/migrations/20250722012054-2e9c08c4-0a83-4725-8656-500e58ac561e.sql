-- Add email setting to site_settings table if it doesn't exist
INSERT INTO site_settings (setting_key, setting_value, description)
VALUES (
  'notification_email',
  'info@frigidflow.com',
  'Email address displayed in header and used for notifications'
)
ON CONFLICT (setting_key) DO NOTHING;