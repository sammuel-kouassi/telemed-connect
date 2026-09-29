import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Send,
  X,
  Sparkles,
  HeartPulse,
  MapPin,
  Building2,
  GraduationCap,
  ShieldCheck,
  PhoneCall,
  RotateCcw,
  Headphones,
  CheckCheck,
  ArrowRight,
  Stethoscope,
  Info,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = {
  from: "bot" | "user";
  text: string;
  time?: string;
  links?: { to: string; label: string }[];
};

type Topic = {
  id: string;
  label: string;
  shortLabel: string;
  icon: typeof HeartPulse;
  answer: string;
  links?: { to: string; label: string }[];
  follow?: string[];
};

const topics: Record<string, Topic> = {
  ecg: {
    id: "ecg",
    label: "Comment fonctionne le télé-ECG ?",
    shortLabel: "Télé-ECG d'urgence",
    icon: HeartPulse,
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
    shortLabel: "Centres connectés (24)",
    icon: MapPin,
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
    shortLabel: "Raccorder ma structure",
    icon: Building2,
    answer:
      "Adressez une demande via le formulaire de contact en précisant votre structure, son plateau technique et vos besoins. Un audit de connectivité et de faisabilité est planifié avec la coordination.",
    links: [{ to: "/contact", label: "Formulaire de contact" }],
    follow: ["formation", "donnees"],
  },
  formation: {
    id: "formation",
    label: "Existe-t-il des formations ?",
    shortLabel: "Télé-formations & E-cours",
    icon: GraduationCap,
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
    shortLabel: "Sécurité & Chiffrement HDS",
    icon: ShieldCheck,
    answer:
      "Les flux médicaux transitent sur des canaux chiffrés de bout-en-bout avec traçabilité intégrale des accès. Seuls les soignants directement habilités accèdent aux dossiers patients conformément aux exigences HDS.",
    links: [{ to: "/faq", label: "Toutes les questions fréquentes" }],
    follow: ["ecg", "contact"],
  },
  contact: {
    id: "contact",
    label: "Parler à la coordination",
    shortLabel: "Astreinte & Contacts",
    icon: PhoneCall,
    answer:
      "La coordination technique répond au +225 01 73 99 67 82 / +225 07 49 42 30 73 ou info@telemedecine.ci (Lundi-Vendredi 9h-17h, Samedi 10h-12h). L'astreinte Télé-ECG d'urgence est opérationnelle 24h/24 7j/7.",
    links: [{ to: "/contact", label: "Écrire à la coordination" }],
    follow: ["sites", "formation"],
  },
};

const starters = ["ecg", "sites", "rejoindre", "formation", "donnees", "contact"];

