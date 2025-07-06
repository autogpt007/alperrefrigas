
-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('epa', 'distributor', 'quality', 'safety')),
  description TEXT,
  pdf_url TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notification_settings table
CREATE TABLE public.notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create site_settings table for global settings like phone numbers
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for team_members
CREATE POLICY "Anyone can view team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Create policies for certificates
CREATE POLICY "Anyone can view active certificates" ON public.certificates FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage certificates" ON public.certificates FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Create policies for notification_settings
CREATE POLICY "Admins can manage notification settings" ON public.notification_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Create policies for site_settings
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Insert default notification email setting
INSERT INTO public.notification_settings (setting_key, setting_value, description)
VALUES ('notification_email', 'eddy3597@gmail.com', 'Email address for receiving form submissions and order notifications')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default WhatsApp number
INSERT INTO public.site_settings (setting_key, setting_value, description)
VALUES ('whatsapp_number', '+18007347443', 'WhatsApp contact number')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default main phone number
INSERT INTO public.site_settings (setting_key, setting_value, description)
VALUES ('main_phone', '1-800-REFRIGERANT', 'Main business phone number displayed across the website')
ON CONFLICT (setting_key) DO NOTHING;

-- Create storage bucket for team photos
INSERT INTO storage.buckets (id, name, public) VALUES ('team-photos', 'team-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for team photos
CREATE POLICY "Anyone can view team photos" ON storage.objects FOR SELECT USING (bucket_id = 'team-photos');
CREATE POLICY "Admins can upload team photos" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'team-photos' AND 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Admins can update team photos" ON storage.objects FOR UPDATE USING (
  bucket_id = 'team-photos' AND 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Admins can delete team photos" ON storage.objects FOR DELETE USING (
  bucket_id = 'team-photos' AND 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
