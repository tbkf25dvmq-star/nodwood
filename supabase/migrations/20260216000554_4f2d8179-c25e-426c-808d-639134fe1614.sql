
-- Add explicit INSERT and DELETE policies for hero_settings (defense-in-depth)
CREATE POLICY "Admins can insert hero settings"
ON public.hero_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete hero settings"
ON public.hero_settings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add explicit INSERT and DELETE policies for banner_settings (defense-in-depth)
CREATE POLICY "Admins can insert banner settings"
ON public.banner_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete banner settings"
ON public.banner_settings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