const getFormattedTime = () =>
  new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "bot",
      text: "Bonjour 👋 Je suis le conseiller virtuel du réseau national de télémédecine en Côte d'Ivoire. Comment puis-je vous renseigner aujourd'hui ?",
      time: getFormattedTime(),
    },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>(starters);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isTyping, open]);

  function answer(topicId: string, userText?: string) {
    const topic = topics[topicId];
    if (!topic) return;

    const userMessage: Msg = {
      from: "user",
      text: userText ?? topic.label,
      time: getFormattedTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Msg = {
        from: "bot",
        text: topic.answer,
        time: getFormattedTime(),
        links: topic.links,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (topic.follow && topic.follow.length > 0) {
        setSuggestions(topic.follow);
      } else {
        setSuggestions(starters.slice(0, 4));
      }
    }, 450);
  }

  function handleReset() {
    setMessages([
      {
        from: "bot",
        text: "Conversation réinitialisée. Comment puis-je vous aider ?",
        time: getFormattedTime(),
      },
    ]);
    setSuggestions(starters);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = draft.trim().toLowerCase();
    if (!query) return;
    setDraft("");

    const userMsg: Msg = {
      from: "user",
      text: draft,
      time: getFormattedTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

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

    setTimeout(() => {
      if (matched && topics[matched]) {
        const topic = topics[matched];
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: topic.answer,
            time: getFormattedTime(),
            links: topic.links,
          },
        ]);
        if (topic.follow) setSuggestions(topic.follow);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "Pour cette demande spécifique, notre coordination technique se tient à votre entière disposition pour vous guider de manière personnalisée.",
            time: getFormattedTime(),
            links: [
              { to: "/contact", label: "Écrire à la coordination" },
              { to: "/faq", label: "Consulter la FAQ" },
            ],
          },
        ]);
        setSuggestions(starters.slice(0, 4));
      }
      setIsTyping(false);
    }, 500);
  }

  return (
    <>
      {/* Floating Trigger Button with Premium Medical Pill Style */}
      <div className="fixed right-4 bottom-5 z-50 sm:right-6 sm:bottom-6">
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-[#74a638] to-[#5e8c2a] text-white p-2.5 sm:pl-3 sm:pr-5 shadow-2xl hover:shadow-glow hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer"
            aria-expanded={false}
            aria-label="Ouvrir l'assistant virtuel"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-white shadow-inner">
              <Headphones className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-[#5e8c2a]" />
              </span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest leading-none">
                Astreinte 24/7
              </span>
              <span className="text-sm font-extrabold text-white tracking-tight mt-0.5">
                Assistant RAFT
              </span>
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#031422] text-white shadow-2xl hover:bg-[#74a638] transition-all duration-300 border border-white/20 hover:rotate-90 active:scale-95 cursor-pointer"
            aria-expanded={true}
            aria-label="Fermer l'assistant virtuel"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Floating Chat Modal */}
      {open && (
        <div className="rise-in fixed right-3 bottom-20 z-50 flex h-[min(620px,80vh)] w-[min(430px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-white/15 bg-card shadow-2xl backdrop-blur-xl sm:right-6 sm:bottom-24">
          {/* Header */}
          <div className="relative bg-[#031422] px-5 py-4 text-white border-b border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-[#74a638]/20 via-transparent to-transparent opacity-40 pointer-events-none" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#74a638] to-[#5e8c2a] text-white shadow-md border border-white/20">
                  <Stethoscope className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#031422]" />
                  </span>
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-white tracking-tight">Conseiller RAFT</p>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                      En ligne
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70">Réseau Médical de Côte d'Ivoire</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  title="Réinitialiser la conversation"
                  className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  aria-label="Réinitialiser la conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  title="Fermer"
                  className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 space-y-3.5 overflow-y-auto p-4 bg-muted/20">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-2.5", m.from === "user" ? "justify-end" : "justify-start")}>
                {m.from === "bot" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#74a638] text-white text-xs shadow-xs mt-1">
                    <Stethoscope className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm transition-all",
                    m.from === "user"
                      ? "rounded-br-xs bg-gradient-to-r from-[#74a638] to-[#5e8c2a] text-white font-medium shadow-md"
                      : "rounded-bl-xs bg-card text-foreground border border-border/70 shadow-xs",
                  )}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {m.links && (
                    <div className="mt-3 pt-2.5 border-t border-border/50 flex flex-col gap-1.5">
                      {m.links.map((l) => (
                        <Link
                          key={l.to + l.label}
                          to={l.to}
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center justify-between rounded-xl bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-[#74a638] hover:text-white transition-all group/link border border-border/50"
                        >
                          <span>{l.label}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {m.time && (
                    <div
                      className={cn(
                        "mt-1.5 flex items-center justify-end gap-1 text-[10px]",
                        m.from === "user" ? "text-white/70" : "text-muted-foreground",
                      )}
                    >
                      <span>{m.time}</span>
                      {m.from === "user" && <CheckCheck className="h-3 w-3 text-white/90" />}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs pl-9">
                <div className="flex items-center gap-1 bg-card border border-border/60 rounded-full px-3 py-1.5 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#74a638] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#74a638] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#74a638] animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="ml-1 text-[11px] font-medium text-foreground/80">L'assistant écrit…</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Footer: Suggestions & Input */}
          <div className="border-t border-border/70 bg-card p-3.5 space-y-3 shadow-lg">
            {/* Horizontal Suggestions Carousel */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1.5 px-0.5">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-[#74a638]" /> Suggestions d'orientation :
                </span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {suggestions.map((id) => {
                  const item = topics[id];
                  if (!item) return null;
                  const Icon = item.icon;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => answer(id)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 hover:bg-[#74a638]/10 hover:border-[#74a638] hover:text-[#5e8c2a] px-3 py-1 text-xs font-semibold text-foreground transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs"
                    >
                      <Icon className="h-3.5 w-3.5 text-[#74a638]" />
                      <span>{item.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Posez votre question (ex: télé-ECG, Man, contact)…"
                aria-label="Votre question"
                className="h-11 w-full rounded-full border border-border/80 bg-muted/30 pl-4 pr-12 text-xs sm:text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-[#74a638] focus:bg-card focus:ring-2 focus:ring-[#74a638]/20"
              />
              <button
                type="submit"
                disabled={!draft.trim() || isTyping}
                aria-label="Envoyer le message"
                className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#74a638] text-white shadow-sm transition-all hover:bg-[#68982f] hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-[#74a638]" />
              <span>Service officiel RAFT CI · Données médicales protégées</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
