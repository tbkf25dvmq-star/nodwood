import { Mail, Phone, MapPin, Instagram } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contatti" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Contatti
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
              Restiamo in Contatto
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mt-8" />
            <p className="font-body text-muted-foreground mt-8 max-w-xl mx-auto leading-relaxed">
              Hai un progetto in mente o vuoi semplicemente saperne di più sulle mie creazioni? 
              Scrivimi, sarò felice di risponderti.
            </p>
          </div>

          {/* Contact info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <a
              href="mailto:danieles.85@icloud.com"
              className="group flex items-center gap-4 p-6 bg-card rounded-sm border border-border hover:border-accent/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <Mail size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-body text-sm text-muted-foreground">Email</p>
                <p className="font-body text-foreground">danieles.85@icloud.com</p>
              </div>
            </a>

            <a
              href="tel:+393518478405"
              className="group flex items-center gap-4 p-6 bg-card rounded-sm border border-border hover:border-accent/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <Phone size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-body text-sm text-muted-foreground">Telefono</p>
                <p className="font-body text-foreground">+39 351 847 8405</p>
              </div>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-6 bg-card rounded-sm border border-border hover:border-accent/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <Instagram size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-body text-sm text-muted-foreground">Instagram</p>
                <p className="font-body text-foreground">@tuoprofilo</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-6 bg-card rounded-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <MapPin size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-body text-sm text-muted-foreground">Località</p>
                <p className="font-body text-foreground">Italia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
