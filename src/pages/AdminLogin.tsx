import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, user, isAdmin, loading, roleLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Dopo il login, evitiamo di navigare subito: aspettiamo che il contesto auth
  // abbia aggiornato user + ruolo, altrimenti /admin può reindirizzare a /admin-login
  // perché vede user=null per un istante.
  useEffect(() => {
    if (isSignUp) return;
    if (loading || roleLoading) return;

    if (user && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [user, isAdmin, loading, roleLoading, navigate, isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          toast({
            title: "Errore di registrazione",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registrazione completata",
            description: "Account creato con successo. Contatta l'amministratore per ottenere l'accesso.",
          });
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Errore di accesso",
            description: "Email o password non corretti",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Accesso effettuato",
            description: "Benvenuto nell'area amministrazione",
          });
          // niente navigate qui: ci pensa l'useEffect quando user/isAdmin sono pronti
        }
      }
    } catch (err) {
      console.error("[AdminLogin] submit failed", err);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'accesso. Riprova.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Legno & Arte</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-foreground">
              {isSignUp ? "Registrazione Admin" : "Area Admin"}
            </h1>
            <p className="font-body text-muted-foreground mt-2">
              {isSignUp ? "Crea un nuovo account" : "Accedi per gestire i tuoi progetti"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading 
                ? (isSignUp ? "Registrazione..." : "Accesso in corso...") 
                : (isSignUp ? "Registrati" : "Accedi")
              }
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-body text-sm text-primary hover:underline"
            >
              {isSignUp ? "Hai già un account? Accedi" : "Non hai un account? Registrati"}
            </button>
            
            <div>
              <a 
                href="/" 
                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Torna al sito
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
