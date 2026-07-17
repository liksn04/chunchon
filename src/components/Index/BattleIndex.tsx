import { useEffect, useRef, useState } from 'react';
import { battleMetas } from '../../battles/registry';
import { navigate } from '../../router';
import { useT } from '../../i18n';
import { useBattleStore } from '../../store/useBattleStore';
import { koreaOutline, KOREA_BBOX } from '../../data/shared/korea';
import { closedSmoothPathFromPoints, type Pt } from '../../lib/morph';
import type { BattleMeta, LngLat, WarPhase } from '../../types';
import './BattleIndex.css';

/** 국면 표시 순서 */
const PHASE_ORDER: WarPhase[] = ['invasion', 'naktong', 'counter', 'ccf', 'stalemate'];

/** 목록 지도 SVG 크기 — InsetMap과 같은 선형(비-메르카토르) 근사 매핑, 전면 표시용으로 확대 */
const MAP_W = 320;
const MAP_H = 380;
const MAP_PAD = 16;

const toXY = ([lng, lat]: LngLat): Pt => [
  MAP_PAD + ((lng - KOREA_BBOX.lngMin) / (KOREA_BBOX.lngMax - KOREA_BBOX.lngMin)) * (MAP_W - 2 * MAP_PAD),
  MAP_PAD + ((KOREA_BBOX.latMax - lat) / (KOREA_BBOX.latMax - KOREA_BBOX.latMin)) * (MAP_H - 2 * MAP_PAD),
];

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

  const silhouette = closedSmoothPathFromPoints(koreaOutline.map(toXY));
  const [x38a, y38a] = toXY([KOREA_BBOX.lngMin, 38]);
  const [x38b, y38b] = toXY([KOREA_BBOX.lngMax, 38]);

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
          <path d={silhouette} className="index-map-outline" />
          <line
            x1={x38a}
            y1={y38a}
            x2={x38b}
            y2={y38b}
            className="index-map-38line"
          />
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
                <circle r={12} fill="transparent" />
                {available && <circle className="index-marker-pulse" r={5.5} />}
                <circle className="index-marker-dot" r={available ? 4.6 : 3.1} />
                {active && (
                  <text className="index-marker-label" x={7} y={-6}>
                    {m.name[lang]}
                  </text>
                )}
              </g>
            );
          })}
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
