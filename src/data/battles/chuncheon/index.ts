import type { BattleData } from '../../../types';
import { chuncheonMeta } from './meta';
import { days } from './days';
import { events } from './events';
import { movements } from './movements';
import { frontLines } from './frontlines';
import { units } from './units';
import { unitPositionsByDate } from './unitPositions';
import { terrainPoints, terrainLines, boundary38 } from './terrain';
import { planArrows, PLAN_FAILED_FROM, planNote } from './plans';
import { eventCoordNotes } from './geo';
import { footnotesByEvent } from './footnotes';
import { eventSources, eventPeople } from './links';

/** 춘천–홍천 전투 데이터 조립 — dynamic import 진입점 */
export const battle: BattleData = {
  meta: chuncheonMeta,
  days,
  events,
  movements,
  frontLines,
  units,
  unitPositionsByDate,
  terrainPoints,
  terrainLines,
  boundary38,
  plans: { arrows: planArrows, failedFrom: PLAN_FAILED_FROM, note: planNote },
  coordNotes: eventCoordNotes,
  footnotesByEvent,
  eventSources,
  eventPeople,
};
