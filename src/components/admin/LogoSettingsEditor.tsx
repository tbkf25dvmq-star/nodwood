import { useState, useEffect } from "react";
import { useLogoSettings } from "@/hooks/useLogoSettings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoNod from "@/assets/logo-nod.webp";

const LogoSettingsEditor = () => {
  const { settings, loading, updateSettings, refetch } = useLogoSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [scale, setScale] = useState<number>(1);
  const [positionX, setPositionX] = useState<number>(0);

  // Sync local state when settings load
  useEffect(() => {
    if (settings) {
      setScale(settings.scale);
      // Parse position_x as number, default to 0 if it's an old string value
      const posNum = parseFloat(settings.position_x);
      setPositionX(isNaN(posNum) ? 0 : posNum);
    }
  }, [settings]);

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Caricamento...</div>;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({ scale, position_x: String(positionX) });
      toast({ title: "Impostazioni logo salvate!" });
    } catch (error) {
      toast({ title: "Errore", description: String(error), variant: "destructive" });
    }
    setSaving(false);
  };

  const handleGenerateTransparent = async () => {
    setGenerating(true);
    try {
      // Convert current logo to base64
      const response = await fetch(logoNod);
      const blob = await response.blob();
      const reader = new FileReader();
      
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const { data, error } = await supabase.functions.invoke("generate-logo", {
        body: { imageBase64: base64 }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({ title: "Logo generato con sfondo trasparente!" });
      refetch();
    } catch (error) {
      console.error("Error generating logo:", error);
      toast({ 
        title: "Errore", 
        description: error instanceof Error ? error.message : "Errore nella generazione",
        variant: "destructive" 
      });
    }
    setGenerating(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("backgrounds")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Errore upload", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("backgrounds")
      .getPublicUrl(fileName);

    try {
      await updateSettings({ image_url: publicUrl });
      toast({ title: "Logo caricato!" });
      refetch();
    } catch (error) {
      toast({ title: "Errore", description: String(error), variant: "destructive" });
    }
    
    setUploading(false);
  };

  const currentLogoUrl = settings?.image_url || logoNod;

  return (
    <div className="space-y-6 p-6 rounded-lg border border-border">
      <h2 className="font-display text-lg">Impostazioni Logo</h2>
      
      {/* Preview */}
      <div className="relative p-4 bg-secondary/50 rounded-lg overflow-hidden">
        <div 
          className="flex"
          style={{ 
            justifyContent: positionX <= 33 ? 'flex-start' : positionX >= 66 ? 'flex-end' : 'center',
            paddingLeft: positionX < 33 ? `${positionX * 3}%` : 0,
            paddingRight: positionX > 66 ? `${(100 - positionX) * 3}%` : 0
          }}
        >
          <img 
            src={currentLogoUrl} 
            alt="Logo preview" 
            className="max-h-20 w-auto"
            style={{ transform: `scale(${scale})` }}
          />
        </div>
      </div>

      {/* Generate transparent version */}
      <div className="space-y-2">
        <Label>Rimuovi sfondo con AI</Label>
        <Button 
          onClick={handleGenerateTransparent} 
          disabled={generating}
          className="w-full"
          variant="outline"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generazione in corso...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Genera versione senza sfondo
            </>
          )}
        </Button>
      </div>

      {/* Upload custom logo */}
      <div className="space-y-2">
        <Label>Oppure carica un logo personalizzato</Label>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
          <Button asChild variant="outline" className="w-full" disabled={uploading}>
            <span>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Caricamento...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Carica logo
                </>
              )}
            </span>
          </Button>
        </label>
      </div>

      {/* Scale */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Dimensione: {(scale * 100).toFixed(0)}%</Label>
        </div>
        <Slider
          value={[scale]}
          onValueChange={([v]) => setScale(v)}
          min={0.5}
          max={6}
          step={0.1}
        />
      </div>

      {/* Position X */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Posizione orizzontale</Label>
          <span className="text-sm text-muted-foreground">
            {positionX <= -10 ? "Estrema sinistra" : positionX <= 33 ? "Sinistra" : positionX >= 66 ? "Destra" : "Centro"}
          </span>
        </div>
        <Slider
          value={[positionX]}
          onValueChange={([v]) => setPositionX(v)}
          min={-30}
          max={100}
          step={1}
        />
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? "Salvataggio..." : "Salva Impostazioni"}
      </Button>
    </div>
  );
};

export default LogoSettingsEditor;
