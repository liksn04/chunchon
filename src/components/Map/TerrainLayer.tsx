import { memo, useMemo } from 'react';
import type { GeoProjection } from 'd3-geo';
import { project, lineToPath, lineToSmoothPath } from '../../lib/projection';
import { useBattleStore } from '../../store/useBattleStore';
import { useBattle } from '../../battles/useBattle';
import type { TerrainPoint } from '../../types';

function PointSymbol({ p }: { p: TerrainPoint }) {
  switch (p.kind) {
    case 'city':
      return <rect x={-3.2} y={-3.2} width={6.4} height={6.4} fill="var(--ink)" />;
    case 'assembly':
      return (
        <circle r={7} fill="var(--nk-soft)" stroke="var(--nk)" strokeWidth={1.4} strokeDasharray="3 2" />
      );
    case 'peak':
      return <path d="M0,-5 L5,4 L-5,4 Z" fill="var(--contour-bistre)" />;
    case 'hill':
      return <path d="M0,-4 L4,3 L-4,3 Z" fill="none" stroke="var(--contour-bistre)" strokeWidth={1.4} />;
    case 'bridge':
      return (
        <path
          d="M-5,-4 C-2,-1.2 -2,1.2 -5,4 M5,-4 C2,-1.2 2,1.2 5,4"
          fill="none"
          stroke="var(--ink)"
          strokeWidth={1.5}
        />
      );
    case 'spot':
      return <path d="M-3,-3 L3,3 M-3,3 L3,-3" stroke="var(--ink-soft)" strokeWidth={1.5} />;
  }
}

function pointLabel(p: TerrainPoint): string {
  if (p.meta?.label?.text) return p.meta.label.text;
  if (p.kind === 'peak' && p.meta?.elevation) return `${p.name} ${p.meta.elevation}`;
  return p.name;
}

function alongLine(projection: GeoProjection, coords: [number, number][], t: number) {
  const idx = Math.min(coords.length - 1, Math.max(0, Math.round((coords.length - 1) * t)));
  return project(projection, coords[idx]);
}

