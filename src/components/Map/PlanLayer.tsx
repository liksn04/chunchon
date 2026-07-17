import { memo } from 'react';
import type { GeoProjection } from 'd3-geo';
import { project, lineToSmoothPath } from '../../lib/projection';
import { useBattleStore } from '../../store/useBattleStore';
import { useBattle } from '../../battles/useBattle';
import type { LngLat } from '../../types';

/** 실현되지 못한 작전 기도와 실패 시점을 전투별 데이터로 표현한다. */
function PlanLayer({ projection, k = 1 }: { projection: GeoProjection; k?: number }) {
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const visible = useBattleStore((s) => s.layers.plan);
  const plans = useBattle().plans;
  if (!visible || !plans) return null;
  const { arrows: planArrows, failedFrom, stamp } = plans;
  const sc = 1 / k;

  const failed = selectedDay === 'all' || selectedDay >= failedFrom;
  const stampCoord: LngLat = stamp?.coord ?? [128.060, 37.630];
  const stampText = stamp?.text ?? '포위계획 무산';
  const [sx, sy] = project(projection, stampCoord);
  const stampWidth = Math.max(148, stampText.length * 17 + 24);

  return (
    <g aria-hidden="true">
      {planArrows.map((p) => {
        const d = lineToSmoothPath(projection, p.path);
        const placement = p.mapLabel;
        const labelIndex = Math.min(p.path.length - 1, Math.max(0, placement?.index ?? 1));
        const labelAt = project(projection, p.path[labelIndex]);
        const showLabel =
          k >= (placement?.minZoom ?? 0) &&
          (selectedDay !== 'all' || (placement?.showAtAll ?? true));
        return (
          <g key={p.id} opacity={0.42}>
            <path
              d={d}
              fill="none"
              stroke="var(--nk)"
              strokeWidth={2.6}
              strokeDasharray="11 8"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              markerEnd="url(#ah-open-NK)"
            />
            {showLabel && (
              <g transform={`translate(${labelAt[0].toFixed(1)},${labelAt[1].toFixed(1)}) scale(${sc})`}>
                <text
                  className="map-label map-label--mono"
                  x={placement?.dx ?? 8}
                  y={placement?.dy ?? 14}
                  textAnchor={placement?.anchor ?? 'start'}
                  fontSize={9.5}
                  fill="var(--nk)"
                >
                  {placement?.text ?? p.label}
                </text>
              </g>
            )}
            {failed &&
              [1, Math.min(2, p.path.length - 1)].map((idx) => {
                const [x, y] = project(projection, p.path[idx]);
                return (
                  <path
                    key={idx}
                    className="fade-in"
                    transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc})`}
                    d="M-6,-6 L6,6 M-6,6 L6,-6"
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
          transform={`translate(${sx.toFixed(1)},${sy.toFixed(1)}) scale(${sc}) rotate(${stamp?.rotate ?? -7})`}
          opacity={0.75}
        >
          <rect x={-stampWidth / 2} y={-19} width={stampWidth} height={38} fill="none" stroke="var(--nk)" strokeWidth={2.5} />
          <rect x={-stampWidth / 2 + 5} y={-14} width={stampWidth - 10} height={28} fill="none" stroke="var(--nk)" strokeWidth={1} />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-display)"
            fontWeight={700}
            fontSize={15}
            letterSpacing="0.18em"
            fill="var(--nk)"
          >
            {stampText}
          </text>
        </g>
      )}
    </g>
  );
}

export default memo(PlanLayer);
