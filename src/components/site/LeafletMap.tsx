import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { programColors, type ProjectSite } from "@/data/site";

function markerIcon(color: string, active: boolean) {
  const size = active ? 26 : 18;
  return L.divIcon({
    className: "ci-marker",
    html: `<span style="
      display:block;width:${size}px;height:${size}px;border-radius:9999px;
      background:${color};border:3px solid #fff;
      box-shadow:0 0 0 ${active ? 8 : 0}px ${color}33, 0 2px 6px rgba(0,0,0,.35);
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
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

    // Contour de la Côte d'Ivoire (GeoJSON public)
    fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/CIV.geo.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((geo) => {
        if (!geo || !mapRef.current) return;
        const layer = L.geoJSON(geo, {
          style: {
            color: "#0f766e",
            weight: 2,
            fillColor: "#14b8a6",
            fillOpacity: 0.08,
          },
        }).addTo(mapRef.current);
        mapRef.current.fitBounds(layer.getBounds(), { padding: [16, 16] });
      })
      .catch(() => undefined);

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
