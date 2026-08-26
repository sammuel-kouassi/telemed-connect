import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="surface-hero mt-24 text-primary-foreground">
      <div className="stagger-grid mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo inverted />
          <p className="max-w-xs text-sm text-primary-foreground/75">
            Portail national d'information et de coordination de la télémédecine en Côte d'Ivoire, animé par le
            réseau RAFT et ses partenaires.
          </p>
        </div>

        <div>
          <h3 className="eyebrow text-primary-foreground/60">Explorer</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/projets", label: "Projets & carte" },
              { to: "/annuaire", label: "Annuaire des structures" },
              { to: "/mediatheque", label: "Médiathèque" },
              { to: "/articles", label: "Actualités" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/75 transition-colors hover:text-primary-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-primary-foreground/60">Ressources</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/partenaires", label: "Partenaires" },
              { to: "/faq", label: "Questions fréquentes" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/75 transition-colors hover:text-primary-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-primary-foreground/60">Nous joindre</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              CHU de Yopougon, Abidjan, Côte d'Ivoire
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              <a href="tel:+2252722415509" className="hover:text-primary-foreground">
                +225 27 22 41 55 09
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <a href="mailto:contact@telemedecine.ci" className="hover:text-primary-foreground">
                contact@telemedecine.ci
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Portail de la télémédecine en Côte d'Ivoire. Tous droits réservés.</p>
          <p>RAFT — Réseau en Afrique Francophone pour la Télémédecine</p>
        </div>
      </div>
    </footer>
  );
}
