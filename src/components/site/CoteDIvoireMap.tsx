import { projectSites, programColors, type ProjectSite } from "@/data/site";
import { cn } from "@/lib/utils";

// Contour simplifié de la Côte d'Ivoire (longitude, latitude).
const outline: [number, number][] = [
  [-8.6, 7.4],
  [-8.3, 8.0],
  [-8.2, 8.5],
  [-7.9, 8.55],
  [-7.9, 9.4],
  [-8.0, 9.8],
  [-7.7, 10.0],
  [-7.0, 10.2],
  [-6.7, 10.4],
  [-6.2, 10.72],
  [-5.5, 10.4],
  [-5.0, 10.3],
  [-4.6, 9.7],
  [-4.3, 9.7],
  [-4.0, 9.9],
  [-3.2, 9.9],
  [-2.7, 9.5],
  [-2.8, 9.0],
  [-2.6, 8.2],
  [-3.2, 7.0],
  [-3.0, 6.2],
  [-2.75, 5.6],
  [-2.9, 5.1],
  [-3.6, 5.1],
  [-4.5, 5.2],
  [-5.5, 5.0],
  [-6.5, 4.8],
  [-7.0, 4.4],
  [-7.5, 4.4],
  [-7.6, 5.0],
  [-7.9, 5.5],
  [-8.6, 6.5],
];

const BOUNDS = { minLon: -8.7, maxLon: -2.5, minLat: 4.2, maxLat: 10.85 };
const W = 620;
const H = 700;

function project(lon: number, lat: number) {
  const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * W;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * H;
  return { x, y };
}

const outlinePath =
  outline
    .map(([lon, lat], i) => {
      const { x, y } = project(lon, lat);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ") + " Z";

export function CoteDIvoireMap({
  sites = projectSites,
  activeId,
  onSelect,
}: {
  sites?: ProjectSite[];
  activeId?: string | null;
  onSelect?: (site: ProjectSite) => void;
}) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Carte des sites de télémédecine en Côte d'Ivoire"
    >
      <defs>
        <linearGradient id="mapFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-secondary)" />
          <stop offset="100%" stopColor="color-mix(in oklab, var(--color-accent) 18%, var(--color-secondary))" />
        </linearGradient>
      </defs>

      <path
        d={outlinePath}
        fill="url(#mapFill)"
        stroke="var(--color-primary)"
        strokeWidth={2}
        strokeLinejoin="round"
        opacity={0.95}
      />

      {sites.map((site) => {
        const { x, y } = project(site.lon, site.lat);
        const active = activeId === site.id;
        const color = programColors[site.program];
        return (
          <g
            key={site.id}
            transform={`translate(${x} ${y})`}
            className={cn("cursor-pointer", onSelect ? "" : "pointer-events-none")}
            onClick={() => onSelect?.(site)}
            tabIndex={onSelect ? 0 : -1}
            role={onSelect ? "button" : undefined}
            aria-label={`${site.city} — ${site.program}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.(site);
              }
            }}
          >
            {active && <circle r={11} fill={color} opacity={0.35} className="pulse-ring" />}
            <circle r={active ? 9 : 6.5} fill={color} stroke="var(--color-background)" strokeWidth={2.5} />
            <text
              x={12}
              y={4.5}
              className="font-[family-name:var(--font-sans)]"
              fontSize={active ? 16 : 14}
              fontWeight={active ? 700 : 500}
              fill="var(--color-foreground)"
            >
              {site.city}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
