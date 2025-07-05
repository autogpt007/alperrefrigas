
-- Create blog posts table if it doesn't exist (it should already exist based on the schema)
-- Adding any missing columns to the existing blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 5;

-- Update RLS policies to ensure proper access
DROP POLICY IF EXISTS "Anyone can view published posts" ON blog_posts;
CREATE POLICY "Anyone can view published posts" ON blog_posts
  FOR SELECT USING (published = true OR auth.uid() = author_id);

-- Create contact submissions table for the contact form
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived'))
);

-- Enable RLS on contact submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage contact submissions
CREATE POLICY "Admins can manage contact submissions" ON public.contact_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policy for anyone to submit contact forms
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);
