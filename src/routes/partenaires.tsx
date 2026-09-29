import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Handshake, Building2, Globe2, ShieldCheck, ArrowRight, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePartners } from "@/hooks/useData";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import heroPartenaires from "@/assets/hero_partenaires.jpg";

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

const types = ["Tous", "Institutionnel", "Académique"];

function PartenairesPage() {
  const { data: partners = [] } = usePartners();
  const [type, setType] = useState("Tous");
  const list = type === "Tous" ? partners : partners.filter((p) => p.type === type);

  const { ref: headerRef, isVisible: headerVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: contentRef, isVisible: contentVisible } = useIntersectionObserver<HTMLDivElement>();

  return (
    <>
      {/* Header Banner with Background Image */}
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
            src={heroPartenaires}
            alt="Alliance nationale et partenaires pour la télémédecine"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#031422]/95 via-[#031422]/80 to-[#031422]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020d17] via-transparent to-black/40" />
          <div className="absolute inset-0 bg-[#74a638]/10 mix-blend-overlay" />
          <div className="grid-pattern absolute inset-0 opacity-15" aria-hidden="true" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Écosystème & Coopérations Stratégiques</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight drop-shadow-md">
              Une alliance nationale & internationale{" "}
              <span className="text-[#8bc34a]">
                au service du soin.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-white/90 leading-relaxed font-normal drop-shadow-sm">
              La pérennité de la télémédecine ivoirienne repose sur une étroite synergie entre l'État, les centres hospitaliers universitaires, les bailleurs et les ONG pionnières.
            </p>

            <div className="flex flex-wrap gap-3 pt-2 text-xs font-medium text-white/95">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1.5 backdrop-blur-md border border-white/20 shadow-xs">
                <Building2 className="h-3.5 w-3.5 text-[#8bc34a]" /> {partners.length} Partenaires engagés
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1.5 backdrop-blur-md border border-white/20 shadow-xs">
                <Globe2 className="h-3.5 w-3.5 text-cyan-300" /> Coopération multilatérale & RAFT
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section ref={contentRef} className={cn("mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8", contentVisible && "animate-fade-up")}>
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border/80 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2 flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" /> Typologie :
          </span>
          {types.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={type === t ? "default" : "outline"}
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className="rounded-full transition-all"
            >
              {t}
            </Button>
          ))}
        </div>

        {/* Partners Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Card
              key={p.name}
              className="card-hover group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-soft"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-white p-2 shadow-xs group-hover:scale-105 transition-transform">
                    {p.logoImg ? (
                      <img src={p.logoImg} alt={p.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="font-[family-name:var(--font-display)] text-base font-extrabold text-primary">
                        {p.initials}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-bold leading-snug text-foreground group-hover:text-accent transition-colors">
                      {p.name}
                    </h2>
                    <Badge variant="secondary" className="mt-1 text-[0.7rem] font-semibold">
                      {p.type}
                    </Badge>
                  </div>
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-accent">{p.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Partenaire conventionné officiel
              </div>
            </Card>
          ))}
        </div>

        {/* Proposer un partenariat CTA */}
        <div className="surface-hero relative overflow-hidden rounded-3xl mt-16 p-8 sm:p-12 text-primary-foreground shadow-lift border border-primary-foreground/15">
          <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold text-accent uppercase tracking-wider">
                <Handshake className="h-3.5 w-3.5" />
                Rejoindre l'Alliance
              </span>
              <h2 className="text-2xl font-bold sm:text-3xl tracking-tight">
                Devenir partenaire du réseau national
              </h2>
              <p className="text-sm sm:text-base text-primary-foreground/80 leading-relaxed">
                Bailleurs, industriels du dispositif médical connecté, universités ou collectivités locales : contribuez à l'extension du réseau et à l'équipement des structures périphériques.
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 font-semibold shadow-soft">
              <Link to="/contact">
                Proposer un partenariat
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
