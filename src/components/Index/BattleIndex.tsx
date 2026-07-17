import { useEffect, useRef, useState } from 'react';
import { battleMetas } from '../../battles/registry';
import { navigate } from '../../router';
import { useT } from '../../i18n';
import { useBattleStore } from '../../store/useBattleStore';
import { koreaOutline, jejuOutline, LAT38_LNG, makeKoreaToXY } from '../../data/shared/korea';
import type { Pt } from '../../lib/morph';
import type { BattleMeta, WarPhase } from '../../types';
import './BattleIndex.css';

/** 국면 표시 순서 */
const PHASE_ORDER: WarPhase[] = ['invasion', 'naktong', 'counter', 'ccf', 'stalemate'];

/** 목록 지도 SVG 크기 — 도엽(전역도) 프레임 여백을 둔 세로형 뷰박스 */
const MAP_W = 300;
const MAP_H = 480;
const MAP_PAD = 30; // 반도가 테두리·눈금 띠와 겹치지 않도록 여유
const FRAME = 12; // 네트라인(도엽 테두리) 여백

const toXY = makeKoreaToXY(MAP_W, MAP_H, MAP_PAD);

/** x는 경도, y는 위도에만 의존(등장방형) — 눈금·격자용 분리 매핑 */
const xOfLng = (lng: number): number => toXY([lng, 38])[0];
const yOfLat = (lat: number): number => toXY([124.2, lat])[1];

/** 가장자리 눈금(1°마다) — 짝수 도는 라벨, 홀수는 짧은 눈금만 */
const LNG_TICKS = [125, 126, 127, 128, 129, 130];
const LAT_TICKS = [34, 35, 36, 37, 38, 39, 40, 41, 42];
/** 내부 경위선 격자(2°) */
const GRID_LNG = [126, 128, 130];
const GRID_LAT = [34, 36, 38, 40, 42];

/** 지리 기준점 — 도시 앵커(속삭임 수준) */
const CITY_ANCHORS: { key: string; coord: [number, number]; dx: number; dy: number; anchor: 'start' | 'end' }[] = [
  { key: 'index.pyongyang', coord: [125.75, 39.03], dx: -6, dy: 4, anchor: 'end' },
  { key: 'inset.seoul', coord: [126.98, 37.57], dx: 6, dy: 12, anchor: 'start' },
];

/** 해역 명칭 — 고전 해도풍(자간·저대비) */
const SEA_LABELS: { key: string; coord: [number, number] }[] = [
  { key: 'index.seaEast', coord: [130.0, 38.2] },
  { key: 'index.seaWest', coord: [125.05, 36.4] },
  { key: 'index.seaSouth', coord: [127.4, 33.98] },
];

/** 활성 마커 라벨 폭 근사(종이 칩 배경용) — 한글/영문 글자폭 차이 반영 */
function labelWidth(label: string): number {
  const hasHangul = /[ㄱ-힝]/.test(label);
  return label.length * (hasHangul ? 9.6 : 6.1) + 10;
}

/** 실측 해안선은 점이 촘촘해 스무딩 없이 직선 연결로 그린다 */
const closedPath = (pts: Pt[]): string =>
  `M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}Z`;

/** 'YYYY-MM-DD'~'YYYY-MM-DD' → '1950.6.25–7.1' 압축 표기(동일 연/월이면 생략) */
function formatDateRange(start: string, end: string): string {
  const [sy, sm, sd] = start.split('-').map(Number);
  const [ey, em, ed] = end.split('-').map(Number);
  const a = `${sy}.${sm}.${sd}`;
  const b = sy !== ey ? `${ey}.${em}.${ed}` : sm !== em ? `${em}.${ed}` : `${ed}`;
  return `${a}–${b}`;
}

/**
 * 전투 목록 첫 화면 — 좌/상단 한반도 지도(국면별 색 마커) + 우/하단 국면별
 * 카드 목록. 마커·카드는 hover/click으로 서로 연동되고, 국면 칩으로 필터링한다.
 * available 전투는 클릭 시 상황도로 이동, planned는 목록 안에서 강조만 된다.
 */
