import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarClock,
  Building2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Search,
  X,
  RotateCcw,
  HeartPulse,
  Stethoscope,
  GraduationCap,
  Phone,
  Mail,
  CheckCircle2,
  Radio,
  Sparkles,
} from "lucide-react";
import LeafletMap from "@/components/site/LeafletMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { programColors, type ProjectSite } from "@/data/site";
import { useProjects, useDirectory } from "@/hooks/useData";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export const Route = createFileRoute("/projets")({
  head: () => ({
    meta: [
      { title: "Projets & Carte interactive du réseau de télémédecine — Côte d'Ivoire" },
      {
        name: "description",
        content:
          "Cartographie interactive des projets de télémédecine en Côte d'Ivoire : télé-ECG d'urgence, télé-expertise et télé-formation, site par site, avec structures hospitalières connectées.",
      },
      { property: "og:title", content: "Projets & Carte interactive de télémédecine — Côte d'Ivoire" },
      {
        property: "og:description",
        content: "Explorez les 12 localités et 24 structures sanitaires interconnectées au réseau RAFT Côte d'Ivoire.",
      },
    ],
  }),
  component: ProjetsPage,
});

const programs = ["Tous", "Télé-ECG", "Télé-expertise", "Télé-formation"] as const;

function ProjetsPage() {
  const { data: projectSites = [] } = useProjects();
  const { data: directory = [] } = useDirectory();

  const [filter, setFilter] = useState<(typeof programs)[number]>("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>("abidjan");

  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: contentRef, isVisible: contentVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: featuresRef, isVisible: featuresVisible } = useIntersectionObserver<HTMLDivElement>();

  // Filter sites based on both program filter and search query
  const filteredSites = useMemo(() => {
    return projectSites.filter((s) => {
      const matchesProgram = filter === "Tous" || s.program === filter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.city.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q) ||
        s.detail.toLowerCase().includes(q);
      return matchesProgram && matchesSearch;
    });
  }, [projectSites, filter, searchQuery]);

  // Selected active site
  const active = useMemo(() => {
    return filteredSites.find((s) => s.id === activeId) ?? filteredSites[0] ?? null;
  }, [filteredSites, activeId]);

  // Connected structures in active city from directory
  const localFacilities = useMemo(() => {
    if (!active) return [];
    return directory.filter(
      (d) =>
        d.city.toLowerCase().includes(active.city.toLowerCase()) ||
        active.city.toLowerCase().includes(d.city.toLowerCase()),
    );
  }, [active, directory]);

  const handleResetFilters = () => {
    setFilter("Tous");
    setSearchQuery("");
  };

  return (
    <>
      {/* Hero Banner with Modern Medical Look */}
      <header
        ref={headerRef}
        className={cn(
          "surface-hero relative overflow-hidden text-primary-foreground py-14 sm:py-20",
          headerVisible && "animate-fade-up",
        )}
      >
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-primary-foreground/15 text-primary-foreground">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cartographie Nationale Officielle · Réseau RAFT CI</span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-3xl">
            La télémédecine ivoirienne,{" "}
            <span className="text-transparent bg-gradient-to-r from-emerald-200 via-teal-100 to-amber-200 bg-clip-text">
              site par site.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base sm:text-lg text-primary-foreground/90 leading-relaxed">
            Consultez le maillage territorial en temps réel : 12 localités interconnectées et 24 structures sanitaires
            équipées pour le télé-ECG d'urgence, la télé-expertise spécialisée et la formation médicale continue.
          </p>

          {/* 4 Interactive Quick KPI Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-4xl">
            <div className="rounded-2xl bg-primary-foreground/10 p-3.5 sm:p-4 backdrop-blur-md border border-primary-foreground/15">
              <div className="flex items-center gap-2 text-emerald-300">
                <MapPin className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Localités</span>
              </div>
              <div className="mt-1.5 text-2xl sm:text-3xl font-black font-[family-name:var(--font-display)] text-primary-foreground">
                12
              </div>
              <p className="mt-0.5 text-[11px] text-primary-foreground/75">Grand Nord au Sud</p>
            </div>

            <div className="rounded-2xl bg-primary-foreground/10 p-3.5 sm:p-4 backdrop-blur-md border border-primary-foreground/15">
              <div className="flex items-center gap-2 text-cyan-300">
                <Building2 className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Structures</span>
              </div>
              <div className="mt-1.5 text-2xl sm:text-3xl font-black font-[family-name:var(--font-display)] text-primary-foreground">
                24
              </div>
              <p className="mt-0.5 text-[11px] text-primary-foreground/75">CHU, CHR & Hôpitaux</p>
            </div>

            <div className="rounded-2xl bg-primary-foreground/10 p-3.5 sm:p-4 backdrop-blur-md border border-primary-foreground/15">
              <div className="flex items-center gap-2 text-amber-300">
                <HeartPulse className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Filières</span>
              </div>
              <div className="mt-1.5 text-2xl sm:text-3xl font-black font-[family-name:var(--font-display)] text-primary-foreground">
                3
              </div>
              <p className="mt-0.5 text-[11px] text-primary-foreground/75">ECG, Expertise & DUDAL</p>
            </div>

            <div className="rounded-2xl bg-primary-foreground/10 p-3.5 sm:p-4 backdrop-blur-md border border-primary-foreground/15">
              <div className="flex items-center gap-2 text-emerald-300">
                <Activity className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Astreinte</span>
              </div>
              <div className="mt-1.5 text-2xl sm:text-3xl font-black font-[family-name:var(--font-display)] text-primary-foreground">
                24/7
              </div>
              <p className="mt-0.5 text-[11px] text-primary-foreground/75">Avis cardiologique actif</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content & Interactive Map Section */}
      <section
        ref={contentRef}
        className={cn("mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8", contentVisible && "animate-fade-up")}
      >
        {/* Modern Control Command Bar: Filters & Live Search */}
        <div className="rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Program Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" /> Filière :
              </span>
              {programs.map((p) => {
                const count = p === "Tous" ? projectSites.length : projectSites.filter((s) => s.program === p).length;
                const isActive = filter === p;
                return (
                  <Button
                    key={p}
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    onClick={() => setFilter(p)}
                    aria-pressed={isActive}
                    className={cn(
                      "rounded-full gap-2 transition-all font-semibold whitespace-nowrap",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:border-primary/40 hover:bg-secondary",
                    )}
                  >
                    <span>{p === "Tous" ? "Toutes les filières" : p}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[0.7rem] font-bold",
                        isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {count}
                    </span>
                  </Button>
                );
              })}
            </div>

            {/* Live Search Input Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une ville, région (ex: Bouaké, Man, Gbêkê)..."
                className="w-full rounded-full border border-border/80 bg-surface/80 py-2 pl-9 pr-9 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                  title="Effacer la recherche"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Results feedback banner */}
          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              <span>
                <strong className="text-foreground">{filteredSites.length}</strong> localité(s) affichée(s) sur{" "}
                {projectSites.length}
              </span>
              {(filter !== "Tous" || searchQuery) && (
                <span className="text-[11px] text-muted-foreground font-medium">
                  (Filtres actifs : {filter !== "Tous" ? filter : ""}
                  {filter !== "Tous" && searchQuery ? " · " : ""}
                  {searchQuery ? `"${searchQuery}"` : ""})
                </span>
              )}
            </div>

            {(filter !== "Tous" || searchQuery) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 font-bold text-primary hover:underline cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>

        {/* Split View: Interactive Map (7 cols) & Locality Hub (5 cols) */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Map Side (7 cols) */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl border border-border/80 bg-card p-4 shadow-soft sm:p-6">
            <div className="mb-3.5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-foreground tracking-tight">Carte Nationale Interactive</h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[0.7rem] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    En direct
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cliquez sur un marqueur ou sélectionnez une ville pour examiner les structures raccordées
                </p>
              </div>
            </div>

            {/* Map Frame */}
            <div className="overflow-hidden rounded-2xl border border-border/80 shadow-xs">
              <LeafletMap sites={filteredSites} activeId={active?.id ?? null} onSelect={(s) => setActiveId(s.id)} />
            </div>

            {/* Clean Status Strip replacing duplicate legend */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground px-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Données certifiées RAFT CI & Ministère de la Santé et de l'Hygiène Publique
              </span>
              <span className="font-semibold text-foreground/80">Plateforme nationale de coordination</span>
            </div>
          </div>

          {/* Details & List Side (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {active ? (
              <Card className="rounded-3xl border-2 border-primary/30 bg-card shadow-lift overflow-hidden transition-all">
                {/* Top colored program indicator */}
                <div className="h-2 w-full" style={{ background: programColors[active.program] }} />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        style={{ background: programColors[active.program] }}
                        className="text-primary-foreground font-bold px-3 py-1 text-xs shadow-xs"
                      >
                        {active.program}
                      </Badge>
                      <Badge variant="outline" className="text-xs font-semibold">
                        Région : {active.region}
                      </Badge>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      #{active.id}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{active.city}</h3>
                      <p className="text-xs font-medium text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary" /> District sanitaire de {active.city}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" /> Connecté
                    </span>
                  </div>

                  <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground bg-surface/60 p-3.5 rounded-2xl border border-border/60">
                    {active.detail}
                  </p>

                  {/* Metrics Box */}
                  <dl className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-secondary/60 p-4 border border-border/60 text-sm">
                    <div>
                      <dt className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5 text-primary" /> Structures raccordées
                      </dt>
                      <dd className="mt-1 font-[family-name:var(--font-display)] text-2xl font-black text-foreground">
                        {active.structures}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          {active.structures > 1 ? "centres" : "centre"}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <CalendarClock className="h-3.5 w-3.5 text-primary" /> Déploiement initial
                      </dt>
                      <dd className="mt-1 font-[family-name:var(--font-display)] text-2xl font-black text-foreground">
                        {active.since}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          ({new Date().getFullYear() - active.since} ans d'activité)
                        </span>
                      </dd>
                    </div>
                  </dl>

                  {/* Connected Facilities in this locality (Directory cross-ref) */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-primary" /> Établissements de santé dans cette zone
                      </p>
                      <span className="text-[11px] font-bold text-primary">
                        {localFacilities.length} répertorié(s)
                      </span>
                    </div>

                    {localFacilities.length > 0 ? (
                      <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                        {localFacilities.map((fac, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-border/80 bg-surface/50 p-3 hover:border-primary/40 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-bold text-foreground leading-snug">{fac.name}</h4>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                                    {fac.category}
                                  </span>
                                  {fac.services.slice(0, 2).map((srv, sIdx) => (
                                    <span
                                      key={sIdx}
                                      className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                                    >
                                      {srv}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {fac.phone && (
                              <div className="mt-2 flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
                                <a
                                  href={`tel:${fac.phone}`}
                                  className="inline-flex items-center gap-1 text-primary font-bold hover:underline"
                                >
                                  <Phone className="h-3 w-3" />
                                  {fac.phone}
                                </a>
                                {fac.email && (
                                  <a
                                    href={`mailto:${fac.email}`}
                                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                                  >
                                    <Mail className="h-3 w-3" />
                                    Email
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground bg-surface/40">
                        <p className="font-semibold text-foreground">Établissement Général de District</p>
                        <p className="mt-0.5">
                          Liaison directe Télé-ECG opérationnelle avec la cellule de garde cardiologique du CHU de Bouaké.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                    <Button asChild size="sm" className="rounded-full flex-1 justify-center font-bold">
                      <Link to="/annuaire">
                        Consulter l'annuaire complet
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-full justify-center">
                      <Link to="/contact">Contacter la coordination</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-3xl border border-dashed border-border p-8 text-center bg-card">
                <MapPin className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                <p className="text-sm font-bold text-foreground">Aucune localité ne correspond à votre filtre</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Essayez d'élargir votre recherche ou de réinitialiser les filtres.
                </p>
                <Button onClick={handleResetFilters} size="sm" variant="outline" className="mt-4 rounded-full">
                  Réinitialiser la recherche
                </Button>
              </div>
            )}

            {/* Quick list of localities with reactive ring & badge */}
            <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-soft">
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-primary" /> Sélection rapide par localité
                </p>
                <span className="text-[11px] font-bold text-muted-foreground">
                  {filteredSites.length} disponible(s)
                </span>
              </div>

              <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                {filteredSites.map((s) => {
                  const isSelected = active?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveId(s.id)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 text-left transition-all cursor-pointer",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/40 font-semibold"
                          : "border-border/80 bg-surface/60 hover:border-primary/40 hover:bg-secondary",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0 shadow-xs"
                          style={{
                            backgroundColor: `${programColors[s.program]}18`,
                            color: programColors[s.program],
                          }}
                        >
                          <MapPin className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-foreground">{s.city}</span>
                          <span className="block text-xs text-muted-foreground">{s.region}</span>
                        </span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="hidden sm:inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{
                            backgroundColor: `${programColors[s.program]}20`,
                            color: programColors[s.program],
                          }}
                        >
                          {s.program}
                        </span>
                        <Badge variant="outline" className="text-[0.68rem] font-bold whitespace-nowrap">
                          {s.structures} {s.structures > 1 ? "structures" : "structure"}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Strategic Programs Focus Section */}
      <section
        ref={featuresRef}
        className={cn("border-t border-border/80 bg-surface/50 py-16", featuresVisible && "animate-fade-up")}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Infrastructures & Technologies Cliniques</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
              Les 3 Piliers Technologiques du Réseau
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              Une infrastructure robuste et résiliente, conçue spécifiquement pour répondre aux exigences des praticiens
              dans les centres sanitaires périphériques de Côte d'Ivoire.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Pilier 1: Télé-ECG */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft hover:shadow-lift transition-all hover:border-accent/50 flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-5">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-sky-600 text-white font-bold text-xs">Télé-ECG d'Urgence</Badge>
                  <span className="text-xs font-bold text-emerald-600">Astreinte 24/7</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Électrocardiogramme Numérique & IA</h3>
                <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Déploiement de kits mobiles Medico Net et de la plateforme ResoDoc avec assistance à l'interprétation par
                  intelligence artificielle. Transmission instantanée des tracés pour diagnostic précoce des infarctus.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Délai moyen de réponse :</span>
                  <strong className="text-foreground font-bold">&lt; 15 minutes</strong>
                </div>
              </div>
            </div>

            {/* Pilier 2: Télé-expertise */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft hover:shadow-lift transition-all hover:border-primary/50 flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-5">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-emerald-600 text-white font-bold text-xs">Télé-Expertise Spécialisée</Badge>
                  <span className="text-xs font-bold text-primary">Plateforme BOGOU</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Avis Médical Asynchrone Sécurisé</h3>
                <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Mise en relation des médecins généralistes en région avec les collèges de professeurs et spécialistes
                  des CHU (Bouaké, Yopougon, Treichville) en cardiologie, dermatologie, radiologie et pédiatrie.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Impact direct :</span>
                  <strong className="text-foreground font-bold">-70% d'évacuations inutiles</strong>
                </div>
              </div>
            </div>

            {/* Pilier 3: Télé-formation */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft hover:shadow-lift transition-all hover:border-amber-500/50 flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-5">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-amber-600 text-white font-bold text-xs">Formation Continue DUDAL</Badge>
                  <span className="text-xs font-bold text-amber-600">Certifiante</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Webcasts & Enseignement Médical</h3>
                <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Conférences interactives hebdomadaires diffusées en basse bande passante vers les amphithéâtres
                  universitaires et les hôpitaux de district pour la mise à niveau continue des équipes soignantes.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Personnels formés :</span>
                  <strong className="text-foreground font-bold">Plus de 860 soignants</strong>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Banner to Connect New Sites */}
          <div className="mt-12 rounded-3xl surface-hero p-8 text-primary-foreground relative overflow-hidden shadow-lift">
            <div className="grid-pattern absolute inset-0 opacity-15" aria-hidden="true" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <Badge className="bg-primary-foreground/20 text-primary-foreground font-bold px-3 py-1 mb-2">
                  Extension du réseau
                </Badge>
                <h3 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Vous souhaitez raccorder votre centre sanitaire ?
                </h3>
                <p className="mt-2 text-sm text-primary-foreground/85 leading-relaxed">
                  La coordination nationale RAFT Côte d'Ivoire accompagne les directeurs d'hôpitaux, médecins-chefs et
                  districts sanitaires pour le déploiement technique et la formation des soignants.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Button asChild size="lg" className="rounded-full bg-card text-foreground hover:bg-card/90 font-bold">
                  <Link to="/contact">
                    Faire une demande de raccordement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border border-white/40 bg-white/10 text-white font-bold hover:bg-white/20 backdrop-blur-sm transition-all"
                >
                  <Link to="/annuaire">Voir l'annuaire des centres</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}