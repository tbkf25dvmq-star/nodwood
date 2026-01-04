import ProjectCard from "./ProjectCard";

// Placeholder projects - these will be replaced with real photos
const placeholderProjects = [
  {
    id: 1,
    title: "Tagliere in Noce",
    description: "Tagliere artigianale realizzato in legno di noce massello",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=750&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Mensola Rustica",
    description: "Mensola da parete con bordo naturale in legno di ulivo",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=750&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Portacandele",
    description: "Set di portacandele in legno di faggio lavorato a mano",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=750&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Vassoio Decorativo",
    description: "Vassoio con intarsi geometrici in legni pregiati",
    image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&h=750&fit=crop&q=80",
  },
  {
    id: 5,
    title: "Lampada da Tavolo",
    description: "Lampada artigianale con base in legno di ciliegio",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=750&fit=crop&q=80",
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
          {placeholderProjects.map((project, index) => (
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
