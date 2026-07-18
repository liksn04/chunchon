/**
 * 새 전투 뼈대 생성 — `npm run battle:new <battle-id>`
 * planned.ts에 등록된 meta를 기반으로 src/data/battles/<id>/ 폴더와
 * 표준 파일 세트(스타일 표준 준수 스텁)를 생성한다.
 *
 * 생성 후 수동 절차:
 *  1) planned.ts에서 해당 meta 항목 제거 (meta.ts로 이관됨)
 *  2) 콘텐츠 저작 (docs/BATTLE-AUTHORING.md 순서)
 *  3) meta.reliefBbox 확정 → `npm run relief:make <id>` → `npm run relief:webp`
 *  4) registry.ts에 loader 등록 + status 'available' 전환 → `npm run validate`
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { battleMetas } from '../src/battles/registry';

const id = process.argv[2];
const meta = battleMetas.find((m) => m.id === id);
if (!id || !meta) {
  console.error('사용법: npm run battle:new <battle-id> — 등록된 id:', battleMetas.map((m) => m.id).join(', '));
  process.exit(1);
}
const dir = `src/data/battles/${id}`;
if (existsSync(dir)) {
  console.error(`${dir} 가 이미 존재합니다.`);
  process.exit(1);
}
mkdirSync(dir, { recursive: true });

const j = (v: unknown) => JSON.stringify(v);
const files: Record<string, string> = {
  'meta.ts': `import type { BattleMeta } from '../../../types';

/** planned.ts에서 이관 — bbox·cartouche·intro·relief는 저작하며 확정한다. */
export const ${camel(id)}Meta: BattleMeta = {
  id: ${j(meta.id)},
  name: { ko: ${j(meta.name.ko)}, en: ${j(meta.name.en)} },
  phase: ${j(meta.phase)},
  dateRange: { start: ${j(meta.dateRange.start)}, end: ${j(meta.dateRange.end)} },
  marker: ${j(meta.marker)},
  summary: ${j(meta.summary)},
  status: 'planned', // 저작 완료 후 'available'
  // TODO: 전투 정면이 화면 과반을 차지하도록 프레이밍 (스타일 표준 §프레이밍)
  // bbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // TODO: bbox보다 넓게 — relief:make가 이 범위로 래스터를 만든다
  // reliefBbox: { sw: [<lng>, <lat>], ne: [<lng>, <lat>] },
  // relief: { light: '/relief/${id}-light.webp', dark: '/relief/${id}-dark.webp' },
  // cartouche: { title: '${meta.name.ko} 상황도', en: '...', sub: '군 작전상황도(도식) · ...' },
  // intro: { headline: '${meta.name.ko}', body: '— ... —' },
  // inset: { label: '...' },
};
`,
  'days.ts': stub('DayPhase[]', 'days', '주요 국면 7~12개 선별 (매일 X — 표준 §타임라인)'),
  'events.ts': stub('BattleEvent[]', 'events', '사건 12~20개. key 사건에 좌표 신뢰도·출처 필수'),
  'frontlines.ts': stub('FrontLine[]', 'frontLines', '국면마다 1개. 모든 전선은 같은 진행 방향으로 작도(모핑 품질)'),
  'movements.ts': stub('MovementArrow[]', 'movements', '이동축. 전체 보기 노출은 visual.ts에서 2~3개로 제한'),
  'units.ts': stub('MilitaryUnit[]', 'units', '전투별 스냅샷 — shared equipment/people을 id로 참조'),
  'unitPositions.ts': `import type { UnitPosition } from '../../../types';

/** 각 DayPhase 날짜마다 연대급 이상 배치 */
export const unitPositionsByDate: Record<string, UnitPosition[]> = {};
`,
  'terrain.ts': `import type { TerrainPoint, TerrainLine, LngLat } from '../../../types';

export const terrainPoints: TerrainPoint[] = [];
export const terrainLines: TerrainLine[] = [];
/** 전투권에 38선이 지나지 않으면 빈 배열 유지 */
export const boundary38: LngLat[] = [];
`,
  'visual.ts': `import type { MapLabelPlacement, TerrainContour } from '../../../types';