export default function BattleIndex() {
  const t = useT();
  const lang = useBattleStore((s) => s.lang);
  const [filter, setFilter] = useState<WarPhase | 'all'>('all');
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cardRefs = useRef(new Map<string, HTMLButtonElement>());

  const activeId = hoverId ?? selectedId;

  // 마커 클릭으로 선택된 planned 카드가 필터에 가려 있으면 목록에서 안 보이므로 스크롤로 노출
  useEffect(() => {
    if (!selectedId) return;
    cardRefs.current.get(selectedId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [selectedId]);

  const activeMeta = activeId ? battleMetas.find((m) => m.id === activeId) ?? null : null;
  const silhouette = closedPath(koreaOutline.map(toXY));
  const jeju = closedPath(jejuOutline.map(toXY));
  // 38선은 반도 폭(해안 교차 경도)에 약간의 여유만 두고 그린다
  const [x38a, y38a] = toXY([LAT38_LNG[0] - 0.3, 38]);
  const [x38b, y38b] = toXY([LAT38_LNG[1] + 0.3, 38]);

  const activate = (m: BattleMeta) => {
    if (m.status === 'available') {
      navigate(`/b/${m.id}`);
      return;
    }
    setSelectedId((cur) => (cur === m.id ? null : m.id));
  };

  const toggleFilter = (phase: WarPhase) => {
    setFilter((cur) => (cur === phase ? 'all' : phase));
  };

  const groups = PHASE_ORDER.map((phase) => ({
    phase,
    items: battleMetas.filter((m) => m.phase === phase),
  })).filter((g) => g.items.length > 0);

  return (
    <main className="index-layout">
      <section className="index-map-pane">
        <svg
          className="index-map-svg"
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          role="img"
          aria-label={t('index.mapLabel')}
        >
          <defs>
            {/* 파도 해칭 — 낮은 대비의 짧은 수평선 반복 */}
            <pattern id="index-sea-wave" width={38} height={26} patternUnits="userSpaceOnUse">
              <line x1={4} y1={7} x2={19} y2={7} className="index-sea-wave" />
              <line x1={22} y1={19} x2={35} y2={19} className="index-sea-wave" />
            </pattern>
            <clipPath id="index-plate">
              <rect x={FRAME} y={FRAME} width={MAP_W - 2 * FRAME} height={MAP_H - 2 * FRAME} />
            </clipPath>
          </defs>

          {/* ── 해양 판(sheet) + 파도 텍스처 ── */}
          <g clipPath="url(#index-plate)">
            <rect x={FRAME} y={FRAME} width={MAP_W - 2 * FRAME} height={MAP_H - 2 * FRAME} className="index-sea" />
            <rect
              x={FRAME}
              y={FRAME}
              width={MAP_W - 2 * FRAME}
              height={MAP_H - 2 * FRAME}
              fill="url(#index-sea-wave)"
            />

            {/* 내부 경위선 격자(2°, 헤어라인) */}
            {GRID_LNG.map((lng) => (
              <line key={`gx${lng}`} x1={xOfLng(lng)} y1={FRAME} x2={xOfLng(lng)} y2={MAP_H - FRAME} className="index-graticule" />
            ))}
            {GRID_LAT.map((lat) => (
              <line key={`gy${lat}`} x1={FRAME} y1={yOfLat(lat)} x2={MAP_W - FRAME} y2={yOfLat(lat)} className="index-graticule" />
            ))}

            {/* ── 육지 ── */}
            <path d={silhouette} className="index-map-outline" />
            <path d={jeju} className="index-map-outline" />

            {/* 38선 + 라벨 */}
            <line x1={x38a} y1={y38a} x2={x38b} y2={y38b} className="index-map-38line" />
            <text className="index-38label" x={x38b + 5} y={y38b - 4}>
              38°N
            </text>

            {/* 해역 명칭 */}
            {SEA_LABELS.map(({ key, coord }) => {
              const [sx, sy] = toXY(coord);
              return (
                <text key={key} className="index-sea-label" x={sx} y={sy} textAnchor="middle">
                  {t(key)}
                </text>
              );
            })}

            {/* 지리 기준 도시 */}
            {CITY_ANCHORS.map(({ key, coord, dx, dy, anchor }) => {
              const [cx, cy] = toXY(coord);
              return (
                <g key={key} pointerEvents="none">
                  <rect x={cx - 2} y={cy - 2} width={4} height={4} className="index-city-dot" />
                  <text className="index-city-label" x={cx + dx} y={cy + dy} textAnchor={anchor}>
                    {t(key)}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ── 전투 마커 ── */}
          <g clipPath="url(#index-plate)">
            {battleMetas.map((m) => {
              const [x, y] = toXY(m.marker);
              const available = m.status === 'available';
              const dimmed = filter !== 'all' && filter !== m.phase;
              const active = activeId === m.id;
              return (
                <g
                  key={m.id}
                  className={[
                    'index-marker',
                    `index-marker--${m.phase}`,
                    available ? 'index-marker--available' : 'index-marker--planned',
                    dimmed ? 'index-marker--dim' : '',
                    active ? 'index-marker--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${m.name[lang]} — ${available ? t('index.available') : t('index.planned')}`}
                  onMouseEnter={() => setHoverId(m.id)}
                  onMouseLeave={() => setHoverId((cur) => (cur === m.id ? null : cur))}
                  onFocus={() => setHoverId(m.id)}
                  onBlur={() => setHoverId((cur) => (cur === m.id ? null : cur))}
                  onClick={() => activate(m)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      activate(m);
                    }
                  }}
                >
                  {/* 히트 타깃 확장 */}
                  <circle r={13} fill="transparent" />
                  {available && <circle className="index-marker-pulse" r={6.4} />}
                  {available ? (
                    <>
                      <circle className="index-marker-ring" r={5.4} />
                      <circle className="index-marker-core" r={2.4} />
                    </>
                  ) : (
                    <circle className="index-marker-planned-dot" r={3.2} />
                  )}
                </g>
              );
            })}
          </g>

          {/* ── 도엽 테두리(네트라인) + 위경도 눈금 ── */}
          <g pointerEvents="none">
            <rect x={FRAME - 4} y={FRAME - 4} width={MAP_W - 2 * (FRAME - 4)} height={MAP_H - 2 * (FRAME - 4)} className="index-frame-outer" />
            <rect x={FRAME} y={FRAME} width={MAP_W - 2 * FRAME} height={MAP_H - 2 * FRAME} className="index-frame-inner" />
            {LNG_TICKS.map((lng) => {
              const x = xOfLng(lng);
              const labeled = lng % 2 === 0;
              const len = labeled ? 6 : 3.5;
              return (
                <g key={`tx${lng}`}>
                  <line x1={x} y1={FRAME} x2={x} y2={FRAME + len} className="index-frame-tick" />
                  <line x1={x} y1={MAP_H - FRAME} x2={x} y2={MAP_H - FRAME - len} className="index-frame-tick" />
                  {/* 상단 눈금 라벨은 카투시와 겹치므로 하단에만 표기 */}
                  {labeled && (
                    <text x={x} y={MAP_H - FRAME - 6} textAnchor="middle" className="index-frame-label">
                      {lng}°E
                    </text>
                  )}
                </g>
              );
            })}
            {LAT_TICKS.map((lat) => {
              const y = yOfLat(lat);
              // 42°N 라벨은 카투시(좌상)와 겹치므로 눈금만 남긴다
              const labeled = lat % 2 === 0 && lat !== 42;
              const len = labeled ? 6 : 3.5;
              return (
                <g key={`ty${lat}`}>
                  <line x1={FRAME} y1={y} x2={FRAME + len} y2={y} className="index-frame-tick" />
                  <line x1={MAP_W - FRAME} y1={y} x2={MAP_W - FRAME - len} y2={y} className="index-frame-tick" />
                  {labeled && (
                    <text x={FRAME + 8} y={y - 3} textAnchor="start" className="index-frame-label">
                      {lat}°N
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* ── 카투시(도엽 표제) — 북서 해역(좌상) ── */}
          <g className="index-cartouche" pointerEvents="none">
            <rect x={16} y={18} width={150} height={54} className="index-cartouche-box-outer" />
            <rect x={19} y={21} width={144} height={48} className="index-cartouche-box" />
            <text x={30} y={40} className="index-cartouche-title">
              {t('index.cartTitle')}
            </text>
            <text x={30} y={53} className="index-cartouche-sub">
              {t('index.cartSub')}
            </text>
            <text x={30} y={64} className="index-cartouche-years">
              1950–1953
            </text>
          </g>

          {/* ── 방위표 — 남동 해역(우하) ── */}
          <g className="index-compass" transform={`translate(${MAP_W - 34},${MAP_H - 54})`} pointerEvents="none">
            <text y={-19} textAnchor="middle" className="index-compass-n">
              N
            </text>
            <path d="M0,-15 L4.2,6 L0,1.6 Z" className="index-compass-fill" />
            <path d="M0,-15 L-4.2,6 L0,1.6 Z" className="index-compass-hollow" />
            <circle r={2.2} className="index-compass-pin" />
          </g>

          {/* ── 활성 마커 라벨 — 클립 밖 오버레이(긴 이름이 도엽 경계에 잘리지 않도록) ── */}
          {activeMeta &&
            (() => {
              const [ax, ay] = toXY(activeMeta.marker);
              const label = activeMeta.name[lang];
              const w = labelWidth(label);
              const flip = MAP_W - ax < w + 20; // 오른쪽 공간이 부족하면 왼쪽으로
              const below = ay < FRAME + 24;
              let chipX = flip ? ax - (10 + w) : ax + 10;
              chipX = Math.max(3, Math.min(chipX, MAP_W - 3 - w));
              const chipY = below ? ay + 8 : ay - 16;
              const textX = flip ? chipX + w - 5 : chipX + 5;
              const textY = below ? ay + 19 : ay - 5;
              return (
                <g pointerEvents="none">
                  <rect className="index-marker-chip" x={chipX} y={chipY} width={w} height={15} rx={2} />
                  <text className="index-marker-label" x={textX} y={textY} textAnchor={flip ? 'end' : 'start'}>
                    {label}
                  </text>
                </g>
              );
            })()}
        </svg>
        <p className="index-map-hint">{t('index.mapHint')}</p>
      </section>

      <section className="index-list-pane">
        <div className="index-filters" role="group" aria-label={t('index.filterLabel')}>
          <button
            type="button"
            className="day-chip index-filter-chip"
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            {t('index.filterAll')}
          </button>
          {PHASE_ORDER.map((phase) => (
            <button
              key={phase}
              type="button"
              className={`day-chip index-filter-chip index-filter-chip--${phase}`}
              aria-pressed={filter === phase}
              onClick={() => toggleFilter(phase)}
            >
              <span className="index-filter-dot" aria-hidden="true" />
              {t(`phase.${phase}`)}
            </button>
          ))}
        </div>

        <div className="index-groups">
          {groups.map(({ phase, items }) => {
            const visibleItems = items.filter((m) => filter === 'all' || filter === m.phase);
            if (visibleItems.length === 0) return null;
            return (
              <section key={phase} className="index-phase">
                <h2 className="index-phase-title">{t(`phase.${phase}`)}</h2>
                <div className="index-grid">
                  {visibleItems.map((m) => {
                    const available = m.status === 'available';
                    const active = activeId === m.id;
                    return (
                      <button
                        key={m.id}
                        ref={(el) => {
                          if (el) cardRefs.current.set(m.id, el);
                          else cardRefs.current.delete(m.id);
                        }}
                        type="button"
                        className={[
                          'index-card',
                          `index-card--${m.phase}`,
                          available ? '' : 'index-card--planned',
                          active ? 'index-card--active' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        aria-label={`${m.name[lang]} — ${available ? t('index.available') : t('index.planned')}`}
                        onMouseEnter={() => setHoverId(m.id)}
                        onMouseLeave={() => setHoverId((cur) => (cur === m.id ? null : cur))}
                        onFocus={() => setHoverId(m.id)}
                        onBlur={() => setHoverId((cur) => (cur === m.id ? null : cur))}
                        onClick={() => activate(m)}
                      >
                        <div className="index-card-head">
                          <span className="index-card-name">{m.name[lang]}</span>
                          <span className={`index-badge${available ? ' index-badge--on' : ''}`}>
                            {available ? t('index.available') : t('index.planned')}
                          </span>
                        </div>
                        <div className="index-card-dates">
                          {formatDateRange(m.dateRange.start, m.dateRange.end)}
                        </div>
                        <p className="index-card-summary">{m.summary}</p>
                        {available && <span className="index-card-open">{t('index.open')}</span>}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
