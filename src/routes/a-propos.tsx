import { useState } from "react";
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
};

const timelineMilestones = [
  {
    year: "2003",
    badge: "Genèse",
    title: "Naissance du RAFT en Afrique",
    desc: "Le projet RAFT débute ses activités au Mali sous l'égide des Hôpitaux Universitaires de Genève (HUG). Il s'étend rapidement aux pays francophones pour désenclaver les professionnels de santé isolés.",
  },
  {
    year: "2005",
    badge: "Adhésion",
    title: "Intégration de la Côte d'Ivoire",
    desc: "La Côte d'Ivoire rejoint officiellement le réseau RAFT sous la conduite du Pr EHUA Somian Francis, amorçant les premiers cycles de formation médicale continue à distance.",
  },
  {
    year: "2009",
    badge: "Congrès continental",
    title: "Congrès africain d'informatique médicale au VITIB",
    desc: "La Côte d'Ivoire accueille et organise avec éclat le congrès africain d'informatique médicale au VITIB à Grand-Bassam, réunissant des sommités scientifiques internationales.",
  },
  {
    year: "2013",
    badge: "Jubilé",
    title: "Célébration des 10 ans du RAFT à Krindjabo",
    desc: "Célébration décennale du réseau panafricain tenue à Krindjabo (Aboisso), marquant une décennie d'innovations solidaires pour la santé numérique.",
  },
  {
    year: "2014",
    badge: "Phase pilote Télé-ECG",
    title: "Atelier de Yopougon & 9 Kits MEDICO NET",
    desc: "Après un atelier intensif au Centre de Télémédecine du CHU de Yopougon, 9 structures sanitaires régionales sont dotées en Kit MEDICO NET pour la télé-expertise cardiaque.",
  },
  {
    year: "2019",
    badge: "Intelligence Artificielle",
    title: "Mission Cardiologs à Paris (Doc&You)",
    desc: "Formation de la délégation ivoirienne (Prof Adoubi, Dr Diby Florent, M. Roger Kpon) sur l'assistance à la lecture d'ECG par IA dans le cadre de la Phase 2 du projet Télé-ECG.",
  },
  {
    year: "Aujourd'hui",
    badge: "Réseau National",
    title: "24 sites connectés & souveraineté e-santé",
    desc: "Plus de 4 200 télé-électrocardiogrammes réalisés, 860 professionnels formés et un maillage territorial au service de l'équité des soins.",
  },
];

const teamPillars = [
  {
    role: "Point Focal National",
    name: "Professeur EHUA Somian Francis",
    bio: "Pionnier historique de la télémédecine en Côte d'Ivoire dès 2004, Professeur Titulaire et figure fondatrice des initiatives de formation médicale à distance avec Genève et Bamako.",
    tag: "Gouvernance & Pédagogie",
  },
  {
    role: "Coordonnateur Médical",
    name: "Dr. Innocent NANAN",
    bio: "Président de la Société Ivoirienne de Biosciences et d'Informatique Médicale (SIBIM), il pilote la validation éthique, scientifique et médicale des protocoles de télé-expertise.",
    tag: "Coordination Clinique",
  },
  {
    role: "Coordonnateur Technique",
    name: "Mr Roger KPON",
    bio: "Chef de service Technologie & Système d'Information au Centre Suisse de Recherches Scientifiques en Côte d'Ivoire (CSRS). Architecte des déploiements télécoms et réseaux.",
    tag: "Technologies & Systèmes",
  },
];

const equipementsFormation = [
  { name: "Ordinateur portable", desc: "Station multimédia configurée pour la réception des flux", icon: Laptop },
  { name: "Vidéoprojecteur", desc: "Diffusion grand écran des présentations et cas cliniques", icon: Monitor },
  { name: "Onduleur haute sécurité", desc: "Protection contre les coupures et variations électriques", icon: ShieldCheck },
  { name: "Webcam HD", desc: "Prise de vue interactive des intervenants locaux", icon: Video },
  { name: "Casque & microphone", desc: "Interactivité sonore limpide lors des sessions de questions-réponses", icon: Volume2 },
  { name: "Écran de projection", desc: "Affichage optimal pour les salles de formation hospitalières", icon: Maximize2 },
];

function AProposPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<LightboxImage | null>(null);

  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: introRef, isVisible: introVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: teamRef, isVisible: teamVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: objRef, isVisible: objVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: eqRef, isVisible: eqVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: timeRef, isVisible: timeVisible } = useIntersectionObserver<HTMLDivElement>();

  return (
    <>
      {/* Header Banner */}
      <header
        ref={headerRef}
        className={cn(
          "surface-hero relative overflow-hidden text-primary-foreground py-16 sm:py-24",
          headerVisible && "animate-fade-up"
        )}
      >
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>En Savoir Plus</span>
            <span className="text-primary-foreground/40">•</span>
            <span className="text-primary-foreground/80">Réseau RAFT Côte d'Ivoire</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-3xl leading-[1.15]">
            Le RAFT Côte d'Ivoire :{" "}
            <span className="text-transparent bg-gradient-to-r from-cyan-200 via-teal-100 to-amber-200 bg-clip-text">
              20 ans d'engagement
            </span>{" "}
            pour la santé connectée.
          </h1>

          <p className="mt-5 max-w-3xl text-base sm:text-lg text-primary-foreground/85 leading-relaxed">
            Né pour rompre l'isolement des soignants et combattre les déserts médicaux, le réseau RAFT en Côte d'Ivoire allie télé-enseignement hebdomadaire, télé-expertise clinique et technologies adaptées au terrain africain.
          </p>

          {/* Quick jump navigation pills */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {[
              { href: "#histoire", label: "Histoire & Origine" },
              { href: "#equipe", label: "L'Équipe RAFT CI" },
              { href: "#objectifs", label: "Objectifs du Projet" },
              { href: "#equipements", label: "Équipements & Kits" },
              { href: "#chronologie", label: "Grandes Dates" },
            ].map((btn) => (
              <a
                key={btn.href}
                href={btn.href}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-4 py-2 text-xs font-medium text-primary-foreground/90 backdrop-blur-sm border border-primary-foreground/15 hover:bg-primary-foreground/20 hover:text-white transition-colors"
              >
                {btn.label}
              </a>
            ))}
          </div>

          {/* Key metrics grid */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-primary-foreground/15 pt-8">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-accent">2003</div>
              <div className="text-xs text-primary-foreground/75 mt-1 font-medium">Début du projet en Afrique (Mali)</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">2005</div>
              <div className="text-xs text-primary-foreground/75 mt-1 font-medium">Intégration de la Côte d'Ivoire</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-cyan-300">10+</div>
              <div className="text-xs text-primary-foreground/75 mt-1 font-medium">Sites pionniers équipés dès l'origine</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-amber-300">24</div>
              <div className="text-xs text-primary-foreground/75 mt-1 font-medium">Centres connectés aujourd'hui</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-24">

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

              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Le RAFT Côte D'Ivoire
              </h2>

              <div className="rounded-2xl border-l-4 border-[#74a638] bg-surface/80 p-5 text-base sm:text-lg font-medium leading-relaxed text-foreground shadow-xs">
                C'est en 2003, que le projet RAFT a débuté ses activités en Afrique. Parti du Mali, le RAFT regroupe aujourd'hui plusieurs pays. La Côte d'Ivoire a intégré le réseau RAFT en 2005.
              </div>

              <p className="text-base text-muted-foreground leading-relaxed">
                Le Réseau en Afrique Francophone pour la Télémédecine (RAFT) s'est imposé comme l'initiative pionnière de santé numérique la plus pérenne du continent. Face aux pénuries de spécialistes hors des capitales, le RAFT a développé une approche résolument pragmatique : relier les praticiens de terrain aux hôpitaux universitaires grâce à des technologies peu gourmandes en bande passante.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground mb-1">
                    <CheckCircle2 className="h-4 w-4 text-[#5e8c2a]" /> Début au Mali (2003)
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Initiative partie de Bamako et Genève, étendue progressivement à plus de 20 pays d'Afrique.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground mb-1">
                    <CheckCircle2 className="h-4 w-4 text-[#5e8c2a]" /> Adhésion Ivoirienne (2005)
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[#8bc34a]" /> Équipe pionnière RAFT CI
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-xs border border-white/20">
                      <Maximize2 className="h-3 w-3" /> Agrandir
                    </span>
                  </div>
                </div>
                <div className="p-4 border-t border-border/60 bg-card/60 text-xs text-muted-foreground">
                  Coordination nationale réunie pour le déploiement des activités de santé numérique en Côte d'Ivoire.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: L'Équipe RAFT Côte d'Ivoire & Gouvernance */}
        <section id="equipe" ref={teamRef} className={cn("scroll-mt-24", teamVisible && "animate-fade-up")}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="eyebrow text-[#5e8c2a] dark:text-[#8bc34a]">Gouvernance & Leadership</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              L'Équipe RAFT Côte d'Ivoire
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Une gouvernance multidisciplinaire alliant expertise médicale universitaire, informatique clinique et ingénierie des télécommunications.
            </p>
          </div>

          {/* Text verbatim quote from Image 1 */}
          <div className="mt-8 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-soft">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8 space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#5e8c2a]" /> Composition de la coordination nationale
                </h3>
                <p className="text-base text-foreground leading-relaxed">
                  « L'équipe RAFT Côte d'Ivoire est composé d'un point focal, le professeur <strong>EHUA Somian Francis</strong>, d'un coordonnateur médical, le <strong>Dr. Innocent NANAN</strong> et d'un coordonnateur technique <strong>Mr Roger KPON</strong>, chef de service technologie et système d'information au Centre Suisse de Recherches Scientifiques en Côte d'Ivoire. »
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  « Cette équipe a participé à plusieurs ateliers de formation organisés par le RAFT à travers l'Afrique. En 2009, la Côte d'Ivoire a organisé le congrès africain d'informatique médical au <strong>VITIB à Bassam</strong> et en 2013, la Côte d'Ivoire a célébré les <strong>10 ans du RAFT à KRINDJABO</strong>. »
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="text-xs font-semibold py-1 px-3">
                    <Calendar className="mr-1.5 h-3.5 w-3.5 text-[#5e8c2a]" /> 2009 : Congrès VITIB Bassam
                  </Badge>
                  <Badge variant="outline" className="text-xs font-semibold py-1 px-3">
                    <Award className="mr-1.5 h-3.5 w-3.5 text-[#5e8c2a]" /> 2013 : 10 ans à Krindjabo
                  </Badge>
                  <Badge variant="outline" className="text-xs font-semibold py-1 px-3">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                      <span className="font-semibold flex items-center gap-1">
                        <Video className="h-3 w-3 text-[#8bc34a]" /> Diffusion & Médias
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 border border-white/20">
                        <Maximize2 className="h-2.5 w-2.5" /> Voir
                      </span>
                    </div>
                  </div>
                  <div className="p-3 text-[11px] text-muted-foreground bg-card/60 border-t border-border/60">
                    Sensibilisation nationale sur le réseau RAFT et l'e-santé.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Pillars Cards */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {teamPillars.map((p) => (
              <Card key={p.name} className="rounded-3xl border-border/80 shadow-soft hover:shadow-lift transition-all">
                <CardContent className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-[#74a638] text-white text-[11px] font-bold">
                      {p.tag}
                    </Badge>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {p.role}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-foreground">{p.name}</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {p.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SECTION 3: Objectifs Du Projet RAFT */}
        <section id="objectifs" ref={objRef} className={cn("scroll-mt-24", objVisible && "animate-fade-up")}>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Photo Geissbuhler & Ehua */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div
                onClick={() =>
                  setSelectedPhoto({
                    src: images.aproposGeissbuhlerEhua,
                    title: "Prof. Antoine Geissbuhler & Prof. EHUA Somian Francis",
                    caption:
                      "Rencontre au sommet entre le Prof. Antoine Geissbuhler (Fondateur du RAFT mondial, HUG Genève) et le Prof. Francis Somian EHUA (Point Focal RAFT Côte d'Ivoire), scellant la coopération internationale pour la télémédecine.",
                    year: "Alliance Internationale",
                  })
                }
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft hover:shadow-lift transition-all duration-300"
              >
                <div className="relative aspect-3/4 max-h-[480px] overflow-hidden bg-muted">
                  <img
                    src={images.aproposGeissbuhlerEhua}
                    alt="Prof Antoine Geissbuhler et Prof Francis Ehua"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-[#8bc34a]" /> HUG Genève & RAFT Côte d'Ivoire
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-xs border border-white/20">
                      <Maximize2 className="h-3 w-3" /> Agrandir
                    </span>
                  </div>
                </div>
                <div className="p-4 border-t border-border/60 bg-card/60 text-xs text-muted-foreground">
                  Pr Antoine Geissbuhler & Pr Francis Ehua lors d'une conférence internationale du RAFT.
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

              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Objectifs Du Projet RAFT
              </h2>

              <div className="rounded-2xl border-l-4 border-[#74a638] bg-surface/80 p-5 text-base sm:text-lg font-medium leading-relaxed text-foreground shadow-xs">
                « L'objectif principal du RAFT est de lutter contre le désert médical. Ainsi le professionnel de la santé, éloigné des grandes métropoles ne se sent plus isoler. Il voit ses capacités professionnelles renforcées à travers les cours de télé enseignement diffusés chaque jeudis à partir de 09h TU. Ces E-cours ne nécessitant pas de grand débit de la connexion Internet est suivi par des milliers de professionnels de la santé. »
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                    <BookOpen className="h-4 w-4 text-[#5e8c2a]" /> E-cours chaque jeudi (09h TU)
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Des sessions interactives hebdomadaires dispensées par des spécialistes africains et internationaux, permettant une formation médicale continue certifiante.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                    <Network className="h-4 w-4 text-[#5e8c2a]" /> Optimisation pour bas débit
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    La technologie DUDAL fonctionne même sur des débits Internet limités, garantissant un accès équitable aux praticiens exerçant dans les zones les plus enclavées.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Équipements & Phase Pilote Télé-ECG */}
        <section id="equipements" ref={eqRef} className={cn("scroll-mt-24", eqVisible && "animate-fade-up")}>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-[#5e8c2a]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#5e8c2a] dark:text-[#8bc34a]">
                  Déploiement Matériel & Clinique
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Équipement des Structures & Phase Pilote Télé-ECG
              </h2>

              <div className="rounded-2xl border-l-4 border-[#74a638] bg-surface/80 p-5 text-base sm:text-lg font-medium leading-relaxed text-foreground shadow-xs">
                « Grace au financement du RAFT, en Côte d'Ivoire, plus de 10 structures de santé ont été équipées en matériel pour les activités de télé formation. Chaque site bénéficiaire a reçu un ordinateur portable, un vidéo projecteur, un onduleur, une Webcam, un casque et un écran de projection. »
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-5 text-sm text-foreground space-y-2 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-base text-[#5e8c2a]">
                  <HeartPulse className="h-5 w-5" /> Phase Pilote 2014 au CHU de Yopougon
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  « En 2014, après un atelier de formation au centre de télé medecine de Yopougon, neuf structures de santé été équipées en <strong>KIT MEDICO NET</strong> pour la phase pilote du projet de télé expertise en cardiologie. »
                </p>
              </div>

              {/* Kit detail items */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Composition du Kit de Télé-formation RAFT :
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {equipementsFormation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.name} className="rounded-xl border border-border/70 bg-card/60 p-3 space-y-1">
                        <Icon className="h-4 w-4 text-[#5e8c2a]" />
                        <div className="text-xs font-bold text-foreground">{item.name}</div>
                        <p className="text-[11px] text-muted-foreground leading-tight">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Photo Ehua on the field */}
            <div className="lg:col-span-5">
              <div
                onClick={() =>
                  setSelectedPhoto({
                    src: images.aproposEhuaTerrain,
                    title: "Prof. EHUA Somian Francis sur le terrain",
                    caption:
                      "Le Professeur Francis Somian EHUA lors d'une mission de prospection et d'évaluation sanitaire dans les districts reculés de Côte d'Ivoire, démontrant l'engagement de proximité auprès des praticiens.",
                    year: "Mission de Terrain",
                  })
                }
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft hover:shadow-lift transition-all duration-300"
              >
                <div className="relative aspect-4/3 max-h-[460px] overflow-hidden bg-muted">
                  <img
                    src={images.aproposEhuaTerrain}
                    alt="Prof Francis Ehua en mission de terrain"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#8bc34a]" /> Mission de terrain RAFT CI
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-xs border border-white/20">
                      <Maximize2 className="h-3 w-3" /> Agrandir
                    </span>
                  </div>
                </div>
                <div className="p-4 border-t border-border/60 bg-card/60 text-xs text-muted-foreground">
                  Pr Francis Ehua, pionnier de la télémédecine, en déplacement auprès des soignants de l'intérieur du pays.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Chronologie & Grandes Dates */}
        <section id="chronologie" ref={timeRef} className={cn("scroll-mt-24", timeVisible && "animate-fade-up")}>
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="eyebrow text-[#5e8c2a] dark:text-[#8bc34a]">Ligne du Temps</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              20 Ans d'Histoire & de Jalons Majeurs
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              De la première connexion pionnière en 2003 aux algorithmes d'intelligence artificielle en 2026.
            </p>
          </div>

          <div className="relative border-l-2 border-border/80 pl-6 sm:pl-10 space-y-12 max-w-4xl mx-auto">
            {timelineMilestones.map((m) => (
              <div key={m.year} className="relative group">
                {/* Node indicator */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-background border-2 border-[#74a638] text-[#5e8c2a] shadow-xs group-hover:bg-[#74a638] group-hover:text-white transition-colors">
                  <span className="h-2 w-2 rounded-full bg-current" />
                </div>

                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft hover:shadow-lift transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xl sm:text-2xl font-black text-[#5e8c2a] dark:text-[#8bc34a]">
                      {m.year}
                    </span>
                    <Badge variant="secondary" className="font-semibold text-xs">
                      {m.badge}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{m.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Card */}
        <section className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-surface p-8 sm:p-12 shadow-soft">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="eyebrow text-[#5e8c2a] dark:text-[#8bc34a]">Participer au réseau</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Rejoignez le Réseau RAFT Côte d'Ivoire
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Vous êtes médecin, directeur d'hôpital ou soignant dans un centre régional ? Découvrez comment raccorder votre établissement au réseau Télé-ECG et participer aux sessions de télé-formation hebdomadaires.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Button asChild size="lg" className="rounded-full font-bold shadow-soft">
                <Link to="/contact">
                  Contacter la coordination
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full font-bold">
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
              <div className="relative aspect-16/10 max-h-[70vh] bg-black/90 overflow-hidden flex items-center justify-center">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/60 text-white hover:bg-black/90 flex items-center justify-center transition-colors border border-white/20"
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
