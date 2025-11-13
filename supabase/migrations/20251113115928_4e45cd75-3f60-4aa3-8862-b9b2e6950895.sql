-- Add company_name and whatsapp_phone columns to contact_submissions table
ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT;