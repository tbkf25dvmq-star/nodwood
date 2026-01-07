import ProjectCard from "./ProjectCard";
import libreriaCastagno from "@/assets/projects/libreria-castagno.png";
import mobileTvIndustrial from "@/assets/projects/mobile-tv-industrial.png";
import consolleIndustrial from "@/assets/projects/consolle-industrial-complete.png";
import lampadaSospensione from "@/assets/projects/lampada-sospensione-industrial.png";

// Projects - mix of real photos and placeholders
const projects = [
  {
    id: 1,
    title: "Libreria in Castagno Antico",
    description: "Libreria realizzata interamente in castagno antico, lavorata a mano senza l'uso di viti",
    image: libreriaCastagno,
  },
  {
    id: 2,
    title: "Mobile TV Industrial",
    description: "Mobile TV in stile industrial con gambe in ferro naturale non verniciato e contenitori in stoffa nera a contrasto",
    image: mobileTvIndustrial,
  },
  {
    id: 3,
    title: "Consolle Industrial",
    description: "Tavolo da lavoro e consolle d'ingresso in castagno antico lavorato a mano, con gambe in ferro pieno grezzo e saldature a vista",
    image: consolleIndustrial,
  },
  {
    id: 4,
    title: "Vassoio Decorativo",
    description: "Vassoio con intarsi geometrici in legni pregiati",
    image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&h=750&fit=crop&q=80",
  },
  {
    id: 5,
    title: "Sospensione a 3 Luci Industrial Wood",
    description: "Linee geometriche e carattere grezzo. Realizzato in legno massello lavorato a mano con tre punti luce regolabili, perfetto per cucina moderna o sala da pranzo rustico-contemporanea",
    image: lampadaSospensione,
  },
  {
    id: 6,
    title: "Scatola Portagioie",
    description: "Scatola intarsiata con coperchio in legno di acero",
    image: "https://images.unsplash.com/photo-1486946255434-2466348c2166?w=600&h=750&fit=crop&q=80",
  },
];

const ProjectsSection = () => {
  return (
    <section id="progetti" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-24">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Portfolio
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            I Miei Progetti
          </h2>
          <div className="w-24 h-px bg-accent mx-auto mt-8" />
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
              index={index}
            />
          ))}
        </div>

        {/* Placeholder note */}
        <p className="text-center mt-16 text-muted-foreground font-body text-sm italic">
          Queste sono immagini di esempio. Carica le foto dei tuoi progetti per personalizzare il portfolio.
        </p>
      </div>
    </section>
  );
};

export default ProjectsSection;
