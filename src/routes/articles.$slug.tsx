import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { articles } from "@/data/site";

export const Route = createFileRoute("/articles/$slug")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
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
      <h1 className="text-3xl font-bold">Article introuvable</h1>
      <p className="mt-3 text-muted-foreground">Cet article n'existe pas ou n'est plus publié.</p>
      <Button asChild className="mt-8">
        <Link to="/articles">Retour aux actualités</Link>
      </Button>
    </div>
  );
}

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <header className="surface-hero relative overflow-hidden text-primary-foreground">
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <Link
            to="/articles"
            className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/75 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Actualités
          </Link>
          <Badge variant="secondary" className="mt-6">
            {article.category}
          </Badge>
          <h1 className="mt-4 text-3xl leading-tight font-extrabold sm:text-4xl">{article.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-foreground/75">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> {article.author}
            </span>
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {article.readingTime}
            </span>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          width={1200}
          height={800}
          className="aspect-16/9 w-full rounded-2xl object-cover shadow-soft"
        />
        <p className="mt-8 border-l-2 border-accent pl-5 text-lg leading-relaxed text-foreground">{article.excerpt}</p>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Une question sur ce programme ?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            La coordination technique du réseau répond aux structures et aux professionnels de santé.
          </p>
          <Button asChild className="mt-4">
            <Link to="/contact">Contacter la coordination</Link>
          </Button>
        </div>
      </article>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">À lire également</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {related.map((a) => (
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
                <CardContent className="space-y-2">
                  <Badge variant="secondary">{a.category}</Badge>
                  <h3 className="text-base leading-snug font-semibold group-hover:text-accent">{a.title}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
