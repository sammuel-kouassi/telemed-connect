import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
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
import heroTeleconsultation from "@/assets/hero_teleconsultation.jpg";
import heroTeleexpertiseEcran from "@/assets/hero_teleexpertise_ecran.jpg";
import heroMedecinTablette from "@/assets/hero_medecin_tablette.jpg";
import histoireRencontre2004 from "@/assets/histoire_rencontre_2004.jpg";
import pioneerRkpon from "@/assets/pioneer_rkpon.png";
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

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Le compteur part de la valeur finale (rendu serveur, carte déjà visible, mouvement réduit) ;
// il ne compte depuis 0 que pour une carte qui arrive à l'écran en défilant.
function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (!active) {
      setValue(target);
      return;
    }
    const duration = 1200;
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

const heroSlides = [
  {
    image: heroTeleconsultation,
    alt: "Médecin spécialiste en téléconsultation directe",
    tag: "Téléconsultation Spécialisée",
  },
  {
    image: heroTeleexpertiseEcran,
    alt: "Télé-expertise médicale et concertation avec le CHU",
    tag: "Télé-expertise & Avis d'Urgence",
  },
  {
    image: heroMedecinTablette,
    alt: "Praticienne consultant le dossier patient et imagerie médicale sur tablette",
    tag: "Dossier Médical & Imagerie Sécurisés",
  },
];

function HeroStatCard({
  value,
  suffix,
  label,
  iconIndex,
}: {
  value: number;
  suffix: string;
  label: string;
  iconIndex: number;
}) {
  const { ref, isVisible: animateCount } = useIntersectionObserver<HTMLDivElement>();
  const shown = useCountUp(value, animateCount && !prefersReducedMotion());
  const Icon = statIcons[iconIndex % statIcons.length] ?? HeartPulse;

  return (
    <div
      ref={ref}
      className="group relative flex items-center gap-3 sm:gap-3.5 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-3 sm:p-3.5 backdrop-blur-md transition duration-200 hover:bg-white/[0.1] hover:border-primary/70 shadow-sm"
    >
      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="font-[family-name:var(--font-display)] text-lg sm:text-xl xl:text-2xl font-extrabold tracking-tight text-white leading-tight">
            {shown.toLocaleString("fr-FR")}
            <span className="text-primary ml-0.5">{suffix}</span>
          </p>
        </div>
        <p className="mt-0.5 text-xs sm:text-xs font-medium text-white/80 leading-snug line-clamp-1">{label}</p>
      </div>
    </div>
  );
}



