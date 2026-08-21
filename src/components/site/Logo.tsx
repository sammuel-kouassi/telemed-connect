import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-3", className)} aria-label="Accueil du portail">
      <img
        src={logo}
        alt="Logo du portail de la télémédecine en Côte d'Ivoire"
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 transition-transform duration-300 group-hover:scale-105"
      />
      <span className="leading-tight">
        <span
          className={cn(
            "block font-[family-name:var(--font-display)] text-sm font-bold tracking-tight sm:text-base",
            inverted ? "text-primary-foreground" : "text-foreground",
          )}
        >
          Télémédecine
        </span>
        <span
          className={cn(
            "block text-[0.65rem] font-medium tracking-[0.14em] uppercase",
            inverted ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          Côte d'Ivoire
        </span>
      </span>
    </Link>
  );
}
