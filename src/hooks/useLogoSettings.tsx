import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LogoSettings {
  id: string;
  image_url: string | null;
  scale: number;
}

export const useLogoSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["logo-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("logo_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data as LogoSettings;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<LogoSettings>) => {
      if (!settings?.id) throw new Error("No settings found");

      const { error } = await supabase
        .from("logo_settings")
        .update(newSettings)
        .eq("id", settings.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logo-settings"] });
    },
  });

  return {
    settings,
    isLoading,
    updateSettings,
  };
};
