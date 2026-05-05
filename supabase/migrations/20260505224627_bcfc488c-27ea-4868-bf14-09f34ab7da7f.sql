-- Banner settings
DROP POLICY IF EXISTS "Admins can update banner settings" ON public.banner_settings;
CREATE POLICY "Admins can update banner settings"
ON public.banner_settings
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Hero settings
DROP POLICY IF EXISTS "Admins can update hero settings" ON public.hero_settings;
CREATE POLICY "Admins can update hero settings"
ON public.hero_settings
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Logo settings
DROP POLICY IF EXISTS "Admins can update logo settings" ON public.logo_settings;
CREATE POLICY "Admins can update logo settings"
ON public.logo_settings
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));