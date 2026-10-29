import { useState, useRef, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Drawer } from "vaul";
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
} from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const primaryNav = [
  { to: "/a-propos", label: "À propos" },
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
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openedByHoverRef = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const routerState = useRouterState();
  const currentPath = routerState?.location?.pathname ?? "";

  const isRessourcesActive = ressourceItems.some((item) =>
    currentPath.startsWith(item.to)
  );

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!ressourcesOpen) openedByHoverRef.current = true;
    setRessourcesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setRessourcesOpen(false);
      openedByHoverRef.current = false;
    }, 150);
  };

  // Un clic juste après l'ouverture au survol confirme l'ouverture au lieu de refermer le menu
  const handleTriggerClick = () => {
    if (ressourcesOpen && openedByHoverRef.current) {
      openedByHoverRef.current = false;
      return;
    }
    openedByHoverRef.current = false;
    setRessourcesOpen((prev) => !prev);
  };

  const focusItem = (index: number) => {
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (items.length === 0) return;
    items[(index + items.length) % items.length]?.focus();
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setRessourcesOpen(true);
      requestAnimationFrame(() => focusItem(0));
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const current = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "Escape") {
      e.preventDefault();
      setRessourcesOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(current + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(current - 1);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRessourcesOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  // Le fondu sous l'en-tête n'apparaît que lorsque du contenu défile dessous
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top institutional status ribbon */}
      <div className="relative z-50 border-b border-border/40 bg-card text-foreground">
        <div className="ci-accent-band w-full" aria-hidden="true" />
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex items-center gap-1.5 font-semibold text-foreground/90 whitespace-nowrap">
              <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              <span className="hidden sm:inline">Réseau Opérationnel 24/7 :</span>
              <span className="text-muted-foreground font-normal sm:font-medium sm:text-foreground">
                24 structures · 12 localités
              </span>
            </span>
            <span className="hidden text-border md:inline">|</span>
            <span className="hidden items-center gap-1 text-muted-foreground md:inline-flex whitespace-nowrap">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Données de santé souveraines
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+2250173996782"
              className="group flex items-center gap-1.5 font-medium text-muted-foreground whitespace-nowrap transition hover:text-brand-strong"
              title="Astreinte nationale cardiologique & coordination RAFT"
            >
              <Phone className="h-3 w-3 text-primary" aria-hidden="true" />
              <span className="hidden lg:inline">Astreinte :</span>
              <span className="font-semibold text-foreground group-hover:text-brand-strong transition">+225 01 73 99 67 82</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <header
        className="site-header sticky top-0 z-40 bg-background/85 backdrop-blur-xl backdrop-saturate-150"
        data-scrolled={scrolled}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 lg:gap-8 px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-2 xl:gap-3 lg:flex" aria-label="Navigation principale">
            {primaryNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                data-press
                className="relative rounded-full px-4 py-2 text-base font-medium text-muted-foreground whitespace-nowrap hover:bg-primary/10 hover:text-brand-strong"
                activeProps={{
                  className: "bg-primary/12 font-semibold text-brand-strong shadow-xs ring-1 ring-primary/25",
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* Menu groupé « Ressources » : survol, clic et clavier */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setRessourcesOpen(false);
              }}
            >
              <button
                ref={triggerRef}
                type="button"
                onClick={handleTriggerClick}
                onKeyDown={handleTriggerKeyDown}
                className={cn(
                  "group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-base font-medium outline-none whitespace-nowrap cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-ring",
                  isRessourcesActive || ressourcesOpen
                    ? "bg-primary/12 font-semibold text-brand-strong shadow-xs ring-1 ring-primary/25"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-brand-strong"
                )}
                aria-expanded={ressourcesOpen}
                aria-haspopup="menu"
                aria-controls="ressources-menu"
              >
                <span>Ressources</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-[rotate,opacity] duration-200 opacity-60 group-hover:opacity-100",
                    ressourcesOpen && "rotate-180 text-brand-strong"
                  )}
                />
              </button>

              {/* Le panneau descend depuis le bouton qui l'a ouvert */}
              <div
                id="ressources-menu"
                role="menu"
                aria-label="Ressources"
                onKeyDown={handleMenuKeyDown}
                className={cn(
                  "absolute left-0 top-full pt-2 z-50 origin-top-left duration-200 ease-out",
                  ressourcesOpen
                    ? "visible opacity-100 scale-100 translate-y-0 transition-[opacity,scale,translate]"
                    : "invisible opacity-0 scale-95 -translate-y-1 pointer-events-none transition-[opacity,scale,translate,visibility]"
                )}
              >
                <div className="w-64 rounded-2xl border border-border/80 bg-card/95 p-2 shadow-lift backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                  {ressourceItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = currentPath.startsWith(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        role="menuitem"
                        ref={(el) => {
                          itemRefs.current[idx] = el;
                        }}
                        onClick={() => setRessourcesOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 transition outline-none focus-visible:bg-primary/10",
                          isActive
                            ? "bg-primary/12 text-brand-strong"
                            : "hover:bg-primary/10 text-foreground"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                            isActive
                              ? "bg-primary text-white"
                              : "bg-primary/10 text-brand-strong"
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
          <div className="flex items-center gap-2.5">
            <Button
              asChild
              size="sm"
              className="relative hidden overflow-hidden rounded-full bg-primary hover:bg-brand-hover text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 sm:inline-flex whitespace-nowrap"
            >
              <Link to="/contact">
                <span className="flex items-center gap-2">
                  Nous contacter
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Button>

            {/* Menu mobile : panneau glissable (vaul) qui suit le doigt et se ferme d'un geste vers la droite */}
            <Drawer.Root open={open} onOpenChange={setOpen} direction="right">
              <Drawer.Trigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 rounded-xl border-border/80 lg:hidden"
                  aria-label={open ? "Fermer le menu principal" : "Ouvrir le menu principal"}
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
                <Drawer.Content
                  className="fixed inset-y-0 right-0 z-50 flex w-[88vw] max-w-sm flex-col justify-between overflow-y-auto border-l border-border bg-background p-6 shadow-lg outline-none"
                  aria-describedby={undefined}
                >
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                      <Drawer.Title className="text-base font-bold text-foreground flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Menu Principal
                      </Drawer.Title>
                      <Drawer.Close asChild>
                        <button
                          type="button"
                          className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                          aria-label="Fermer le menu principal"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </Drawer.Close>
                    </div>

                    <nav className="mt-6 flex flex-col gap-1.5" aria-label="Navigation mobile">
                      <p className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                        Navigation principale
                      </p>
                      {primaryNav.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          data-press
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-primary/10 hover:text-brand-strong active:bg-primary/15"
                          activeProps={{ className: "bg-primary/12 font-semibold text-brand-strong ring-1 ring-primary/25" }}
                        >
                          <span className="whitespace-nowrap">{item.label}</span>
                          <ArrowRight className="h-4 w-4 opacity-40" />
                        </Link>
                      ))}

                      <div className="my-2 border-t border-border/60" />

                      <p className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                        Ressources & Réseau
                      </p>
                      {ressourceItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          data-press
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-primary/10 hover:text-brand-strong active:bg-primary/15"
                          activeProps={{ className: "bg-primary/12 font-semibold text-brand-strong ring-1 ring-primary/25" }}
                        >
                          <span className="whitespace-nowrap">{item.label}</span>
                          <ArrowRight className="h-4 w-4 opacity-40" />
                        </Link>
                      ))}
                    </nav>
                  </div>

                  <div className="pt-6 border-t border-border space-y-4">
                    <div className="rounded-2xl bg-surface p-4 border border-border/60">
                      <p className="eyebrow text-brand-strong">Permanence médicale</p>
                      <p className="mt-1 text-sm font-bold text-foreground">+225 01 73 99 67 82</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Coordination RAFT · CHU de Yopougon</p>
                    </div>

                    <Button asChild className="w-full rounded-xl bg-primary hover:bg-brand-hover text-white shadow-md shadow-primary/20 font-semibold" size="lg">
                      <Link to="/contact" onClick={() => setOpen(false)}>
                        Demander un raccordement
                      </Link>
                    </Button>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          </div>
        </div>
      </header>
    </>
  );
}
