-- Add certificate details setting
INSERT INTO site_settings (setting_key, setting_value, description)
VALUES (
  'certificate_details',
  'All our refrigerants come with proper EPA certification and compliance documentation. We ensure strict quality control and provide complete traceability for all products.',
  'Description text for Certificate Verification & Compliance Assurance section'
)
ON CONFLICT (setting_key) DO NOTHING;