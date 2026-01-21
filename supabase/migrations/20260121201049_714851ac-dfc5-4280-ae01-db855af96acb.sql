-- Create hero_settings table for dynamic background configuration
CREATE TABLE public.hero_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scale DECIMAL(4,2) NOT NULL DEFAULT 1.15,
  rotation INTEGER NOT NULL DEFAULT -10,
  position_x TEXT NOT NULL DEFAULT 'left',
  position_y INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default settings
INSERT INTO public.hero_settings (scale, rotation, position_x, position_y) 
VALUES (1.15, -10, 'left', 30);

-- Enable RLS
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read hero settings (public page)
CREATE POLICY "Hero settings are viewable by everyone" 
ON public.hero_settings 
FOR SELECT 
USING (true);

-- Only admins can update hero settings
CREATE POLICY "Admins can update hero settings" 
ON public.hero_settings 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_hero_settings_updated_at
BEFORE UPDATE ON public.hero_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();