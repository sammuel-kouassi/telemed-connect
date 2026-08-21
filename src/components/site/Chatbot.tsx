import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { from: "bot" | "user"; text: string; links?: { to: string; label: string }[] };

type Topic = {
  id: string;
  label: string;
  answer: string;
  links?: { to: string; label: string }[];
  follow?: string[];
};

const topics: Record<string, Topic> = {
  ecg: {
    id: "ecg",
    label: "Comment fonctionne le télé-ECG ?",
    answer:
      "Un infirmier formé réalise l'électrocardiogramme sur un appareil connecté. Le tracé est transmis de façon sécurisée à la plateforme, puis interprété par un cardiologue référent qui renvoie un compte rendu — en moins de 30 minutes en cas d'urgence signalée.",
    links: [
      { to: "/projets", label: "Voir la carte des sites" },
      { to: "/articles/tele-ecg-bilan-programme", label: "Lire le bilan du programme" },
    ],
    follow: ["sites", "rejoindre"],
  },
  sites: {
    id: "sites",
    label: "Où trouver un site connecté ?",
    answer:
      "Le réseau couvre aujourd'hui 12 localités et 24 structures, d'Abidjan à Odienné. La carte interactive des projets et l'annuaire vous permettent de filtrer par ville, région et service.",
    links: [
      { to: "/projets", label: "Carte interactive" },
      { to: "/annuaire", label: "Annuaire des structures" },
    ],
    follow: ["ecg", "contact"],
  },
  rejoindre: {
    id: "rejoindre",
    label: "Comment rejoindre le réseau ?",
    answer:
      "Adressez une demande via le formulaire de contact en précisant votre structure, son plateau technique et vos besoins. Une évaluation de faisabilité technique est ensuite planifiée avec la coordination.",
    links: [{ to: "/contact", label: "Formulaire de contact" }],
    follow: ["formation", "donnees"],
  },
  formation: {
    id: "formation",
    label: "Existe-t-il des formations ?",
    answer:
      "Oui : des séminaires de télé-formation sont diffusés chaque semaine vers les CHU et districts sanitaires, avec attestation de participation. Les supports et replays restent disponibles dans la médiathèque.",
    links: [
      { to: "/mediatheque", label: "Médiathèque" },
      { to: "/articles/tele-formation-competences", label: "En savoir plus" },
    ],
    follow: ["rejoindre", "sites"],
  },
  donnees: {
    id: "donnees",
    label: "Mes données sont-elles protégées ?",
    answer:
      "Les échanges passent par des plateformes sécurisées avec traçabilité des accès. Seuls les professionnels intervenant dans la prise en charge consultent les données, dans le respect du consentement du patient.",
    links: [{ to: "/faq", label: "Toutes les questions fréquentes" }],
    follow: ["ecg", "contact"],
  },
  contact: {
    id: "contact",
    label: "Parler à un humain",
    answer:
      "La coordination technique répond du lundi au vendredi, de 8h à 17h : +225 27 22 41 55 09 ou contact@telemedecine.ci. Vous pouvez aussi envoyer une demande détaillée via le formulaire.",
    links: [{ to: "/contact", label: "Écrire à la coordination" }],
    follow: ["sites", "formation"],
  },
};

const starters = ["ecg", "sites", "rejoindre", "formation", "donnees", "contact"];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "bot",
      text: "Bonjour 👋 Je suis l'assistant du portail de la télémédecine. Sur quoi puis-je vous renseigner ?",
    },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>(starters);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  function answer(topicId: string, userText?: string) {
    const topic = topics[topicId];
    if (!topic) return;
    setMessages((m) => [
      ...m,
      { from: "user", text: userText ?? topic.label },
      { from: "bot", text: topic.answer, links: topic.links },
    ]);
    setSuggestions(
      (topic.follow ?? starters).concat(starters.filter((s) => s !== topicId)).filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    const t = text.toLowerCase();
    const match =
      /ecg|électro|electro|cardio/.test(t)
        ? "ecg"
        : /où|ou |site|ville|carte|région|region|annuaire/.test(t)
          ? "sites"
          : /rejoin|adhér|adher|partenaire|inscri/.test(t)
            ? "rejoindre"
            : /formation|former|séminaire|seminaire|cours/.test(t)
              ? "formation"
              : /donnée|donnee|sécur|secur|confident|rgpd/.test(t)
                ? "donnees"
                : /contact|téléphone|telephone|humain|appel|mail/.test(t)
                  ? "contact"
                  : null;

    if (match) {
      answer(match, text);
    } else {
      setMessages((m) => [
        ...m,
        { from: "user", text },
        {
          from: "bot",
          text: "Je n'ai pas de réponse préparée pour cette question. Choisissez un sujet ci-dessous, ou écrivez à la coordination qui vous répondra directement.",
          links: [{ to: "/contact", label: "Écrire à la coordination" }],
        },
      ]);
      setSuggestions(starters.slice(0, 4));
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen((o) => !o)}
        size="lg"
        className="fixed right-4 bottom-4 z-50 h-14 gap-2 rounded-full pr-5 pl-4 shadow-lift sm:right-6 sm:bottom-6"
        aria-expanded={open}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="hidden sm:inline">{open ? "Fermer" : "Assistant"}</span>
      </Button>

      {open && (
        <div className="rise-in fixed right-3 bottom-22 z-50 flex h-[min(560px,72vh)] w-[min(400px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lift sm:right-6 sm:bottom-24">
          <div className="surface-hero flex items-center gap-3 px-4 py-3 text-primary-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Assistant Télémédecine</p>
              <p className="text-xs text-primary-foreground/70">Réponses guidées · 24/7</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.from === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-secondary text-secondary-foreground",
                  )}
                >
                  <p>{m.text}</p>
                  {m.links && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {m.links.map((l) => (
                        <Link
                          key={l.to + l.label}
                          to={l.to}
                          onClick={() => setOpen(false)}
                          className="rounded-full border border-accent/40 bg-card px-2.5 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border bg-surface/60 px-3 pt-3 pb-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {suggestions.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => answer(id)}
                  className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
                >
                  {topics[id]?.label}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Posez votre question…"
                aria-label="Votre question"
                className="h-10 flex-1 rounded-full border border-input bg-card px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="submit" size="icon" className="h-10 w-10 rounded-full" aria-label="Envoyer">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
