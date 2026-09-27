import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Award,
  Users,
  Calendar,
  Laptop,
  HeartPulse,
  BookOpen,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Video,
  Monitor,
  Volume2,
  Maximize2,
  X,
  Building2,
  Network,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Layers,
  Sparkles,
  Quote,
  Clock,
  Radio,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { images } from "@/data/site";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos du RAFT Côte d'Ivoire — Historique, Équipe & Missions" },
      {
        name: "description",
        content:
          "Découvrez le Réseau en Afrique Francophone pour la Télémédecine (RAFT) en Côte d'Ivoire : genèse depuis 2003, équipe pionnière, télé-formation DUDAL, télé-expertise et équipements déployés.",
      },
      { property: "og:title", content: "À propos du RAFT Côte d'Ivoire — Historique, Équipe & Missions" },
      {
        property: "og:description",
        content:
          "Lutter contre les déserts médicaux et former les soignants à distance : découvrez l'histoire et les engagements du RAFT en Côte d'Ivoire.",
      },
    ],
  }),
  component: AProposPage,
});

type LightboxImage = {
  src: string;
  title: string;
  caption: string;
  year?: string;
  credit?: string;
};

const timelineMilestones = [
  {
    year: "2003",
    badge: "Genèse Panafricaine",
    location: "Mali & Genève",
    title: "Naissance du RAFT en Afrique",
    desc: "Le projet RAFT débute ses activités au Mali sous l'égide des Hôpitaux Universitaires de Genève (HUG). L'objectif est de relier les médecins isolés et de désenclaver les centres périphériques africains par des technologies adaptées au bas débit.",
    fact: "Premières télé-formations diffusées par liaisons satellites et internet bas débit.",
    icon: Network,
  },
  {
    year: "2005",
    badge: "Adhésion Officielle",
    location: "Abidjan (UFR Médicale)",
    title: "Intégration de la Côte d'Ivoire",
    desc: "La Côte d'Ivoire rejoint officiellement le réseau RAFT sous la conduite du Pr EHUA Somian Francis, alors vice-doyen de l'UFR des Sciences Médicales d'Abidjan. Structuration du point focal national et aménagement du Centre de Télémédecine au CHU de Yopougon.",
    fact: "Lancement des premiers cycles de télé-enseignement médical interactif régulier.",
    icon: CheckCircle2,
  },
  {
    year: "2007",
    badge: "Société Savante",
    location: "Abidjan",
    title: "Création de la SIBIM",
    desc: "Fondation de la Société Ivoirienne de Biosciences et d'Informatique Médicale (SIBIM) sous l'égide du Dr Innocent NANAN. La SIBIM devient le moteur scientifique, déontologique et méthodologique de la santé numérique ivoirienne.",
    fact: "Établissement du cadre éthique et légal pour la consultation médicale à distance.",
    icon: ShieldCheck,
  },
  {
    year: "2009",
    badge: "Congrès International",
    location: "VITIB, Grand-Bassam",
    title: "Congrès africain d'informatique médicale",
    desc: "La Côte d'Ivoire organise avec éclat le congrès africain d'informatique médicale au VITIB à Bassam, réunissant des délégations scientifiques de plus de 15 pays et démontrant la viabilité de la télémédecine en Afrique subsaharienne.",
    fact: "Reconnaissance internationale du leadership ivoirien dans le réseau francophone.",
    icon: Building2,
  },
  {
    year: "2013",
    badge: "Jubilé Décennal",
    location: "Krindjabo (Aboisso)",
    title: "Célébration des 10 ans du RAFT à Krindjabo",
    desc: "Célébration des dix premières années du réseau panafricain tenue à Krindjabo en terre Sanwi, marquant une décennie d'innovations solidaires et d'engagements auprès des soignants de brousse.",
    fact: "Hommage solennel rendu aux pionniers médicaux et aux communautés d'accueil.",
    icon: Award,
  },
  {
    year: "2014",
    badge: "Phase Pilote Télé-ECG",
    location: "CHU de Yopougon & 9 sites",
    title: "Atelier de Yopougon & 9 Kits MEDICO NET",
    desc: "Après un atelier intensif au Centre de Télémédecine de Yopougon, 9 structures régionales de santé sont dotées en Kit MEDICO NET pour la phase pilote du projet de télé-expertise en cardiologie, reliées au CHU de Bouaké.",
    fact: "Premiers diagnostics à distance d'infarctus évitant des évacuations sanitaires critiques.",
    icon: HeartPulse,
  },
  {
    year: "2019",
    badge: "Intelligence Artificielle",
    location: "Paris (Doc&You / Cardiologs)",
    title: "Formation Cardiologs & Plateforme ResoDoc",
    desc: "Formation à Paris au 136 rue Saint-Denis de la délégation ivoirienne (Prof ADOUBI, Dr DIBY Florent, M. Roger KPON) sur l'assistance à l'interprétation des ECG par IA pour la phase 2 du projet Télé-ECG.",
    fact: "Intégration d'algorithmes pré-diagnostiques pour assister les médecins isolés.",
    icon: Laptop,
  },
  {
    year: "2026",
    badge: "Réseau National Souverain",
    location: "National (24 structures)",
    title: "24 sites connectés & astreinte 24h/24",
    desc: "Plus de 4 200 examens réalisés, 860 professionnels formés et un maillage territorial consolidé avec le Ministère de la Santé, l'ANSUT et le Centre Suisse de Recherches Scientifiques (CSRS).",
    fact: "Souveraineté des données médicales et prise en charge équitable sur toute la Côte d'Ivoire.",
    icon: Sparkles,
  },
];

