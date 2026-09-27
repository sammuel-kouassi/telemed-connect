import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpCircle, Search, MessageSquare, ArrowRight, X, Sparkles, CheckCircle2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { faqCategories, faqItems } from "@/data/site";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Questions fréquentes sur la télémédecine en Côte d'Ivoire" },
      {
        name: "description",
        content:
          "Réponses aux questions des patients, professionnels de santé et structures sur la télémédecine, le télé-ECG, la formation et la sécurité des données.",
      },
      { property: "og:title", content: "FAQ — Télémédecine Côte d'Ivoire" },
      {
        property: "og:description",
        content: "Tout comprendre du fonctionnement de la télémédecine ivoirienne en quelques questions.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");

  const q = query.trim().toLowerCase();
  const items = faqItems.filter(
    (f) =>
      (category === "Tous" || f.category === category) &&
      (!q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: contentRef, isVisible: contentVisible } = useIntersectionObserver<HTMLDivElement>();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header Banner */}
      <header
        ref={headerRef}
        className={cn(
          "surface-hero relative overflow-hidden text-primary-foreground py-16 sm:py-20",
          headerVisible && "animate-fade-up",
        )}
      >
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Centre d'Aide & Questions Fréquentes</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-3xl">
            Toutes les réponses à vos questions sur{" "}
            <span className="text-transparent bg-gradient-to-r from-cyan-200 via-teal-100 to-amber-200 bg-clip-text">
              la télémédecine.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base sm:text-lg text-primary-foreground/85 leading-relaxed">
            Modalités cliniques du télé-ECG, raccordement de plateau technique, sécurité des données patients et formations continues.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-xs font-medium text-primary-foreground/80">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3.5 py-1.5 backdrop-blur-sm border border-primary-foreground/15">
              <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> {faqItems.length} Réponses officielles validées
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3.5 py-1.5 backdrop-blur-sm border border-primary-foreground/15">
              <MessageSquare className="h-3.5 w-3.5 text-cyan-300" /> Assistant interactif 24/7 disponible
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section ref={contentRef} className={cn("mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8", contentVisible && "animate-fade-up")}>
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par mot-clé (ex: télé-ECG, coût, données, consentement, délai)..."
            className="h-14 rounded-2xl pl-12 pr-10 text-base border-border/80 shadow-soft bg-card"
            aria-label="Rechercher une question"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {["Tous", ...faqCategories].map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className="rounded-full transition-all text-xs"
            >
              {c}
            </Button>
          ))}
        </div>

        {/* Accordion Questions */}
        <Accordion type="single" collapsible className="mt-8 space-y-4">
          {items.map((f, i) => (
            <AccordionItem
              key={f.question}
              value={`item-${i}`}
              className="rounded-3xl border border-border/80 bg-card px-6 py-1 shadow-soft transition-all hover:border-accent/40"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <AccordionTrigger className="text-left text-base sm:text-lg font-bold text-foreground hover:no-underline hover:text-accent transition-colors py-4">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base leading-relaxed text-muted-foreground pb-5 pt-1">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {items.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-border/80 bg-card/50 py-16 text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-base font-bold text-foreground">Aucune question ne correspond à votre recherche</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Veuillez reformuler ou utiliser l'assistant virtuel en bas à droite de votre écran.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setCategory("Tous");
              }}
              className="mt-4 rounded-full"
            >
              Afficher toutes les questions
            </Button>
          </div>
        )}

        {/* Assistance Card */}
        <div className="mt-14 rounded-3xl border border-border/80 bg-card p-8 shadow-soft text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-accent">
            <HelpCircle className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-foreground">Vous ne trouvez pas votre réponse ?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Notre assistant interactif disponible en bas à droite répond 24h/24, et notre équipe de coordination prend en charge toutes les questions institutionnelles ou techniques.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full shadow-soft font-semibold">
              <Link to="/contact">
                Poser une question à la coordination
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}