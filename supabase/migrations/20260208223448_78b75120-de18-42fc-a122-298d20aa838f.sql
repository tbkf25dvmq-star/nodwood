-- Fix backgrounds bucket storage policies to use has_role() for consistency
-- Drop existing policies that use direct user_roles query
DROP POLICY IF EXISTS "Admins can upload background images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update background images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete background images" ON storage.objects;

-- Recreate with has_role() SECURITY DEFINER function for consistency
CREATE POLICY "Admins can upload background images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'backgrounds' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update background images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'backgrounds' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete background images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'backgrounds' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);