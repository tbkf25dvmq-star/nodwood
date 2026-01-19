import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectPhoto {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  is_cover: boolean;
  display_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  photos?: ProjectPhoto[];
  cover_photo?: ProjectPhoto;
}

export const useProjects = (includeHidden: boolean = false) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (projectsError) throw projectsError;

      // Fetch photos for each project
      const { data: photosData, error: photosError } = await supabase
        .from("project_photos")
        .select("*")
        .order("display_order", { ascending: true });

      if (photosError) throw photosError;

      // Combine projects with their photos
      const projectsWithPhotos = (projectsData || []).map((project) => {
        const projectPhotos = (photosData || []).filter(
          (photo) => photo.project_id === project.id
        );
        const coverPhoto = projectPhotos.find((photo) => photo.is_cover) || projectPhotos[0];
        
        return {
          ...project,
          photos: projectPhotos,
          cover_photo: coverPhoto,
        };
      });

      // Filter if needed
      const filteredProjects = includeHidden 
        ? projectsWithPhotos 
        : projectsWithPhotos.filter(p => p.is_visible);

      setProjects(filteredProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel caricamento progetti");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [includeHidden]);

  return { projects, loading, error, refetch: fetchProjects };
};
