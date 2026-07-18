import type { BattleData } from '../../../types';
import { hyeonriMeta } from './meta';
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

/** 현리 전투 데이터 조립 — dynamic import 진입점 */
export const battle: BattleData = {
  meta: hyeonriMeta,
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
