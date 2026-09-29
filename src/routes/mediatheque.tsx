import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  ImageIcon,
  PlayCircle,
  Film,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Search,
  X,
  RotateCcw,
  Play,
  Tv,
  Clock,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { mediaThemes, type MediaItem } from "@/data/site";
import { useMediaItems } from "@/hooks/useData";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import heroMediatheque from "@/assets/hero_mediatheque.jpg";

export const Route = createFileRoute("/mediatheque")({
  head: () => ({
    meta: [
      { title: "Médiathèque officielle — Vidéos, replays et documents de télémédecine en Côte d'Ivoire" },
      {
        name: "description",
        content:
          "Grand reportage Medi1TV, replays de télé-expertise clinique, photothèque de terrain et documents techniques du réseau de télémédecine en Côte d'Ivoire.",
      },
      { property: "og:title", content: "Médiathèque officielle — Télémédecine Côte d'Ivoire" },
      {
        property: "og:description",
        content: "Explorez les reportages vidéo, cours DUDAL et ressources visuelles du réseau RAFT Côte d'Ivoire.",
      },
    ],
  }),
  component: MediathequePage,
});

const typeIcon = {
  Photo: ImageIcon,
  Vidéo: PlayCircle,
  Document: FileText,
} as const;

function MediathequePage() {
  const { data: mediaItems = [] } = useMediaItems();
  const [theme, setTheme] = useState("Tous");
  const [type, setType] = useState<"Tous" | MediaItem["type"]>("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [isPlayingHeroVideo, setIsPlayingHeroVideo] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: spotlightRef, isVisible: spotlightVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: contentRef, isVisible: contentVisible } = useIntersectionObserver<HTMLDivElement>();

  // Featured hero video (the one provided by the user)
  const featuredVideo = useMemo(() => {
    return mediaItems.find((m) => m.featured && m.type === "Vidéo") ?? mediaItems[0];
  }, [mediaItems]);

  // Filtered items based on format, theme, and real-time search
  const filteredItems = useMemo(() => {
    return mediaItems.filter((m) => {
      const matchesTheme = theme === "Tous" || m.theme === theme;
      const matchesType = type === "Tous" || m.type === type;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.source && m.source.toLowerCase().includes(q));
      return matchesTheme && matchesType && matchesSearch;
    });
  }, [mediaItems, theme, type, searchQuery]);

  const handleResetFilters = () => {
    setTheme("Tous");
    setType("Tous");
    setSearchQuery("");
  };

  const handleShare = (item: MediaItem) => {
    if (typeof window === "undefined") return;
    const url = item.youtubeId
      ? `https://youtu.be/${item.youtubeId}`
      : window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <>
      {/* Header Banner with Background Image */}
      <header
        ref={headerRef}
        className={cn(
          "relative overflow-hidden text-primary-foreground py-16 sm:py-24 lg:py-28 min-h-[380px] flex items-center",
          headerVisible && "animate-fade-up",
        )}
      >
        {/* Background Image with High Clarity & Directional Gradient Overlay */}
        <div className="absolute inset-0 select-none">
          <img
            src={heroMediatheque}
            alt="Studio de diffusion et cours de télémédecine en direct"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#031422]/95 via-[#031422]/80 to-[#031422]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020d17] via-transparent to-black/40" />
          <div className="absolute inset-0 bg-[#74a638]/10 mix-blend-overlay" />
          <div className="grid-pattern absolute inset-0 opacity-15" aria-hidden="true" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Fonds Audiovisuel & Pédagogique Officiel · RAFT CI</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight drop-shadow-md">
              Médiathèque, reportages &{" "}
              <span className="text-[#8bc34a]">
                replays cliniques.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-white/90 leading-relaxed font-normal drop-shadow-sm">
              Consultez les reportages vidéo de référence, les enregistrements des télé-expertises spécialisées, la
              photothèque des missions de terrain et les guides techniques officiels du réseau.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2 text-xs font-semibold text-white/95">
              <span className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3.5 py-1.5 backdrop-blur-md border border-white/20 shadow-xs">
                <Tv className="h-4 w-4 text-[#8bc34a]" /> Grand reportage Medi1TV
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3.5 py-1.5 backdrop-blur-md border border-white/20 shadow-xs">
                <Film className="h-4 w-4 text-cyan-300" /> {mediaItems.filter((m) => m.type === "Vidéo").length} Replays & Séminaires
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3.5 py-1.5 backdrop-blur-md border border-white/20 shadow-xs">
                <FileText className="h-4 w-4 text-amber-300" /> Documents & Guides téléchargeables
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Video Cinema Spotlight ("À la Une") */}
      {featuredVideo && (
        <section
          ref={spotlightRef}
          className={cn("mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8", spotlightVisible && "animate-fade-up")}
        >
          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-slate-950 text-white shadow-lift">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center p-6 sm:p-8 lg:p-10">
              {/* Left Video Player / Thumbnail */}
              <div className="lg:col-span-7">
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                  {isPlayingHeroVideo && featuredVideo.youtubeId ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${featuredVideo.youtubeId}?autoplay=1&rel=0`}
                      title={featuredVideo.title}
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="group relative h-full w-full cursor-pointer" onClick={() => setIsPlayingHeroVideo(true)}>
                      <img
                        src={featuredVideo.image}
                        alt={featuredVideo.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

                      {/* Play Beacon Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative flex items-center justify-center">
                          <span className="absolute h-20 w-20 rounded-full bg-primary/40 animate-ping opacity-75" />
                          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-transform duration-300 group-hover:scale-110">
                            <Play className="h-8 w-8 sm:h-9 sm:w-9 ml-1 fill-white" />
                          </div>
                        </div>
                      </div>

                      {/* Video overlay badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                          Vidéo Documentaire
                        </span>
                        {featuredVideo.duration && (
                          <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-mono font-bold text-white backdrop-blur-sm">
                            {featuredVideo.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Description & Action */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Grand Documentaire à la Une</span>
                  </div>

                  <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    {featuredVideo.title}
                  </h2>

                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    {featuredVideo.description}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs border-y border-white/10 py-3">
                    <div>
                      <span className="block text-slate-400">Source :</span>
                      <strong className="text-white font-bold">{featuredVideo.source ?? "Medi1TV Afrique"}</strong>
                    </div>
                    <div>
                      <span className="block text-slate-400">Thématique :</span>
                      <strong className="text-emerald-400 font-bold">{featuredVideo.theme}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Button
                    onClick={() => setIsPlayingHeroVideo(true)}
                    className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold gap-2"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    {isPlayingHeroVideo ? "Lecture en cours" : "Lancer le documentaire"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleShare(featuredVideo)}
                    className="rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white font-bold gap-2 backdrop-blur-sm shadow-sm"
                  >
                    <Share2 className="h-4 w-4 text-white" />
                    <span className="text-white">{copiedLink ? "Lien copié !" : "Partager"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content: Filter Command Bar & Media Grid */}
      <section
        ref={contentRef}
        className={cn("mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8", contentVisible && "animate-fade-up")}
      >
        {/* Modern Control Command Bar */}
        <div className="rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Format Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" /> Format :
              </span>
              {(["Tous", "Vidéo", "Photo", "Document"] as const).map((t) => {
                const count = t === "Tous" ? mediaItems.length : mediaItems.filter((m) => m.type === t).length;
                const isActive = type === t;
                const Icon = t === "Tous" ? Film : typeIcon[t];
                return (
                  <Button
                    key={t}
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    onClick={() => setType(t)}
                    aria-pressed={isActive}
                    className={cn(
                      "rounded-full gap-2 transition-all font-semibold whitespace-nowrap",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:border-primary/40 hover:bg-secondary",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{t === "Tous" ? "Tous les formats" : t}</span>
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
                placeholder="Rechercher une vidéo, photo, cours DUDAL..."
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

          {/* Theme Filters Secondary Row */}
          <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1.5">
              Thématiques :
            </span>
            {mediaThemes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={cn(
                  "rounded-full px-3 py-1 transition-all cursor-pointer font-medium",
                  theme === t
                    ? "bg-secondary text-primary font-bold ring-1 ring-primary/40 shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Active Results Feedback */}
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              <span>
                <strong className="text-foreground">{filteredItems.length}</strong> ressource(s) affichée(s) sur{" "}
                {mediaItems.length}
              </span>
              {(theme !== "Tous" || type !== "Tous" || searchQuery) && (
                <span className="text-[11px] text-muted-foreground font-medium">
                  ({type !== "Tous" ? type : ""}
                  {type !== "Tous" && theme !== "Tous" ? " · " : ""}
                  {theme !== "Tous" ? theme : ""}
                  {(type !== "Tous" || theme !== "Tous") && searchQuery ? " · " : ""}
                  {searchQuery ? `"${searchQuery}"` : ""})
                </span>
              )}
            </div>

            {(theme !== "Tous" || type !== "Tous" || searchQuery) && (
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

        {/* Media Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((m, i) => {
            const Icon = typeIcon[m.type];
            const isVideo = m.type === "Vidéo";
            return (
              <div
                key={m.id}
                onClick={() => setSelected(m)}
                className="card-hover group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card text-left shadow-soft cursor-pointer transition-all hover:border-primary/40 hover:shadow-lift"
                style={{ animationDelay: `${i * 60}ms` }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(m);
                  }
                }}
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                    <img
                      src={m.image}
                      alt={m.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Format Badge Overlay */}
                    <span
                      className={cn(
                        "absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-xs backdrop-blur-md border",
                        isVideo
                          ? "bg-sky-600/90 text-white border-white/20"
                          : m.type === "Photo"
                            ? "bg-emerald-600/90 text-white border-white/20"
                            : "bg-amber-600/90 text-white border-white/20",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {m.type}
                    </span>

                    {/* Duration badge for video */}
                    {m.duration && (
                      <span className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] font-mono font-bold text-white backdrop-blur-md">
                        <Clock className="h-3 w-3" />
                        {m.duration}
                      </span>
                    )}

                    {/* Play Circle Overlay for Videos */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-90 group-hover:opacity-100 transition-opacity">
                        <div className="flex h-13 w-13 items-center justify-center rounded-full bg-white/90 text-primary shadow-lift transition-transform duration-300 group-hover:scale-110">
                          <Play className="h-6 w-6 ml-0.5 fill-primary text-primary" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs mb-2.5">
                      <Badge variant="secondary" className="font-bold text-[0.7rem]">
                        {m.theme}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(m.date).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                      </span>
                    </div>

                    <h3 className="text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                      {m.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                      {m.description}
                    </p>

                    {m.source && (
                      <p className="mt-2 text-[11px] font-semibold text-primary flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Source : {m.source}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary">
                  <span>{isVideo ? "Regarder la vidéo" : m.type === "Photo" ? "Agrandir la photo" : "Consulter le document"}</span>
                  <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-border/80 bg-card p-12 text-center shadow-soft">
            <Film className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-base font-bold text-foreground">Aucun média ne correspond à vos critères</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Essayez de modifier votre recherche ou de réinitialiser les filtres.
            </p>
            <Button onClick={handleResetFilters} variant="outline" size="sm" className="mt-4 rounded-full">
              Réinitialiser tous les filtres
            </Button>
          </div>
        )}
      </section>

      {/* Media Detail & Player Modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] w-[95vw] flex flex-col p-0 rounded-3xl border border-border/80 bg-card shadow-2xl overflow-hidden my-auto">
          {selected && (
            <>
              {/* Media viewer container: Full image visibility without cropping */}
              <div className="relative w-full shrink-0 bg-slate-950 flex items-center justify-center overflow-hidden">
                {selected.type === "Vidéo" && selected.youtubeId ? (
                  <div className="aspect-video w-full max-h-[44vh] overflow-hidden bg-black">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${selected.youtubeId}?autoplay=1&rel=0`}
                      title={selected.title}
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="w-full max-h-[46vh] flex items-center justify-center p-3 sm:p-5 bg-slate-950/95">
                    <img
                      src={selected.image}
                      alt={selected.title}
                      className="max-h-[40vh] max-w-full w-auto object-contain rounded-xl shadow-2xl"
                    />
                  </div>
                )}

                {/* Floating dismiss button */}
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/90 transition-colors cursor-pointer shadow-md"
                  title="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Details & Actions: Scrollable area if screen is small */}
              <div className="flex-1 overflow-y-auto space-y-4 p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-bold">
                      {selected.theme}
                    </Badge>
                    <Badge variant="outline" className="font-semibold">
                      Format : {selected.type}
                    </Badge>
                  </div>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {new Date(selected.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <DialogTitle className="text-lg sm:text-2xl font-extrabold leading-tight text-foreground">
                  {selected.title}
                </DialogTitle>

                <DialogDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {selected.description}
                </DialogDescription>

                {selected.source && (
                  <div className="rounded-xl bg-surface/80 p-3 text-xs text-muted-foreground border border-border/60">
                    <strong className="text-foreground font-semibold">Source & Production :</strong> {selected.source}
                  </div>
                )}

                <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
                  <Button variant="outline" onClick={() => setSelected(null)} className="rounded-full text-xs">
                    Fermer
                  </Button>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleShare(selected)}
                      className="rounded-full gap-2 text-xs"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      {copiedLink ? "Copié !" : "Partager"}
                    </Button>

                    {selected.youtubeId ? (
                      <Button asChild className="rounded-full gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs">
                        <a
                          href={`https://www.youtube.com/watch?v=${selected.youtubeId}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Ouvrir sur YouTube
                        </a>
                      </Button>
                    ) : (
                      <Button asChild className="rounded-full gap-2 font-bold text-xs">
                        <a href={selected.image} target="_blank" rel="noreferrer" download>
                          <Download className="h-3.5 w-3.5" />
                          Télécharger la ressource
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}