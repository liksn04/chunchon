import type { BattleData } from '../../../types';
import { chuncheonMeta } from './meta';
import { days } from './days';
import { events } from './events';
import { movements } from './movements';
import { frontLines } from './frontlines';
import { units } from './units';
import { unitPositionsByDate } from './unitPositions';
import { terrainPoints, terrainLines, boundary38 } from './terrain';
import { planArrows, PLAN_FAILED_FROM, planNote, planStamp } from './plans';
import { battleOverview } from './overview';
import { eventLabels } from './visual';
import { eventCoordNotes } from './geo';
import { footnotesByEvent } from './footnotes';
import { eventSources, eventPeople } from './links';

/** 춘천–홍천 전투 데이터 조립 — dynamic import 진입점 */
export const battle: BattleData = {
  meta: chuncheonMeta,
  days,
  // 전체 보기 큐레이션(visual.ts)을 사건에 병합 — 다부동과 같은 표준 배선
  events: events.map((event) => ({ ...event, mapLabel: eventLabels[event.id] })),
  movements,
  frontLines,
  units,
  unitPositionsByDate,
  terrainPoints,
  terrainLines,
  boundary38,
  plans: { arrows: planArrows, failedFrom: PLAN_FAILED_FROM, note: planNote, stamp: planStamp },
  overview: battleOverview,
  coordNotes: eventCoordNotes,
  footnotesByEvent,
  eventSources,
  eventPeople,
};
