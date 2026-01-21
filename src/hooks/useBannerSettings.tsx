import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BannerSettings {
  id: string;
  scale: number;
  rotation: number;
  position_y: number;
  created_at: string;
  updated_at: string;
}

export const useBannerSettings = () => {
  return useQuery({
    queryKey: ["banner-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banner_settings")
        .select("*")
        .maybeSingle();
      
      if (error) throw error;
      return data as BannerSettings | null;
    },
  });
};

export const useUpdateBannerSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...settings }: { id: string } & Partial<Omit<BannerSettings, "id">>) => {
      const { data, error } = await supabase
        .from("banner_settings")
        .update(settings)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banner-settings"] });
    },
  });
};