function Home() {
  const { data: articles = [] } = useArticles();
  const { data: team = [] } = useTeam();
  const { data: testimonials = [] } = useTestimonials();
  const { data: projectSites = [] } = useProjects();
  const { data: partners = [] } = usePartners();

  const latest = articles.slice(0, 3);

  const { ref: histoireRef, isVisible: histoireVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: mapRef, isVisible: mapVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: articlesRef, isVisible: articlesVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: teamRef, isVisible: teamVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: ctaRef, isVisible: ctaVisible } = useIntersectionObserver<HTMLDivElement>();

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // ---- Hero : fondu entre 3 images, glissable au doigt ----
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSlidePlaying, setIsSlidePlaying] = useState(true);
  const [isHeroInteracting, setIsHeroInteracting] = useState(false);
  const swipeRef = useRef<{ x: number; y: number; t: number; id: number; locked: "x" | "y" | null } | null>(null);

  // Défilement auto : arrêté si mouvement réduit, en pause au survol, au focus ou au toucher
  useEffect(() => {
    if (!isSlidePlaying || isHeroInteracting || reducedMotion) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isSlidePlaying, isHeroInteracting, reducedMotion, activeSlide]);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  // Geste de balayage : seuil de 10 px avant de choisir un axe, puis décision sur distance OU vitesse
  const onHeroPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    swipeRef.current = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, locked: null };
    setIsHeroInteracting(true);
  };
  const onHeroPointerMove = (e: React.PointerEvent) => {
    const s = swipeRef.current;
    if (!s || s.id !== e.pointerId || s.locked) return;
    const dx = Math.abs(e.clientX - s.x);
    const dy = Math.abs(e.clientY - s.y);
    if (dx > 10 || dy > 10) s.locked = dx > dy ? "x" : "y";
  };
  const onHeroPointerEnd = (e: React.PointerEvent) => {
    const s = swipeRef.current;
    swipeRef.current = null;
    setIsHeroInteracting(false);
    if (!s || s.id !== e.pointerId || s.locked !== "x") return;
    const dx = e.clientX - s.x;
    const velocity = dx / Math.max(1, performance.now() - s.t); // px/ms
    if (Math.abs(dx) > 60 || Math.abs(velocity) > 0.35) {
      if (dx < 0) nextSlide();
      else prevSlide();
    }
  };

  // ---- Témoignages : carrousel Embla (suivi 1:1 du doigt, élan, bords élastiques) ----
  const [testimonialsViewport, testimonialsApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    duration: reducedMotion ? 1 : 28,
  });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isTestimonialPlaying, setIsTestimonialPlaying] = useState(true);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);

  useEffect(() => {
    if (!testimonialsApi) return;
    const onSelect = () => setActiveTestimonial(testimonialsApi.selectedScrollSnap());
    onSelect();
    testimonialsApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      testimonialsApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [testimonialsApi]);

  useEffect(() => {
    if (!testimonialsApi || !isTestimonialPlaying || isTestimonialHovered || reducedMotion) return;
    if (testimonials.length < 2) return;
    const timer = setInterval(() => testimonialsApi.scrollNext(), 7000);
    return () => clearInterval(timer);
  }, [testimonialsApi, isTestimonialPlaying, isTestimonialHovered, reducedMotion, testimonials.length, activeTestimonial]);

  const goToTestimonial = (idx: number) => testimonialsApi?.scrollTo(idx);

  return (
    <>
      {/* Hero Section with 3-image Background Carousel & Integrated Dynamic Stats */}
      <section
        aria-roledescription="carrousel"
        aria-label="Présentation du réseau"
        className="relative overflow-hidden text-primary-foreground pt-14 pb-16 lg:pt-20 lg:pb-24 min-h-[580px] flex flex-col justify-center touch-pan-y"
        onPointerDown={onHeroPointerDown}
        onPointerMove={onHeroPointerMove}
        onPointerUp={onHeroPointerEnd}
        onPointerCancel={onHeroPointerEnd}
        onMouseEnter={() => setIsHeroInteracting(true)}
        onMouseLeave={() => setIsHeroInteracting(false)}
        onFocus={() => setIsHeroInteracting(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsHeroInteracting(false);
        }}
      >
        {/* Images de fond en fondu enchaîné */}
        <div className="absolute inset-0 select-none">
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                idx === activeSlide ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
              )}
              aria-hidden={idx !== activeSlide}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                draggable={false}
                className="h-full w-full object-cover object-center"
              />
            </div>
          ))}

          {/* Directional subtle dark & brand gradient overlay ensuring text readability while keeping the image clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#031422]/95 via-[#031422]/80 to-[#031422]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020d17] via-transparent to-black/45" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
          <div className="grid-pattern absolute inset-0 opacity-15" aria-hidden="true" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-md">
              <span>Réseau National RAFT · Côte d'Ivoire</span>
              <span className="text-white/40">|</span>
              <span className="text-brand-light font-bold">Santé Numérique</span>
            </div>

            <h1 className="text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-6xl tracking-tight text-white drop-shadow-md">
              Le soin spécialisé,{" "}
              <span className="text-brand-light">
                accessible partout sur le territoire.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-white/90 leading-relaxed drop-shadow-sm font-normal">
              Depuis 2004, le réseau ivoirien de télémédecine relie en continu les dispensaires et hôpitaux généraux aux cardiologues et spécialistes des CHU : interprétation d'ECG d'urgence en moins de 30 minutes, télé-expertise pluridisciplinaire et télé-formation certifiante.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary hover:bg-brand-hover text-white px-7 font-semibold shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 cursor-pointer"
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
                className="rounded-full border-white/30 bg-black/30 text-white backdrop-blur-md hover:bg-black/50 hover:text-white transition cursor-pointer"
              >
                <Link to="/annuaire">Trouver une structure</Link>
              </Button>
            </div>

            {/* Slide controls & current theme badge */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div
                className="inline-flex items-center gap-2 rounded-full bg-black/50 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20"
                aria-live="polite"
              >
                <span>{heroSlides[activeSlide]?.tag}</span>
              </div>

              {/* Commandes : chaque cible fait au moins 44 px grâce à une zone de clic étendue */}
              <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Diapositive précédente"
                  className="relative text-white/80 hover:text-white cursor-pointer after:absolute after:-inset-3.5 after:content-['']"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Aller à la diapositive ${idx + 1}`}
                      aria-current={idx === activeSlide}
                      className="relative flex h-1.5 items-center px-1 cursor-pointer after:absolute after:-inset-y-[19px] after:inset-x-0 after:content-['']"
                    >
                      <span
                        className={cn(
                          "block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out",
                          idx === activeSlide ? "w-6 bg-primary" : "w-2 bg-white/40 hover:bg-white/70"
                        )}
                      />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Diapositive suivante"
                  className="relative text-white/80 hover:text-white cursor-pointer after:absolute after:-inset-3.5 after:content-['']"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                {!reducedMotion && (
                  <button
                    type="button"
                    onClick={() => setIsSlidePlaying((p) => !p)}
                    aria-label={isSlidePlaying ? "Mettre le défilement en pause" : "Reprendre le défilement"}
                    className="relative ml-1 text-white/80 hover:text-white cursor-pointer after:absolute after:-inset-3.5 after:content-['']"
                  >
                    {isSlidePlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </button>
                )}
              </div>

              <div className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-white/80 bg-black/30 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                <Clock className="h-3.5 w-3.5 text-brand-light" />
                <span>Avis cardiologique en &lt; 28 min</span>
              </div>
            </div>
          </div>

          {/* Dynamic Impact Stats (directement dans l'Hero) */}
          <div className="mt-10 pt-7 border-t border-white/15">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <HeroStatCard
                value={4200}
                suffix="+"
                label="Télé-ECG réalisés"
                iconIndex={0}
              />
              <HeroStatCard
                value={projectSites.length > 0 ? projectSites.length : 24}
                suffix=""
                label="Sites connectés"
                iconIndex={1}
              />
              <HeroStatCard
                value={partners.length > 0 ? partners.length : 4}
                suffix=""
                label="Partenaires officiels"
                iconIndex={2}
              />
              <HeroStatCard
                value={860}
                suffix="+"
                label="Professionnels formés"
                iconIndex={3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="border-b border-border/80 bg-card py-4 shadow-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-6 px-4 text-xs font-semibold text-muted-foreground sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Conventionné Ministère de la Santé</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Membre officiel Réseau RAFT Afrique</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Matériel médical certifié CE / OMS</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Astreinte cardiologique 24h/24 7j/7</span>
          </div>
        </div>
      </div>

      {/* Section Historique : D'hier à aujourd'hui */}
      <section
        ref={histoireRef}
        className="relative overflow-hidden bg-background py-16 sm:py-24 border-b border-border/60"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Colonne Gauche : Texte & Récit (Animation d'entrée depuis la gauche) */}
            <div
              className={cn(
                "lg:col-span-7 space-y-6",
                histoireVisible && "animate-fade-up"
              )}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-strong dark:text-brand-light">
                <span>Genèse & Histoire Pionnière</span>
              </div>

              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl lg:text-[2.2rem] xl:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-[1.2]">
                <span className="block sm:whitespace-nowrap">
                  La Télémédecine En Côte D'Ivoire
                </span>
                <span className="block text-brand-strong dark:text-brand-light mt-1">
                  D'hier À Aujourd'hui
                </span>
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                En Côte d'Ivoire la Télémédecine a commencé par la formation médicale à distance en 2004 grâce à la rencontre entre Dr Benjamin GOLD et le Pr EHUA Somian Francis qui, à l'époque, était vice-doyen chargé de la pédagogie à l'UFR des sciences médicales d'Abidjan. Cette rencontre a permis au Pr Ehua de participer à une activité du Réseau en Afrique Francophone pour la Télémédecine (RAFT) à Bamako (Mali).
              </p>

              <div className="pt-2">
                <Button
                  asChild
                  className="rounded-full bg-primary hover:bg-brand-hover text-white px-7 py-3 font-semibold shadow-md shadow-primary/25 transition hover:-translate-y-0.5 cursor-pointer"
                >
                  <Link to="/a-propos">
                    Découvrir toute l'histoire
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Colonne Droite : Image historique (Animation d'entrée depuis la droite) */}
            <div
              className={cn(
                "lg:col-span-5 relative [animation-delay:80ms]",
                histoireVisible && "animate-fade-up"
              )}
            >
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Lueur d'ambiance en arrière-plan */}
                <div className="absolute -inset-4 rounded-3xl bg-primary/15 blur-3xl opacity-60 pointer-events-none" />

                {/* Cadre d'image unique soigné */}
                <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lift group transition duration-300 hover:shadow-2xl hover:border-primary/50">
                  <img
                    src={histoireRencontre2004}
                    alt="Pr EHUA Somian Francis et confrères lors de la rencontre fondatrice de 2004"
                    className="w-full h-auto max-h-[420px] object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-85" />

                  {/* Badge descriptif élégant en bas */}
                  <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white text-xs sm:text-sm font-semibold">
                    <span className="flex items-center gap-2">
                      2004 · Rencontre fondatrice avec le Pr Ehua
                    </span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-md border border-white/20 font-medium">
                      Archive historique
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Équipe et Pionniers */}
      <section ref={teamRef} className={cn("mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-border/70", teamVisible && "animate-fade-up")}>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-strong dark:text-brand-light">
            <span>Coordination RAFT & Pionniers</span>
          </div>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold sm:text-4xl text-foreground">
            Les pionniers de la télémédecine en Côte d'Ivoire
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Les figures historiques qui ont introduit et développé la formation médicale à distance et le télé-ECG depuis 2004.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => {
            const isOng = m.role?.toLowerCase().includes("ong") || m.name?.includes("DIBY");
            const isKpon = m.name?.includes("KPON");
            const memberPhoto = isKpon ? pioneerRkpon : m.image;
            const orgLabel = isOng ? "ONG Wake Up Africa" : "Réseau RAFT CI";
            const badgeType = isOng ? "Partenaire ONG" : "Pionnier";
            const periodLabel = isOng ? "Programme Télé-ECG" : "Depuis 2004";

            return (
              <div
                key={m.name}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/60"
              >
                {/* Photo portrait optimisée */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted">
                  {memberPhoto ? (
                    <img
                      src={memberPhoto}
                      alt={m.name}
                      width={400}
                      height={400}
                      className={cn(
                        "h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105",
                        isKpon ? "object-[center_20%]" : "object-top"
                      )}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-white font-bold text-3xl">
                      {m.initials}
                    </div>
                  )}

                  {/* Dégradé léger bas d'image */}
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card via-card/30 to-transparent" />

                  {/* Badge incrusté en haut à gauche */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-card/90 px-2.5 py-0.5 text-xs font-bold text-brand-strong dark:text-brand-light backdrop-blur-md shadow-xs border border-primary/25">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {badgeType}
                    </span>
                  </div>

                  {/* Pastille active en haut à droite */}
                  <div className="absolute top-3 right-3">
                    <span className="flex h-2.5 w-2.5">
                      <span className="inline-flex h-full w-full rounded-full bg-primary ring-2 ring-white dark:ring-card" />
                    </span>
                  </div>
                </div>

                {/* Contenu textuel concis & équilibré */}
                <div className="flex flex-1 flex-col justify-between p-4 pt-2.5">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold leading-snug text-foreground group-hover:text-brand-strong dark:group-hover:text-brand-light transition">
                      {m.name}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-strong dark:text-brand-light">
                      {m.role}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium leading-tight line-clamp-1">
                      {m.subRole}
                    </p>
                    <p className="pt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {m.bio}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-strong dark:text-brand-light bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {orgLabel}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {periodLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Actualités / Journal */}
      <section ref={articlesRef} className={cn("mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-border/70", articlesVisible && "animate-fade-up")}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-strong dark:text-brand-light">
              <span>Actualités & Recherches</span>
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold sm:text-4xl text-foreground">
              Dernières publications du réseau
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Retours d'expérience cliniques, bilans de programmes et avancées de la télémédecine.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full border-primary/40 hover:bg-primary/10 hover:text-brand-strong dark:hover:text-brand-light font-semibold">
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
              className="group flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/50"
            >
              <div className="aspect-16/10 overflow-hidden bg-muted">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="font-semibold bg-primary/10 text-brand-strong dark:text-brand-light border border-primary/20">
                      {a.category}
                    </Badge>
                    <time dateTime={a.date}>
                      {new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </time>
                  </div>
                  <h3 className="text-lg font-bold leading-snug text-foreground group-hover:text-brand-strong dark:group-hover:text-brand-light transition">
                    {a.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">{a.excerpt}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-brand-strong dark:text-brand-light">
                  <span>Lire l'article complet</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Carte & Couverture Nationale */}
      <section ref={mapRef} className={cn("bg-surface/60 py-20 border-b border-border/70", mapVisible && "animate-fade-up")}>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-strong dark:text-brand-light">
                <span>Maillage Territorial</span>
              </div>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold sm:text-4xl text-foreground tracking-tight">
                Un réseau qui s'étend d'Abidjan à Odienné
              </h2>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              La télémédecine ivoirienne permet d'abolir les distances géographiques. Les structures rurales disposent d'un accès direct aux équipes de cardiologie et de médecine interne des grands CHU universitaires.
            </p>

            <div className="space-y-3.5 rounded-2xl bg-card p-5 border border-border/80 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-brand-strong dark:text-brand-light text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">24 structures équipées et opérationnelles</p>
                  <p className="text-xs text-muted-foreground">CHU, Centres Hospitaliers Régionaux et Centres de Santé Ruraux.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-brand-strong dark:text-brand-light text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Astreinte cardiologique centralisée</p>
                  <p className="text-xs text-muted-foreground">Interprétation d'électrocardiogrammes 7 jours sur 7.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-brand-strong dark:text-brand-light text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Accompagnement et formation sur site</p>
                  <p className="text-xs text-muted-foreground">Mise à niveau continue des soignants et techniciens biomédicaux.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-primary hover:bg-brand-hover text-white shadow-soft font-semibold">
                <Link to="/projets">
                  Ouvrir la carte complète
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-border/80 hover:bg-muted font-semibold">
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
                <Badge className="bg-primary/15 text-brand-strong dark:text-brand-light font-semibold border-primary/30">
                  ● 24 Sites en ligne
                </Badge>
              </div>
              <LeafletMap sites={projectSites} activeId={null} onSelect={() => {}} />
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages - Les Acteurs Prennent La Parole */}
      <section
        ref={testimonialsRef}
        className={cn("bg-background py-20 border-b border-border/70 overflow-hidden", testimonialsVisible && "animate-fade-up")}
        onMouseEnter={() => setIsTestimonialHovered(true)}
        onMouseLeave={() => setIsTestimonialHovered(false)}
        onFocus={() => setIsTestimonialHovered(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsTestimonialHovered(false);
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 lg:p-12 shadow-soft">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              {/* Colonne Gauche : Titre, Sous-titre & Commandes */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-strong dark:text-brand-light">
                    <span>Témoignages & Retours Cliniques</span>
                  </div>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold sm:text-4xl text-foreground tracking-tight leading-tight">
                    Les acteurs prennent la parole
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Découvrez les retours d'expérience et l'impact quotidien de la télémédecine racontés par les médecins,
                    spécialistes et coordonnateurs du réseau RAFT.
                  </p>
                </div>

                {/* Commandes du carrousel (cibles de 44 px) */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => testimonialsApi?.scrollPrev()}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-surface text-foreground hover:border-primary hover:bg-primary hover:text-white cursor-pointer shadow-xs"
                    aria-label="Témoignage précédent"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => testimonialsApi?.scrollNext()}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-surface text-foreground hover:border-primary hover:bg-primary hover:text-white cursor-pointer shadow-xs"
                    aria-label="Témoignage suivant"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {!reducedMotion && (
                    <button
                      type="button"
                      onClick={() => setIsTestimonialPlaying((prev) => !prev)}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-surface text-muted-foreground hover:text-primary hover:border-primary/50 cursor-pointer shadow-xs"
                      aria-label={isTestimonialPlaying ? "Mettre en pause la rotation" : "Reprendre la rotation automatique"}
                    >
                      {isTestimonialPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                  )}

                  {testimonials.length > 0 && (
                    <span className="text-xs font-mono font-bold text-muted-foreground ml-2" aria-live="polite">
                      {String(activeTestimonial + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                    </span>
                  )}
                </div>
              </div>

              {/* Centre & Droite : carrousel glissable au doigt et à la souris */}
              <div className="lg:col-span-8 min-w-0">
                <div ref={testimonialsViewport} className="overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing">
                  <div className="flex touch-pan-y">
                    {testimonials.map((current, idx) => (
                      <div
                        key={current.author}
                        className="min-w-0 shrink-0 grow-0 basis-full"
                        role="group"
                        aria-roledescription="diapositive"
                        aria-label={`${idx + 1} sur ${testimonials.length}`}
                      >
                        <div className="flex h-full flex-col md:flex-row items-center gap-6 lg:gap-8 rounded-2xl bg-surface/60 p-6 sm:p-8 border border-border/60 select-none">
                          {/* Photo de l'acteur */}
                          <div className="shrink-0 relative">
                            <div className="relative h-44 w-44 sm:h-48 sm:w-48 overflow-hidden rounded-2xl border-2 border-primary/30 shadow-lift bg-slate-200">
                              <img
                                src={current.image}
                                alt={current.author}
                                draggable={false}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-card px-3 py-0.5 text-xs font-bold text-brand-strong dark:text-brand-light border border-primary/30 whitespace-nowrap shadow-xs">
                              Praticien certifié
                            </span>
                          </div>

                          {/* Citation et détails */}
                          <div className="flex-1 flex flex-col justify-between text-left">
                            <Quote className="h-8 w-8 text-primary/40 mb-2" aria-hidden="true" />
                            <blockquote className="text-sm sm:text-base leading-relaxed text-foreground font-medium italic">
                              « {current.quote} »
                            </blockquote>

                            <div className="mt-5 pt-4 border-t border-border/60">
                              <h4 className="text-lg font-black text-foreground tracking-tight">
                                {current.author}
                              </h4>
                              <p className="text-xs font-bold uppercase tracking-wider text-brand-strong dark:text-brand-light mt-0.5">
                                {current.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur rapide des acteurs (sert aussi de pagination) */}
            <div className="mt-8 pt-6 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {testimonials.map((t, idx) => {
                const isCurrent = idx === activeTestimonial;
                return (
                  <button
                    key={t.author}
                    type="button"
                    onClick={() => goToTestimonial(idx)}
                    aria-current={isCurrent}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-2xl border p-2.5 text-left cursor-pointer",
                      isCurrent
                        ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/30"
                        : "border-border/70 bg-card hover:border-primary/40 hover:bg-primary/5"
                    )}
                  >
                    <img
                      src={t.image}
                      alt=""
                      className="h-10 w-10 rounded-xl object-cover shrink-0 shadow-xs border border-border"
                    />
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-foreground truncate">{t.author}</span>
                      <span className="block text-xs text-muted-foreground truncate">{t.role}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Partenaires Officiels - Les 4 Partenaires Stratégiques */}
      <section className="border-b border-border/80 bg-surface/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-strong dark:text-brand-light">
              <span>Partenaires Stratégiques</span>
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Les 4 partenaires officiels du réseau
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Une alliance institutionnelle, technologique et académique au service de la santé publique en Côte d'Ivoire.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 lg:p-10 shadow-soft">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border/80">
              {partners.map((p, idx) => (
                <div
                  key={p.name}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 text-center group transition",
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
                    <span className="block text-xs font-bold text-foreground leading-snug group-hover:text-brand-strong dark:group-hover:text-brand-light transition">
                      {p.name}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5 line-clamp-1">
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-strong dark:text-brand-light hover:underline"
            >
              Consulter les conventions de partenariat & détails institutionnels
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section CTA Finale : Raccordement & Coopération Sanitaire */}
      <section
        ref={ctaRef}
        className={cn(
          "relative overflow-hidden bg-background py-20 sm:py-24",
          ctaVisible && "animate-fade-up"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-[#16270e] via-[#1d3513] to-[#0e1a09] px-6 py-14 sm:px-12 sm:py-16 text-center text-white shadow-2xl">
            {/* Halos lumineux d'ambiance */}
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

            <div className="relative mx-auto max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                <span>Déploiement National & Adhésion</span>
              </div>

              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Vous représentez une structure de santé ou une équipe médicale ?
              </h2>

              <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
                Rejoignez le réseau national RAFT Côte d'Ivoire. Bénéficiez du raccordement au Télé-ECG d'urgence, de l'accès aux avis de cardiologues CHU 24h/24 et de programmes de formation continue accrédités.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-primary hover:bg-brand-hover text-white px-8 py-3.5 font-bold shadow-lg shadow-primary/35 transition hover:-translate-y-0.5 cursor-pointer"
                >
                  <Link to="/contact">
                    Demander un raccordement de site
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white transition cursor-pointer font-semibold"
                >
                  <Link to="/annuaire">
                    Consulter les 24 centres connectés
                  </Link>
                </Button>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}