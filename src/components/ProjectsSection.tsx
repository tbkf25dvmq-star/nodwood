import { useState } from "react";
import { useProjects, Project } from "@/hooks/useProjects";
import ProjectGallery from "./ProjectGallery";
import { useSectionFade } from "@/hooks/useSectionFade";

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

// Custom scale overrides for specific projects
const scaleOverrides: Record<string, number> = {
  "a1b2c3d4-e5f6-7890-abcd-444444444444": 0.9, // Sospensione a 3 Luci: -10%
};

const ProjectsSection = () => {
  const { projects, loading } = useProjects();
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);
  const sectionRef = useSectionFade(0.05);

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
    <section ref={sectionRef} id="progetti" className="section-fade py-20 md:py-32 lg:py-48 bg-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        {/* Section header — minimal, editorial */}
        <div className="mb-16 md:mb-32 lg:mb-40">
          <p className="font-body text-[10px] tracking-[0.5em] uppercase text-muted-foreground mb-4 md:mb-6">
            Progetti
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-[76px] font-light text-foreground leading-[0.9] tracking-[-0.015em]">
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
          <div className="space-y-20 md:space-y-36 lg:space-y-52">
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
                      <div className={`${layout.aspect} overflow-hidden group shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] ${
                        containIds.has(project.id) ? 'bg-[hsl(38,20%,96%)]' : ''
                      }`}>
                         <img
                          src={coverImage}
                          alt={project.title}
                          className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.02] group-hover:brightness-[1.03] ${
                            containIds.has(project.id) ? 'object-contain' : 'object-cover'
                          }`}
                          style={scaleOverrides[project.id] ? { transform: `scale(${scaleOverrides[project.id]})` } : undefined}
                        />
                      </div>

                      {/* Caption — minimal, underneath */}
                      <div className="mt-4 md:mt-6">
                        <h3 className={`font-display text-foreground leading-tight tracking-[-0.01em] ${
                          layout.size === 'hero' || layout.size === 'cinematic'
                            ? 'text-2xl md:text-[28px] lg:text-4xl'
                            : 'text-xl md:text-2xl lg:text-[26px]'
                        }`}>
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="font-body text-[12px] tracking-wide text-muted-foreground mt-2 max-w-lg leading-[1.8]">
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