const teamPillars = [
  {
    role: "Point Focal National",
    name: "Professeur EHUA Somian Francis",
    status: "Pionnier historique",
    title: "Professeur Titulaire en Sciences Médicales",
    bio: "Pionnier fondateur de la télémédecine en Côte d'Ivoire dès 2004 suite à sa rencontre avec le Dr Benjamin Gold. Ancien vice-doyen de l'UFR d'Abidjan, il impulse la vision pédagogique et l'ancrage institutionnel du réseau RAFT.",
    tag: "Gouvernance & Pédagogie",
    accent: "border-[#74a638] bg-[#74a638]/5",
  },
  {
    role: "Coordonnateur Médical",
    name: "Dr. Innocent NANAN",
    status: "Directeur Clinique",
    title: "Président de la SIBIM",
    bio: "Spécialiste d'informatique médicale et président de la Société Ivoirienne de Biosciences et d'Informatique Médicale (SIBIM). Il garantit la rigueur clinique, déontologique et l'évaluation continue des protocoles de télé-expertise.",
    tag: "Coordination Clinique",
    accent: "border-[#5e8c2a] bg-[#5e8c2a]/5",
  },
  {
    role: "Coordonnateur Technique",
    name: "Mr Roger KPON",
    status: "Architecte Réseau & Systèmes",
    title: "Chef de service TIC au CSRS",
    bio: "Chef de service Technologie & Système d'Information au Centre Suisse de Recherches Scientifiques en Côte d'Ivoire (CSRS). Maître d'œuvre de l'architecture télécoms, de la sécurité logicielle et de l'interopérabilité des sites.",
    tag: "Technologies & Systèmes",
    accent: "border-cyan-600 bg-cyan-50/50 dark:bg-cyan-950/20",
  },
];

const kitTeleFormation = [
  { name: "Ordinateur portable", desc: "Poste multimédia configuré pour la réception fluide des cours interactifs", icon: Laptop },
  { name: "Vidéoprojecteur", desc: "Projection grand format pour les séances collectives hospitalières", icon: Monitor },
  { name: "Onduleur haute sécurité", desc: "Autonomie électrique et protection contre les variations de tension", icon: ShieldCheck },
  { name: "Webcam HD", desc: "Prise de vue grand-angle pour l'interactivité salle-orateur", icon: Video },
  { name: "Casque & microphone", desc: "Précision acoustique lors des séances de questions-réponses en direct", icon: Volume2 },
  { name: "Écran de projection", desc: "Toile de rétro-projection optimisée pour les amphithéâtres régionaux", icon: Maximize2 },
];

const kitMedicoNet = [
  { name: "Module d'acquisition ECG 12 pistes", desc: "Enregistrement numérique instantané conforme aux normes cardiologiques", icon: HeartPulse },
  { name: "Logiciel de télé-expertise sécurisé", desc: "Transmission cryptée des tracés vers les cardiologues du CHU de Bouaké", icon: ShieldCheck },
  { name: "Liaison de communication dédiée", desc: "Synchronisation opérationnelle même en bas débit sur réseau 3G/4G", icon: Network },
  { name: "Station praticien périphérique", desc: "Interface simplifiée pour infirmiers et médecins de garde en district", icon: Laptop },
];

function AProposPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<LightboxImage | null>(null);

  // Animated Timeline State
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [timelineView, setTimelineView] = useState<"interactive" | "overview">("interactive");

  // Equipment active tab state
  const [activeKitTab, setActiveKitTab] = useState<"formation" | "mediconet">("formation");

  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: introRef, isVisible: introVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: teamRef, isVisible: teamVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: objRef, isVisible: objVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: eqRef, isVisible: eqVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: timeRef, isVisible: timeVisible } = useIntersectionObserver<HTMLDivElement>();

  // Timeline Auto-play Loop
  useEffect(() => {
    if (!isPlaying || timelineView !== "interactive") {
      setProgress(0);
      return;
    }

    const duration = 5000; // 5s per slide
    const intervalTime = 50; // update progress every 50ms
    const stepIncrement = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((curr) => (curr + 1) % timelineMilestones.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, activeStep, timelineView]);

  const handleSelectMilestone = (idx: number) => {
    setActiveStep(idx);
    setProgress(0);
  };

  const handleNextMilestone = () => {
    setActiveStep((prev) => (prev + 1) % timelineMilestones.length);
    setProgress(0);
  };

  const handlePrevMilestone = () => {
    setActiveStep((prev) => (prev - 1 + timelineMilestones.length) % timelineMilestones.length);
    setProgress(0);
  };

  const activeMilestone = timelineMilestones[activeStep];
  const MilestoneIcon = activeMilestone.icon;

  return (
    <>
      {/* Header Banner - Ultra-refined Designer Aesthetics */}
      <header
        ref={headerRef}
        className={cn(
          "surface-hero relative overflow-hidden text-primary-foreground py-16 sm:py-24 lg:py-28",
          headerVisible && "animate-fade-up"
        )}
      >
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>En Savoir Plus</span>
            <span className="text-primary-foreground/40">•</span>
            <span className="text-primary-foreground/80">Portail Officiel RAFT Côte d'Ivoire</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-4xl leading-[1.12]">
            Le RAFT Côte d'Ivoire :{" "}
            <span className="text-transparent bg-gradient-to-r from-cyan-200 via-teal-100 to-amber-200 bg-clip-text">
              l'histoire pionnière
            </span>{" "}
            de la médecine connectée.
          </h1>

          <p className="mt-6 max-w-3xl text-base sm:text-lg lg:text-xl text-primary-foreground/85 leading-relaxed font-normal">
            Depuis 2003 en Afrique et 2005 en Côte d'Ivoire, le réseau RAFT rompt l'isolement des soignants en milieu rural à travers le télé-enseignement hebdomadaire, la télé-expertise clinique et des technologies conçues pour résister aux contraintes du terrain.
          </p>

          {/* Quick jump navigation pills */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {[
              { href: "#histoire", label: "Origine du RAFT" },
              { href: "#equipe", label: "L'Équipe Pionnière" },
              { href: "#objectifs", label: "Objectifs & E-cours" },
              { href: "#equipements", label: "Équipements & Kits" },
              { href: "#chronologie", label: "Chronologie Interactive" },
            ].map((btn) => (
              <a
                key={btn.href}
                href={btn.href}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-4 py-2 text-xs font-semibold text-primary-foreground/90 backdrop-blur-md border border-primary-foreground/15 hover:bg-primary-foreground/20 hover:text-white transition-all shadow-xs"
              >
                {btn.label}
              </a>
            ))}
          </div>

          {/* Key metrics grid - Executive Card Design */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-primary-foreground/15 pt-8">
            <div className="rounded-2xl bg-primary-foreground/5 p-4 border border-primary-foreground/10 backdrop-blur-xs">
              <div className="text-3xl sm:text-4xl font-black text-accent tracking-tight">2003</div>
              <div className="text-xs text-primary-foreground/80 mt-1 font-semibold">Genèse Panafricaine (Mali)</div>
            </div>
            <div className="rounded-2xl bg-primary-foreground/5 p-4 border border-primary-foreground/10 backdrop-blur-xs">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">2005</div>
              <div className="text-xs text-primary-foreground/80 mt-1 font-semibold">Intégration Côte d'Ivoire</div>
            </div>
            <div className="rounded-2xl bg-primary-foreground/5 p-4 border border-primary-foreground/10 backdrop-blur-xs">
              <div className="text-3xl sm:text-4xl font-black text-cyan-300 tracking-tight">10+</div>
              <div className="text-xs text-primary-foreground/80 mt-1 font-semibold">Centres pionniers outillés</div>
            </div>
            <div className="rounded-2xl bg-primary-foreground/5 p-4 border border-primary-foreground/10 backdrop-blur-xs">
              <div className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">24/7</div>
              <div className="text-xs text-primary-foreground/80 mt-1 font-semibold">Astreinte & Permanence ECG</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-28">

        {/* SECTION 1: Le RAFT Côte d'Ivoire (Genèse & Histoire) */}
        <section id="histoire" ref={introRef} className={cn("scroll-mt-24", introVisible && "animate-fade-up")}>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-[#5e8c2a]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#5e8c2a] dark:text-[#8bc34a]">
                  En Savoir Plus
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
                Le RAFT Côte D'Ivoire
              </h2>

              {/* Exact user text highlight callout */}
              <div className="relative overflow-hidden rounded-3xl border-l-4 border-[#74a638] bg-surface/90 p-6 sm:p-7 shadow-xs">
                <Quote className="absolute right-4 top-4 h-14 w-14 text-muted-foreground/10 pointer-events-none" />
                <p className="text-lg sm:text-xl font-semibold leading-relaxed text-foreground">
                  « Le RAFT Côte d'Ivoire. C'est en 2003, que le projet RAFT a débuté ses activités en Afrique. Parti du Mali, le RAFT regroupe aujourd'hui plusieurs pays. La Côte d'Ivoire a intégré le réseau RAFT en 2005. »
                </p>
              </div>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Le Réseau en Afrique Francophone pour la Télémédecine (RAFT) s'est imposé comme l'initiative pionnière de santé numérique la plus pérenne du continent. Face aux pénuries de spécialistes hors des grandes agglomérations, le RAFT a développé une approche résolument pragmatique : relier les praticiens de terrain aux hôpitaux universitaires grâce à des technologies peu gourmandes en bande passante.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs hover:border-[#74a638]/50 transition-colors">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-foreground mb-1.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#74a638]/15 text-[#5e8c2a]">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    Début au Mali (2003)
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Initiative partie de Bamako et Genève, étendue progressivement à plus de 20 pays d'Afrique subsaharienne.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs hover:border-[#74a638]/50 transition-colors">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-foreground mb-1.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#74a638]/15 text-[#5e8c2a]">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    Adhésion Ivoirienne (2005)
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Portée par la faculté de médecine d'Abidjan et le Centre de Télémédecine du CHU de Yopougon.
                  </p>
                </div>
              </div>
            </div>

            {/* Photo Card with zoom */}
            <div className="lg:col-span-5">
              <div
                onClick={() =>
                  setSelectedPhoto({
                    src: images.aproposEquipe,
                    title: "L'équipe pionnière du RAFT Côte d'Ivoire",
                    caption:
                      "L'équipe pionnière de coordination et les chercheurs réunis devant le centre de télémédecine, incarnant l'alliance entre médecins, universitaires et ingénieurs des systèmes d'information.",
                    year: "Historique RAFT CI",
                    credit: "Coordination RAFT Côte d'Ivoire",
                  })
                }
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft hover:shadow-lift transition-all duration-300"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  <img
                    src={images.aproposEquipe}
                    alt="Le RAFT Côte d'Ivoire - Équipe pionnière"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="font-bold flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#8bc34a]" /> Équipe pionnière RAFT CI
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md border border-white/20 font-medium">
                      <Maximize2 className="h-3 w-3" /> Agrandir
                    </span>
                  </div>
                </div>
                <div className="p-4 border-t border-border/60 bg-card text-xs text-muted-foreground leading-relaxed">
                  Coordination nationale réunie pour le déploiement des activités de santé numérique en Côte d'Ivoire.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: L'Équipe RAFT Côte d'Ivoire & Gouvernance */}
        <section id="equipe" ref={teamRef} className={cn("scroll-mt-24", teamVisible && "animate-fade-up")}>
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="eyebrow text-[#5e8c2a] dark:text-[#8bc34a]">Gouvernance & Leadership</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              L'Équipe RAFT Côte d'Ivoire
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Une gouvernance multidisciplinaire alliant expertise médicale universitaire, informatique clinique et ingénierie des télécommunications.
            </p>
          </div>

          {/* Text verbatim quote from Image 1 with studio card */}
          <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-surface/80 p-6 sm:p-10 shadow-soft">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8 space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5e8c2a] dark:text-[#8bc34a]">
                  <ShieldCheck className="h-4 w-4" /> Coordination Nationale Officielle
                </div>

                <p className="text-lg sm:text-xl font-medium text-foreground leading-relaxed">
                  « L'équipe RAFT Côte d'Ivoire est composé d'un point focal, le professeur <strong>EHUA Somian Francis</strong>, d'un coordonnateur médical, le <strong>Dr. Innocent NANAN</strong> et d'un coordonnateur technique <strong>Mr Roger KPON</strong>, chef de service technologie et système d'information au Centre Suisse de Recherches Scientifiques en Côte d'Ivoire. »
                </p>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  « Cette équipe a participé à plusieurs ateliers de formation organisés par le RAFT à travers l'Afrique. En 2009, la Côte d'Ivoire a organisé le congrès africain d'informatique médical au <strong>VITIB à Bassam</strong> et en 2013, la Côte d'Ivoire a célébré les <strong>10 ans du RAFT à KRINDJABO</strong>. »
                </p>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  <Badge variant="outline" className="text-xs font-semibold py-1.5 px-3.5 rounded-full border-[#74a638]/40 bg-[#74a638]/5">
                    <Calendar className="mr-1.5 h-3.5 w-3.5 text-[#5e8c2a]" /> 2009 : Congrès VITIB Bassam
                  </Badge>
                  <Badge variant="outline" className="text-xs font-semibold py-1.5 px-3.5 rounded-full border-[#74a638]/40 bg-[#74a638]/5">
                    <Award className="mr-1.5 h-3.5 w-3.5 text-[#5e8c2a]" /> 2013 : 10 ans à Krindjabo
                  </Badge>
                  <Badge variant="outline" className="text-xs font-semibold py-1.5 px-3.5 rounded-full border-[#74a638]/40 bg-[#74a638]/5">
                    <Building2 className="mr-1.5 h-3.5 w-3.5 text-[#5e8c2a]" /> Partenariat CSRS
                  </Badge>
                </div>
              </div>

              {/* Studio photo card */}
              <div className="lg:col-span-4">
                <div
                  onClick={() =>
                    setSelectedPhoto({
                      src: images.aproposStudio,
                      title: "Intervention médiatique & plaidoyer e-santé",
                      caption:
                        "Intervention sur plateau télévisé pour la vulgarisation des bénéfices de la télémédecine, la formation continue et l'accès universel aux spécialistes médicaux en Côte d'Ivoire.",
                      year: "Plaidoyer Médiatique",
                      credit: "Plateau TV — Sensibilisation RAFT CI",
                    })
                  }
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft hover:shadow-lift transition-all"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-muted">
                    <img
                      src={images.aproposStudio}
                      alt="Intervention télévisée de la coordination RAFT"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-bold flex items-center gap-1.5">
                        <Video className="h-3.5 w-3.5 text-[#8bc34a]" /> Diffusion & Médias
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 border border-white/20 text-[11px]">
                        <Maximize2 className="h-3 w-3" /> Voir
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 text-xs text-muted-foreground bg-card border-t border-border/60">
                    Sensibilisation nationale sur le réseau RAFT et l'e-santé.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Pillars Executive Cards */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {teamPillars.map((p) => (
              <Card key={p.name} className={cn("rounded-3xl border transition-all duration-300 hover:shadow-lift", p.accent)}>
                <CardContent className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-[#74a638] text-white text-xs font-bold px-3 py-1">
                      {p.tag}
                    </Badge>
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      {p.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-foreground">{p.name}</h3>
                    <p className="text-xs font-semibold text-[#5e8c2a] dark:text-[#8bc34a] mt-0.5">{p.title}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                    {p.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SECTION 3: Objectifs Du Projet RAFT — High-res Photo Geissbuhler & Ehua */}
        <section id="objectifs" ref={objRef} className={cn("scroll-mt-24", objVisible && "animate-fade-up")}>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* New High-Res Photo: Geissbuhler & Ehua */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div
                onClick={() =>
                  setSelectedPhoto({
                    src: images.aproposGeissbuhlerEhua,
                    title: "Prof. Antoine Geissbuhler & Prof. EHUA Somian Francis",
                    caption:
                      "Rencontre au sommet entre le Prof. Antoine Geissbuhler (Fondateur du RAFT mondial, Hôpitaux Universitaires de Genève) et le Prof. Francis Somian EHUA (Point Focal RAFT Côte d'Ivoire), scellant l'alliance académique et technologique pour la télémédecine.",
                    year: "Alliance Internationale",
                    credit: "HUG Genève × RAFT Côte d'Ivoire",
                  })
                }
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft hover:shadow-lift transition-all duration-300"
              >
                <div className="relative aspect-4/5 max-h-[520px] overflow-hidden bg-muted">
                  <img
                    src={images.aproposGeissbuhlerEhua}
                    alt="Prof Antoine Geissbuhler et Prof Francis Ehua"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#74a638] text-white text-xs font-bold shadow-md">
                      Pionniers Mondiaux
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-[#8bc34a]" /> HUG Genève & RAFT Côte d'Ivoire
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md border border-white/20 font-medium">
                      <Maximize2 className="h-3 w-3" /> Agrandir
                    </span>
                  </div>
                </div>
                <div className="p-4 border-t border-border/60 bg-card text-xs text-muted-foreground leading-relaxed">
                  Pr Antoine Geissbuhler (Genève) et Pr Francis Ehua (Abidjan) : les fondateurs de la coopération médicale connectée.
                </div>
              </div>
            </div>

            {/* Content text verbatim */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-[#5e8c2a]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#5e8c2a] dark:text-[#8bc34a]">
                  Mission Fondamentale
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
                Objectifs Du Projet RAFT
              </h2>

              <div className="rounded-3xl border-l-4 border-[#74a638] bg-surface/90 p-6 sm:p-7 shadow-xs">
                <p className="text-lg sm:text-xl font-semibold leading-relaxed text-foreground">
                  « L'objectif principal du RAFT est de lutter contre le désert médical. Ainsi le professionnel de la santé, éloigné des grandes métropoles ne se sent plus isoler. Il voit ses capacités professionnelles renforcées à travers les cours de télé enseignement diffusés chaque jeudis à partir de 09h TU. Ces E-cours ne nécessitant pas de grand débit de la connexion Internet est suivi par des milliers de professionnels de la santé. »
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2 shadow-xs hover:border-[#74a638]/50 transition-colors">
                  <div className="flex items-center gap-2.5 font-bold text-foreground text-sm">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#74a638]/15 text-[#5e8c2a]">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    E-cours chaque jeudi (09h TU)
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Des sessions interactives hebdomadaires dispensées par des spécialistes africains et internationaux, permettant une formation médicale continue certifiante.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2 shadow-xs hover:border-[#74a638]/50 transition-colors">
                  <div className="flex items-center gap-2.5 font-bold text-foreground text-sm">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#74a638]/15 text-[#5e8c2a]">
                      <Network className="h-4 w-4" />
                    </span>
                    Optimisation bas débit (DUDAL)
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    La technologie DUDAL fonctionne même sur des débits Internet limités, garantissant un accès équitable aux praticiens exerçant dans les zones les plus enclavées.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Équipements & Phase Pilote Télé-ECG — High-res Photo Ehua on the field */}
        <section id="equipements" ref={eqRef} className={cn("scroll-mt-24", eqVisible && "animate-fade-up")}>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-[#5e8c2a]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#5e8c2a] dark:text-[#8bc34a]">
                  Déploiement Matériel & Clinique
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
                Équipement des Structures & Phase Pilote Télé-ECG
              </h2>

              <div className="rounded-3xl border-l-4 border-[#74a638] bg-surface/90 p-6 sm:p-7 shadow-xs">
                <p className="text-base sm:text-lg font-semibold leading-relaxed text-foreground">
                  « Grace au financement du RAFT, en Côte d'Ivoire, plus de 10 structures de santé ont été équipées en matériel pour les activités de télé formation. Chaque site bénéficiaire a reçu un ordinateur portable, un vidéo projecteur, un onduleur, une Webcam, un casque et un écran de projection. »
                </p>
              </div>

              <div className="rounded-3xl border border-border/80 bg-card p-6 text-sm text-foreground space-y-3 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-base text-[#5e8c2a] dark:text-[#8bc34a]">
                  <HeartPulse className="h-5 w-5" /> Phase Pilote 2014 au Centre de Télémédecine du CHU de Yopougon
                </div>
                <p className="leading-relaxed text-muted-foreground text-sm">
                  « En 2014, après un atelier de formation au centre de télé medecine de Yopougon, neuf structures de santé été équipées en <strong>KIT MEDICO NET</strong> pour la phase pilote du projet de télé expertise en cardiologie. »
                </p>
              </div>

              {/* Interactive Kit Switcher */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                  <Button
                    size="sm"
                    variant={activeKitTab === "formation" ? "default" : "outline"}
                    onClick={() => setActiveKitTab("formation")}
                    className="rounded-full text-xs font-bold"
                  >
                    Kit Télé-formation (10+ structures)
                  </Button>
                  <Button
                    size="sm"
                    variant={activeKitTab === "mediconet" ? "default" : "outline"}
                    onClick={() => setActiveKitTab("mediconet")}
                    className="rounded-full text-xs font-bold"
                  >
                    Kit Médico Net Télé-ECG (9 structures)
                  </Button>
                </div>

                {activeKitTab === "formation" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {kitTeleFormation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.name} className="rounded-2xl border border-border/70 bg-card p-3.5 space-y-1.5 shadow-xs hover:border-[#74a638]/50 transition-colors">
                          <Icon className="h-4 w-4 text-[#5e8c2a]" />
                          <div className="text-xs font-bold text-foreground">{item.name}</div>
                          <p className="text-[11px] text-muted-foreground leading-tight">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {kitMedicoNet.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.name} className="rounded-2xl border border-border/70 bg-card p-4 space-y-1.5 shadow-xs hover:border-[#74a638]/50 transition-colors">
                          <Icon className="h-4 w-4 text-[#5e8c2a]" />
                          <div className="text-xs font-bold text-foreground">{item.name}</div>
                          <p className="text-xs text-muted-foreground leading-tight">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Photo Ehua on the field - Full High-Res Portrait */}
            <div className="lg:col-span-5">
              <div
                onClick={() =>
                  setSelectedPhoto({
                    src: images.aproposEhuaTerrain,
                    title: "Prof. EHUA Somian Francis sur le terrain",
                    caption:
                      "Le Professeur Francis Somian EHUA lors d'une mission de prospection et d'évaluation sanitaire dans les districts reculés de Côte d'Ivoire, démontrant l'engagement de proximité auprès des praticiens de brousse.",
                    year: "Mission de Terrain",
                    credit: "Archives Coordination RAFT Côte d'Ivoire",
                  })
                }
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft hover:shadow-lift transition-all duration-300"
              >
                <div className="relative aspect-4/5 max-h-[520px] overflow-hidden bg-muted">
                  <img
                    src={images.aproposEhuaTerrain}
                    alt="Prof Francis Ehua en mission de terrain"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#74a638] text-white text-xs font-bold shadow-md">
                      Engagement de Terrain
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-[#8bc34a]" /> Mission de terrain RAFT CI
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md border border-white/20 font-medium">
                      <Maximize2 className="h-3 w-3" /> Agrandir
                    </span>
                  </div>
                </div>
                <div className="p-4 border-t border-border/60 bg-card text-xs text-muted-foreground leading-relaxed">
                  Pr Francis Ehua, pionnier de la télémédecine, en déplacement auprès des soignants de l'intérieur du pays.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: ANIMATED INTERACTIVE CHRONOLOGY — State-of-the-Art Pro Designer Experience */}
        <section id="chronologie" ref={timeRef} className={cn("scroll-mt-24", timeVisible && "animate-fade-up")}>
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 lg:p-12 shadow-soft relative overflow-hidden">
            {/* Background glowing decorations */}
            <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#74a638]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

            {/* Header with Controls */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-border/80">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5e8c2a] dark:text-[#8bc34a]">
                  <Radio className="h-3.5 w-3.5 animate-pulse text-[#74a638]" />
                  <span>Chronologie Interactive & Animée</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
                  20 Ans d'Histoire & de Jalons Majeurs
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Explorez pas à pas l'évolution du réseau, de la genèse panafricaine en 2003 aux algorithmes d'IA en 2026.
                </p>
              </div>

              {/* View & Player Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-border bg-muted/40 p-1">
                  <button
                    type="button"
                    onClick={() => setTimelineView("interactive")}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                      timelineView === "interactive"
                        ? "bg-[#74a638] text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Mode Interactif
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimelineView("overview")}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                      timelineView === "overview"
                        ? "bg-[#74a638] text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Vue d'ensemble
                  </button>
                </div>

                {timelineView === "interactive" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="rounded-full text-xs font-semibold gap-1.5 shadow-xs"
                    title={isPlaying ? "Mettre en pause l'animation" : "Lancer le défilement automatique"}
                  >
                    {isPlaying ? <Pause className="h-3.5 w-3.5 text-[#5e8c2a]" /> : <Play className="h-3.5 w-3.5 text-[#5e8c2a]" />}
                    <span>{isPlaying ? "Pause" : "Auto-lecture"}</span>
                  </Button>
                )}
              </div>
            </div>

            {/* INTERACTIVE MODE */}
            {timelineView === "interactive" ? (
              <div className="pt-8 space-y-8">
                {/* Horizontal Stepper Track with Progress Indicator */}
                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-border/60 rounded-full" />
                  <div
                    className="hidden sm:block absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-[#74a638] rounded-full transition-all duration-300"
                    style={{
                      width: `${(activeStep / (timelineMilestones.length - 1)) * 100}%`,
                    }}
                  />

                  {/* Milestones Buttons Bar */}
                  <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 sm:pb-0 scrollbar-none">
                    {timelineMilestones.map((m, idx) => {
                      const isActive = idx === activeStep;
                      const isPast = idx < activeStep;
                      return (
                        <button
                          key={m.year}
                          type="button"
                          onClick={() => handleSelectMilestone(idx)}
                          className={cn(
                            "relative z-10 flex flex-col items-center gap-1.5 transition-all outline-none cursor-pointer group shrink-0 px-2 py-1",
                            isActive ? "scale-105" : "opacity-75 hover:opacity-100"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl font-black text-xs sm:text-sm transition-all duration-300 shadow-xs",
                              isActive
                                ? "bg-[#74a638] text-white ring-4 ring-[#74a638]/25 shadow-md scale-110"
                                : isPast
                                ? "bg-card border-2 border-[#74a638] text-[#5e8c2a]"
                                : "bg-card border-2 border-border text-muted-foreground group-hover:border-[#74a638]/60"
                            )}
                          >
                            {m.year}
                          </div>
                          <span
                            className={cn(
                              "text-[10px] sm:text-[11px] font-bold whitespace-nowrap max-w-[80px] sm:max-w-none text-center truncate",
                              isActive ? "text-[#5e8c2a] dark:text-[#8bc34a]" : "text-muted-foreground"
                            )}
                          >
                            {m.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Animated Progress Bar for Auto-play */}
                {isPlaying && (
                  <div className="h-1 w-full bg-border/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#74a638] to-cyan-500 transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Active Milestone Card — Rich Showcase */}
                <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 sm:p-10 shadow-soft transition-all duration-500 rise-in">
                  <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className="bg-[#74a638] text-white font-bold text-xs px-3 py-1">
                          {activeMilestone.badge}
                        </Badge>
                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#5e8c2a]" /> {activeMilestone.location}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Étape {activeStep + 1} sur {timelineMilestones.length}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight">
                        {activeMilestone.title}
                      </h3>

                      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        {activeMilestone.desc}
                      </p>

                      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#5e8c2a] dark:text-[#8bc34a] mb-1">
                          Fait marquant :
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {activeMilestone.fact}
                        </p>
                      </div>
                    </div>

                    {/* Milestone Big Graphic Badge */}
                    <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3 text-center">
                      <div className="h-16 w-16 rounded-2xl bg-[#74a638]/15 flex items-center justify-center text-[#5e8c2a]">
                        <MilestoneIcon className="h-8 w-8" />
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                        {activeMilestone.year}
                      </div>
                      <p className="text-xs text-muted-foreground font-semibold">
                        Jalon historique RAFT Côte d'Ivoire
                      </p>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="mt-8 pt-6 border-t border-border/80 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevMilestone}
                      className="rounded-full gap-1.5 text-xs font-semibold"
                    >
                      <ChevronLeft className="h-4 w-4" /> Précédent
                    </Button>

                    <div className="flex items-center gap-1">
                      {timelineMilestones.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectMilestone(i)}
                          className={cn(
                            "h-2 rounded-full transition-all cursor-pointer",
                            i === activeStep ? "w-6 bg-[#74a638]" : "w-2 bg-border hover:bg-muted-foreground"
                          )}
                          aria-label={`Étape ${i + 1}`}
                        />
                      ))}
                    </div>

                    <Button
                      size="sm"
                      onClick={handleNextMilestone}
                      className="rounded-full gap-1.5 text-xs font-semibold bg-[#74a638] text-white hover:bg-[#68982f]"
                    >
                      Suivant <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* OVERVIEW MODE — Full continuous timeline list */
              <div className="pt-10">
                <div className="relative border-l-2 border-[#74a638]/40 pl-6 sm:pl-10 space-y-10 max-w-4xl mx-auto">
                  {timelineMilestones.map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.year} className="relative group">
                        <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-background border-2 border-[#74a638] text-[#5e8c2a] shadow-xs group-hover:bg-[#74a638] group-hover:text-white transition-colors">
                          <span className="h-2 w-2 rounded-full bg-current" />
                        </div>

                        <div className="rounded-3xl border border-border/80 bg-surface/70 p-6 sm:p-7 shadow-xs hover:shadow-soft transition-all">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="text-2xl font-black text-[#5e8c2a] dark:text-[#8bc34a]">
                              {m.year}
                            </span>
                            <Badge variant="secondary" className="font-semibold text-xs">
                              {m.badge}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                            <Icon className="h-4 w-4 text-[#5e8c2a]" /> {m.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{m.desc}</p>
                          <div className="rounded-xl bg-card p-3 border border-border/60 text-xs text-foreground font-medium">
                            <span className="font-bold text-[#5e8c2a]">Fait marquant : </span>{m.fact}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Card — High Conversion Executive Design */}
        <section className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-surface p-8 sm:p-14 shadow-lift relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="eyebrow text-[#5e8c2a] dark:text-[#8bc34a]">Participer au réseau</span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                Rejoignez le Réseau RAFT Côte d'Ivoire
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Vous êtes médecin, directeur d'établissement ou soignant dans un centre régional ? Découvrez comment raccorder votre structure au réseau Télé-ECG, bénéficier des kits Médico Net et participer aux e-cours hebdomadaires.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Button asChild size="lg" className="rounded-full font-bold shadow-soft bg-[#74a638] text-white hover:bg-[#68982f] px-7">
                <Link to="/contact">
                  Contacter la coordination
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full font-bold px-7">
                <Link to="/projets">
                  Explorer les 24 sites
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal for HD Image Viewing */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-border bg-card/95 backdrop-blur-xl">
          {selectedPhoto && (
            <div className="flex flex-col">
              <div className="relative aspect-16/10 max-h-[75vh] bg-black/95 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/70 text-white hover:bg-black flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Fermer</span>
                </button>
              </div>

              <div className="p-6 space-y-2 border-t border-border/80 bg-card">
                <div className="flex items-center justify-between gap-3">
                  <DialogTitle className="text-xl font-bold text-foreground">
                    {selectedPhoto.title}
                  </DialogTitle>
                  {selectedPhoto.year && (
                    <Badge variant="secondary" className="font-semibold text-xs shrink-0">
                      {selectedPhoto.year}
                    </Badge>
                  )}
                </div>
                <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                  {selectedPhoto.caption}
                </DialogDescription>
                {selectedPhoto.credit && (
                  <p className="text-xs text-muted-foreground/80 font-medium pt-1">
                    Source / Crédit : {selectedPhoto.credit}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
