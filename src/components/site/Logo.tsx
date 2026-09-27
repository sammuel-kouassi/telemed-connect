import { Link } from "@tanstack/react-router";
import logo from "@/assets/telemed_logo.webp";
import { cn } from "@/lib/utils";

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link
      to="/"
      className={cn(
        "group flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#74a638] rounded-xl transition-opacity hover:opacity-95",
        className
      )}
      aria-label="Accueil du portail de télémédecine"
    >
      {/* Official Telemedecine Logo Image */}
      <div
        className={cn(
          "flex items-center rounded-xl py-0.5",
          inverted ? "bg-white px-2.5 py-1 shadow-xs ring-1 ring-white/20" : ""
        )}
      >
        <img
          src={logo}
          alt="Logo Télémédecine Côte d'Ivoire"
          className="h-8 sm:h-9.5 w-auto max-w-[210px] object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </div>
    </Link>
  );
}
