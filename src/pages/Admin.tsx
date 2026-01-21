import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { useProjects, Project, ProjectPhoto } from "@/hooks/useProjects";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import HeroSettingsEditor from "@/components/admin/HeroSettingsEditor";
import BannerSettingsEditor from "@/components/admin/BannerSettingsEditor";
import { 
  Plus, 
  Trash2, 
  LogOut, 
  GripVertical,
  Eye,
  EyeOff,
  Upload,
  Star,
  ArrowLeft,
  Settings
} from "lucide-react";

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { projects, loading: projectsLoading, refetch } = useProjects(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showHeroSettings, setShowHeroSettings] = useState(false);
  const [showBannerSettings, setShowBannerSettings] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    is_visible: true,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin-login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && user && !isAdmin) {
      toast({
        title: "Accesso negato",
        description: "Non hai i permessi di amministratore",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, authLoading, user, navigate, toast]);

  if (authLoading || projectsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Caricamento...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const handleCreateProject = async () => {
    const { error } = await supabase.from("projects").insert({
      title: formData.title,
      description: formData.description,
      is_visible: formData.is_visible,
      display_order: projects.length,
    });

    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Progetto creato!" });
      setIsCreating(false);
      setFormData({ title: "", description: "", is_visible: true });
      refetch();
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProject) return;

    const { error } = await supabase
      .from("projects")
      .update({
        title: formData.title,
        description: formData.description,
        is_visible: formData.is_visible,
      })
      .eq("id", selectedProject.id);

    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Progetto aggiornato!" });
      refetch();
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo progetto?")) return;

    const { error } = await supabase.from("projects").delete().eq("id", projectId);

    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Progetto eliminato" });
      setSelectedProject(null);
      refetch();
    }
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProject || !e.target.files?.length) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${selectedProject.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Errore upload", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);

    const isFirstPhoto = !selectedProject.photos?.length;
    
    const { error: insertError } = await supabase.from("project_photos").insert({
      project_id: selectedProject.id,
      image_url: publicUrl,
      is_cover: isFirstPhoto,
      display_order: selectedProject.photos?.length || 0,
    });

    if (insertError) {
      toast({ title: "Errore", description: insertError.message, variant: "destructive" });
    } else {
      toast({ title: "Foto caricata!" });
      refetch();
    }
    
    setUploading(false);
  };

  const handleSetCover = async (photoId: string) => {
    if (!selectedProject) return;

    // Remove cover from all photos in this project
    await supabase
      .from("project_photos")
      .update({ is_cover: false })
      .eq("project_id", selectedProject.id);

    // Set new cover
    await supabase
      .from("project_photos")
      .update({ is_cover: true })
      .eq("id", photoId);

    toast({ title: "Copertina aggiornata!" });
    refetch();
  };

  const handleTogglePhotoVisibility = async (photo: ProjectPhoto) => {
    const { error } = await supabase
      .from("project_photos")
      .update({ is_visible: !photo.is_visible })
      .eq("id", photo.id);

    if (!error) {
      refetch();
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Eliminare questa foto?")) return;

    const { error } = await supabase.from("project_photos").delete().eq("id", photoId);

    if (!error) {
      toast({ title: "Foto eliminata" });
      refetch();
    }
  };

  const handleUpdateCaption = async (photoId: string, caption: string) => {
    await supabase
      .from("project_photos")
      .update({ caption })
      .eq("id", photoId);
    refetch();
  };

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description || "",
      is_visible: project.is_visible,
    });
    setIsCreating(false);
  };

  const startCreating = () => {
    setSelectedProject(null);
    setFormData({ title: "", description: "", is_visible: true });
    setIsCreating(true);
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Legno & Arte</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </a>
              <h1 className="font-display text-xl">Gestione Progetti</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={showHeroSettings ? "default" : "outline"} 
                size="sm"
                onClick={() => { setShowHeroSettings(!showHeroSettings); setShowBannerSettings(false); }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Hero
              </Button>
              <Button 
                variant={showBannerSettings ? "default" : "outline"} 
                size="sm"
                onClick={() => { setShowBannerSettings(!showBannerSettings); setShowHeroSettings(false); }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Banner
              </Button>
              <Button variant="ghost" onClick={() => signOut().then(() => navigate("/"))}>
                <LogOut className="w-4 h-4 mr-2" />
                Esci
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {showHeroSettings ? (
            <div className="max-w-md mx-auto">
              <HeroSettingsEditor />
            </div>
          ) : showBannerSettings ? (
            <div className="max-w-md mx-auto">
              <BannerSettingsEditor />
            </div>
          ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Projects list */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg">Progetti</h2>
                <Button size="sm" onClick={startCreating}>
                  <Plus className="w-4 h-4 mr-1" />
                  Nuovo
                </Button>
              </div>

              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => selectProject(project)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedProject?.id === project.id
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-sm truncate">{project.title}</h3>
                          {!project.is_visible && (
                            <EyeOff className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                        <p className="font-body text-xs text-muted-foreground">
                          {project.photos?.length || 0} foto
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit panel */}
            <div className="lg:col-span-2">
              {(selectedProject || isCreating) ? (
                <div className="space-y-8">
                  {/* Project form */}
                  <div className="p-6 rounded-lg border border-border space-y-4">
                    <h2 className="font-display text-lg">
                      {isCreating ? "Nuovo Progetto" : "Modifica Progetto"}
                    </h2>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Titolo</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Nome del progetto"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Descrizione</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Descrizione del progetto"
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Switch
                          id="visible"
                          checked={formData.is_visible}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                        />
                        <Label htmlFor="visible" className="flex items-center gap-2">
                          {formData.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          {formData.is_visible ? "Visibile" : "Nascosto"}
                        </Label>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      {isCreating ? (
                        <Button onClick={handleCreateProject} disabled={!formData.title}>
                          Crea Progetto
                        </Button>
                      ) : (
                        <>
                          <Button onClick={handleUpdateProject}>Salva Modifiche</Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteProject(selectedProject!.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Photos section (only for existing projects) */}
                  {selectedProject && (
                    <div className="p-6 rounded-lg border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-display text-lg">Foto</h2>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadPhoto}
                            className="hidden"
                            disabled={uploading}
                          />
                          <Button asChild disabled={uploading}>
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              {uploading ? "Caricamento..." : "Carica Foto"}
                            </span>
                          </Button>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedProject.photos?.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <div className="aspect-[4/3] overflow-hidden rounded-lg">
                              <img
                                src={photo.image_url}
                                alt=""
                                className={`w-full h-full object-cover ${
                                  !photo.is_visible ? "opacity-50" : ""
                                }`}
                              />
                            </div>
                            
                            {/* Photo controls */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleSetCover(photo.id)}
                                className={`p-2 rounded-full ${
                                  photo.is_cover 
                                    ? "bg-accent text-accent-foreground" 
                                    : "bg-white/20 text-white hover:bg-white/30"
                                }`}
                                title="Imposta come copertina"
                              >
                                <Star className={`w-4 h-4 ${photo.is_cover ? "fill-current" : ""}`} />
                              </button>
                              <button
                                onClick={() => handleTogglePhotoVisibility(photo)}
                                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
                                title={photo.is_visible ? "Nascondi" : "Mostra"}
                              >
                                {photo.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDeletePhoto(photo.id)}
                                className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500"
                                title="Elimina"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Cover badge */}
                            {photo.is_cover && (
                              <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded">
                                Copertina
                              </div>
                            )}

                            {/* Caption input */}
                            <Input
                              placeholder="Didascalia..."
                              value={photo.caption || ""}
                              onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                              className="mt-2 text-xs"
                            />
                          </div>
                        ))}
                      </div>

                      {(!selectedProject.photos || selectedProject.photos.length === 0) && (
                        <p className="text-center text-muted-foreground font-body py-8">
                          Nessuna foto caricata. Clicca "Carica Foto" per aggiungerne.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground font-body">
                  Seleziona un progetto o creane uno nuovo
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Admin;
