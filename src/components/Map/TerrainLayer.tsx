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
  const s = 1 / k; // 라벨·기호 역-스케일: 화면상 크기 고정

  /* 지오메트리는 projection·전투 데이터에만 의존 — 줌(k) 변경 시 재계산하지 않도록 메모 */
  const geo = useMemo(() => {
    const rivers = terrainLines.filter((l) => l.kind === 'river');
    const roads = terrainLines.filter((l) => l.kind === 'road');
    // 음영기복 이미지 배치: 넓은 릴리프 범위 북서(좌상)~남동(우하)
    let reliefRect: { x: number; y: number; w: number; h: number } | null = null;
    if (reliefBbox) {
      const nw = project(projection, [reliefBbox.sw[0], reliefBbox.ne[1]]);
      const se = project(projection, [reliefBbox.ne[0], reliefBbox.sw[1]]);
      reliefRect = { x: nw[0], y: nw[1], w: se[0] - nw[0], h: se[1] - nw[1] };
    }
    return {
      rivers: rivers.map((r) => ({ id: r.id, name: r.name, d: lineToSmoothPath(projection, r.coordinates), coords: r.coordinates })),
      roads: roads.map((r) => ({ id: r.id, name: r.name, d: lineToSmoothPath(projection, r.coordinates), coords: r.coordinates })),
      relief: reliefRect,
      b38: lineToPath(projection, boundary38),
      b38a: project(projection, boundary38[0]),
      points: terrainPoints.map((p) => ({ p, xy: project(projection, p.coord) })),
    };
  }, [projection, terrainPoints, terrainLines, boundary38, reliefBbox]);

  return (
    <g>
      {/* 음영기복(hillshade) — 래스터 relief가 있는 전투만. 없으면 종이 배경 + 벡터 지형 */}
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
