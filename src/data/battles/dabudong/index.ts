import type { BattleData } from '../../../types';
import { dabudongMeta } from './meta';
import { days } from './days';
import { events } from './events';
import { movements } from './movements';
import { frontLines } from './frontlines';
import { units } from './units';
import { unitPositionsByDate } from './unitPositions';
import { terrainPoints, terrainLines, boundary38 } from './terrain';
import { eventCoordNotes } from './geo';
import { footnotesByEvent } from './footnotes';
import { eventSources, eventPeople } from './links';

/** 다부동 전투 데이터 조립 — dynamic import 진입점 */
export const battle: BattleData = {
  meta: dabudongMeta,
  days,
  events,
  movements,
  frontLines,
  units,
  unitPositionsByDate,
  terrainPoints,
  terrainLines,
  boundary38,
  coordNotes: eventCoordNotes,
  footnotesByEvent,
  eventSources,
  eventPeople,
};
