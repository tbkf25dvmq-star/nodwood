const AboutSection = () => {
  return (
    <section id="chi-sono" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <div className="relative opacity-0 animate-fade-in order-2 lg:order-1">
            <div className="aspect-[4/5] overflow-hidden rounded-sm">
              <img
                src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&h=750&fit=crop&q=80"
                alt="Lavorazione del legno"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-accent/30 rounded-sm -z-10" />
          </div>

          {/* Text side */}
          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
                La Mia Storia
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight">
                Chi Sono
              </h2>
              <div className="w-16 h-px bg-accent mt-6" />
            </div>

            <div className="space-y-6 font-body text-muted-foreground leading-relaxed">
              <p>
                La passione per il legno mi accompagna da sempre. Quello che è iniziato 
                come un hobby si è trasformato in una vera e propria missione: dare nuova 
                vita al legno attraverso creazioni uniche e funzionali.
              </p>
              <p>
                Ogni pezzo che realizzo racconta una storia. Dalla scelta del legno grezzo 
                alla rifinitura finale, dedico cura e attenzione a ogni dettaglio, 
                rispettando le venature naturali e valorizzando l'unicità di ogni essenza.
              </p>
              <p>
                Il mio laboratorio è il luogo dove tradizione e creatività si incontrano, 
                dove nascono oggetti pensati per durare nel tempo e portare un tocco di 
                calore naturale nelle case.
              </p>
            </div>

            {/* Signature or name */}
            <div className="pt-4">
              <p className="font-display text-2xl italic text-foreground">
                — Dario Scio
              </p>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Artigiano del legno
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
