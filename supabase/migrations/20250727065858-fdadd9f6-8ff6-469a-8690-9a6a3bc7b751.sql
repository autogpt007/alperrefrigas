-- Create a table for advertisements/announcements
CREATE TABLE public.adverts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'discount', 'emergency')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  dismissible BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.adverts ENABLE ROW LEVEL SECURITY;

-- Create policies for advert access
CREATE POLICY "Admins can manage adverts" 
ON public.adverts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Anyone can view active adverts" 
ON public.adverts 
FOR SELECT 
USING (
  is_active = true 
  AND (start_date IS NULL OR start_date <= now()) 
  AND (end_date IS NULL OR end_date >= now())
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_adverts_updated_at
BEFORE UPDATE ON public.adverts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();