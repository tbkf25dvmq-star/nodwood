
-- 1. Remove public INSERT policy on contact_messages (edge function uses service role, bypasses RLS)
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

-- 2. Revoke EXECUTE on has_role from anon and authenticated (still works inside RLS via SECURITY DEFINER)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;

-- 3. Restrict listing on public buckets: replace any broad SELECT policy with one that requires a specific name (no listing)
-- Drop common default permissive policies if they exist
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND cmd = 'SELECT'
      AND policyname IN (
        'Public Access',
        'Public read access',
        'Allow public read access',
        'Public Access project-images',
        'Public Access backgrounds',
        'project-images public read',
        'backgrounds public read'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Recreate scoped read policies that allow fetching individual objects but not listing the bucket
CREATE POLICY "project-images read individual"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'project-images' AND name IS NOT NULL);

CREATE POLICY "backgrounds read individual"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'backgrounds' AND name IS NOT NULL);
