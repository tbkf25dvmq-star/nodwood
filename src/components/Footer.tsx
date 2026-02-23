import { ChevronUp } from "lucide-react";
import { useLogoSettings } from "@/hooks/useLogoSettings";
import logoNod from "@/assets/logo-nod.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings: logoSettings } = useLogoSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="pb-8 bg-secondary/40">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center">

          {/* Back to top — sits directly below contact section, ABOVE divider */}
          <button
            onClick={scrollToTop}
            className="flex flex-col items-center gap-1.5 text-accent/50 hover:text-accent transition-colors duration-300 group cursor-pointer py-6"
            aria-label="Torna in cima"
          >
            <ChevronUp
              size={18}
              className="animate-bounce"
              style={{ animationDuration: "2s", animationTimingFunction: "ease-in-out" }}
            />
            <span className="font-body text-[9px] tracking-[0.4em] uppercase">
              Torna su
            </span>
          </button>

          {/* Divider — below scroll indicator */}
          <div className="w-full h-px bg-accent/20 mb-7" />

          <img
            src={logoSettings?.image_url || logoNod}
            alt="NOD Wood & Art"
            className="footer-logo w-auto opacity-90 mb-4"
            style={{
              height: "110px",
              width: "auto",
              background: "transparent",
              padding: 0,
              boxShadow: "none",
              border: "none",
              display: "block",
            }}
          />
          <p className="font-body text-[10px] text-muted-foreground tracking-[0.15em]">
            © {currentYear} NOD Wood & Art · Tutti i diritti riservati
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


