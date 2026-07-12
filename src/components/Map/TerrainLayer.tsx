import { memo, useMemo } from 'react';
import type { GeoProjection } from 'd3-geo';
import { project, lineToPath, lineToSmoothPath } from '../../lib/projection';
import { closedSmoothPathFromPoints, type Pt } from '../../lib/morph';
import { terrainPoints, terrainLines, boundary38 } from '../../data/terrain';
import { reliefMassifs } from '../../data/relief';
import { useBattleStore } from '../../store/useBattleStore';
import type { TerrainPoint } from '../../types';

/** 산괴 폴리곤을 중심 방향으로 수축시켜 등고선 링 3단 생성 */
function contourRings(projection: GeoProjection, coords: [number, number][]): string[] {
  const pts: Pt[] = coords.map((c) => project(projection, c));
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return [1, 0.64, 0.34].map((s) =>
    closedSmoothPathFromPoints(
      pts.map(([x, y], i) => {
        const wobble = 1 + 0.08 * Math.sin(i * 2.4 + s * 7);
        const k = s * wobble;
        return [cx + (x - cx) * k, cy + (y - cy) * k] as Pt;
      }),
    ),
  );
}

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
  const s = 1 / k; // 라벨·기호 역-스케일: 화면상 크기 고정

  /* 지오메트리는 projection에만 의존 — 줌(k) 변경 시 재계산하지 않도록 메모 */
  const geo = useMemo(() => {
    const rivers = terrainLines.filter((l) => l.kind === 'river');
    const roads = terrainLines.filter((l) => l.kind === 'road');
    return {
      rivers: rivers.map((r) => ({ id: r.id, name: r.name, d: lineToSmoothPath(projection, r.coordinates), coords: r.coordinates })),
      roads: roads.map((r) => ({ id: r.id, name: r.name, d: lineToSmoothPath(projection, r.coordinates), coords: r.coordinates })),
      relief: reliefMassifs.map((m) => ({ id: m.id, it: m.intensity ?? 1, rings: contourRings(projection, m.coordinates) })),
      b38: lineToPath(projection, boundary38),
      b38a: project(projection, boundary38[0]),
      points: terrainPoints.map((p) => ({ p, xy: project(projection, p.coord) })),
    };
  }, [projection]);

  return (
    <g>
      {/* 음영 기복 — 도식 산괴 등고선 (선 두께 고정) */}
      {geo.relief.map((m) => (
        <g key={m.id} aria-hidden="true">
          <path d={m.rings[0]} fill="var(--ridge-shadow)" opacity={0.35 * m.it} stroke="none" />
          {m.rings.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="var(--contour-bistre)"
              strokeWidth={0.9}
              vectorEffect="non-scaling-stroke"
              opacity={(0.42 - i * 0.06) * m.it}
            />
          ))}
        </g>
      ))}

      {/* 강 */}
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

      {/* 도로 */}
      {geo.roads.map((r) => (
        <path
          key={r.id}
          d={r.d}
          fill="none"
          stroke="var(--contour-bistre)"
          strokeWidth={1.4}
          strokeDasharray="7 4"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          opacity={0.85}
        />
      ))}

      {/* 38선 */}
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

      {showLabels && (
        <g>
          {/* 강·도로 이름 */}
          {geo.rivers.map((r) => {
            const [x, y] = alongLine(projection, r.coords, 0.35);
            return (
              <g key={r.id} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s})`}>
                <text className="map-label map-label--water" x={6} y={-5} fontSize={10.5}>
                  {r.name}
                </text>
              </g>
            );
          })}
          {geo.roads.map((r) => {
            const [x, y] = alongLine(projection, r.coords, 0.55);
            return (
              <g key={r.id} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s})`}>
                <text className="map-label" x={6} y={12} fontSize={9} fill="var(--contour-bistre)">
                  {r.name}
                </text>
              </g>
            );
          })}

          {/* 지형 지점 — 기호·라벨 화면상 크기 고정 */}
          {geo.points.map(({ p, xy }) => {
            const [x, y] = xy;
            const big = p.kind === 'city' || p.kind === 'assembly';
            const isDetail = p.kind === 'spot' || p.kind === 'hill';
            return (
              <g key={p.id} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s})`}>
                <PointSymbol p={p} />
                <title>{pointLabel(p)}</title>
                {(!isDetail || detail) && (
                  <text
                    className="map-label"
                    y={big ? -8 : -7}
                    textAnchor="middle"
                    fontSize={big ? 12.5 : 10}
                    fill={p.kind === 'assembly' ? 'var(--nk)' : undefined}
                    opacity={isDetail ? 0.85 : 1}
                  >
                    {pointLabel(p)}
                  </text>
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
