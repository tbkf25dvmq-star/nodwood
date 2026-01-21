import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Loader2, X } from "lucide-react";

interface ImageUploaderProps {
  currentImageUrl: string | null;
  defaultImage: string;
  onImageChange: (url: string) => void;
  label: string;
  bucketPath: string;
}

const ImageUploader = ({ 
  currentImageUrl, 
  defaultImage, 
  onImageChange, 
  label,
  bucketPath 
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayImage = currentImageUrl || defaultImage;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Per favore seleziona un'immagine");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'immagine deve essere inferiore a 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${bucketPath}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('backgrounds')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(fileName);

      onImageChange(publicUrl);
      toast.success("Immagine caricata con successo!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Errore nel caricamento dell'immagine");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReset = () => {
    onImageChange('');
    toast.success("Immagine ripristinata al default");
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* Image Preview */}
      <div className="relative w-full h-24 overflow-hidden rounded-lg border bg-muted">
        <img 
          src={displayImage} 
          alt="Anteprima sfondo"
          className="w-full h-full object-cover"
        />
        {currentImageUrl && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleReset}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {isUploading ? "Caricamento..." : "Carica nuova immagine"}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Formati supportati: JPG, PNG, WebP. Max 5MB.
      </p>
    </div>
  );
};

export default ImageUploader;
