import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  GraduationCap,
  HeartPulse,
  MapPin,
  Quote,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClientOnly } from "@tanstack/react-router";
import { projectSites } from "@/data/site";
import { articles, images, stats, team, testimonials } from "@/data/site";

const HomeLeafletMap = lazy(() => import("@/components/site/LeafletMap"));

function HomeMapSkeleton() {
  return (
    <div className="flex h-[460px] w-full items-center justify-center rounded-xl border border-border bg-secondary/50 text-sm text-muted-foreground sm:h-[560px]">
      Chargement de la carte…
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Télémédecine Côte d'Ivoire — Portail national du réseau RAFT" },
      {
        name: "description",
        content:
          "Télé-ECG, télé-expertise et télé-formation en Côte d'Ivoire : découvrez les projets, les structures connectées, la médiathèque et les partenaires du réseau RAFT.",
      },
      { property: "og:title", content: "Télémédecine Côte d'Ivoire — Portail national du réseau RAFT" },
      {
        property: "og:description",
        content:
          "Le portail national de la télémédecine ivoirienne : projets, carte interactive des sites, annuaire, médiathèque et ressources de formation.",
      },
    ],
  }),
  component: Home,
});

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1400;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);
  return value;
}

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setSeen(true);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const shown = useCountUp(value, seen);
  return (
    <div ref={ref} className="rounded-xl border border-border/60 bg-card/70 px-5 py-6 text-center backdrop-blur">
      <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground sm:text-4xl">
        {shown.toLocaleString("fr-FR")}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

const services = [
  {
    icon: HeartPulse,
    title: "Télé-ECG",
    text: "Électrocardiogrammes réalisés en périphérie et interprétés par un cardiologue référent en moins de 30 minutes.",
    to: "/projets" as const,
  },
  {
    icon: Stethoscope,
    title: "Télé-expertise",
    text: "Avis spécialisé à distance sur les dossiers complexes, pour orienter sans transfert inutile du patient.",
    to: "/projets" as const,
  },
  {
    icon: GraduationCap,
    title: "Télé-formation",
    text: "Séminaires hebdomadaires diffusés vers les CHU et districts, avec replays disponibles en médiathèque.",
    to: "/mediatheque" as const,
  },
  {
    icon: BookOpen,
    title: "Ressources & données",
    text: "Guides, protocoles et recommandations d'interopérabilité pour les équipes et les éditeurs de logiciels.",
    to: "/articles" as const,
  },
];

function Home() {
  const latest = articles.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="surface-hero relative overflow-hidden text-primary-foreground">
        <div className="grid-pattern absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="rise-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold tracking-wide">
              <Activity className="h-3.5 w-3.5" aria-hidden="true" />
              Réseau RAFT · Côte d'Ivoire
            </span>
            <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-6xl">
              Le soin spécialisé,
              <span className="block text-transparent [background-image:linear-gradient(90deg,oklch(0.85_0.09_190),oklch(0.95_0.05_95))] [background-clip:text]">
                partout sur le territoire.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
              Depuis 2004, le réseau ivoirien de télémédecine relie les centres de santé de proximité aux
              spécialistes des CHU : diagnostic cardiologique à distance, formation continue et partage de données
              de santé sécurisé.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/projets">
                  Explorer la carte des projets
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/annuaire">Trouver une structure</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-primary-foreground/70">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Données de santé sécurisées
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" /> 12 localités connectées
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" aria-hidden="true" /> 860+ professionnels formés
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-primary-foreground/20 shadow-lift">
              <img
                src={images.hero}
                alt="Médecin ivoirien réalisant une télé-expertise cardiologique depuis un hôpital d'Abidjan"
                width={1600}
                height={1104}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden rounded-xl border border-border bg-card p-4 shadow-lift sm:block">
              <p className="eyebrow text-muted-foreground">Délai moyen d'avis</p>
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">28 min</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow text-accent">Nos solutions</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Quatre leviers pour rapprocher l'expertise du patient</h2>
          <p className="mt-4 text-muted-foreground">
            Chaque programme s'appuie sur un protocole clinique validé, un plateau technique adapté et une équipe
            locale formée.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Card key={s.title} className="card-hover border-border/70">
              <CardContent className="pt-6">
                <span className="surface-accent inline-flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground">
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                <Link
                  to={s.to}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                >
                  En savoir plus <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Carte + histoire */}
      <section className="bg-surface py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="eyebrow text-accent">Couverture nationale</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Un réseau qui s'étend d'Abidjan à Odienné</h2>
            <p className="mt-4 text-muted-foreground">
              La télémédecine ivoirienne a débuté par la formation médicale à distance en 2004, à la suite de la
              rencontre entre le Dr Benjamin GOLD et le Pr EHUA Somian Francis. Elle couvre aujourd'hui
              l'électrocardiographie, la télé-expertise et la formation continue dans une vingtaine de structures.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "24 structures connectées dans 12 localités",
                "Un pool de cardiologues référents de garde",
                "Des équipes locales formées et accompagnées",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {t}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8">
              <Link to="/projets">
                Voir la carte interactive
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-6">
            <ClientOnly fallback={<HomeMapSkeleton />}>
              <Suspense fallback={<HomeMapSkeleton />}>
                <HomeLeafletMap sites={projectSites} />
              </Suspense>
            </ClientOnly>
          </div>
        </div>
      </section>

      {/* Actualités */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-accent">Actualités</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Dernières publications du réseau</h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/articles">Toutes les actualités</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {latest.map((a) => (
            <Link key={a.slug} to="/articles/$slug" params={{ slug: a.slug }} className="group">
              <Card className="card-hover h-full overflow-hidden border-border/70 pt-0">
                <div className="aspect-16/10 overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="secondary">{a.category}</Badge>
                    <time dateTime={a.date}>
                      {new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </time>
                  </div>
                  <h3 className="text-lg leading-snug font-semibold group-hover:text-accent">{a.title}</h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{a.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-accent">Témoignages</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Les acteurs prennent la parole</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.author} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <Quote className="h-6 w-6 text-accent" aria-hidden="true" />
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground">“{t.quote}”</blockquote>
                <figcaption className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="eyebrow text-accent">Notre équipe</p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Les pionniers de la télémédecine ivoirienne</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <div key={m.name} className="card-hover rounded-2xl border border-border bg-card p-6">
              <span className="surface-hero flex h-14 w-14 items-center justify-center rounded-2xl font-[family-name:var(--font-display)] text-lg font-bold text-primary-foreground">
                {m.initials}
              </span>
              <h3 className="mt-4 text-base font-semibold">{m.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="surface-accent relative overflow-hidden rounded-3xl px-6 py-14 text-center text-primary-foreground sm:px-12">
          <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">Connectez votre structure au réseau</h2>
            <p className="mt-4 text-primary-foreground/85">
              Vous dirigez un centre de santé, un hôpital ou une équipe spécialisée ? La coordination technique vous
              accompagne de l'étude de faisabilité à la mise en service.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8">
              <Link to="/contact">
                Démarrer une demande
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
