export type Faction = 'ROK' | 'NK';
export type AxisId = 'chuncheon' | 'inje-hongcheon' | 'both';
export type Outcome = 'rok' | 'nk' | 'mixed' | 'none';

/** d3.geo 순서: [경도, 위도] */
export type LngLat = [number, number];

export interface MilitaryUnit {
  id: string;
  faction: Faction;
  designation: string;                 // "국군 7연대", "북한 2사단"
  echelon: 'corps' | 'division' | 'regiment' | 'battalion' | 'battery';
  parent?: string;                     // MilitaryUnit id
  commander?: string;
  symbol: 'infantry' | 'artillery' | 'armor' | 'motorized';
  role?: string;                       // 한 줄 역할
  detail?: string;                     // 전투에서의 서술
  equipment?: string;                  // 주요 장비
  strength?: string;                   // 병력·규모
}

export interface BattleEvent {
  id: string;
  date: string;                        // 'YYYY-MM-DD'
  time?: string;                       // '04:00'
  title: string;
  axis: AxisId;
  coord: LngLat;
  unitIds: string[];                   // MilitaryUnit id[]
  outcome: Outcome;
  summary: string;                     // 1~2문장
  detail: string;                      // 서술
  significance?: string;
  tags?: string[];
  key?: boolean;                       // ★ 핵심 사건 강조
}

export interface MovementArrow {
  id: string;
  faction: Faction;
  label: string;
  activeFrom: string;                  // 이 날짜부터 표시 'YYYY-MM-DD'
  path: LngLat[];
  style: 'advance' | 'attack' | 'withdraw';
}

export interface FrontLine {
  date: string;                        // 'YYYY-MM-DD'
  coordinates: LngLat[];               // 남하하는 전선 폴리라인
  label?: string;
  approx?: boolean;                    // 도식화/근사 여부
}

export interface DayPhase {
  date: string;                        // 'YYYY-MM-DD'
  label: string;                       // '6.27'
  headline: string;                    // 그날 한 줄 요약
  activeEventIds: string[];
  activeArrowIds: string[];
  frontLineDate: string;               // 참조할 FrontLine.date
}

export type TerrainKind =
  | 'city' | 'peak' | 'hill' | 'bridge' | 'spot' | 'assembly';

export interface TerrainPoint {
  id: string;
  kind: TerrainKind;
  name: string;
  coord: LngLat;
  meta?: {
    elevation?: number;
    note?: string;
    submerged1950?: boolean;           // 1950년엔 없었거나 이후 수몰
    uncertain?: boolean;               // 좌표 보정 필요
  };
}

export interface TerrainLine {
  id: string;
  kind: 'river' | 'road';
  name: string;
  coordinates: LngLat[];
  approx?: boolean;                    // 도식화된 근사 linework
}
