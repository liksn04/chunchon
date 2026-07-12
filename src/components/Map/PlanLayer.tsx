import { memo } from 'react';
import type { GeoProjection } from 'd3-geo';
import { project, lineToSmoothPath } from '../../lib/projection';
import { planArrows, PLAN_FAILED_FROM } from '../../data/plans';
import { useBattleStore } from '../../store/useBattleStore';

/**
 * 유령 포위망 — 북한 2군단의 실현되지 못한 계획선.
 * 항상 반투명 점선으로 깔리고, 6/28 이후엔 ✕ 표시와 "포위계획 무산" 스탬프가 찍힌다.
 */
function PlanLayer({ projection }: { projection: GeoProjection }) {
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const visible = useBattleStore((s) => s.layers.plan);
  if (!visible) return null;

  const failed =
    selectedDay === 'all' || (selectedDay !== 'all' && selectedDay >= PLAN_FAILED_FROM);

  // 스탬프 위치: 홍천 남동쪽 빈 영역 — 기본 프레이밍 안, 카투시(좌하단)와 겹치지 않게
  const [sx, sy] = project(projection, [128.060, 37.630]);

  return (
    <g aria-hidden="true">
      {planArrows.map((p) => {
        const d = lineToSmoothPath(projection, p.path);
        const labelAt = project(projection, p.path[1]);
        return (
          <g key={p.id} opacity={0.42}>
            <path
              d={d}
              fill="none"
              stroke="var(--nk)"
              strokeWidth={2.6}
              strokeDasharray="11 8"
              strokeLinecap="round"
              markerEnd="url(#ah-open-NK)"
            />
            <text
              className="map-label map-label--mono"
              x={labelAt[0] + 8}
              y={labelAt[1] + 14}
              fontSize={9.5}
              fill="var(--nk)"
            >
              {p.label}
            </text>
            {failed &&
              // path[1]은 기본 프레이밍 안, path[2]는 남서쪽 화면 밖 — 팬하면 보인다
              [1, 2].map((idx) => {
                const [x, y] = project(projection, p.path[idx]);
                return (
                  <path
                    key={idx}
                    className="fade-in"
                    d={`M${x - 6},${y - 6} L${x + 6},${y + 6} M${x - 6},${y + 6} L${x + 6},${y - 6}`}
                    stroke="var(--nk)"
                    strokeWidth={3}
                    opacity={0.9}
                  />
                );
              })}
          </g>
        );
      })}

      {failed && (
        <g
          className="fade-in"
          transform={`translate(${sx.toFixed(1)},${sy.toFixed(1)}) rotate(-7)`}
          opacity={0.75}
        >
          <rect x={-74} y={-19} width={148} height={38} fill="none" stroke="var(--nk)" strokeWidth={2.5} />
          <rect x={-69} y={-14} width={138} height={28} fill="none" stroke="var(--nk)" strokeWidth={1} />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-display)"
            fontWeight={700}
            fontSize={16}
            letterSpacing="0.28em"
            fill="var(--nk)"
          >
            포위계획 무산
          </text>
        </g>
      )}
    </g>
  );
}

export default memo(PlanLayer);
