-- Add image_url column to hero_settings
ALTER TABLE public.hero_settings 
ADD COLUMN image_url TEXT DEFAULT '/assets/hero-carpet-texture.jpeg';

-- Add image_url column to banner_settings
ALTER TABLE public.banner_settings 
ADD COLUMN image_url TEXT DEFAULT '/assets/decorative-carpet.png';

-- Create storage bucket for background images if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('backgrounds', 'backgrounds', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to backgrounds bucket
CREATE POLICY "Background images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'backgrounds');

-- Allow admins to upload background images
CREATE POLICY "Admins can upload background images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'backgrounds' 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Allow admins to update background images
CREATE POLICY "Admins can update background images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'backgrounds' 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Allow admins to delete background images
CREATE POLICY "Admins can delete background images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'backgrounds' 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);