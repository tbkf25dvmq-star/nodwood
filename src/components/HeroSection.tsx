import { ChevronDown } from "lucide-react";
import heroCarpetTexture from "@/assets/hero-carpet-texture.jpeg";
import { useHeroSettings } from "@/hooks/useHeroSettings";

const HeroSection = () => {
  const { data: settings } = useHeroSettings();
  
  // Default values fallback
  const scale = settings?.scale ? Number(settings.scale) : 1.15;
  const rotation = settings?.rotation ?? -10;
  const positionY = settings?.position_y ?? 30;

  const scrollToProjects = () => {
    const element = document.getElementById("progetti");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Carpet texture background */}
      <div 
        className="absolute -inset-40 bg-cover"
        style={{
          backgroundImage: `url(${heroCarpetTexture})`,
          backgroundPosition: `left ${positionY}%`,
          transform: `rotate(${rotation}deg) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      />
      
      {/* Gradient overlay to blend with background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />

      <div className="relative container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <p 
            className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground opacity-0 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Artigianato & Passione
          </p>
          
          <h1 
            className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-tight opacity-0 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            Quando il legno
            <span className="block italic text-accent">incontra l'arte</span>
          </h1>
          
          <p 
            className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            Creazioni uniche realizzate a mano, dove ogni venatura racconta una storia
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToProjects}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-accent transition-colors opacity-0 animate-fade-in cursor-pointer"
        style={{ animationDelay: "1s" }}
        aria-label="Scorri verso i progetti"
      >
        <ChevronDown size={32} className="animate-bounce" />
      </button>
    </section>
  );
};

export default HeroSection;
