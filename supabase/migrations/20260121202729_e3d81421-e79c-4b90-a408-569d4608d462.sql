-- Create table for decorative banner settings
CREATE TABLE public.banner_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scale NUMERIC NOT NULL DEFAULT 1,
  rotation INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.banner_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view banner settings
CREATE POLICY "Banner settings are viewable by everyone"
ON public.banner_settings
FOR SELECT
USING (true);

-- Only admins can update banner settings
CREATE POLICY "Admins can update banner settings"
ON public.banner_settings
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role = 'admin'::app_role
));

-- Insert default settings
INSERT INTO public.banner_settings (scale, rotation, position_y) VALUES (1, 0, 50);

-- Create trigger for updated_at
CREATE TRIGGER update_banner_settings_updated_at
BEFORE UPDATE ON public.banner_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();