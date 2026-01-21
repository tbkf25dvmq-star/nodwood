import { useState, useEffect } from "react";
import { useHeroSettings, useUpdateHeroSettings } from "@/hooks/useHeroSettings";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, RotateCcw } from "lucide-react";

const HeroSettingsEditor = () => {
  const { data: settings, isLoading } = useHeroSettings();
  const updateSettings = useUpdateHeroSettings();
  
  const [scale, setScale] = useState(1.15);
  const [rotation, setRotation] = useState(-10);
  const [positionY, setPositionY] = useState(30);

  useEffect(() => {
    if (settings) {
      setScale(Number(settings.scale));
      setRotation(settings.rotation);
      setPositionY(settings.position_y);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        scale,
        rotation,
        position_y: positionY,
      });
      toast.success("Impostazioni sfondo salvate!");
    } catch (error) {
      toast.error("Errore nel salvare le impostazioni");
    }
  };

  const handleReset = () => {
    setScale(1.15);
    setRotation(-10);
    setPositionY(30);
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
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Impostazioni Sfondo Hero</span>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview Box */}
        <div className="relative w-full h-32 overflow-hidden rounded-lg border bg-muted">
          <div 
            className="absolute -inset-8 bg-cover"
            style={{
              backgroundImage: `url(/hero-carpet-preview.jpg)`,
              backgroundPosition: `left ${positionY}%`,
              transform: `rotate(${rotation}deg) scale(${scale})`,
              transformOrigin: 'center center',
              backgroundColor: 'hsl(var(--muted))',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Anteprima</p>
          </div>
        </div>

        {/* Zoom Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Zoom</Label>
            <span className="text-sm text-muted-foreground">{scale.toFixed(2)}x</span>
          </div>
          <Slider
            value={[scale]}
            onValueChange={(value) => setScale(value[0])}
            min={0.8}
            max={2}
            step={0.05}
          />
        </div>

        {/* Rotation Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Rotazione</Label>
            <span className="text-sm text-muted-foreground">{rotation}°</span>
          </div>
          <Slider
            value={[rotation]}
            onValueChange={(value) => setRotation(value[0])}
            min={-20}
            max={20}
            step={1}
          />
        </div>

        {/* Position Y Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Posizione Verticale</Label>
            <span className="text-sm text-muted-foreground">{positionY}%</span>
          </div>
          <Slider
            value={[positionY]}
            onValueChange={(value) => setPositionY(value[0])}
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
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Salva Impostazioni
        </Button>
      </CardContent>
    </Card>
  );
};

export default HeroSettingsEditor;
