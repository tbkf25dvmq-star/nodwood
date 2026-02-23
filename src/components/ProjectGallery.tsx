import { useEffect, useRef, useState, useCallback } from "react";
import { X, ChevronUp, ZoomIn, ZoomOut } from "lucide-react";
import { ProjectPhoto } from "@/hooks/useProjects";
import OptimizedImage from "./OptimizedImage";

interface ProjectGalleryProps {
  photos: ProjectPhoto[];
  projectTitle: string;
  projectDescription: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectGallery = ({
  photos,
  projectTitle,
  projectDescription,
  isOpen,
  onClose,
}: ProjectGalleryProps) => {
  const allVisible = photos.filter((p) => p.is_visible);
  const visiblePhotos = allVisible.filter((p) => !p.caption?.startsWith("[variante]"));
  const variantPhotos = allVisible.filter((p) => p.caption?.startsWith("[variante]"));
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Prevent body scroll when gallery is open
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        if (zoomedIndex !== null) {
          setZoomedIndex(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Track scroll position to determine active image & show scroll-to-top
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isOpen) return;

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 300);

      // Determine which image is most visible
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      imageRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const imageCenter = rect.top + rect.height / 2;
        const distance = Math.abs(imageCenter - containerCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Reset scroll when opening
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      setActiveIndex(0);
    }
  }, [isOpen]);

  const scrollToImage = (index: number) => {
    imageRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleZoom = useCallback((index: number) => {
    setZoomedIndex((prev) => (prev === index ? null : index));
  }, []);

  if (!isOpen || visiblePhotos.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[60] p-2 bg-background/80 backdrop-blur-sm rounded-full border border-border hover:bg-muted transition-colors"
        aria-label="Chiudi"
      >
        <X className="w-5 h-5 text-foreground" />
      </button>

      <div className="h-full flex flex-col md:flex-row overflow-hidden">
        {/* Left: Scrollable images */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto scroll-smooth overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="max-w-4xl mx-auto px-4 md:px-8 pt-20 md:pt-12 pb-8 md:pb-12 space-y-4 md:space-y-6">
            {visiblePhotos.map((photo, index) => (
              <div
                key={photo.id}
                ref={(el) => {
                  imageRefs.current[index] = el;
                }}
                className="w-full flex flex-col items-center"
              >
                <div
                  className="relative group cursor-pointer max-h-[85vh] flex items-center justify-center"
                  onClick={() => toggleZoom(index)}
                >
                  <OptimizedImage
                    src={photo.image_url}
                    alt={photo.caption || `${projectTitle} - Foto ${index + 1}`}
                    priority={index === 0}
                    className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-sm"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-foreground/5 rounded-sm">
                    <ZoomIn className="w-8 h-8 text-foreground/60" />
                  </div>
                </div>
                {photo.caption && (
                  <p className="font-body text-xs text-muted-foreground mt-2 px-1 self-start">
                    {photo.caption}
                  </p>
                )}
              </div>
            ))}

            {/* Varianti section */}
            {variantPhotos.length > 0 && (
              <div className="mt-16 md:mt-24 pt-12 border-t border-border/30">
                <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
                  Varianti
                </p>
                {variantPhotos.map((variant) => {
                  const variantTitle = variant.caption?.replace("[variante]", "").trim() || "";
                  return (
                    <div key={variant.id} className="space-y-6">
                      <h3 className="font-display text-2xl md:text-3xl font-light text-foreground">
                        {variantTitle}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-lg">
                        Questo progetto può essere realizzato in dimensioni e configurazioni diverse, 
                        mantenendo lo stesso approccio costruttivo e la stessa qualità materica.
                      </p>
                      <div className="mt-8">
                        <OptimizedImage
                          src={variant.image_url}
                          alt={variantTitle}
                          className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom spacer for scroll */}
            <div className="h-16 md:h-24" />
          </div>
        </div>

        {/* Right: Sticky details panel — hidden on mobile, shown as sidebar on desktop */}
        <div className="hidden md:flex w-80 lg:w-96 border-l border-border bg-card flex-shrink-0">
          <div className="sticky top-0 p-8 lg:p-10 h-screen flex flex-col justify-between">
            <div>
              <h2 className="font-display text-4xl lg:text-5xl font-light text-foreground leading-tight">
                {projectTitle}
              </h2>

              <div className="w-12 h-px bg-accent mt-6 mb-6" />

              {projectDescription && (
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {projectDescription}
                </p>
              )}

              <div className="mt-8">
                <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  {activeIndex + 1} / {visiblePhotos.length} foto
                </p>
              </div>

              {visiblePhotos.length > 1 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {visiblePhotos.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => scrollToImage(index)}
                      className={`w-12 h-12 rounded-sm overflow-hidden border-2 transition-all duration-300 ${
                        index === activeIndex
                          ? "border-accent opacity-100"
                          : "border-transparent opacity-50 hover:opacity-80"
                      }`}
                      aria-label={`Vai alla foto ${index + 1}`}
                    >
                      <img src={photo.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={onClose}
                className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Torna ai progetti
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: Floating title bar at top */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-[55] bg-background/90 backdrop-blur-sm border-b border-border px-4 py-3">
          <h2 className="font-display text-xl font-light text-foreground pr-10">{projectTitle}</h2>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            {activeIndex + 1} / {visiblePhotos.length} foto
          </p>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-[60] p-3 bg-card/90 backdrop-blur-sm border border-border rounded-full shadow-lg hover:bg-muted transition-all duration-300"
          aria-label="Torna in cima"
        >
          <ChevronUp className="w-5 h-5 text-foreground" />
        </button>
      )}

      {/* Zoom overlay */}
      {zoomedIndex !== null && visiblePhotos[zoomedIndex] && (
        <div
          className="fixed inset-0 z-[70] bg-foreground/95 flex items-center justify-center cursor-zoom-out"
          onClick={() => setZoomedIndex(null)}
        >
          <button
            onClick={() => setZoomedIndex(null)}
            className="absolute top-4 right-4 z-[80] p-2 text-background/80 hover:text-background transition-colors"
            aria-label="Chiudi zoom"
          >
            <ZoomOut className="w-6 h-6" />
          </button>
          <img
            src={visiblePhotos[zoomedIndex].image_url}
            alt={visiblePhotos[zoomedIndex].caption || projectTitle}
            className="max-w-[95vw] max-h-[95vh] object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ProjectGallery;
