import { useState, useRef, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Menu,
  X,
  Phone,
  ShieldCheck,
  Activity,
  ArrowRight,
  ChevronDown,
  Film,
  Handshake,
  HelpCircle,
  MapPin,
  Building2,
} from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const primaryNav = [
  { to: "/projets", label: "Projets & Carte" },
  { to: "/annuaire", label: "Annuaire des sites" },
  { to: "/articles", label: "Actualités" },
] as const;

const ressourceItems = [
  {
    to: "/mediatheque",
    label: "Médiathèque",
    desc: "Photos, vidéos & documents",
    icon: Film,
  },
  {
    to: "/partenaires",
    label: "Partenaires",
    desc: "Institutions & réseau RAFT",
    icon: Handshake,
  },
  {
    to: "/faq",
    label: "FAQ",
    desc: "Foire aux questions & adhésion",
    icon: HelpCircle,
  },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [ressourcesOpen, setRessourcesOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const routerState = useRouterState();
  const currentPath = routerState?.location?.pathname ?? "";

  const isRessourcesActive = ressourceItems.some((item) =>
    currentPath.startsWith(item.to)
  );

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setRessourcesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setRessourcesOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRessourcesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top institutional status ribbon */}
      <div className="relative z-50 border-b border-border/40 bg-card/95 text-foreground backdrop-blur-md">
        <div className="ci-accent-band w-full" aria-hidden="true" />
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex items-center gap-1.5 font-semibold text-foreground/90 whitespace-nowrap">
              <span className="inline-block h-2 w-2 rounded-full bg-[#74a638] animate-pulse" aria-hidden="true" />
              <span className="hidden sm:inline">Réseau Opérationnel 24/7 :</span>
              <span className="text-muted-foreground font-normal sm:font-medium sm:text-foreground">
                24 structures · 12 localités
              </span>
            </span>
            <span className="hidden text-border md:inline">|</span>
            <span className="hidden items-center gap-1 text-muted-foreground md:inline-flex whitespace-nowrap">
              <ShieldCheck className="h-3.5 w-3.5 text-[#74a638]" /> Données de santé souveraines
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+2250173996782"
              className="group flex items-center gap-1.5 font-medium text-muted-foreground whitespace-nowrap transition-colors hover:text-[#5e8c2a]"
              title="Astreinte nationale cardiologique & coordination RAFT"
            >
              <Phone className="h-3 w-3 text-[#74a638] transition-transform group-hover:scale-110" aria-hidden="true" />
              <span className="hidden lg:inline">Astreinte :</span>
              <span className="font-semibold text-foreground group-hover:text-[#5e8c2a] transition-colors">+225 01 73 99 67 82</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 shadow-xs backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 lg:gap-8 px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop navigation - roomy, spacious, and guaranteed 1-line tabs */}
          <nav className="hidden items-center gap-2 xl:gap-3 lg:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground whitespace-nowrap transition-all duration-200 hover:bg-[#74a638]/10 hover:text-[#5e8c2a] active:scale-95"
                activeProps={{
                  className: "bg-[#74a638]/12 font-semibold text-[#5e8c2a] dark:text-[#8bc34a] shadow-xs ring-1 ring-[#74a638]/25",
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* Grouped dropdown: Ressources (Smooth, zero-flicker hover & click) */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setRessourcesOpen((prev) => !prev)}
                className={cn(
                  "group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 outline-none whitespace-nowrap cursor-pointer select-none",
                  isRessourcesActive || ressourcesOpen
                    ? "bg-[#74a638]/12 font-semibold text-[#5e8c2a] dark:text-[#8bc34a] shadow-xs ring-1 ring-[#74a638]/25"
                    : "text-muted-foreground hover:bg-[#74a638]/10 hover:text-[#5e8c2a]"
                )}
                aria-expanded={ressourcesOpen}
                aria-haspopup="true"
              >
                <span>Ressources</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200 opacity-60 group-hover:opacity-100",
                    ressourcesOpen && "rotate-180 text-[#5e8c2a]"
                  )}
                />
              </button>

              {/* Dropdown panel with seamless bridge to avoid any mouse-leave flicker */}
              <div
                className={cn(
                  "absolute left-0 top-full pt-2 z-50 transition-all duration-200",
                  ressourcesOpen
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible -translate-y-1 pointer-events-none"
                )}
              >
                <div className="w-64 rounded-2xl border border-border/80 bg-card/95 p-2 shadow-lift backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                  {ressourceItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath.startsWith(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setRessourcesOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors outline-none",
                          isActive
                            ? "bg-[#74a638]/12 text-[#5e8c2a]"
                            : "hover:bg-[#74a638]/10 text-foreground"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                            isActive
                              ? "bg-[#74a638] text-white"
                              : "bg-[#74a638]/10 text-[#5e8c2a]"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                            {item.label}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {item.desc}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>

          {/* Desktop Right CTAs */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="relative hidden overflow-hidden rounded-full bg-[#74a638] hover:bg-[#68982f] text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-[#74a638]/25 transition-all duration-200 hover:shadow-lg hover:shadow-[#74a638]/35 hover:-translate-y-0.5 sm:inline-flex whitespace-nowrap"
            >
              <Link to="/contact">
                <span className="flex items-center gap-2">
                  Nous contacter
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>

            {/* Mobile Sheet Trigger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl border-border/80 lg:hidden"
                  aria-label="Ouvrir le menu principal"
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] max-w-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <SheetTitle className="text-base font-bold text-foreground flex items-center gap-2">
                      <Activity className="h-4 w-4 text-[#74a638]" />
                      Menu Principal
                    </SheetTitle>
                  </div>

                  <nav className="mt-6 flex flex-col gap-1.5">
                    <p className="px-4 text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground/70">
                      Navigation principale
                    </p>
                    {primaryNav.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-foreground transition-all hover:bg-[#74a638]/10 hover:text-[#5e8c2a] active:bg-[#74a638]/15"
                        activeProps={{ className: "bg-[#74a638]/12 font-semibold text-[#5e8c2a] dark:text-[#8bc34a] ring-1 ring-[#74a638]/25" }}
                      >
                        <span className="whitespace-nowrap">{item.label}</span>
                        <ArrowRight className="h-4 w-4 opacity-40" />
                      </Link>
                    ))}

                    <div className="my-2 border-t border-border/60" />

                    <p className="px-4 text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground/70">
                      Ressources & Réseau
                    </p>
                    {ressourceItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-[#74a638]/10 hover:text-[#5e8c2a] active:bg-[#74a638]/15"
                        activeProps={{ className: "bg-[#74a638]/12 font-semibold text-[#5e8c2a] dark:text-[#8bc34a] ring-1 ring-[#74a638]/25" }}
                      >
                        <span className="whitespace-nowrap">{item.label}</span>
                        <ArrowRight className="h-4 w-4 opacity-40" />
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="pt-6 border-t border-border space-y-4">
                  <div className="rounded-2xl bg-surface p-4 border border-border/60">
                    <p className="eyebrow text-[#5e8c2a] dark:text-[#8bc34a]">Permanence médicale</p>
                    <p className="mt-1 text-sm font-bold text-foreground">+225 01 73 99 67 82</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Coordination RAFT · CHU de Yopougon</p>
                  </div>

                  <Button asChild className="w-full rounded-xl bg-[#74a638] hover:bg-[#68982f] text-white shadow-md shadow-[#74a638]/20 font-semibold" size="lg">
                    <Link to="/contact" onClick={() => setOpen(false)}>
                      Demander un raccordement
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
