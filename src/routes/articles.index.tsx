import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, BookOpen, User, Calendar, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useArticles } from "@/hooks/useData";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import heroActualites from "@/assets/hero_actualites.jpg";

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
  const { data: articles = [] } = useArticles();
  const [category, setCategory] = useState("Toutes");
  const list = category === "Toutes" ? articles : articles.filter((a) => a.category === category);
  const [featured, ...rest] = list;

  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: contentRef, isVisible: contentVisible } = useIntersectionObserver<HTMLDivElement>();

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
            src={heroActualites}
            alt="Actualités et publications de télémédecine"
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
              <span>Publications & Analyses Cliniques</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              Le journal de la{" "}
              <span className="text-[#8bc34a]">
                télémédecine ivoirienne.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-white/90 leading-relaxed font-normal drop-shadow-sm">
              Évaluations d'impact, retours d'expérience cliniques de terrain et feuille de route pour le déploiement de la santé numérique nationale.
            </p>

            <div className="flex flex-wrap gap-3 pt-2 text-xs font-medium text-white/95">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1.5 backdrop-blur-md border border-white/20 shadow-xs">
                <Newspaper className="h-3.5 w-3.5 text-[#74a638]" /> {articles.length} Articles et rapports
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1.5 backdrop-blur-md border border-white/20 shadow-xs">
                <BookOpen className="h-3.5 w-3.5 text-cyan-300" /> Analyses cliniques & scientifiques
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section ref={contentRef} className={cn("mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8", contentVisible && "animate-fade-up")}>
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border/80 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">
            Catégorie :
          </span>
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className="rounded-full transition-all"
            >
              {c}
            </Button>
          ))}
        </div>

        {/* Featured Article Card */}
        {featured && (
          <Link
            to="/articles/$slug"
            params={{ slug: featured.slug }}
            className="group mt-8 block overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft transition-all duration-300 hover:shadow-lift hover:border-accent/50"
          >
            <div className="lg:grid lg:grid-cols-12">
              <div className="relative aspect-16/10 lg:aspect-auto lg:col-span-7 overflow-hidden bg-muted">
                <img
                  src={featured.image}
                  alt={featured.title}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground font-bold shadow-md">
                    À la une
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-5 space-y-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="font-semibold">
                    {featured.category}
                  </Badge>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-accent" />
                    <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {featured.readingTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-foreground group-hover:text-accent transition-colors">
                  {featured.title}
                </h2>

                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground line-clamp-3">
                  {featured.excerpt}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                    <User className="h-3.5 w-3.5 text-accent" /> Par {featured.author}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-accent group-hover:translate-x-1 transition-transform">
                    Lire l'article <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Secondary Articles Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((a, i) => (
            <Link
              key={a.slug}
              to="/articles/$slug"
              params={{ slug: a.slug }}
              className="card-hover group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div>
                <div className="aspect-16/10 overflow-hidden bg-muted">
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="font-semibold">
                      {a.category}
                    </Badge>
                    <time dateTime={a.date}>{formatDate(a.date)}</time>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {a.readingTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold leading-snug text-foreground group-hover:text-accent transition-colors">
                    {a.title}
                  </h3>
                  <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{a.excerpt}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-border/60 mt-4 flex items-center justify-between text-xs font-semibold text-accent">
                <span>Lire l'article</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}