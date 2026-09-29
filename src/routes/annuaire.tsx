import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Mail,
  MapPin,
  Phone,
  Search,
  Building2,
  Stethoscope,
  Filter,
  CheckCircle2,
  X,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDirectory } from "@/hooks/useData";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import heroAnnuaire from "@/assets/hero_annuaire.jpg";

export const Route = createFileRoute("/annuaire")({
  head: () => ({
    meta: [
      { title: "Annuaire des structures de télémédecine — Côte d'Ivoire" },
      {
        name: "description",
        content:
          "Recherchez les CHU, hôpitaux, centres de santé et spécialistes connectés au réseau de télémédecine ivoirien par ville, région et service.",
      },
      { property: "og:title", content: "Annuaire des structures de télémédecine — Côte d'Ivoire" },
      {
        property: "og:description",
        content: "Coordonnées et services de télémédecine des structures partenaires du réseau RAFT Côte d'Ivoire.",
      },
    ],
  }),
  component: AnnuairePage,
});

const categories = ["Toutes", "CHU", "Hôpital général", "Centre de santé", "Spécialiste"];

function AnnuairePage() {
  const { data: directory = [] } = useDirectory();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [region, setRegion] = useState("Toutes");

  const regions = useMemo(
    () => ["Toutes", ...Array.from(new Set(directory.map((d) => d.region))).sort()],
    [directory],
  );

  const results = directory.filter((d) => {
    const q = query.trim().toLowerCase();
    const matchQ =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      d.services.some((s) => s.toLowerCase().includes(q));
    return matchQ && (category === "Toutes" || d.category === category) && (region === "Toutes" || d.region === region);
  });

  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: listRef, isVisible: listVisible } = useIntersectionObserver<HTMLDivElement>();

  return (
    <>
      {/* Hero Banner with Background Image */}
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
            src={heroAnnuaire}
            alt="Campus hospitalier et praticiens du réseau national de télémédecine"
            className="h-full w-full object-cover object-center"
          />
          {/* Subtle directional gradient: deep dark on the text side, clear & visible on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#031422]/95 via-[#031422]/80 to-[#031422]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020d17] via-transparent to-black/40" />
          <div className="absolute inset-0 bg-[#74a638]/10 mix-blend-overlay" />
          <div className="grid-pattern absolute inset-0 opacity-15" aria-hidden="true" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#74a638] animate-pulse" />
              <span>Répertoire National Officiel</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              Annuaire des structures{" "}
              <span className="text-[#8bc34a]">
                & praticiens connectés.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-white/90 leading-relaxed font-normal drop-shadow-sm">
              Consultez les coordonnées, filières de télé-expertise et contacts des centres hospitaliers universitaires, hôpitaux généraux et centres de santé raccordés.
            </p>

            <div className="flex flex-wrap gap-3 pt-2 text-xs font-medium text-white/95">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1.5 backdrop-blur-md border border-white/20 shadow-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#74a638]" /> {directory.length} Établissements répertoriés
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1.5 backdrop-blur-md border border-white/20 shadow-xs">
                <MapPin className="h-3.5 w-3.5 text-cyan-300" /> {regions.length - 1} Régions sanitaires
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Filter and Content Section */}
      <section ref={listRef} className={cn("mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8", listVisible && "animate-fade-up")}>
        {/* Search & Filter Toolbar */}
        <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-soft">
          <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher par structure, ville, spécialité (ex: Treichville, Télé-ECG, Man)..."
                className="h-11 rounded-2xl pl-10 pr-9 border-border/80"
                aria-label="Rechercher"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11 rounded-2xl md:w-52 border-border/80" aria-label="Filtrer par catégorie">
                <SelectValue placeholder="Toutes catégories" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="rounded-xl">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="h-11 rounded-2xl md:w-52 border-border/80" aria-label="Filtrer par région">
                <SelectValue placeholder="Toutes régions" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {regions.map((r) => (
                  <SelectItem key={r} value={r} className="rounded-xl">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Filter Reset */}
          {(query || category !== "Toutes" || region !== "Toutes") && (
            <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
              <span className="text-muted-foreground">
                Filtres actifs : {query && `"${query}" `} {category !== "Toutes" && `• ${category} `}{" "}
                {region !== "Toutes" && `• ${region}`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setCategory("Toutes");
                  setRegion("Toutes");
                }}
                className="h-7 text-xs text-accent hover:text-accent font-semibold"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="mt-6 flex items-center justify-between px-1">
          <p className="text-sm font-semibold text-foreground">
            {results.length} structure{results.length > 1 ? "s" : ""} disponible{results.length > 1 ? "s" : ""}
          </p>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Interconnexion sécurisée vérifiée
          </span>
        </div>

        {/* Structures Grid */}
        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((d, i) => (
            <Card
              key={d.name}
              className="card-hover group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-soft"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-accent font-bold group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-base font-bold leading-snug text-foreground group-hover:text-accent transition-colors">
                        {d.name}
                      </h2>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-accent shrink-0" /> {d.city} · {d.region}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {d.category}
                  </Badge>
                </div>

                {/* Services list */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {d.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border/60 bg-surface px-2.5 py-1 text-[0.72rem] font-medium text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact actions */}
              <div className="mt-6 border-t border-border/70 pt-4 space-y-2 text-xs">
                <a
                  href={`tel:${d.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 rounded-xl bg-surface/60 px-3 py-2 font-semibold text-foreground transition-colors hover:bg-secondary hover:text-accent"
                >
                  <Phone className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>{d.phone}</span>
                </a>
                <a
                  href={`mailto:${d.email}`}
                  className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-muted-foreground transition-colors hover:text-accent break-all"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-accent" />
                  <span>{d.email}</span>
                </a>
              </div>
            </Card>
          ))}
        </div>

        {results.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-border/80 bg-card/50 py-16 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-base font-bold text-foreground">Aucune structure correspondante</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Essayez de modifier votre recherche ou d'élargir les critères de filtrage.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setCategory("Toutes");
                setRegion("Toutes");
              }}
              className="mt-4 rounded-full"
            >
              Effacer la recherche
            </Button>
          </div>
        )}
      </section>
    </>
  );
}