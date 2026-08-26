import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { articles } from "@/data/site";

export const Route = createFileRoute("/articles/")({
  head: () => ({
    meta: [
      { title: "Actualités & publications — Télémédecine Côte d'Ivoire" },
      {
        name: "description",
        content:
          "Actualités, retours d'expérience et publications du réseau ivoirien de télémédecine : télé-ECG, télé-expertise, formation et santé numérique.",
      },
      { property: "og:title", content: "Actualités & publications — Télémédecine Côte d'Ivoire" },
      {
        property: "og:description",
        content: "Suivez les avancées de la télémédecine en Côte d'Ivoire, projet par projet.",
      },
    ],
  }),
  component: ArticlesPage,
});

const categories = ["Toutes", "Actualité", "Projet", "Formation", "Recherche"];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function ArticlesPage() {
  const [category, setCategory] = useState("Toutes");
  const list = category === "Toutes" ? articles : articles.filter((a) => a.category === category);
  const [featured, ...rest] = list;

  return (
    <>
      <header className="surface-hero relative overflow-hidden text-primary-foreground">
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="eyebrow text-primary-foreground/70">Actualités</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Le journal du réseau</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Comptes rendus de projets, résultats d'évaluation et orientations techniques de la télémédecine ivoirienne.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
            >
              {c}
            </Button>
          ))}
        </div>

        {featured && (
          <Link to="/articles/$slug" params={{ slug: featured.slug }} className="group mt-8 block">
            <Card className="card-hover overflow-hidden border-border/70 pt-0 lg:grid lg:grid-cols-2">
              <div className="aspect-16/10 overflow-hidden lg:aspect-auto lg:h-full">
                <img
                  src={featured.image}
                  alt={featured.title}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardContent className="flex flex-col justify-center gap-4 p-6 lg:p-10">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Badge>{featured.category}</Badge>
                  <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {featured.readingTime}
                  </span>
                </div>
                <h2 className="text-2xl leading-tight font-bold group-hover:text-accent sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="text-muted-foreground">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  Lire l'article <ArrowRight className="h-4 w-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        )}

        <div className="stagger-grid mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <Link key={a.slug} to="/articles/$slug" params={{ slug: a.slug }} className="group">
              <Card className="card-hover h-full overflow-hidden border-border/70 pt-0">
                <div className="aspect-16/10 overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="secondary">{a.category}</Badge>
                    <time dateTime={a.date}>{formatDate(a.date)}</time>
                  </div>
                  <h2 className="text-lg leading-snug font-semibold group-hover:text-accent">{a.title}</h2>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{a.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {list.length === 0 && (
          <p className="mt-10 rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            Aucun article dans cette catégorie pour le moment.
          </p>
        )}
      </section>
    </>
  );
}
