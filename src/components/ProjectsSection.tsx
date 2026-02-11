import { useState } from "react";
import { useProjects, Project } from "@/hooks/useProjects";
import ProjectGallery from "./ProjectGallery";

// Fallback static projects
import libreriaCastagno from "@/assets/projects/libreria-castagno.png";
import mobileTvIndustrial from "@/assets/projects/mobile-tv-industrial.png";
import consolleIndustrial from "@/assets/projects/consolle-industrial-complete.png";
import lampadaSospensione from "@/assets/projects/lampada-sospensione-industrial.png";

const fallbackProjects = [
  { id: "1", title: "Libreria in Castagno Antico", description: "Castagno antico, lavorata a mano senza viti", image: libreriaCastagno },
  { id: "2", title: "Mobile TV Industrial", description: "Ferro naturale e contenitori in stoffa nera", image: mobileTvIndustrial },
  { id: "3", title: "Consolle Industrial", description: "Castagno antico con gambe in ferro pieno grezzo", image: consolleIndustrial },
  { id: "4", title: "Sospensione a 3 Luci", description: "Legno massello con tre punti luce regolabili", image: lampadaSospensione },
];

// Editorial layout patterns that cycle for visual variety
const layoutPatterns = [
  // Pattern A: Large left, small right
  [
    { colSpan: "md:col-span-7", aspect: "aspect-[3/4]", size: "hero" },
    { colSpan: "md:col-span-5 md:mt-24", aspect: "aspect-[4/5]", size: "secondary" },
  ],
  // Pattern B: Small left, large right
  [
    { colSpan: "md:col-span-5 md:mt-16", aspect: "aspect-[4/5]", size: "secondary" },
    { colSpan: "md:col-span-7", aspect: "aspect-[3/4]", size: "hero" },
  ],
  // Pattern C: Full width cinematic
  [
    { colSpan: "md:col-span-8 md:col-start-3", aspect: "aspect-[16/9]", size: "cinematic" },
  ],
  // Pattern D: Two equal, offset
  [
    { colSpan: "md:col-span-5 md:col-start-2", aspect: "aspect-[4/5]", size: "secondary" },
    { colSpan: "md:col-span-5 md:mt-32", aspect: "aspect-[3/4]", size: "secondary" },
  ],
];

// IDs of projects that should show the full object (object-contain)
const containIds = new Set([
  "a1b2c3d4-e5f6-7890-abcd-333333333333", // Consolle Industrial
  "2fbee35f-bc8f-4602-8f93-5777de647e8e", // Scaffale Angolare
  "a1b2c3d4-e5f6-7890-abcd-444444444444", // Sospensione a 3 Luci
]);

const ProjectsSection = () => {
  const { projects, loading } = useProjects();
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);

  const hasDbProjects = projects.length > 0;
  const displayProjects = hasDbProjects ? projects : fallbackProjects;

  const openLightbox = (project: Project) => {
    if (project.photos && project.photos.length > 0) {
      setLightboxProject(project);
    }
  };

  // Distribute projects into layout groups
  const layoutGroups: { project: typeof displayProjects[0]; layout: typeof layoutPatterns[0][0] }[][] = [];
  let projectIndex = 0;

  while (projectIndex < displayProjects.length) {
    const patternIndex = layoutGroups.length % layoutPatterns.length;
    const pattern = layoutPatterns[patternIndex];
    const group: { project: typeof displayProjects[0]; layout: typeof layoutPatterns[0][0] }[] = [];

    for (const slot of pattern) {
      if (projectIndex < displayProjects.length) {
        group.push({ project: displayProjects[projectIndex], layout: slot });
        projectIndex++;
      }
    }
    layoutGroups.push(group);
  }

  return (
    <section id="progetti" className="py-32 md:py-48 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section header — minimal, editorial */}
        <div className="mb-24 md:mb-40">
          <p className="font-body text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
            Progetti
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[0.95]">
            Le nostre<br />creazioni
          </h2>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-16">
            {[1, 2].map((i) => (
              <div key={i} className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 md:col-span-7 aspect-[3/4] bg-muted animate-pulse" />
                <div className="col-span-12 md:col-span-5 aspect-[4/5] bg-muted animate-pulse md:mt-24" />
              </div>
            ))}
          </div>
        )}

        {/* Editorial layout */}
        {!loading && (
          <div className="space-y-32 md:space-y-52">
            {layoutGroups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="grid grid-cols-12 gap-4 md:gap-8 items-start"
              >
                {group.map(({ project, layout }, itemIndex) => {
                  const isDbProject = 'photos' in project;
                  const coverImage = isDbProject
                    ? (project as Project).cover_photo?.image_url
                    : (project as typeof fallbackProjects[0]).image;
                  const hasPhotos = isDbProject && (project as Project).photos?.length;
                  const globalIndex = groupIndex * 2 + itemIndex;

                  return (
                    <div
                      key={project.id}
                      className={`col-span-12 ${layout.colSpan} opacity-0 animate-fade-in ${
                        hasPhotos ? 'cursor-pointer' : ''
                      }`}
                      style={{ animationDelay: `${0.15 * globalIndex}s` }}
                      onClick={() => isDbProject && openLightbox(project as Project)}
                    >
                      {/* Image */}
                      <div className={`${layout.aspect} overflow-hidden group ${
                        containIds.has(project.id) ? 'bg-muted' : ''
                      }`}>
                        <img
                          src={coverImage}
                          alt={project.title}
                          className={`w-full h-full transition-transform duration-1000 ease-out group-hover:scale-[1.03] ${
                            containIds.has(project.id) ? 'object-contain' : 'object-cover'
                          }`}
                        />
                      </div>

                      {/* Caption — minimal, underneath */}
                      <div className="mt-5 md:mt-7">
                        <h3 className={`font-display text-foreground leading-tight ${
                          layout.size === 'hero' || layout.size === 'cinematic'
                            ? 'text-2xl md:text-4xl'
                            : 'text-lg md:text-2xl'
                        }`}>
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="font-body text-[13px] text-muted-foreground mt-2 md:mt-3 max-w-lg leading-relaxed">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Fallback note */}
        {!hasDbProjects && !loading && (
          <p className="text-center mt-24 text-muted-foreground font-body text-xs italic">
            Immagini di esempio. Accedi come admin per gestire i progetti.
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
