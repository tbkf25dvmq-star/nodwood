import { useState, useEffect } from "react";
import { useLogoSettings } from "@/hooks/useLogoSettings";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import ImageUploader from "./ImageUploader";
import { useToast } from "@/hooks/use-toast";

export const LogoSettingsEditor = () => {
  const { settings, isLoading, updateSettings } = useLogoSettings();
  const { toast } = useToast();

  const [scale, setScale] = useState(1.5);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setScale(settings.scale);
      setImageUrl(settings.image_url);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        scale,
        image_url: imageUrl,
      });
      toast({
        title: "Salvato",
        description: "Le impostazioni del logo sono state aggiornate",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile salvare le impostazioni",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Caricamento...</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold">Impostazioni Logo</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <ImageUploader
            currentImageUrl={imageUrl}
            defaultImage=""
            onImageChange={setImageUrl}
            label="Immagine Logo"
            bucketPath="logo"
          />
          <p className="text-xs text-muted-foreground">
            Consigliato: PNG con sfondo trasparente
          </p>
        </div>

        <div className="space-y-2">
          <Label>Dimensione: {scale.toFixed(2)}x</Label>
          <Slider
            value={[scale]}
            onValueChange={([value]) => setScale(value)}
            min={0.5}
            max={3}
            step={0.1}
          />
        </div>

        {/* Preview */}
        <div className="p-4 bg-muted rounded-lg">
          <Label className="text-xs text-muted-foreground mb-2 block">
            Anteprima (dimensione: {scale.toFixed(1)}x)
          </Label>
          <div className="flex items-center justify-center min-h-[100px]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Logo preview"
                style={{
                  height: `${scale * 40}px`,
                  width: "auto",
                }}
              />
            ) : (
              <span className="text-muted-foreground">Nessun logo caricato</span>
            )}
          </div>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={updateSettings.isPending}
        className="w-full"
      >
        {updateSettings.isPending ? "Salvataggio..." : "Salva Modifiche"}
      </Button>
    </div>
  );
};
