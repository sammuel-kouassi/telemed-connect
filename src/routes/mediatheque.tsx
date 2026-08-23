import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, ImageIcon, PlayCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { mediaItems, mediaThemes, type MediaItem } from "@/data/site";

export const Route = createFileRoute("/mediatheque")({
  head: () => ({
    meta: [
      { title: "Médiathèque — Photos, vidéos et documents de la télémédecine ivoirienne" },
      {
        name: "description",
        content:
          "Photos de terrain, replays de télé-formation et documents techniques du réseau de télémédecine en Côte d'Ivoire, filtrables par thématique.",
      },
      { property: "og:title", content: "Médiathèque — Télémédecine Côte d'Ivoire" },
      {
        property: "og:description",
        content: "Ressources visuelles et documentaires du réseau RAFT Côte d'Ivoire.",
      },
    ],
  }),
  component: MediathequePage,
});

const typeIcon = {
  Photo: ImageIcon,
  Vidéo: PlayCircle,
  Document: FileText,
} as const;

function MediathequePage() {
  const [theme, setTheme] = useState("Tous");
  const [type, setType] = useState<"Tous" | MediaItem["type"]>("Tous");
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const items = mediaItems.filter(
    (m) => (theme === "Tous" || m.theme === theme) && (type === "Tous" || m.type === type),
  );

  return (
    <>
      <header className="surface-hero relative overflow-hidden text-primary-foreground">
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="eyebrow text-primary-foreground/70">Médiathèque</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Images, vidéos et documents du réseau</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Retrouvez les traces du terrain, les replays de télé-formation et les documents techniques mis à
            disposition des équipes.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {mediaThemes.map((t) => (
              <Button
                key={t}
                size="sm"
                variant={theme === t ? "default" : "outline"}
                onClick={() => setTheme(t)}
                aria-pressed={theme === t}
              >
                {t}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(["Tous", "Photo", "Vidéo", "Document"] as const).map((t) => (
              <Button
                key={t}
                size="sm"
                variant={type === t ? "secondary" : "ghost"}
                onClick={() => setType(t)}
                aria-pressed={type === t}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => {
            const Icon = typeIcon[m.type];
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelected(m)}
                className="card-hover group overflow-hidden rounded-2xl border border-border bg-card text-left"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.title}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium backdrop-blur">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {m.type}
                  </span>
                </div>
                <div className="space-y-2 p-5">
                  <Badge variant="secondary">{m.theme}</Badge>
                  <h2 className="text-base leading-snug font-semibold">{m.title}</h2>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{m.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {items.length === 0 && (
          <p className="mt-10 rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            Aucun média ne correspond à ces filtres.
          </p>
        )}
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0" showCloseButton={false}>
          {selected && (
            <>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 z-10 rounded-full bg-background/85 p-2 backdrop-blur transition-colors hover:bg-background"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={selected.image}
                alt={selected.title}
                className="max-h-[60vh] w-full object-cover"
                width={1200}
                height={800}
              />
              <div className="space-y-2 p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{selected.theme}</Badge>
                  <span>{selected.type}</span>
                  <time dateTime={selected.date}>
                    {new Date(selected.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <DialogTitle className="text-xl">{selected.title}</DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
