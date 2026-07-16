import type { GeoProjection } from 'd3-geo';
import type { ZoomTransform } from 'd3-zoom';
import { koreaOutline, KOREA_BBOX, seoul } from '../../data/shared/korea';
import { closedSmoothPathFromPoints, type Pt } from '../../lib/morph';
import { useBattleStore } from '../../store/useBattleStore';
import { useBattle } from '../../battles/useBattle';
import { useT } from '../../i18n';
import type { LngLat } from '../../types';

const W = 96;
const H = 108;
const PAD = 8;

const toInset = ([lng, lat]: LngLat): Pt => [
  PAD + ((lng - KOREA_BBOX.lngMin) / (KOREA_BBOX.lngMax - KOREA_BBOX.lngMin)) * (W - 2 * PAD),
  PAD + ((KOREA_BBOX.latMax - lat) / (KOREA_BBOX.latMax - KOREA_BBOX.latMin)) * (H - 2 * PAD),
];

/**
 * 좌상단 인셋 미니맵 — 한반도 실루엣 + 38선 + 서울/춘천 + 현재 뷰박스.
 * 6/28 이후엔 서울 함락을 붉게 표시해 유령 포위망(무산된 계획)과 맥락을 잇는다.
 */
export default function InsetMap({
  projection,
  transform,
  w,
  h,
}: {
  projection: GeoProjection;
  transform: ZoomTransform;
  w: number;
  h: number;
}) {
  const t = useT();
  const meta = useBattle().meta;
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const seoulFallDate = meta.inset?.seoulFallDate;
  const seoulFallen = !!seoulFallDate && (selectedDay === 'all' || selectedDay >= seoulFallDate);

  const silhouette = closedSmoothPathFromPoints(koreaOutline.map(toInset));

  // 현재 화면 사각형 네 모서리를 지리좌표로 역투영 → 인셋 좌표
  const corners: [number, number][] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  const viewPts = corners
    .map(([sx, sy]) => {
      const px = (sx - transform.x) / transform.k;
      const py = (sy - transform.y) / transform.k;
      const inv = projection.invert?.([px, py]);
      return inv ? toInset(inv as LngLat) : null;
    })
    .filter((p): p is Pt => p !== null);

  const viewPath =
    viewPts.length === 4
      ? `M${viewPts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L')} Z`
      : '';

  const lat38a = toInset([KOREA_BBOX.lngMin, 38]);
  const lat38b = toInset([KOREA_BBOX.lngMax, 38]);
  const [seoulX, seoulY] = toInset(seoul);
  const [ccX, ccY] = toInset(meta.marker);

  return (
    <div className="inset-map" aria-hidden="true">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <path
          d={silhouette}
          fill="var(--map-buff-deep)"
          stroke="var(--ink-soft)"
          strokeWidth={1}
        />
        <line
          x1={lat38a[0]}
          y1={lat38a[1]}
          x2={lat38b[0]}
          y2={lat38b[1]}
          stroke="var(--ink)"
          strokeWidth={0.9}
          strokeDasharray="4 2.5"
        />
        {viewPath && (
          <path d={viewPath} fill="var(--amber)" fillOpacity={0.22} stroke="var(--amber-deep)" strokeWidth={1.2} />
        )}
        {/* 서울 */}
        <circle cx={seoulX} cy={seoulY} r={2.6} fill={seoulFallen ? 'var(--nk)' : 'var(--ink)'} />
        <text x={seoulX - 4} y={seoulY + 2.5} textAnchor="end" className="inset-label">
          {t('inset.seoul')}{seoulFallen ? ' ✕' : ''}
        </text>
        {/* 전투 지점 */}
        <circle cx={ccX} cy={ccY} r={2.4} fill="var(--rok)" stroke="var(--map-buff)" strokeWidth={0.8} />
        {meta.inset?.label && (
          <text x={ccX + 4} y={ccY + 2.5} className="inset-label inset-label--rok">
            {meta.inset.label}
          </text>
        )}
      </svg>
    </div>
  );
}
