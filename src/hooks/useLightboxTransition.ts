import { useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";

const NAME = "lightbox-image";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void>; ready: Promise<void> };
};

function canMorph(): boolean {
  if (typeof document === "undefined") return false;
  if (!(document as ViewTransitionDocument).startViewTransition) return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Ouvre une visionneuse (Dialog) en faisant grandir l'image depuis la vignette cliquée,
 * puis la referme vers cette même vignette (View Transitions API).
 * Sans support navigateur ou en mouvement réduit : ouverture/fermeture classiques.
 */
export function useLightboxTransition<T>() {
  const [item, setItem] = useState<T | null>(null);
  const sourceRef = useRef<HTMLImageElement | null>(null);
  const morphRef = useRef(false);

  function open(trigger: HTMLElement, next: T, morph = true) {
    const img = trigger.querySelector("img");
    sourceRef.current = img;
    morphRef.current = morph && !!img && canMorph();
    if (!morphRef.current || !img) {
      setItem(next);
      return;
    }
    img.style.viewTransitionName = NAME;
    const vt = (document as ViewTransitionDocument).startViewTransition!(() => {
      img.style.viewTransitionName = "";
      flushSync(() => setItem(next));
    });
    vt.ready.catch(() => {});
    vt.finished.catch(() => {});
  }

  function close() {
    const img = sourceRef.current;
    if (!morphRef.current || !img || !img.isConnected || !canMorph()) {
      setItem(null);
      return;
    }
    const vt = (document as ViewTransitionDocument).startViewTransition!(() => {
      flushSync(() => setItem(null));
      img.style.viewTransitionName = NAME;
    });
    vt.ready.catch(() => {});
    vt.finished
      .catch(() => {})
      .finally(() => {
        img.style.viewTransitionName = "";
      });
  }

  const morphing = item !== null && morphRef.current;

  return {
    item,
    open,
    close,
    /** À poser sur l'image agrandie dans la visionneuse */
    targetStyle: (morphing ? { viewTransitionName: NAME } : undefined) as CSSProperties | undefined,
    /** À poser sur DialogContent : l'animation est portée par la View Transition */
    contentStyle: (morphing ? { animation: "none" } : undefined) as CSSProperties | undefined,
  };
}
