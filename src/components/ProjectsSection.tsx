import { useState } from "react";
import { useProjects, Project } from "@/hooks/useProjects";
import ProjectGallery from "./ProjectGallery";

// Fallback static projects (used when database is empty)
import libreriaCastagno from "@/assets/projects/libreria-castagno.png";
import mobileTvIndustrial from "@/assets/projects/mobile-tv-industrial.png";
import consolleIndustrial from "@/assets/projects/consolle-industrial-complete.png";
import lampadaSospensione from "@/assets/projects/lampada-sospensione-industrial.png";

const fallbackProjects = [
  {
    id: "1",
    title: "Libreria in Castagno Antico",
    description: "Libreria realizzata interamente in castagno antico, lavorata a mano senza l'uso di viti",
    image: libreriaCastagno,
  },
  {
    id: "2",
    title: "Mobile TV Industrial",
    description: "Mobile TV in stile industrial con gambe in ferro naturale non verniciato e contenitori in stoffa nera a contrasto",
    image: mobileTvIndustrial,
  },
  {
    id: "3",
    title: "Consolle Industrial",
    description: "Tavolo da lavoro e consolle d'ingresso in castagno antico lavorato a mano, con gambe in ferro pieno grezzo e saldature a vista",
    image: consolleIndustrial,
  },
  {
    id: "4",
    title: "Sospensione a 3 Luci Industrial Wood",
    description: "Linee geometriche e carattere grezzo. Realizzato in legno massello lavorato a mano con tre punti luce regolabili",
    image: lampadaSospensione,
  },
];

const ProjectsSection = () => {
  const { projects, loading } = useProjects();
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Use database projects if available, otherwise use fallback
  const hasDbProjects = projects.length > 0;
  const displayProjects = hasDbProjects ? projects : fallbackProjects;

  const openLightbox = (project: Project, photoIndex: number = 0) => {
    if (project.photos && project.photos.length > 0) {
      setLightboxProject(project);
      setLightboxIndex(photoIndex);
    }
  };

  return (
    <section id="progetti" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-24">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Portfolio
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            I Nostri Progetti
          </h2>
          <div className="w-24 h-px bg-accent mx-auto mt-8" />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-sm" />
            ))}
          </div>
        )}

        {/* Projects grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayProjects.map((project, index) => {
              // Handle both database projects and fallback projects
              const isDbProject = 'photos' in project;
              const coverImage = isDbProject 
                ? (project as Project).cover_photo?.image_url 
                : (project as typeof fallbackProjects[0]).image;
              const hasMultiplePhotos = isDbProject && (project as Project).photos && (project as Project).photos!.length > 1;

              return (
                <div 
                  key={project.id}
                  className={`group relative overflow-hidden bg-card rounded-sm opacity-0 animate-fade-in ${
                    isDbProject && (project as Project).photos?.length ? 'cursor-pointer' : ''
                  }`}
                  style={{ animationDelay: `${0.1 * index}s` }}
                  onClick={() => isDbProject && openLightbox(project as Project)}
                >
                  {/* Image container */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-display text-2xl md:text-3xl text-primary-foreground mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {project.title}
                    </h3>
                    <p className="font-body text-sm text-primary-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      {project.description}
                    </p>
                    {hasMultiplePhotos && (
                      <p className="font-body text-xs text-primary-foreground/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                        Clicca per vedere tutte le foto ({(project as Project).photos?.filter(p => p.is_visible).length})
                      </p>
                    )}
                  </div>
                  
                  {/* Always visible title */}
                  <div className="p-4 bg-card border-t border-border group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="font-display text-xl text-card-foreground">{project.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info note for static projects */}
        {!hasDbProjects && !loading && (
          <p className="text-center mt-16 text-muted-foreground font-body text-sm italic">
            Queste sono immagini di esempio. Accedi come admin per gestire i progetti.
          </p>
        )}
      </div>

      {/* Gallery */}
      {lightboxProject && lightboxProject.photos && (
        <ProjectGallery
          photos={lightboxProject.photos}
          projectTitle={lightboxProject.title}
          projectDescription={lightboxProject.description}
          isOpen={!!lightboxProject}
          onClose={() => setLightboxProject(null)}
        />
      )}
    </section>
  );
};

export default ProjectsSection;