/** 지도 편집값 — 스타일 표준: 전체 보기 사건 라벨 ≤5, 이동축 ≤3 */
export const eventLabels: Record<string, MapLabelPlacement> = {};
export const movementLabels: Record<string, MapLabelPlacement> = {};
export const terrainPointLabels: Record<string, MapLabelPlacement> = {};
export const terrainLineLabels: Record<string, MapLabelPlacement> = {};
export const terrainContours: Record<string, TerrainContour> = {};
export const emphasizedTerrainLines = new Set<string>();
`,
  'overview.ts': `import type { BattleOverview } from '../../../types';

export const battleOverview: BattleOverview = {
  kicker: '${meta.dateRange.start.replace(/-/g, '.')} – ${meta.dateRange.end.replace(/-/g, '.')} · <지역>',
  rok: 'TODO',
  nk: 'TODO',
  result: { label: 'TODO', note: 'TODO', tone: 'rok' },
  sections: [{ title: 'TODO', paragraphs: ['TODO'] }],
  sourceNote: 'TODO — 서술 출처와 도식화 한계를 명시',
};
`,
  'geo.ts': `import type { CoordNote } from '../../../types';

/** 사건별 좌표 신뢰도 — confirmed | offset | estimated (+근거 메모) */
export const eventCoordNotes: Record<string, CoordNote> = {};
`,
  'footnotes.ts': `import type { Footnote } from '../../../types';

export const footnotesByEvent: Record<string, Footnote[]> = {};
`,
  'links.ts': `/** 조인 테이블 — 카탈로그 본체는 src/data/shared/ */
export const eventSources: Record<string, string[]> = {};
export const eventPeople: Record<string, string[]> = {};
`,
  'index.ts': `import type { BattleData } from '../../../types';
import { ${camel(id)}Meta } from './meta';
import { days } from './days';
import { events } from './events';
import { movements } from './movements';
import { frontLines } from './frontlines';
import { units } from './units';
import { unitPositionsByDate } from './unitPositions';
import { terrainPoints, terrainLines, boundary38 } from './terrain';
import { battleOverview } from './overview';
import { eventLabels, movementLabels, terrainPointLabels, terrainLineLabels, terrainContours } from './visual';
import { eventCoordNotes } from './geo';
import { footnotesByEvent } from './footnotes';
import { eventSources, eventPeople } from './links';

/** ${meta.name.ko} 데이터 조립 — dynamic import 진입점 */
export const battle: BattleData = {
  meta: ${camel(id)}Meta,
  days,
  events: events.map((e) => ({ ...e, mapLabel: eventLabels[e.id] })),
  movements: movements.map((m) => ({ ...m, mapLabel: movementLabels[m.id] })),
  frontLines,
  units,
  unitPositionsByDate,
  terrainPoints: terrainPoints.map((p) => ({
    ...p,
    mapLabel: terrainPointLabels[p.id],
    meta: { ...p.meta, contour: terrainContours[p.id] ?? p.meta?.contour },
  })),
  terrainLines: terrainLines.map((l) => ({ ...l, mapLabel: terrainLineLabels[l.id] })),
  boundary38,
  overview: battleOverview,
  coordNotes: eventCoordNotes,
  footnotesByEvent,
  eventSources,
  eventPeople,
};
`,
};

function camel(s: string): string {
  return s.replace(/-(\w)/g, (_, c) => c.toUpperCase());
}
function stub(type: string, name: string, note: string): string {
  const typeName = type.replace('[]', '');
  return `import type { ${typeName} } from '../../../types';

/** TODO: ${note} */
export const ${name}: ${type} = [];
`;
}

for (const [file, content] of Object.entries(files)) {
  writeFileSync(`${dir}/${file}`, content);
}
console.log(`${dir}/ 생성 완료 (${Object.keys(files).length}개 파일)`);
console.log('다음: planned.ts에서 meta 제거 → 저작 → relief:make → registry 등록 → validate');
