import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border/80 bg-gradient-to-b from-background via-surface/30 to-surface/60">
      {/* Subtle Ivorian national accent ribbon */}
      <div className="ci-accent-band w-full" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 items-start">
          {/* Col 1: Identity & Official Scope (5 cols) */}
          <div className="space-y-3 lg:col-span-5">
            <Logo />
            <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed max-w-sm">
              Portail national de coordination de la télémédecine en Côte d'Ivoire. Déploiement clinique, astreinte cardiologique et télé-formation sous l'égide du réseau RAFT et du Ministère de la Santé.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#74a638]/12 px-2.5 py-1 font-semibold text-[#5e8c2a] dark:text-[#8bc34a] border border-[#74a638]/25">
                <span className="h-1.5 w-1.5 rounded-full bg-[#74a638] animate-pulse" />
                Réseau Opérationnel 24/7 · 24 sites
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-[#74a638]" /> Données de santé souveraines
              </span>
            </div>
          </div>

          {/* Col 2: Solutions cliniques (2 cols) */}
          <div className="space-y-2.5 lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground/80">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { to: "/projets", label: "Télé-ECG d'urgence" },
                { to: "/projets", label: "Télé-expertise" },
                { to: "/mediatheque", label: "Télé-formation" },
                { to: "/contact", label: "Raccordement" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-muted-foreground transition-colors hover:text-[#5e8c2a] dark:hover:text-[#8bc34a] flex items-center gap-1.5 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-border group-hover:bg-[#74a638] transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Ressources (2 cols) */}
          <div className="space-y-2.5 lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground/80">
              Ressources
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { to: "/a-propos", label: "À propos du RAFT" },
                { to: "/projets", label: "Carte des 24 sites" },
                { to: "/annuaire", label: "Annuaire des sites" },
                { to: "/articles", label: "Actualités réseau" },
                { to: "/mediatheque", label: "Médiathèque" },
                { to: "/faq", label: "Foire aux questions" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-muted-foreground transition-colors hover:text-[#5e8c2a] dark:hover:text-[#8bc34a] flex items-center gap-1.5 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-border group-hover:bg-[#74a638] transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Permanence & Contact compact (3 cols) */}
          <div className="space-y-2.5 lg:col-span-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground/80">
              Permanence Médicale
            </h4>
            <div className="rounded-2xl border border-border/80 bg-card p-3 space-y-2 shadow-xs">
              <a
                href="tel:+2250173996782"
                className="group flex items-center gap-2.5 transition-colors"
                title="Appel direct astreinte cardiologique"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#74a638]/12 text-[#5e8c2a] group-hover:bg-[#74a638] group-hover:text-white transition-all">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground group-hover:text-[#5e8c2a] transition-colors">
                    +225 01 73 99 67 82
                  </p>
                  <p className="text-[10px] text-muted-foreground">Astreinte 24h/24 & 7j/7</p>
                </div>
              </a>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1.5 border-t border-border/60">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#74a638]" />
                <span className="truncate">CHU de Yopougon, Abidjan</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0 text-[#74a638]" />
                <a href="mailto:info@telemedecine.ci" className="truncate hover:text-foreground transition-colors">
                  info@telemedecine.ci
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom micro bar with safe area for chatbot */}
        <div className="mt-8 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground lg:pr-36">
          <p>© {new Date().getFullYear()} République de Côte d'Ivoire — Réseau National de Télémédecine (RAFT).</p>
          <div className="flex items-center gap-3.5">
            <Link to="/faq" className="hover:text-foreground transition-colors">
              Mentions Légales
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Assistance
            </Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-[#5e8c2a] dark:hover:text-[#8bc34a] transition-colors flex items-center gap-1 font-semibold text-foreground/90">
              <ShieldCheck className="h-3 w-3 text-[#74a638]" />
              Espace Administration
            </Link>
            <span>•</span>
            <span className="font-semibold text-foreground/80">v2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
