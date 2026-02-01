import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logoNod from "@/assets/logo-nod.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <button
          onClick={() => scrollToSection("hero")}
          className="hover:opacity-80 transition-opacity"
        >
          <img 
            src={logoNod} 
            alt="NOD Wood & Art" 
            className="h-16 md:h-20 w-auto mix-blend-multiply"
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { label: "Progetti", id: "progetti" },
            { label: "Chi Sono", id: "chi-sono" },
            { label: "Contatti", id: "contatti" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="font-body text-sm font-medium tracking-widest uppercase text-foreground/80 hover:text-accent transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-foreground p-2"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-sm border-b border-border">
          <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {[
              { label: "Progetti", id: "progetti" },
              { label: "Chi Sono", id: "chi-sono" },
              { label: "Contatti", id: "contatti" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="font-body text-sm font-medium tracking-widest uppercase text-foreground/80 hover:text-accent transition-colors text-left py-2"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
