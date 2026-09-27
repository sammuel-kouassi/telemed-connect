import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bot, MessageCircle, Send, X, Sparkles, User } from "lucide-react";
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
      "Un infirmier formé réalise l'électrocardiogramme sur un appareil connecté. Le tracé est transmis de façon sécurisée à la plateforme, puis analysé par un cardiologue référent qui renvoie un compte rendu structuré en moins de 30 minutes en cas d'urgence signalée.",
    links: [
      { to: "/projets", label: "Voir la carte des sites" },
      { to: "/articles/tele-ecg-bilan-programme", label: "Lire le bilan du programme" },
    ],
    follow: ["sites", "rejoindre"],
  },
  sites: {
    id: "sites",
    label: "Où trouver un centre connecté ?",
    answer:
      "Le réseau couvre aujourd'hui 12 localités et 24 structures, d'Abidjan à Odienné. La carte interactive des projets et l'annuaire vous permettent de filtrer par ville, région et filière médicale.",
    links: [
      { to: "/projets", label: "Carte interactive" },
      { to: "/annuaire", label: "Annuaire des structures" },
    ],
    follow: ["ecg", "contact"],
  },
  rejoindre: {
    id: "rejoindre",
    label: "Comment raccorder mon centre ?",
    answer:
      "Adressez une demande via le formulaire de contact en précisant votre structure, son plateau technique et vos besoins. Un audit de connectivité et de faisabilité est planifié avec la coordination.",
    links: [{ to: "/contact", label: "Formulaire de contact" }],
    follow: ["formation", "donnees"],
  },
  formation: {
    id: "formation",
    label: "Existe-t-il des formations ?",
    answer:
      "Oui : des séminaires de télé-formation médicale continue sont diffusés chaque semaine vers les CHU et districts sanitaires avec attestation de participation. Les replays restent consultables dans la médiathèque.",
    links: [
      { to: "/mediatheque", label: "Médiathèque & Replays" },
      { to: "/articles/tele-formation-competences", label: "En savoir plus" },
    ],
    follow: ["rejoindre", "sites"],
  },
  donnees: {
    id: "donnees",
    label: "Mes données sont-elles protégées ?",
    answer:
      "Les flux médicaux transitent sur des canaux chiffrés de bout-en-bout avec traçabilité intégrale des accès. Seuls les soignants directement habilités accèdent aux dossiers patients conformément aux exigences HDS.",
    links: [{ to: "/faq", label: "Toutes les questions fréquentes" }],
    follow: ["ecg", "contact"],
  },
  contact: {
    id: "contact",
    label: "Parler à la coordination",
    answer:
      "La coordination technique répond au +225 01 73 99 67 82 / +225 07 49 42 30 73 ou info@telemedecine.ci (Lundi-Vendredi 9h-17h, Samedi 10h-12h). L'astreinte Télé-ECG d'urgence est opérationnelle 24h/24 7j/7.",
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
      text: "Bonjour 👋 Je suis l'assistant officiel de la télémédecine ivoirienne. Comment puis-je vous orienter aujourd'hui ?",
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
    const botMsg: Msg = topic.links
      ? { from: "bot", text: topic.answer, links: topic.links }
      : { from: "bot", text: topic.answer };

    setMessages((prev) => [
      ...prev,
      { from: "user", text: userText ?? topic.label },
      botMsg,
    ]);

    if (topic.follow && topic.follow.length > 0) {
      setSuggestions(topic.follow);
    } else {
      setSuggestions(starters.slice(0, 4));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = draft.trim().toLowerCase();
    if (!query) return;
    setDraft("");

    let matched: string | null = null;
    if (query.includes("ecg") || query.includes("coeur") || query.includes("cardio") || query.includes("tracé")) {
      matched = "ecg";
    } else if (
      query.includes("site") ||
      query.includes("centre") ||
      query.includes("hopital") ||
      query.includes("chu") ||
      query.includes("ville") ||
      query.includes("où")
    ) {
      matched = "sites";
    } else if (query.includes("rejoindre") || query.includes("connecter") || query.includes("inscri") || query.includes("adher")) {
      matched = "rejoindre";
    } else if (query.includes("format") || query.includes("cours") || query.includes("seminaire") || query.includes("replay")) {
      matched = "formation";
    } else if (query.includes("donnee") || query.includes("secur") || query.includes("rgpd") || query.includes("confidential")) {
      matched = "donnees";
    } else if (query.includes("contact") || query.includes("telephon") || query.includes("mail") || query.includes("appel") || query.includes("parler")) {
      matched = "contact";
    }

    if (matched) {
      answer(matched, draft);
    } else {
      setMessages((prev) => [
        ...prev,
        { from: "user", text: draft },
        {
          from: "bot",
          text: "Pour cette question spécifique, nous vous recommandons de contacter la coordination technique ou de consulter notre foire aux questions détaillée.",
          links: [
            { to: "/contact", label: "Écrire à la coordination" },
            { to: "/faq", label: "Consulter la FAQ" },
          ],
        },
      ]);
      setSuggestions(starters.slice(0, 4));
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed right-4 bottom-5 z-50 sm:right-6 sm:bottom-6">
        <Button
          onClick={() => setOpen((o) => !o)}
          size="lg"
          className="relative h-14 gap-2.5 rounded-full px-5 shadow-lift font-bold bg-primary text-primary-foreground hover:shadow-glow transition-all duration-300"
          aria-expanded={open}
          aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant virtuel"}
        >
          {!open && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </span>
          )}
          {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5 text-accent" />}
          <span className="text-sm font-bold tracking-tight">
            {open ? "Fermer" : "Assistant RAFT"}
          </span>
        </Button>
      </div>

      {/* Floating Chat Modal */}
      {open && (
        <div className="rise-in fixed right-3 bottom-22 z-50 flex h-[min(580px,75vh)] w-[min(420px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lift sm:right-6 sm:bottom-24">
          {/* Header */}
          <div className="surface-hero flex items-center justify-between px-5 py-4 text-primary-foreground border-b border-primary-foreground/15">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-foreground/15 text-accent shadow-xs">
                <Bot className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold flex items-center gap-1.5">
                  Assistant Télémédecine
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </p>
                <p className="text-[0.7rem] text-primary-foreground/75">Réseau RAFT Côte d'Ivoire · En ligne</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
              aria-label="Fermer la boîte de dialogue"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-2.5", m.from === "user" ? "justify-end" : "justify-start")}>
                {m.from === "bot" && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-accent text-xs font-bold mt-0.5">
                    <Bot className="h-4 w-4" />
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[84%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-xs",
                    m.from === "user"
                      ? "rounded-br-xs bg-primary text-primary-foreground font-medium"
                      : "rounded-bl-xs bg-surface text-foreground border border-border/70",
                  )}
                >
                  <p>{m.text}</p>
                  {m.links && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.links.map((l) => (
                        <Link
                          key={l.to + l.label}
                          to={l.to}
                          onClick={() => setOpen(false)}
                          className="rounded-full border border-accent/40 bg-card px-3 py-1 text-xs font-bold text-accent transition-all hover:bg-accent hover:text-accent-foreground shadow-xs"
                        >
                          {l.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Footer Input & Suggestions */}
          <div className="border-t border-border/80 bg-surface/70 p-3.5 space-y-2.5">
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
              {suggestions.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => answer(id)}
                  className="rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-accent/60 hover:text-accent hover:bg-accent/5 active:scale-95"
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
                className="h-10 flex-1 rounded-full border border-input bg-card px-4 text-xs sm:text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-full" aria-label="Envoyer">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
