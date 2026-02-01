-- Create logo_settings table
CREATE TABLE public.logo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT,
  scale NUMERIC NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.logo_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Logo settings are viewable by everyone" 
ON public.logo_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update logo settings" 
ON public.logo_settings 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() 
  AND user_roles.role = 'admin'
));

-- Insert default settings
INSERT INTO public.logo_settings (scale) VALUES (1.5);

-- Add trigger for updated_at
CREATE TRIGGER update_logo_settings_updated_at
BEFORE UPDATE ON public.logo_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();