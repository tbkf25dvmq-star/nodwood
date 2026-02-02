import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LogoSettings {
  id: string;
  image_url: string | null;
  scale: number;
  position_x: string;
}

export const useLogoSettings = () => {
  const [settings, setSettings] = useState<LogoSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("logo_settings")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching logo settings:", error);
    }
    
    setSettings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (updates: Partial<LogoSettings>) => {
    if (!settings?.id) {
      // Create new settings row
      const { data, error } = await supabase
        .from("logo_settings")
        .insert(updates)
        .select()
        .single();
      
      if (error) throw error;
      setSettings(data);
      return data;
    }

    const { data, error } = await supabase
      .from("logo_settings")
      .update(updates)
      .eq("id", settings.id)
      .select()
      .single();

    if (error) throw error;
    setSettings(data);
    return data;
  };

  return { settings, loading, updateSettings, refetch: fetchSettings };
};
