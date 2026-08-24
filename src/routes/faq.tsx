import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpCircle, Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { faqCategories, faqItems } from "@/data/site";

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="surface-hero relative overflow-hidden text-primary-foreground">
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="eyebrow text-primary-foreground/70">FAQ</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Questions fréquentes</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Patients, professionnels de santé, responsables de structures : les réponses aux questions les plus
            souvent posées à la coordination.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une question…"
            className="h-12 pl-9"
            aria-label="Rechercher une question"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["Tous", ...faqCategories].map((c) => (
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

        <Accordion type="single" collapsible className="mt-8 space-y-3">
          {items.map((f, i) => (
            <AccordionItem
              key={f.question}
              value={`item-${i}`}
              className="rounded-xl border border-border bg-card px-5"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {items.length === 0 && (
          <p className="mt-10 rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            Aucune question ne correspond à votre recherche.
          </p>
        )}

        <div className="mt-12 rounded-2xl border border-border bg-surface p-8 text-center">
          <HelpCircle className="mx-auto h-8 w-8 text-accent" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-bold">Vous ne trouvez pas votre réponse ?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            L'assistant du portail répond aux questions courantes, et la coordination technique prend le relais pour
            les demandes spécifiques.
          </p>
          <Button asChild className="mt-6">
            <Link to="/contact">Poser votre question</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
