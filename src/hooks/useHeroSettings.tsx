import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HeroSettings {
  id: string;
  scale: number;
  rotation: number;
  position_x: string;
  position_y: number;
}

export const useHeroSettings = () => {
  return useQuery({
    queryKey: ["hero-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_settings")
        .select("*")
        .maybeSingle();
      
      if (error) throw error;
      return data as HeroSettings | null;
    },
  });
};

export const useUpdateHeroSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...settings }: { id: string } & Partial<Omit<HeroSettings, "id">>) => {
      const { data, error } = await supabase
        .from("hero_settings")
        .update(settings)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-settings"] });
    },
  });
};
