-- Update public SELECT access to allow cover photos even when not visible
-- This enables “preview/cover” images to be shown while keeping them hidden from the gallery.

DROP POLICY IF EXISTS "Anyone can view visible photos" ON public.project_photos;

CREATE POLICY "Anyone can view visible photos"
ON public.project_photos
FOR SELECT
USING (
  (
    (is_visible = true)
    OR (is_cover = true)
  )
  AND EXISTS (
    SELECT 1
    FROM public.projects
    WHERE projects.id = project_photos.project_id
      AND projects.is_visible = true
  )
);