import type { BattleData } from '../../../types';
import { dabudongMeta } from './meta';
import { days } from './days';
import { events as rawEvents } from './events';
import { movements as rawMovements } from './movements';
import { frontLines } from './frontlines';
import { units } from './units';
import { unitPositionsByDate } from './unitPositions';
import { terrainPoints as rawTerrainPoints, terrainLines as rawTerrainLines, boundary38 } from './terrain';
import { eventCoordNotes } from './geo';
import { footnotesByEvent } from './footnotes';
import { eventSources, eventPeople } from './links';
import { battleOverview } from './overview';
import { planArrows, PLAN_FAILED_FROM, planNote, planStamp } from './plans';
import {
  eventLabels,
  movementLabels,
  terrainPointLabels,
  terrainContours,
  terrainLineLabels,
  emphasizedTerrainLines,
} from './visual';

const events = rawEvents.map((event) => ({
  ...event,
  mapLabel: eventLabels[event.id],
}));

const movements = rawMovements.map((movement) => ({
  ...movement,
  mapLabel: movementLabels[movement.id],
}));

const terrainPoints = rawTerrainPoints.map((point) => {
  const label = terrainPointLabels[point.id];
  const contour = terrainContours[point.id];
  if (!label && !contour) return point;
  return {
    ...point,
    meta: {
      ...point.meta,
      label,
      contour,
    },
  };
});

const terrainLines = rawTerrainLines.map((line) => ({
  ...line,
  emphasis: emphasizedTerrainLines.has(line.id),
  mapLabel: terrainLineLabels[line.id],
}));

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
  plans: {
    arrows: planArrows,
    failedFrom: PLAN_FAILED_FROM,
    note: planNote,
    stamp: planStamp,
  },
  overview: battleOverview,
  coordNotes: eventCoordNotes,
  footnotesByEvent,
  eventSources,
  eventPeople,
};
