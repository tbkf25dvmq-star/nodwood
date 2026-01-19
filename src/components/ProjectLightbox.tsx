import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectPhoto } from "@/hooks/useProjects";

interface ProjectLightboxProps {
  photos: ProjectPhoto[];
  initialIndex: number;
  projectTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectLightbox = ({ 
  photos, 
  initialIndex, 
  projectTitle, 
  isOpen, 
  onClose 
}: ProjectLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const visiblePhotos = photos.filter(p => p.is_visible);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || visiblePhotos.length === 0) return null;

  const currentPhoto = visiblePhotos[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? visiblePhotos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === visiblePhotos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors"
        aria-label="Chiudi"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation arrows */}
      {visiblePhotos.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 z-10 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Foto precedente"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 z-10 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Foto successiva"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </>
      )}

      {/* Image container */}
      <div 
        className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentPhoto.image_url}
          alt={currentPhoto.caption || projectTitle}
          className="max-w-full max-h-[75vh] object-contain"
        />
        
        {/* Caption and counter */}
        <div className="mt-4 text-center">
          <h3 className="font-display text-xl text-white">{projectTitle}</h3>
          {currentPhoto.caption && (
            <p className="font-body text-sm text-white/70 mt-1">{currentPhoto.caption}</p>
          )}
          {visiblePhotos.length > 1 && (
            <p className="font-body text-xs text-white/50 mt-2">
              {currentIndex + 1} / {visiblePhotos.length}
            </p>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      {visiblePhotos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto pb-2">
          {visiblePhotos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
              className={`w-16 h-16 flex-shrink-0 overflow-hidden rounded-sm transition-opacity ${
                index === currentIndex ? "opacity-100 ring-2 ring-white" : "opacity-50 hover:opacity-75"
              }`}
            >
              <img
                src={photo.image_url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectLightbox;
