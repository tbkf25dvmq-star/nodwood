
-- Ensure RLS is enabled on logo_settings
ALTER TABLE public.logo_settings ENABLE ROW LEVEL SECURITY;

-- Add admin-only INSERT policy
CREATE POLICY "Admins can insert logo settings"
ON public.logo_settings
FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role = 'admin'::app_role
));

-- Ensure only one settings row can ever exist (singleton pattern)
CREATE UNIQUE INDEX IF NOT EXISTS logo_settings_singleton ON public.logo_settings ((true));
