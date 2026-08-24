import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  "Connecter ma structure",
  "Support technique",
  "Formation & séminaires",
  "Partenariat",
  "Demande d'information",
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
    if (!form.subject) e.subject = "Choisissez un objet.";
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
      toast.success("Demande envoyée", {
        description: "La coordination vous répond sous 48 heures ouvrées.",
      });
    }, 700);
  }

  return (
    <>
      <header className="surface-hero relative overflow-hidden text-primary-foreground">
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="eyebrow text-primary-foreground/70">Contact</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Écrire à la coordination</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Une question clinique, technique ou institutionnelle ? L'équipe de coordination du réseau vous répond.
          </p>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
        <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Dr. Awa Koné" />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="nom@structure.ci"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="organisation">Structure</Label>
              <Input
                id="organisation"
                value={form.organisation}
                onChange={(e) => set("organisation", e.target.value)}
                placeholder="CHU, centre de santé, ONG…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+225 …"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="subject">Objet *</Label>
              <Select value={form.subject} onValueChange={(v) => set("subject", v)}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Sélectionnez un objet" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="message">Votre demande *</Label>
              <Textarea
                id="message"
                rows={6}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Décrivez votre besoin, votre plateau technique ou votre question…"
              />
              {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
            </div>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            Les informations transmises sont utilisées uniquement pour traiter votre demande. N'incluez aucune donnée
            médicale nominative dans ce formulaire.
          </p>

          <Button type="submit" size="lg" className="mt-6" disabled={sending}>
            {sending ? "Envoi en cours…" : "Envoyer la demande"}
            <Send className="ml-1 h-4 w-4" />
          </Button>
        </form>

        <aside className="space-y-5">
          {[
            {
              icon: MapPin,
              title: "Adresse",
              lines: ["Coordination RAFT Côte d'Ivoire", "CHU de Yopougon, Abidjan"],
            },
            {
              icon: Phone,
              title: "Téléphone",
              lines: ["+225 27 22 41 55 09"],
            },
            {
              icon: Mail,
              title: "E-mail",
              lines: ["contact@telemedecine.ci"],
            },
            {
              icon: Clock,
              title: "Horaires",
              lines: ["Lundi – vendredi, 8h00 – 17h00", "Réponse sous 48 h ouvrées"],
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-5">
              <span className="surface-accent inline-flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground">
                <c.icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <h2 className="mt-3 text-sm font-semibold">{c.title}</h2>
              {c.lines.map((l) => (
                <p key={l} className="text-sm text-muted-foreground">
                  {l}
                </p>
              ))}
            </div>
          ))}
        </aside>
      </section>
    </>
  );
}
