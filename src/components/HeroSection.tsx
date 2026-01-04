import { ChevronDown } from "lucide-react";

const HeroSection = () => {
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
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-wood-dark/20 via-background to-background" />
      
      {/* Pattern overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

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