function TerrainLayer({
  projection,
  k = 1,
  detail = false,
}: {
  projection: GeoProjection;
  k?: number;
  detail?: boolean;
}) {
  const showLabels = useBattleStore((s) => s.layers.terrain);
  const theme = useBattleStore((s) => s.theme);
  const { terrainPoints, terrainLines, boundary38, meta } = useBattle();
  const relief = meta.relief;
  const reliefBbox = meta.reliefBbox;
  const s = 1 / k;

  const geo = useMemo(() => {
    const rivers = terrainLines.filter((l) => l.kind === 'river');
    const roads = terrainLines.filter((l) => l.kind === 'road');
    let reliefRect: { x: number; y: number; w: number; h: number } | null = null;
    if (reliefBbox) {
      const nw = project(projection, [reliefBbox.sw[0], reliefBbox.ne[1]]);
      const se = project(projection, [reliefBbox.ne[0], reliefBbox.sw[1]]);
      reliefRect = { x: nw[0], y: nw[1], w: se[0] - nw[0], h: se[1] - nw[1] };
    }
    const hasBoundary38 = boundary38.length >= 2;
    return {
      rivers: rivers.map((r) => ({ ...r, d: lineToSmoothPath(projection, r.coordinates), coords: r.coordinates })),
      roads: roads.map((r) => ({ ...r, d: lineToSmoothPath(projection, r.coordinates), coords: r.coordinates })),
      relief: reliefRect,
      b38: hasBoundary38 ? lineToPath(projection, boundary38) : null,
      b38a: hasBoundary38 ? project(projection, boundary38[0]) : null,
      points: terrainPoints.map((p) => ({ p, xy: project(projection, p.coord) })),
      contours: terrainPoints.flatMap((p) => {
        const c = p.meta?.contour;
        if (!c) return [];
        const center = project(projection, p.coord);
        const east = project(projection, [p.coord[0] + c.rxDeg, p.coord[1]]);
        const north = project(projection, [p.coord[0], p.coord[1] + c.ryDeg]);
        return [{
          id: p.id,
          center,
          rx: Math.abs(east[0] - center[0]),
          ry: Math.abs(north[1] - center[1]),
          rings: c.rings ?? 4,
          rotate: c.rotate ?? 0,
        }];
      }),
    };
  }, [projection, terrainPoints, terrainLines, boundary38, reliefBbox]);

  return (
    <g>
      {relief && reliefBbox && geo.relief && (
        <image
          href={theme === 'dark' ? relief.dark : relief.light}
          x={geo.relief.x}
          y={geo.relief.y}
          width={geo.relief.w}
          height={geo.relief.h}
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ pointerEvents: 'none' }}
        />
      )}

      <g aria-hidden="true" opacity={0.28}>
        {geo.contours.flatMap((c) =>
          Array.from({ length: c.rings }, (_, i) => {
            const ratio = (i + 1) / c.rings;
            return (
              <ellipse
                key={`${c.id}-${i}`}
                cx={c.center[0]}
                cy={c.center[1]}
                rx={c.rx * ratio}
                ry={c.ry * ratio}
                transform={`rotate(${c.rotate} ${c.center[0]} ${c.center[1]})`}
                fill={i === c.rings - 1 ? 'var(--contour-bistre)' : 'none'}
                fillOpacity={i === c.rings - 1 ? 0.035 : 0}
                stroke="var(--contour-bistre)"
                strokeWidth={0.8}
                strokeDasharray={i % 2 ? '4 3' : undefined}
                vectorEffect="non-scaling-stroke"
              />
            );
          }),
        )}
      </g>

      {geo.rivers.map((r) => (
        <path
          key={r.id}
          d={r.d}
          fill="none"
          stroke="var(--water-teal)"
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {geo.roads.map((r) => (
        <g key={r.id}>
          {r.emphasis && (
            <path
              d={r.d}
              fill="none"
              stroke="var(--amber)"
              strokeWidth={6}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              opacity={0.22}
            />
          )}
          <path
            d={r.d}
            fill="none"
            stroke="var(--contour-bistre)"
            strokeWidth={r.emphasis ? 1.8 : 1.4}
            strokeDasharray={r.emphasis ? '10 4' : '7 4'}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            opacity={r.emphasis ? 1 : 0.78}
          />
        </g>
      ))}

      {geo.b38 && geo.b38a && (
        <>
          <path
            d={geo.b38}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={1.3}
            strokeDasharray="12 5 3 5"
            vectorEffect="non-scaling-stroke"
          />
          <g transform={`translate(${geo.b38a[0].toFixed(1)},${geo.b38a[1].toFixed(1)}) scale(${s})`}>
            <text className="map-label map-label--mono" x={6} y={-5} fontSize={10}>
              38°N — 38선
            </text>
          </g>
        </>
      )}

      {showLabels && (
        <g>
          {geo.rivers.map((r) => {
            const placement = r.mapLabel;
            if (k < (placement?.minZoom ?? 0)) return null;
            const [x, y] = alongLine(projection, r.coords, 0.35);
            return (
              <g key={r.id} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s})`}>
                <text
                  className="map-label map-label--water"
                  x={placement?.dx ?? 6}
                  y={placement?.dy ?? -5}
                  textAnchor={placement?.anchor ?? 'start'}
                  fontSize={10.5}
                >
                  {placement?.text ?? r.name}
                </text>
              </g>
            );
          })}
          {geo.roads.map((r) => {
            const placement = r.mapLabel;
            if (k < (placement?.minZoom ?? 0)) return null;
            const [x, y] = alongLine(projection, r.coords, 0.55);
            return (
              <g key={r.id} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s})`}>
                <text
                  className="map-label"
                  x={placement?.dx ?? 6}
                  y={placement?.dy ?? 12}
                  textAnchor={placement?.anchor ?? 'start'}
                  fontSize={r.emphasis ? 9.5 : 9}
                  fontWeight={r.emphasis ? 700 : 600}
                  fill="var(--contour-bistre)"
                >
                  {placement?.text ?? r.name}
                </text>
              </g>
            );
          })}

          {geo.points.map(({ p, xy }) => {
            const [x, y] = xy;
            const big = p.kind === 'city' || p.kind === 'assembly';
            const isDetail = p.kind === 'spot' || p.kind === 'hill';
            const placement = p.meta?.label;
            const showPointLabel = placement
              ? k >= (placement.minZoom ?? 0)
              : (!isDetail || detail);
            const dx = placement?.dx ?? 0;
            const dy = placement?.dy ?? (big ? -8 : -7);
            const anchor = placement?.anchor ?? 'middle';
            const leader = placement?.leader && (Math.abs(dx) > 10 || Math.abs(dy) > 12);
            return (
              <g key={p.id} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s})`}>
                <PointSymbol p={p} />
                <title>{pointLabel(p)}</title>
                {showPointLabel && (
                  <>
                    {leader && (
                      <path
                        d={`M0,0 L${(dx * 0.72).toFixed(1)},${(dy * 0.72).toFixed(1)}`}
                        fill="none"
                        stroke="var(--ink-faint)"
                        strokeWidth={0.9}
                        strokeDasharray="2 2"
                      />
                    )}
                    <text
                      className="map-label"
                      x={dx}
                      y={dy}
                      textAnchor={anchor}
                      fontSize={big ? 12.5 : 10}
                      fill={p.kind === 'assembly' ? 'var(--nk)' : undefined}
                      opacity={isDetail ? 0.85 : 1}
                    >
                      {pointLabel(p)}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
}

export default memo(TerrainLayer);
