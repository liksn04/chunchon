import { memo } from 'react';
import type { GeoProjection } from 'd3-geo';
import { project } from '../../lib/projection';
import { unitPositionsByDate } from '../../data/unitPositions';
import { unitById } from '../../data/units';
import { useBattleStore } from '../../store/useBattleStore';
import type { MilitaryUnit } from '../../types';

/** 제대 표식: 대대 Ⅱ · 연대 Ⅲ · 사단 XX · 군단 XXX */
const ECHELON_MARK: Record<MilitaryUnit['echelon'], string> = {
  battery: 'I',
  battalion: 'II',
  regiment: 'III',
  division: 'XX',
  corps: 'XXX',
};

/** 짧은 표시명: "제7연대" → "7", "북한 제2군단" → "2군단" */
function shortName(u: MilitaryUnit): string {
  const m = u.designation.match(/제?(\d+)/);
  if (!m) return u.designation;
  if (u.echelon === 'corps') return `${m[1]}군단`;
  if (u.echelon === 'division') return `${m[1]}사`;
  if (u.echelon === 'battalion' || u.echelon === 'battery') return `${m[1]}`;
  return m[1];
}

/** 병종 심볼 (APP-6 간이): 보병 X · 포병 ● · 기갑 타원 · 차량화 세로선 */
function BranchGlyph({ symbol, color }: { symbol: MilitaryUnit['symbol']; color: string }) {
  switch (symbol) {
    case 'infantry':
      return (
        <path d="M-9,-5.5 L9,5.5 M-9,5.5 L9,-5.5" stroke={color} strokeWidth={1.2} fill="none" />
      );
    case 'artillery':
      return <circle r={2.6} fill={color} />;
    case 'armor':
      return <ellipse rx={5.5} ry={3.4} fill="none" stroke={color} strokeWidth={1.2} />;
    case 'motorized':
      return (
        <g stroke={color} strokeWidth={1.2} fill="none">
          <path d="M-9,-5.5 L9,5.5 M-9,5.5 L9,-5.5" />
          <path d="M0,-5.5 V5.5" />
        </g>
      );
  }
}

function UnitLayer({ projection, k = 1 }: { projection: GeoProjection; k?: number }) {
  const selectedDay = useBattleStore((s) => s.selectedDay);
  const selectUnit = useBattleStore((s) => s.selectUnit);
  const visible = useBattleStore((s) => s.layers.units);
  if (!visible || selectedDay === 'all') return null;

  const positions = unitPositionsByDate[selectedDay];
  if (!positions) return null;
  const sc = 1 / k; // 부대기호 화면상 크기 고정

  return (
    <g>
      {positions.map((pos) => {
        const u = unitById.get(pos.unitId);
        if (!u) return null;
        const [x, y] = project(projection, pos.coord);
        const color = u.faction === 'ROK' ? 'var(--rok)' : 'var(--nk)';
        return (
          <g
            key={pos.unitId}
            className="fade-in event-marker"
            transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc})`}
            role="button"
            tabIndex={0}
            aria-label={`${u.designation} 부대 기록`}
            onClick={(e) => {
              e.stopPropagation();
              selectUnit(pos.unitId);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectUnit(pos.unitId);
              }
            }}
          >
            <title>{`${u.designation}${pos.note ? ` — ${pos.note}` : ''}`}</title>
            {/* 히트 타깃 */}
            <rect x={-14} y={-11} width={34} height={22} fill="transparent" />
            {/* 프레임 */}
            <rect
              x={-10}
              y={-6.5}
              width={20}
              height={13}
              fill="var(--map-buff)"
              fillOpacity={0.92}
              stroke={color}
              strokeWidth={1.5}
            />
            <BranchGlyph symbol={u.symbol} color={color} />
            {/* 제대 표식 */}
            <text
              y={-9}
              textAnchor="middle"
              fontSize={6.5}
              fontFamily="var(--font-mono)"
              fill={color}
              className="map-label"
              strokeWidth={2}
            >
              {ECHELON_MARK[u.echelon]}
            </text>
            {/* 부대 번호 */}
            <text
              x={13}
              y={3.5}
              fontSize={8.5}
              fontFamily="var(--font-mono)"
              fontWeight={600}
              fill={color}
              className="map-label"
              strokeWidth={2.5}
              textAnchor="start"
            >
              {shortName(u)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default memo(UnitLayer);
