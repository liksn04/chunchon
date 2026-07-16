import type {
  BattleData,
  BattleEvent,
  DayPhase,
  FrontLine,
  MilitaryUnit,
} from '../types';

/** 브리핑 대본의 한 스텝: 날짜 인트로(eventId=null) 또는 사건 클로즈업 */
export interface BriefStep {
  date: string;
  eventId: string | null;
}

/** 로드 시 1회 파생되는 lookup·대본을 얹은 전투 번들 */
export interface BattleBundle extends BattleData {
  eventById: Map<string, BattleEvent>;
  dayByDate: Map<string, DayPhase>;
  frontLineByDate: Map<string, FrontLine>;
  unitById: Map<string, MilitaryUnit>;
  /** 브리핑 대본: 각 날짜마다 [인트로 → 그날의 사건들] 순서 */
  briefScript: BriefStep[];
  /** 날짜 이동 순서 ('전체' → 각 날짜) */
  dayOrder: (string | 'all')[];
}

/** BattleData → BattleBundle (파생 lookup·briefScript·dayOrder 생성) */
export function makeBundle(data: BattleData): BattleBundle {
  const briefScript: BriefStep[] = data.days.flatMap((d) => [
    { date: d.date, eventId: null },
    ...d.activeEventIds.map((id) => ({ date: d.date, eventId: id })),
  ]);

  return {
    ...data,
    eventById: new Map(data.events.map((e) => [e.id, e])),
    dayByDate: new Map(data.days.map((d) => [d.date, d])),
    frontLineByDate: new Map(data.frontLines.map((f) => [f.date, f])),
    unitById: new Map(data.units.map((u) => [u.id, u])),
    briefScript,
    dayOrder: ['all', ...data.days.map((d) => d.date)],
  };
}
