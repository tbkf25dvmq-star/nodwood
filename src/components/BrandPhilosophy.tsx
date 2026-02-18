import { useSectionFade } from "@/hooks/useSectionFade";

const BrandPhilosophy = () => {
  const sectionRef = useSectionFade();

  return (
    <section ref={sectionRef} className="section-fade py-16 md:py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Subtle decorative accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-accent/30" />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          {/* Opening quote mark */}
          <span className="block font-display text-7xl md:text-8xl text-accent/15 leading-none select-none">
            "
          </span>

          <div className="space-y-6 -mt-6">
            <p className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-snug italic">
              NØD significa necessità.
            </p>
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
              Una parola nordica, asciutta, autentica. Come il nostro modo di lavorare.
            </p>
          </div>

          <div className="w-12 h-px bg-accent mx-auto" />

          <div className="space-y-6 font-body text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>
              Crediamo che l'arredo non debba essere superfluo, ma{" "}
              <span className="text-foreground font-medium">necessario</span>.
              <br />
              Solido, onesto, destinato a durare.
            </p>
            <p>
              Lavoriamo il castagno nel rispetto della sua natura: nodi, venature, 
              imperfezioni diventano identità. Un design industriale, artigianale, 
              contemporaneo — dove metallo e legno dialogano senza maschere.
            </p>
          </div>

          <div className="w-12 h-px bg-accent mx-auto" />

          <div className="space-y-4">
            <p className="font-display text-xl md:text-2xl lg:text-3xl font-light text-foreground italic leading-snug">
              NØD è l'essenziale che prende forma.
            </p>
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
              È materia che vive, segnata dal tempo e pronta a restare.
            </p>
          </div>

          {/* Closing quote mark */}
          <span className="block font-display text-7xl md:text-8xl text-accent/15 leading-none select-none rotate-180">
            "
          </span>
        </div>
      </div>
    </section>
  );
};

export default BrandPhilosophy;
