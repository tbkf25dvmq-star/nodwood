import logoNod from "@/assets/logo-nod.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <img 
            src={logoNod} 
            alt="NOD Wood & Art" 
            className="h-8 w-auto"
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
