import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  Handshake,
  HeartPulse,
  Lock,
  MapPin,
  Pause,
  PhoneCall,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LeafletMap from "@/components/site/LeafletMap";
import { images, stats } from "@/data/site";
import { useArticles, useTeam, useTestimonials, useProjects, usePartners } from "@/hooks/useData";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Télémédecine Côte d'Ivoire — Portail national du réseau RAFT" },
      {
        name: "description",
        content:
          "Télé-ECG d'urgence, télé-expertise et télé-formation en Côte d'Ivoire : découvrez les projets, les structures connectées, la médiathèque et les partenaires du réseau RAFT.",
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
    const duration = 1600;
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

const statIcons = [HeartPulse, Building2, Handshake, GraduationCap];

function StatCard({
  value,
  suffix,
  label,
  iconIndex,
  style,
}: {
  value: number;
  suffix: string;
  label: string;
  iconIndex: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setSeen(true);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const shown = useCountUp(value, seen);
  const Icon = statIcons[iconIndex % statIcons.length] ?? HeartPulse;

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-accent/50"
      style={style}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/80 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:bg-accent/15">
          <Icon className="h-6 w-6" />
        </div>
        <span className="h-2 w-2 rounded-full bg-emerald-500/60" />
      </div>

      <div className="mt-5">
        <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {shown.toLocaleString("fr-FR")}
          <span className="text-accent">{suffix}</span>
        </p>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

const services = [
  {
    icon: HeartPulse,
    badge: "Priorité Vitale",
    title: "Télé-ECG d'urgence",
    text: "Électrocardiogrammes réalisés dans les centres périphériques et analysés par un cardiologue de garde en moins de 30 minutes.",
    to: "/projets" as const,
    highlights: ["Interprétation < 30 min", "Pool de cardiologues 24/7", "Alerte syndrome coronarien"],
  },
  {
    icon: Stethoscope,
    badge: "Recours Spécialisé",
    title: "Télé-expertise",
    text: "Avis confraternel structuré pour les dossiers complexes, permettant d'orienter le patient et d'éviter les évacuations inutiles.",
    to: "/projets" as const,
    highlights: ["Dossier patient sécurisé", "Avis sous 48h ouvrées", "Économie de transport"],
  },
  {
    icon: GraduationCap,
    badge: "Développement Continu",
    title: "Télé-formation continue",
    text: "Conférences interactives hebdomadaires diffusées en direct vers les CHU et districts, archivées en médiathèque.",
    to: "/mediatheque" as const,
    highlights: ["Séminaires interactifs", "Attestations de participation", "Replays en accès libre"],
  },
  {
    icon: BookOpen,
    badge: "Guides & Données",
    title: "Standards & Référentiels",
    text: "Protocoles cliniques validés, guides d'implémentation et normes d'interopérabilité pour les professionnels de santé.",
    to: "/articles" as const,
    highlights: ["Interopérabilité HL7/FHIR", "Conformité réglementaire", "Guides pratiques terrain"],
  },
];

function Home() {
  const { data: articles = [] } = useArticles();
  const { data: team = [] } = useTeam();
  const { data: testimonials = [] } = useTestimonials();
  const { data: projectSites = [] } = useProjects();
  const { data: partners = [] } = usePartners();

  const latest = articles.slice(0, 3);

  const { ref: heroRef, isVisible: heroVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: statsRef, isVisible: statsVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: servicesRef, isVisible: servicesVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: mapRef, isVisible: mapVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: articlesRef, isVisible: articlesVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: teamRef, isVisible: teamVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: ctaRef, isVisible: ctaVisible } = useIntersectionObserver<HTMLDivElement>();

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isTestimonialPlaying, setIsTestimonialPlaying] = useState(true);

  // Auto-rotation des témoignages
  useEffect(() => {
    if (!isTestimonialPlaying) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isTestimonialPlaying]);

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className={cn(
          "surface-hero relative overflow-hidden text-primary-foreground pt-12 pb-20 lg:pt-20 lg:pb-28",
          heroVisible && "animate-fade-up",
        )}
      >
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="absolute top-1/4 -left-48 h-96 w-96 rounded-full bg-accent/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-primary/40 blur-3xl pointer-events-none" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          {/* Hero Left Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Réseau National RAFT · Côte d'Ivoire</span>
              <span className="text-primary-foreground/50">|</span>
              <span className="text-accent font-medium">Santé Numérique</span>
            </div>

            <h1 className="text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-6xl tracking-tight">
              Le soin spécialisé,{" "}
              <span className="block text-transparent bg-gradient-to-r from-cyan-200 via-teal-100 to-amber-200 bg-clip-text">
                accessible partout sur le territoire.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-primary-foreground/85 leading-relaxed">
              Depuis 2004, le réseau ivoirien de télémédecine relie en continu les dispensaires et hôpitaux généraux aux cardiologues et spécialistes des CHU : interprétation d'ECG d'urgence en moins de 30 minutes, télé-expertise pluridisciplinaire et télé-formation certifiante.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-accent px-7 text-accent-foreground font-semibold shadow-lift hover:bg-accent/90 hover:shadow-glow transition-all"
              >
                <Link to="/projets">
                  Explorer la carte des 24 sites
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20 transition-all"
              >
                <Link to="/annuaire">Trouver une structure</Link>
              </Button>
            </div>

            {/* Micro assurances bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-primary-foreground/15 text-xs text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Données de santé sécurisées</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-300 shrink-0" />
                <span>12 Localités connectées</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <Users className="h-4 w-4 text-amber-300 shrink-0" />
                <span>860+ Soignants formés</span>
              </div>
            </div>
          </div>

          {/* Hero Right Media with Floating Widgets (5 cols) */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-accent/30 via-emerald-400/20 to-gold/30 blur-xl opacity-70" />

              <div className="relative overflow-hidden rounded-3xl border border-primary-foreground/25 bg-primary/20 shadow-lift">
                <img
                  src={images.hero}
                  alt="Médecin réalisant une télé-expertise cardiologique"
                  width={1600}
                  height={1104}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Widget 1: Télé-ECG (Top-Right) */}
              <div className="animate-float glass absolute -top-6 -right-4 hidden sm:flex items-center gap-3.5 rounded-2xl p-4 shadow-lift text-foreground border border-white/60">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm">
                  <HeartPulse className="h-6 w-6" />
                </span>
                <div>
                  <p className="eyebrow text-accent">Délai moyen d'avis</p>
                  <p className="font-[family-name:var(--font-display)] text-xl font-extrabold text-foreground">
                    &lt; 28 minutes
                  </p>
                  <span className="text-[0.68rem] text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Cardiologue de garde
                  </span>
                </div>
              </div>

              {/* Floating Widget 2: Sécurité HDS (Bottom-Left) */}
              <div className="animate-float-delayed glass absolute -bottom-6 -left-4 hidden sm:flex items-center gap-3.5 rounded-2xl p-4 shadow-lift text-foreground border border-white/60">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600">
                  <Lock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">Chiffrement HDS</p>
                  <p className="text-[0.72rem] text-muted-foreground">Données patients protégées</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="border-b border-border/80 bg-card py-4 shadow-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-6 px-4 text-xs font-semibold text-muted-foreground sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span>Conventionné Ministère de la Santé</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span>Membre officiel Réseau RAFT Afrique</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span>Matériel médical certifié CE / OMS</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span>Astreinte cardiologique 24h/24 7j/7</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section ref={statsRef} className={cn("bg-surface/50 py-16 sm:py-20", statsVisible && "animate-fade-up")}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="eyebrow text-accent">Impact Clinique</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl text-foreground">
              Des résultats mesurables au service de la population
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {stats.map((s, i) => (
              <StatCard
                key={s.label}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                iconIndex={i}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Solutions / Services Section */}
      <section ref={servicesRef} className={cn("mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8", servicesVisible && "animate-fade-up")}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow text-accent">Nos Solutions</span>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl text-foreground">
              Quatre piliers pour rapprocher l'expertise du patient
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              Chaque dispositif combine un équipement biomédical connecté, des protocoles cliniques validés et un accompagnement humain permanent.
            </p>
          </div>

          <Button asChild variant="outline" className="rounded-full self-start md:self-auto">
            <Link to="/projets">
              Voir tous les projets <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Card
              key={s.title}
              className="group card-hover relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-soft transition-all duration-300"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:scale-105 shadow-xs">
                    <s.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <Badge variant="secondary" className="text-[0.68rem] font-semibold text-muted-foreground">
                    {s.badge}
                  </Badge>
                </div>

                <h3 className="mt-5 text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>

                <ul className="mt-5 space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  {s.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <Link
                  to={s.to}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-all group-hover:translate-x-1"
                >
                  En savoir plus <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Carte & Couverture Nationale */}
      <section ref={mapRef} className={cn("bg-surface/60 py-20 border-y border-border/70", mapVisible && "animate-fade-up")}>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="eyebrow text-accent">Maillage Territorial</span>
              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl text-foreground tracking-tight">
                Un réseau qui s'étend d'Abidjan à Odienné
              </h2>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              La télémédecine ivoirienne permet d'abolir les distances géographiques. Les structures rurales disposent d'un accès direct aux équipes de cardiologie et de médecine interne des grands CHU universitaires.
            </p>

            <div className="space-y-3.5 rounded-2xl bg-card p-5 border border-border/80 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">24 structures équipées et opérationnelles</p>
                  <p className="text-xs text-muted-foreground">CHU, Centres Hospitaliers Régionaux et Centres de Santé Ruraux.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Astreinte cardiologique centralisée</p>
                  <p className="text-xs text-muted-foreground">Interprétation d'électrocardiogrammes 7 jours sur 7.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Accompagnement et formation sur site</p>
                  <p className="text-xs text-muted-foreground">Mise à niveau continue des soignants et techniciens biomédicaux.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full shadow-soft">
                <Link to="/projets">
                  Ouvrir la carte complète
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/annuaire">Voir l'annuaire des sites</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-card p-4 shadow-lift sm:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <p className="text-sm font-bold text-foreground">Cartographie interactive nationale</p>
                  <p className="text-xs text-muted-foreground">Cliquez sur un marqueur pour afficher le centre</p>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border-emerald-500/30">
                  ● 24 Sites en ligne
                </Badge>
              </div>
              <LeafletMap sites={projectSites} activeId={null} onSelect={() => {}} />
            </div>
          </div>
        </div>
      </section>

      {/* Actualités / Journal */}
      <section ref={articlesRef} className={cn("mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8", articlesVisible && "animate-fade-up")}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow text-accent">Actualités & Recherches</span>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl text-foreground">Dernières publications du réseau</h2>
            <p className="mt-2 text-sm text-muted-foreground">Retours d'expérience cliniques, bilans de programmes et avancées de la télémédecine.</p>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/articles">
              Toutes les publications <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {latest.map((a, i) => (
            <Link
              key={a.slug}
              to="/articles/$slug"
              params={{ slug: a.slug }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-accent/50"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="aspect-16/10 overflow-hidden bg-muted">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="font-semibold">
                      {a.category}
                    </Badge>
                    <time dateTime={a.date}>
                      {new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </time>
                  </div>
                  <h3 className="text-lg font-bold leading-snug text-foreground group-hover:text-accent transition-colors">
                    {a.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">{a.excerpt}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-accent">
                  <span>Lire l'article complet</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Équipe et Pionniers */}
      <section ref={teamRef} className={cn("mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-border/70", teamVisible && "animate-fade-up")}>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="eyebrow text-accent">Coordination RAFT</span>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl text-foreground">
            Les pionniers de la télémédecine en Côte d'Ivoire
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Les figures historiques qui ont introduit et développé la formation médicale à distance et le télé-ECG depuis 2004.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <div
              key={m.name}
              className="card-hover group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-6 text-center shadow-soft"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div>
                <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-3xl border-2 border-accent/40 shadow-soft group-hover:border-accent transition-all">
                  {m.image ? (
                    <img
                      src={m.image}
                      alt={m.name}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-bold text-2xl">
                      {m.initials}
                    </div>
                  )}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="inline-flex h-full w-full rounded-full bg-emerald-500" />
                  </span>
                </div>

                <h3 className="mt-5 text-base font-bold text-foreground group-hover:text-accent transition-colors">
                  {m.name}
                </h3>
                <p className="mt-1 text-xs font-bold text-accent">{m.role}</p>
                <p className="mt-1 text-[0.72rem] text-muted-foreground leading-tight">{m.subRole}</p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">{m.bio}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60">
                <span className="inline-block text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full">
                  Réseau RAFT Côte d'Ivoire
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Témoignages - Les Acteurs Prennent La Parole */}
      <section
        ref={testimonialsRef}
        className={cn("bg-surface/50 py-20 border-t border-border/70 overflow-hidden", testimonialsVisible && "animate-fade-up")}
        onMouseEnter={() => setIsTestimonialPlaying(false)}
        onMouseLeave={() => setIsTestimonialPlaying(true)}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 lg:p-12 shadow-soft">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Heading, Subtitle & Interactive Navigation */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Témoignages
                  </span>
                  <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl text-foreground tracking-tight leading-tight">
                    Les Acteurs Prennent La Parole
                  </h2>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    Découvrez les retours d'expérience et l'impact quotidien de la télémédecine racontés par les médecins,
                    spécialistes et coordonnateurs du réseau RAFT.
                  </p>
                </div>

                {/* Slider Controls */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-surface text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground cursor-pointer shadow-xs active:scale-95"
                    title="Témoignage précédent"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-surface text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground cursor-pointer shadow-xs active:scale-95"
                    title="Témoignage suivant"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsTestimonialPlaying((prev) => !prev)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-surface text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-xs"
                    title={isTestimonialPlaying ? "Mettre en pause la rotation" : "Reprendre la rotation automatique"}
                  >
                    {isTestimonialPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>

                  <span className="text-xs font-mono font-bold text-muted-foreground ml-2">
                    0{activeTestimonial + 1} / 0{testimonials.length}
                  </span>
                </div>
              </div>

              {/* Center & Right: Active Testimonial Card */}
              {(() => {
                const current = testimonials[activeTestimonial] ?? testimonials[0];
                if (!current) return null;
                return (
                  <div className="lg:col-span-8 flex flex-col md:flex-row items-center gap-6 lg:gap-8 rounded-2xl bg-surface/60 p-6 sm:p-8 border border-border/60">
                    {/* Photo of the actor */}
                    <div className="shrink-0 relative">
                      <div className="relative h-44 w-44 sm:h-48 sm:w-48 overflow-hidden rounded-2xl border-2 border-border shadow-lift bg-slate-200">
                        <img
                          src={current.image}
                          alt={current.author}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap shadow-xs backdrop-blur-sm">
                        ● Praticien certifié
                      </span>
                    </div>

                    {/* Quote and Author Details */}
                    <div className="flex-1 flex flex-col justify-between text-left">
                      <Quote className="h-8 w-8 text-primary/30 mb-2" aria-hidden="true" />
                      <blockquote className="text-sm sm:text-base leading-relaxed text-foreground font-medium">
                        « {current.quote} »
                      </blockquote>

                      <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-black text-foreground tracking-tight">
                            {current.author}
                          </h4>
                          <p className="text-xs font-bold uppercase tracking-wider text-primary mt-0.5">
                            {current.role}
                          </p>
                        </div>

                        {/* Pagination Dots (Matching user screenshots) */}
                        <div className="flex items-center gap-2">
                          {testimonials.map((t, idx) => {
                            const isCurrent = idx === activeTestimonial;
                            return (
                              <button
                                key={t.author}
                                type="button"
                                onClick={() => setActiveTestimonial(idx)}
                                className="p-1 cursor-pointer transition-transform hover:scale-125"
                                title={`Témoignage de ${t.author}`}
                              >
                                <span
                                  className={cn(
                                    "block rounded-full transition-all duration-300",
                                    isCurrent
                                      ? "h-3.5 w-3.5 border-2 border-amber-500 bg-amber-400 shadow-xs"
                                      : "h-2.5 w-2.5 bg-slate-400/60 dark:bg-slate-600 hover:bg-slate-500"
                                  )}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Quick Actor Selector Thumbnails */}
            <div className="mt-8 pt-6 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {testimonials.map((t, idx) => {
                const isCurrent = idx === activeTestimonial;
                return (
                  <button
                    key={t.author}
                    type="button"
                    onClick={() => setActiveTestimonial(idx)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-all cursor-pointer",
                      isCurrent
                        ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/30"
                        : "border-border/70 bg-card hover:border-primary/40 hover:bg-secondary/70"
                    )}
                  >
                    <img
                      src={t.image}
                      alt={t.author}
                      className="h-10 w-10 rounded-xl object-cover shrink-0 shadow-xs border border-border"
                    />
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-foreground truncate">{t.author}</span>
                      <span className="block text-[10px] text-muted-foreground truncate">{t.role}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Partenaires Officiels - Les 4 Partenaires Stratégiques */}
      <section className="border-t border-border/80 bg-surface/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="eyebrow text-accent">Partenaires Stratégiques</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Les 4 Partenaires Officiels du Réseau
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Une alliance institutionnelle, technologique et académique au service de la santé publique en Côte d'Ivoire.
            </p>
          </div>

          {/* Clean Horizontal Partner Banner with Vertical Dividers (Exact Layout from User Reference) */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 lg:p-10 shadow-soft">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border/80">
              {partners.map((p, idx) => (
                <div
                  key={p.name}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 text-center group transition-all",
                    idx > 0 && "sm:border-t-0"
                  )}
                >
                  <div className="h-20 sm:h-24 w-full flex items-center justify-center p-2">
                    {p.logoImg ? (
                      <img
                        src={p.logoImg}
                        alt={p.name}
                        className="max-h-16 sm:max-h-20 max-w-[210px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-lg font-bold text-foreground">{p.name}</span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="block text-xs font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {p.name}
                    </span>
                    <span className="block text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                      {p.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/partenaires"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              Consulter les conventions de partenariat & détails institutionnels
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}