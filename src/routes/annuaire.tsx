import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { directory } from "@/data/site";

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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [region, setRegion] = useState("Toutes");

  const regions = useMemo(
    () => ["Toutes", ...Array.from(new Set(directory.map((d) => d.region))).sort()],
    [],
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

  return (
    <>
      <header className="surface-hero relative overflow-hidden text-primary-foreground">
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="eyebrow text-primary-foreground/70">Annuaire</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Structures & praticiens du réseau</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Trouvez rapidement la structure connectée la plus proche, ou le référent en charge d'un programme.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft sm:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une structure, une ville, un service…"
              className="pl-9"
              aria-label="Rechercher"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="sm:w-48" aria-label="Filtrer par catégorie">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="sm:w-48" aria-label="Filtrer par région">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {results.length} résultat{results.length > 1 ? "s" : ""}
        </p>

        <div className="stagger-grid mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.map((d) => (
            <Card key={d.name} className="card-hover border-border/70">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base leading-snug font-semibold">{d.name}</h2>
                  <Badge variant="secondary" className="shrink-0">
                    {d.category}
                  </Badge>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {d.city} · {d.region}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {d.services.map((s) => (
                    <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
                  <a href={`tel:${d.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-accent">
                    <Phone className="h-3.5 w-3.5" /> {d.phone}
                  </a>
                  <a href={`mailto:${d.email}`} className="flex items-center gap-2 break-all hover:text-accent">
                    <Mail className="h-3.5 w-3.5 shrink-0" /> {d.email}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {results.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            Aucune structure ne correspond à votre recherche.
          </div>
        )}
      </section>
    </>
  );
}
