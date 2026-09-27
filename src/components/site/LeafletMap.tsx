import { useEffect, useRef, useState, useCallback } from "react";
import { programColors, type ProjectSite } from "@/data/site";
import { Compass, RotateCcw } from "lucide-react";
import type * as LType from "leaflet";

export default function LeafletMap({
  sites,
  activeId,
  onSelect,
  interactiveMode,
}: {
  sites: ProjectSite[];
  activeId?: string | null;
  onSelect?: (site: ProjectSite) => void;
  interactiveMode?: "select" | "popup";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LType.Map | null>(null);
  const markersRef = useRef<Record<string, LType.Marker>>({});
  const tileLayerRef = useRef<LType.TileLayer | null>(null);
  const [leafletLib, setLeafletLib] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Determine actual mode
  const mode = interactiveMode ?? (onSelect ? "select" : "popup");

  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // 1. Detect Dark Mode
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkDark = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkDark();

    const observer = new MutationObserver(() => checkDark());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // 2. Load Leaflet and CSS dynamically (SSR Safety)
  useEffect(() => {
    if (typeof window === "undefined") return;

    Promise.all([
      import("leaflet"),
      // @ts-ignore
      import("leaflet/dist/leaflet.css"),
    ]).then((modules: [any, any]) => {
      const leafletMod = modules[0];
      const leafletInstance = leafletMod.default || leafletMod;
      setLeafletLib(leafletInstance);
    });
  }, []);

  // Recenter handler
  const handleRecenter = useCallback(() => {
    if (!mapRef.current) return;
    const mobile = typeof window !== "undefined" && window.innerWidth < 640;
    mapRef.current.setView([7.35, -5.65], mobile ? 6.1 : 6.7, { animate: true });
  }, []);

  // 3. Initialize Map once leafletLib is loaded (clean zoom on Côte d'Ivoire)
  useEffect(() => {
    if (!leafletLib || !containerRef.current || mapRef.current) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const initialZoom = isMobile ? 6.1 : 6.7;
    const initialCenter: [number, number] = [7.35, -5.65];

    // Geographic center of Côte d'Ivoire with fractional zoom support
    const map = leafletLib.map(containerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomSnap: 0.1,
      zoomDelta: 0.5,
      minZoom: 5.5,
      maxZoom: 16,
      scrollWheelZoom: false,
      zoomControl: false,
    });

    // Add Zoom Control to the top-right
    leafletLib.control.zoom({ position: "topright" }).addTo(map);

    mapRef.current = map;

    // Dynamically adjust center & zoom on layout / resize
    const updateMapView = () => {
      if (!mapRef.current) return;
      const mobile = typeof window !== "undefined" && window.innerWidth < 640;
      mapRef.current.setView([7.35, -5.65], mobile ? 6.1 : 6.7);
    };

    // Invalidate size to ensure crisp rendering after layout paint
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        updateMapView();
      }
    }, 300);

    const handleResize = () => {
      updateMapView();
    };
    window.addEventListener("resize", handleResize);

    // Enable scroll wheel zoom on map click
    map.on("click", () => {
      map.scrollWheelZoom.enable();
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
      tileLayerRef.current = null;
    };
  }, [leafletLib]);

  // 4. Update Tile Layer: Clean OpenStreetMap tiles
  useEffect(() => {
    if (!leafletLib || !mapRef.current) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    tileLayerRef.current = leafletLib.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> · République de Côte d\'Ivoire',
      maxZoom: 18,
      subdomains: ["a", "b", "c"],
      className: isDarkMode ? "map-tiles-dark" : "map-tiles-light",
    }).addTo(mapRef.current);
  }, [leafletLib, isDarkMode]);

  // 5. Update Markers when sites/activeId/leafletLib change
  useEffect(() => {
    const map = mapRef.current;
    if (!leafletLib || !map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((m: any) => {
      if (m) m.remove();
    });
    markersRef.current = {};

    // Helper for marker icon
    const createMarkerIcon = (color: string, active: boolean) => {
      const size = active ? 26 : 18;
      const html = `
        <div class="relative flex items-center justify-center" style="width: ${size}px; height: ${size}px;">
          ${active ? `<span class="pulse-ring-leaflet" style="background-color: ${color};"></span>` : ""}
          <span style="
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background-color: ${color};
            border: 2.5px solid #ffffff;
            box-shadow: 0 3px 10px rgba(0,0,0,0.35);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            transform: ${active ? "scale(1.15)" : "scale(1)"};
          "></span>
        </div>
      `;
      return leafletLib.divIcon({
        className: "custom-leaflet-marker",
        html,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    };

    sites.forEach((site: ProjectSite) => {
      const active = site.id === activeId;
      const color = programColors[site.program] || "#0ea5e9";

      const marker = leafletLib.marker([site.lat, site.lon], {
        icon: createMarkerIcon(color, active),
        title: `${site.city} — ${site.program}`,
        zIndexOffset: active ? 1000 : 0,
      }).addTo(map);

      // Tooltip for both modes on hover
      marker.bindTooltip(
        `
        <div class="font-sans px-2 py-1">
          <strong class="block text-sm font-bold text-foreground leading-tight">${site.city}</strong>
          <span class="text-[10px] text-primary font-bold uppercase tracking-wider">${site.program} · ${site.structures} structure(s)</span>
        </div>
        `,
        {
          direction: "top",
          offset: [0, -10],
          className: "custom-leaflet-tooltip",
        }
      );

      if (mode === "select") {
        marker.on("click", () => {
          onSelectRef.current?.(site);
        });
      } else {
        const popupContent = `
          <div class="p-4 font-sans min-w-[220px] max-w-[260px]">
            <div class="flex items-center gap-1.5 mb-2">
              <span class="w-2.5 h-2.5 rounded-full inline-block" style="background-color: ${color}"></span>
              <span class="text-[10px] uppercase font-bold tracking-wider text-accent">${site.program}</span>
            </div>
            <h3 class="text-base font-extrabold text-foreground m-0 mb-1 leading-tight">${site.city}</h3>
            <p class="text-xs text-muted-foreground m-0 mb-3 leading-relaxed">${site.detail}</p>
            <div class="grid grid-cols-2 gap-2 text-[10px] border-t border-border/80 pt-2 mb-3">
              <div>
                <span class="block text-muted-foreground">Structures</span>
                <strong class="font-bold text-foreground text-sm">${site.structures}</strong>
              </div>
              <div>
                <span class="block text-muted-foreground">En service</span>
                <strong class="font-bold text-foreground text-sm">${site.since}</strong>
              </div>
            </div>
            <a href="/projets" class="inline-flex w-full items-center justify-center rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow hover:opacity-90 transition-opacity">
              Consulter la fiche &rarr;
            </a>
          </div>
        `;
        marker.bindPopup(popupContent, {
          offset: [0, -10],
          className: "custom-leaflet-popup",
        });
      }

      markersRef.current[site.id] = marker;
    });
  }, [leafletLib, sites, activeId, mode]);

  // 6. Pan to active site
  useEffect(() => {
    const map = mapRef.current;
    if (!leafletLib || !map || !activeId) return;

    const site = sites.find((s: ProjectSite) => s.id === activeId);
    if (site) {
      map.setView([site.lat, site.lon], 7.8, { animate: true });
    }
  }, [leafletLib, activeId, sites]);

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl border border-border bg-slate-100 dark:bg-slate-900 sm:h-[580px] lg:h-[620px]">
      {/* Dynamic styles to inject */}
      <style>{`
        @keyframes pulse-ring-leaflet {
          0% {
            transform: scale(0.6);
            opacity: 1;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        .pulse-ring-leaflet {
          position: absolute;
          width: 200%;
          height: 200%;
          border-radius: 50%;
          animation: pulse-ring-leaflet 1.8s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
          pointer-events: none;
        }
        .custom-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-leaflet-tooltip {
          background: var(--color-card) !important;
          color: var(--color-foreground) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: var(--radius-lg) !important;
          box-shadow: var(--shadow-lift) !important;
          padding: 8px 12px !important;
        }
        .custom-leaflet-tooltip::before {
          border-top-color: var(--color-border) !important;
        }
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          background: var(--color-card);
          color: var(--color-foreground);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-lift);
          padding: 0;
          overflow: hidden;
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 0;
        }
        .custom-leaflet-popup .leaflet-popup-tip-container {
          overflow: hidden;
        }
        .custom-leaflet-popup .leaflet-popup-tip {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          box-shadow: none;
        }
        .custom-leaflet-popup .leaflet-popup-close-button {
          color: var(--color-muted-foreground) !important;
          padding: 8px !important;
          font-size: 16px !important;
        }
        .custom-leaflet-popup .leaflet-popup-close-button:hover {
          color: var(--color-foreground) !important;
          background: transparent !important;
        }
        .leaflet-container {
          background: #e2e8f0 !important;
          font-family: inherit;
        }
        .map-tiles-dark {
          filter: brightness(0.7) invert(1) contrast(2.5) hue-rotate(180deg);
        }
      `}</style>

      {/* Loading overlay */}
      {!leafletLib && (
        <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center gap-3 bg-card/80 backdrop-blur-sm">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-accent border-t-transparent" />
          <span className="text-sm font-medium text-muted-foreground animate-pulse">
            Chargement de la carte de Côte d'Ivoire...
          </span>
        </div>
      )}

      {/* Map container */}
      <div ref={containerRef} className="h-full w-full" role="application" />

      {/* Floating Recenter Button (Top Left) */}
      <button
        type="button"
        onClick={handleRecenter}
        title="Recentrer la carte sur la Côte d'Ivoire"
        className="absolute top-3.5 left-3.5 z-[999] flex items-center gap-2 rounded-xl border border-border/80 bg-card/90 px-3 py-2 text-xs font-bold text-foreground shadow-lift backdrop-blur-md transition-all hover:bg-secondary hover:text-primary active:scale-95 cursor-pointer"
      >
        <Compass className="h-3.5 w-3.5 text-primary animate-spin-slow" />
        <span className="hidden sm:inline">Recentrer Côte d'Ivoire</span>
        <RotateCcw className="h-3 w-3 text-muted-foreground" />
      </button>

      {/* Floating Legend Overlay (Bottom Left) */}
      <div className="absolute bottom-3.5 left-3.5 z-[999] rounded-2xl border border-border/80 bg-card/95 p-3 shadow-lift backdrop-blur-md max-w-[210px] text-xs">
        <div className="font-bold mb-2 text-foreground flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Filières RAFT CI</span>
        </div>
        <div className="space-y-1.5">
          {Object.entries(programColors).map(([program, color]) => (
            <div key={program} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-card shadow-xs" style={{ backgroundColor: color }} />
              <span className="text-muted-foreground font-medium text-[11px] leading-tight">{program}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}