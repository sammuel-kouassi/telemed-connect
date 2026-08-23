import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Handshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { partners } from "@/data/site";

export const Route = createFileRoute("/partenaires")({
  head: () => ({
    meta: [
      { title: "Partenaires du réseau de télémédecine — Côte d'Ivoire" },
      {
        name: "description",
        content:
          "Institutions, ONG, partenaires techniques et académiques qui soutiennent le déploiement de la télémédecine en Côte d'Ivoire.",
      },
      { property: "og:title", content: "Partenaires du réseau de télémédecine — Côte d'Ivoire" },
      {
        property: "og:description",
        content: "Découvrez les organisations qui rendent possible la télémédecine ivoirienne.",
      },
    ],
  }),
  component: PartenairesPage,
});

const types = ["Tous", "Institutionnel", "Technique", "ONG", "Académique"];

function PartenairesPage() {
  const [type, setType] = useState("Tous");
  const list = type === "Tous" ? partners : partners.filter((p) => p.type === type);

  return (
    <>
      <header className="surface-hero relative overflow-hidden text-primary-foreground">
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="eyebrow text-primary-foreground/70">Partenaires</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Une alliance au service du soin</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            La télémédecine ivoirienne repose sur une coopération continue entre institutions publiques, hôpitaux
            universitaires, ONG et partenaires techniques.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={type === t ? "default" : "outline"}
              onClick={() => setType(t)}
              aria-pressed={type === t}
            >
              {t}
            </Button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Card key={p.name} className="card-hover border-border/70">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <span className="surface-hero flex h-12 w-12 items-center justify-center rounded-xl font-[family-name:var(--font-display)] font-bold text-primary-foreground">
                    {p.initials}
                  </span>
                  <div>
                    <h2 className="text-base font-semibold">{p.name}</h2>
                    <Badge variant="secondary" className="mt-1">
                      {p.type}
                    </Badge>
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-accent">{p.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="surface-accent mt-14 flex flex-col items-start gap-6 rounded-3xl p-8 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div className="max-w-xl">
            <Handshake className="h-8 w-8" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Devenir partenaire du réseau</h2>
            <p className="mt-3 text-primary-foreground/85">
              Bailleurs, industriels du dispositif médical, universités ou collectivités : contribuez à étendre la
              couverture de la télémédecine sur le territoire.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link to="/contact">Proposer un partenariat</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
