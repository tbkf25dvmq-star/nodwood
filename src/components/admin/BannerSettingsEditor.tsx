import { useState, useEffect } from "react";
import { useBannerSettings, useUpdateBannerSettings } from "@/hooks/useBannerSettings";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, RotateCcw } from "lucide-react";
import carpetImage from "@/assets/decorative-carpet.png";

const BannerSettingsEditor = () => {
  const { data: settings, isLoading } = useBannerSettings();
  const updateSettings = useUpdateBannerSettings();
  
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [positionY, setPositionY] = useState(50);

  useEffect(() => {
    if (settings) {
      setScale(settings.scale);
      setRotation(settings.rotation);
      setPositionY(settings.position_y);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings?.id) {
      toast.error("Impostazioni non trovate");
      return;
    }
    
    try {
      await updateSettings.mutateAsync({
        id: settings.id,
        scale,
        rotation,
        position_y: positionY,
      });
      toast.success("Impostazioni banner salvate!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Errore nel salvare le impostazioni");
    }
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPositionY(50);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          Impostazioni Banner Decorativo
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview Box */}
        <div className="relative w-full h-32 overflow-hidden rounded-lg border">
          <img 
            src={carpetImage}
            alt="Anteprima banner"
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: 'cover',
              objectPosition: `center ${positionY}%`,
              transform: `rotate(${rotation}deg) scale(${scale})`,
              transformOrigin: 'center center',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <p className="text-sm font-medium text-white drop-shadow-lg">Anteprima Live</p>
          </div>
        </div>

        {/* Scale Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Zoom: {scale.toFixed(2)}x</Label>
          </div>
          <Slider
            value={[scale]}
            onValueChange={([v]) => setScale(v)}
            min={1}
            max={2}
            step={0.05}
          />
        </div>

        {/* Rotation Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Rotazione: {rotation}°</Label>
          </div>
          <Slider
            value={[rotation]}
            onValueChange={([v]) => setRotation(v)}
            min={-15}
            max={15}
            step={1}
          />
        </div>

        {/* Position Y Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Posizione verticale: {positionY}%</Label>
          </div>
          <Slider
            value={[positionY]}
            onValueChange={([v]) => setPositionY(v)}
            min={0}
            max={100}
            step={5}
          />
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={updateSettings.isPending}
        >
          {updateSettings.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvataggio...
            </>
          ) : (
            "Salva Impostazioni"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BannerSettingsEditor;
