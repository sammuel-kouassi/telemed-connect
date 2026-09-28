import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, User, Calendar, Share2, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getArticleBySlug } from "@/lib/db";
import { useArticles } from "@/hooks/useData";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/articles/$slug")({
  loader: async ({ params }) => {
    const article = await getArticleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article indisponible" }, { name: "robots", content: "noindex" }] };
    }
    const { article } = loaderData;
    return {
      meta: [
        { title: `${article.title} — Télémédecine Côte d'Ivoire` },
        { name: "description", content: article.excerpt.slice(0, 155) },
        { property: "og:title", content: article.title },
        { property: "og:description", content: article.excerpt.slice(0, 155) },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: ArticleNotFound,
  component: ArticlePage,
});

function ArticleNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold text-foreground">Publication introuvable</h1>
      <p className="mt-3 text-muted-foreground">Cet article n'existe pas ou n'est plus accessible sur le portail.</p>
      <Button asChild className="mt-8 rounded-full">
        <Link to="/articles">Retour aux publications</Link>
      </Button>
    </div>
  );
}

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const { data: articles = [] } = useArticles();
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: contentRef, isVisible: contentVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: relatedRef, isVisible: relatedVisible } = useIntersectionObserver<HTMLDivElement>();

  return (
    <>
      {/* Header Banner */}
      <header
        ref={headerRef}
        className={cn(
          "surface-hero relative overflow-hidden text-primary-foreground py-14 sm:py-20",
          headerVisible && "animate-fade-up",
        )}
      >
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground/75 hover:text-primary-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Retour aux actualités
          </Link>

          <div>
            <Badge variant="secondary" className="font-semibold text-xs px-3 py-1">
              {article.category}
            </Badge>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl lg:text-5xl leading-tight tracking-tight">
            {article.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-5 text-xs sm:text-sm text-primary-foreground/80 border-t border-primary-foreground/15 pt-5">
            <span className="flex items-center gap-1.5 font-medium">
              <User className="h-4 w-4 text-accent" /> {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-accent" />
              <time dateTime={article.date}>
                {new Date(article.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-accent" /> {article.readingTime} de lecture
            </span>
          </div>
        </div>
      </header>

      {/* Main Article Body */}
      <article ref={contentRef} className={cn("mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8", contentVisible && "animate-fade-up")}>
        <div className="overflow-hidden rounded-3xl border border-border/80 shadow-lift">
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            width={1200}
            height={800}
            className="aspect-16/9 w-full object-cover"
          />
        </div>

        {/* Lead paragraph / chapeau */}
        <div className="mt-10 rounded-2xl bg-surface/70 p-6 border-l-4 border-accent text-base sm:text-lg font-medium leading-relaxed text-foreground shadow-xs">
          {article.excerpt}
        </div>

        {/* Article text content */}
        <div className="mt-8 space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
          {article.body.map((p, i) => (
            <div key={i} className="space-y-6">
              <p>{p}</p>
              {i === 1 && article.secondaryImage && (
                <div className="my-8 overflow-hidden rounded-3xl border border-border/80 bg-muted/30 shadow-soft">
                  <img
                    src={article.secondaryImage}
                    alt={`${article.title} - Illustration`}
                    loading="lazy"
                    className="w-full max-h-[500px] object-cover"
                  />
                  <div className="p-3 text-center text-xs text-muted-foreground border-t border-border/60 bg-card/60">
                    Dispositif et acquisition en temps réel — Réseau Télémédecine Côte d'Ivoire
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action card */}
        <div className="mt-12 rounded-3xl border border-border/80 bg-card p-8 shadow-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-lg font-bold text-foreground">Une question sur ce programme ?</h3>
            <p className="text-sm text-muted-foreground">
              La coordination technique nationale et les référents cliniques sont à l'écoute des praticiens et des directions hospitalières.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full shrink-0 font-semibold shadow-soft">
            <Link to="/contact">
              Écrire à la coordination
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </article>

      {/* Related Articles */}
      <section ref={relatedRef} className={cn("mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8 border-t border-border/80", relatedVisible && "animate-fade-up")}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="eyebrow text-accent">Poursuivre la lecture</span>
            <h2 className="mt-1 text-2xl font-bold text-foreground">Publications connexes</h2>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link to="/articles">Toutes les publications</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {related.map((a, i) => (
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
                <div className="p-6 space-y-2.5">
                  <Badge variant="secondary" className="font-semibold text-xs">
                    {a.category}
                  </Badge>
                  <h3 className="text-base font-bold leading-snug text-foreground group-hover:text-accent transition-colors">
                    {a.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-border/60 mt-2 flex items-center justify-between text-xs font-semibold text-accent">
                <span>Lire</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}