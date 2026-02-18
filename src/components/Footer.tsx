import { useLogoSettings } from "@/hooks/useLogoSettings";
import logoNod from "@/assets/logo-nod.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings: logoSettings } = useLogoSettings();

  return (
    <footer className="py-8 bg-secondary/60 border-t border-accent/15">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-4">
          <img 
            src={logoSettings?.image_url || logoNod} 
            alt="NOD Wood & Art" 
            className="h-8 w-auto"
            style={{ 
              transform: `scale(${logoSettings?.scale || 1})`,
              transformOrigin: "center center"
            }}
          />
          <p className="font-body text-sm text-muted-foreground">
            © {currentYear} Tutti i diritti riservati
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
