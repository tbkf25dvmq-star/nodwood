interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  index: number;
}

const ProjectCard = ({ title, description, image, index }: ProjectCardProps) => {
  return (
    <div 
      className="group relative overflow-hidden bg-card rounded-sm opacity-0 animate-fade-in"
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      {/* Image container */}
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="font-display text-2xl md:text-3xl text-primary-foreground mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {title}
        </h3>
        <p className="font-body text-sm text-primary-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
          {description}
        </p>
      </div>
      
      {/* Always visible title */}
      <div className="p-4 bg-card border-t border-border group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="font-display text-xl text-card-foreground">{title}</h3>
      </div>
    </div>
  );
};

export default ProjectCard;
