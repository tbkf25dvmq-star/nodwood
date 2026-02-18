import { useState } from "react";
import { useSectionFade } from "@/hooks/useSectionFade";
import { Mail, MapPin, Instagram, Send, Loader2, CheckCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Il nome è obbligatorio").max(100, "Max 100 caratteri"),
  email: z.string().trim().email("Inserisci un'email valida").max(255, "Max 255 caratteri"),
  message: z.string().trim().min(1, "Il messaggio è obbligatorio").max(2000, "Max 2000 caratteri"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const sectionRef = useSectionFade();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: values,
      });

      if (error) throw error;

      setIsSuccess(true);
      form.reset();
      toast({
        title: "Messaggio inviato!",
        description: "Ti risponderemo il prima possibile.",
      });

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error("Contact form error:", err);
      toast({
        title: "Errore nell'invio",
        description: "Riprova più tardi o contattaci direttamente via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="contatti" className="section-fade py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12 md:mb-16">
            <p className="font-body text-[11px] tracking-[0.35em] uppercase text-muted-foreground mb-4">
              Contatti
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-foreground">
              Restiamo in Contatto
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mt-8" />
            <p className="font-body text-muted-foreground mt-8 max-w-xl mx-auto leading-relaxed">
              Hai un progetto in mente o vuoi semplicemente saperne di più sulle nostre creazioni? 
              Scrivici, saremo felici di risponderti.
            </p>
          </div>

          {/* Contact form */}
          <div className="mb-16">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-muted-foreground">Nome</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Il tuo nome"
                            className="bg-card border-border rounded-sm font-body focus-visible:ring-accent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-muted-foreground">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="La tua email"
                            className="bg-card border-border rounded-sm font-body focus-visible:ring-accent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body text-sm text-muted-foreground">Messaggio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Raccontaci il tuo progetto o la tua idea..."
                          className="bg-card border-border rounded-sm font-body min-h-[150px] focus-visible:ring-accent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className="bg-accent hover:bg-accent/80 text-accent-foreground font-body px-8 py-3 rounded-sm tracking-wider uppercase text-sm transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Invio in corso...
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Inviato!
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Invia Messaggio
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Contact info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="mailto:Nod.wood.art@gmail.com"
              className="group flex items-center gap-4 p-6 bg-card rounded-sm border border-border hover:border-accent/50 transition-colors"
            >
              <div className="p-3 bg-accent/10 rounded-sm group-hover:bg-accent/20 transition-colors">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-body text-sm text-muted-foreground">Email</p>
                <p className="font-body text-foreground">Nod.wood.art@gmail.com</p>
              </div>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-6 bg-card rounded-sm border border-border hover:border-accent/50 transition-colors"
            >
              <div className="p-3 bg-accent/10 rounded-sm group-hover:bg-accent/20 transition-colors">
                <Instagram className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-body text-sm text-muted-foreground">Instagram</p>
                <p className="font-body text-foreground">@tuoprofilo</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-6 bg-card rounded-sm border border-border">
              <div className="p-3 bg-accent/10 rounded-sm">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-body text-sm text-muted-foreground">Località</p>
                <p className="font-body text-foreground">Italia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
