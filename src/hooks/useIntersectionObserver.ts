import { useEffect, useRef, useState } from 'react';

/**
 * Indique quand jouer l'animation d'apparition d'une section.
 * Une section déjà visible au chargement n'est jamais animée : elle reste affichée telle que
 * rendue par le serveur, sans disparaître puis réapparaître à l'hydratation.
 */
export function useIntersectionObserver<T extends HTMLElement>(options?: IntersectionObserverInit) {
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, ...options }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [options]);

    return { ref, isVisible };
}
