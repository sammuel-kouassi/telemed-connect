import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { programColors, type ProjectSite } from "@/data/site";
import civBoundaryJson from "@/data/civ-boundary.json";

type PolyCoords = number[][][];
const civBoundary = civBoundaryJson as unknown as {
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: PolyCoords | PolyCoords[] };
};

function markerIcon(color: string, active: boolean) {
  const size = active ? 38 : 30;
  const dotSize = active ? 12 : 9;
  return L.divIcon({
    className: "ci-marker",
    html: `<span style="
      display:flex;width:${size}px;height:${size}px;align-items:center;justify-content:center;
      border:2px solid #fff;border-radius:50% 50% 50% 0;background:${color};
      box-shadow:0 2px 6px rgba(0,0,0,.35), 0 0 0 ${active ? 7 : 0}px ${color}33;
      transform:rotate(-45deg);
    "><span style="
      display:block;width:${dotSize}px;height:${dotSize}px;border-radius:9999px;
      background:#fff;transform:rotate(45deg);
    "></span></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

export default function LeafletMap({
  sites,
  activeId,
  onSelect,
}: {
  sites: ProjectSite[];
  activeId?: string | null;
  onSelect?: (site: ProjectSite) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [7.54, -5.55],
      zoom: 6,
      scrollWheelZoom: true,
      zoomControl: true,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;

    // Délimitation exacte de la Côte d'Ivoire (geoBoundaries ADM0, domaine public)
    const border = L.geoJSON(civBoundary as never, {
      style: {
        color: "#0f766e",
        weight: 2.5,
        opacity: 1,
        fillColor: "#14b8a6",
        fillOpacity: 0.07,
        lineJoin: "round",
      },
      interactive: false,
    }).addTo(map);

    // Masque : assombrit tout ce qui est hors du territoire ivoirien
    const geom = civBoundary.geometry;
    const rings: L.LatLngExpression[][] = [
      [
        [-90, -360],
        [90, -360],
        [90, 360],
        [-90, 360],
      ],
    ];
    const polys: PolyCoords[] =
      geom.type === "MultiPolygon" ? (geom.coordinates as PolyCoords[]) : [geom.coordinates as PolyCoords];
    polys.forEach((poly) => {
      rings.push(poly[0]!.map(([lon, lat]) => [lat, lon] as L.LatLngExpression));
    });
    L.polygon(rings, {
      stroke: false,
      fillColor: "#0b1b23",
      fillOpacity: 0.35,
      interactive: false,
    }).addTo(map);

    const bounds = border.getBounds();
    map.fitBounds(bounds, { padding: [16, 16] });
    map.setMaxBounds(bounds.pad(0.6));
    map.setMinZoom(map.getBoundsZoom(bounds) - 1);

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // Sync markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    sites.forEach((site) => {
      const active = site.id === activeId;
      const marker = L.marker([site.lat, site.lon], {
        icon: markerIcon(programColors[site.program], active),
        title: `${site.city} — ${site.program}`,
        zIndexOffset: active ? 1000 : 0,
        keyboard: true,
      })
        .addTo(map)
        .bindTooltip(`<strong>${site.city}</strong><br/>${site.program}`, {
          direction: "top",
          offset: [0, -10],
        })
        .on("click", () => onSelectRef.current?.(site));
      markersRef.current[site.id] = marker;
    });
  }, [sites, activeId]);

  // Recentre sur le site actif
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeId) return;
    const site = sites.find((s) => s.id === activeId);
    if (site) map.panTo([site.lat, site.lon], { animate: true });
  }, [activeId, sites]);

  return (
    <div
      ref={containerRef}
      className="h-[460px] w-full overflow-hidden rounded-xl border border-border sm:h-[560px]"
      role="application"
      aria-label="Carte interactive des sites de télémédecine en Côte d'Ivoire"
    />
  );
}
