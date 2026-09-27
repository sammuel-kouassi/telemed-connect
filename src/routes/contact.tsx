import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Headphones,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Coordination de la télémédecine en Côte d'Ivoire" },
      {
        name: "description",
        content:
          "Contactez la coordination du réseau de télémédecine ivoirien : connexion d'une structure, support technique, partenariat ou demande d'information.",
      },
      { property: "og:title", content: "Contact — Télémédecine Côte d'Ivoire" },
      {
        property: "og:description",
        content: "Écrivez à la coordination technique du réseau RAFT Côte d'Ivoire.",
      },
    ],
  }),
  component: ContactPage,
});

const subjects = [
  "Raccorder ma structure (audit & équipement)",
  "Astreinte Télé-ECG & cardiologie d'urgence",
  "Support technique plateforme & matériel",
  "Inscriptions aux télé-formations cliniques",
  "Partenariat institutionnel ou académique",
  "Autre demande d'information",
];

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", organisation: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = "Indiquez votre nom complet.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Adresse e-mail invalide.";
    if (!form.subject) e.subject = "Veuillez choisir un objet.";
    if (form.message.trim().length < 20) e.message = "Décrivez votre demande en 20 caractères minimum.";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", organisation: "", phone: "", subject: "", message: "" });
      toast.success("Demande transmise avec succès", {
        description: "La coordination technique vous répondra sous 48 heures ouvrées.",
      });
    }, 800);
  }

  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: formRef, isVisible: formVisible } = useIntersectionObserver<HTMLDivElement>();

  return (
    <>
      {/* Header Banner */}
      <header
        ref={headerRef}
        className={cn(
          "surface-hero relative overflow-hidden text-primary-foreground py-16 sm:py-20",
          headerVisible && "animate-fade-up",
        )}
      >
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Coordination Centrale</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-3xl">
            Écrire à la coordination{" "}
            <span className="text-transparent bg-gradient-to-r from-cyan-200 via-teal-100 to-amber-200 bg-clip-text">
              nationale.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base sm:text-lg text-primary-foreground/85 leading-relaxed">
            Raccordement de votre établissement, astreinte médicale, questions cliniques ou demandes de partenariat : nos référents vous répondent sous 48 heures.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-xs font-medium text-primary-foreground/80">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3.5 py-1.5 backdrop-blur-sm border border-primary-foreground/15">
              <Headphones className="h-3.5 w-3.5 text-accent" /> Astreinte Télé-ECG 24/7 active
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3.5 py-1.5 backdrop-blur-sm border border-primary-foreground/15">
              <Clock className="h-3.5 w-3.5 text-cyan-300" /> Réponse garantie &lt; 48h
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section
        ref={formRef}
        className={cn(
          "mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8",
          formVisible && "animate-fade-up",
        )}
      >
        {/* Contact Form (8 cols) */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft sm:p-10"
          >
            <div className="border-b border-border/60 pb-5 mb-6">
              <h2 className="text-xl font-bold text-foreground">Formulaire de contact & de raccordement</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Remplissez les champs ci-dessous pour être mis en relation avec le référent compétent.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Nom et Prénom *
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Dr. Awa Koné"
                  className="h-11 rounded-2xl border-border/80"
                />
                {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Adresse e-mail professionnelle *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="nom@chu-treichville.ci"
                  className="h-11 rounded-2xl border-border/80"
                />
                {errors.email && <p className="text-xs text-destructive font-medium">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organisation" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Structure de rattachement
                </Label>
                <Input
                  id="organisation"
                  value={form.organisation}
                  onChange={(e) => set("organisation", e.target.value)}
                  placeholder="CHU, Hôpital Général, Centre de Santé..."
                  className="h-11 rounded-2xl border-border/80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Téléphone direct
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+225 07 00 00 00 00"
                  className="h-11 rounded-2xl border-border/80"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Objet de la demande *
                </Label>
                <Select value={form.subject} onValueChange={(v) => set("subject", v)}>
                  <SelectTrigger id="subject" className="h-11 rounded-2xl border-border/80">
                    <SelectValue placeholder="Sélectionnez l'objet de votre démarche" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s} className="rounded-xl">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && <p className="text-xs text-destructive font-medium">{errors.subject}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Détails de votre message *
                </Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Précisez votre plateau technique actuel, votre besoin de télé-expertise ou votre question..."
                  className="rounded-2xl border-border/80"
                />
                {errors.message && <p className="text-xs text-destructive font-medium">{errors.message}</p>}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-surface/80 p-4 border border-border/60 text-xs text-muted-foreground flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Protection des données : vos coordonnées ne font l'objet d'aucune cession commerciale. N'incluez aucune donnée médicale nominative de patient dans ce formulaire de contact général.
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-6 rounded-full px-8 font-semibold shadow-soft hover:shadow-glow transition-all"
              disabled={sending}
            >
              {sending ? "Transmission en cours..." : "Envoyer le message"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Sidebar Information (4 cols) */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-5">
            <h3 className="text-base font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-accent" />
              Siège de la Coordination
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-accent">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">Adresse physique</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    CHU de Yopougon, B.P. 632 Abidjan, Côte d'Ivoire
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-accent">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">Standard & Coordination</p>
                  <a
                    href="tel:+2250173996782"
                    className="text-xs font-bold text-accent hover:underline block mt-0.5"
                  >
                    +225 01 73 99 67 82
                  </a>
                  <a
                    href="tel:+2250749423073"
                    className="text-xs text-muted-foreground hover:underline block"
                  >
                    +225 07 49 42 30 73
                  </a>
                  <p className="text-[0.7rem] text-muted-foreground mt-0.5">Astreinte cardiologique 24h/24 7j/7</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-accent">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">Courriel institutionnel</p>
                  <a
                    href="mailto:info@telemedecine.ci"
                    className="text-xs text-accent hover:underline block mt-0.5 break-all"
                  >
                    info@telemedecine.ci
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-accent">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">Horaires d'ouverture</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Lundi – Vendredi : 09h00 – 17h00 GMT
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Samedi : 10h00 – 12h00 GMT
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-soft space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Procédure d'adhésion simplifiée
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pour tout centre de santé public ou privé d'intérêt général, le raccordement inclut la mise à disposition de matériel connecté certifié et la formation initiale de l'équipe soignante.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}