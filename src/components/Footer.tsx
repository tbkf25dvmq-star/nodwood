import { useLogoSettings } from "@/hooks/useLogoSettings";
import logoNod from "@/assets/logo-nod.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings: logoSettings } = useLogoSettings();

  return (
    <footer className="py-10 bg-secondary/40 border-t border-accent/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-5">
          <div className="w-8 h-px bg-accent/50" />
          <img 
            src={logoSettings?.image_url || logoNod} 
            alt="NOD Wood & Art" 
            className="h-8 w-auto opacity-80"
            style={{ 
              transform: `scale(${logoSettings?.scale || 1})`,
              transformOrigin: "center center"
            }}
          />
          <p className="font-body text-xs text-muted-foreground tracking-[0.15em]">
            © {currentYear} NOD Wood & Art · Tutti i diritti riservati
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
