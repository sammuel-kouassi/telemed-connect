import { Suspense, lazy, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { CalendarClock, Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { projectSites, programColors, type ProjectSite } from "@/data/site";
import { cn } from "@/lib/utils";

const LeafletMap = lazy(() => import("@/components/site/LeafletMap"));

function MapSkeleton() {
  return (
    <div className="flex h-[460px] w-full items-center justify-center rounded-xl border border-border bg-secondary/50 text-sm text-muted-foreground sm:h-[560px]">
      Chargement de la carte…
    </div>
  );
}


export const Route = createFileRoute("/projets")({
  head: () => ({
    meta: [
      { title: "Projets de télémédecine & carte interactive — Côte d'Ivoire" },
      {
        name: "description",
        content:
          "Carte interactive des projets de télémédecine en Côte d'Ivoire : télé-ECG, télé-expertise et télé-formation, site par site, avec structures et année de démarrage.",
      },
      { property: "og:title", content: "Projets de télémédecine & carte interactive — Côte d'Ivoire" },
      {
        property: "og:description",
        content: "Explorez les 12 localités et 24 structures connectées au réseau ivoirien de télémédecine.",
      },
    ],
  }),
  component: ProjetsPage,
});

const programs = ["Tous", "Télé-ECG", "Télé-expertise", "Télé-formation"] as const;

function ProjetsPage() {
  const [filter, setFilter] = useState<(typeof programs)[number]>("Tous");
  const [activeId, setActiveId] = useState<string | null>("abidjan");

  const sites = filter === "Tous" ? projectSites : projectSites.filter((s) => s.program === filter);
  const active = sites.find((s) => s.id === activeId) ?? sites[0] ?? null;

  return (
    <>
      <header className="surface-hero relative overflow-hidden text-primary-foreground">
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="eyebrow text-primary-foreground/70">Projets</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl">
            La télémédecine ivoirienne, site par site
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Sélectionnez une localité sur la carte pour découvrir le programme déployé, le nombre de structures
            impliquées et l'année de mise en service.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {programs.map((p) => (
            <Button
              key={p}
              size="sm"
              variant={filter === p ? "default" : "outline"}
              onClick={() => setFilter(p)}
              aria-pressed={filter === p}
            >
              {p}
            </Button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-6">
            <ClientOnly fallback={<MapSkeleton />}>
              <Suspense fallback={<MapSkeleton />}>
                <LeafletMap
                  sites={sites}
                  activeId={active?.id ?? null}
                  onSelect={(s: ProjectSite) => setActiveId(s.id)}
                />
              </Suspense>
            </ClientOnly>
            <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
              {(Object.keys(programColors) as ProjectSite["program"][]).map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: programColors[p] }} />
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {active && (
              <Card className="border-accent/40 shadow-soft">
                <CardContent className="pt-6">
                  <Badge style={{ background: programColors[active.program] }} className="text-primary-foreground">
                    {active.program}
                  </Badge>
                  <h2 className="mt-3 text-2xl font-bold">{active.city}</h2>
                  <p className="text-sm text-muted-foreground">Région : {active.region}</p>
                  <p className="mt-4 text-sm leading-relaxed">{active.detail}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
                    <div>
                      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" /> Structures
                      </dt>
                      <dd className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold">
                        {active.structures}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarClock className="h-3.5 w-3.5" /> Depuis
                      </dt>
                      <dd className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold">{active.since}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            )}

            <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {sites.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                    active?.id === s.id
                      ? "border-accent bg-accent/10"
                      : "border-border bg-card hover:border-accent/40 hover:bg-secondary",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 shrink-0" style={{ color: programColors[s.program] }} />
                    <span>
                      <span className="block text-sm font-semibold">{s.city}</span>
                      <span className="block text-xs text-muted-foreground">{s.region}</span>
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">{s.program}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
