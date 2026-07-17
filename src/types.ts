import type { UnitPosition } from './data/battles/chuncheon/unitPositions';
import type { PlanArrow } from './data/battles/chuncheon/plans';
import type { CoordNote } from './data/battles/chuncheon/geo';
import type { Footnote } from './data/battles/chuncheon/footnotes';

export type Faction = 'ROK' | 'NK';
/** 전투 축선 식별자 — 전투마다 다르므로 일반화된 문자열 */
export type AxisId = string;
export type Outcome = 'rok' | 'nk' | 'mixed' | 'none';

/** d3.geo 순서: [경도, 위도] */
export type LngLat = [number, number];

/** 전투별 지도 편집용 라벨 배치. 좌표와 라벨 위치를 분리해 충돌을 줄인다. */
export interface MapLabelPlacement {
  text?: string;
  dx?: number;
  dy?: number;
  anchor?: 'start' | 'middle' | 'end';
  minZoom?: number;
  /** 전체(누적) 화면에서 라벨 표시 여부 */
  showAtAll?: boolean;
  /** 전체(누적) 화면에서 이동 경로 자체를 표시할지 여부 */
  showPathAtAll?: boolean;
  /** 마커와 이격 라벨 사이에 유도선을 표시 */
  leader?: boolean;
}

/** 실제 DEM이 아닌 상황도용 도식 등고선. 단위는 경위도 차이값이다. */
export interface TerrainContour {
  rxDeg: number;
  ryDeg: number;
  rings?: number;
  rotate?: number;
}

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
  equipment?: string;                  // 주요 장비(텍스트)
  equipmentIds?: string[];             // 장비 카드 id
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
  mapLabel?: MapLabelPlacement;
}

export interface MovementArrow {
  id: string;
  faction: Faction;
  label: string;
  activeFrom: string;                  // 이 날짜부터 표시 'YYYY-MM-DD'
  path: LngLat[];
  style: 'advance' | 'attack' | 'withdraw';
  mapLabel?: MapLabelPlacement;
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
    label?: MapLabelPlacement;
    contour?: TerrainContour;
  };
}

export interface TerrainLine {
  id: string;
  kind: 'river' | 'road';
  name: string;
  coordinates: LngLat[];
  approx?: boolean;                    // 도식화된 근사 linework
  emphasis?: boolean;
  width?: number;                      // 강 굵기(px) — 광역 전투에서 하천 과대 표현 방지
  mapLabel?: MapLabelPlacement;
}

/** 지리 범위 (남서·북동 모서리) */
export interface Bbox {
  sw: LngLat;
  ne: LngLat;
}

/** 6.25 전쟁 국면 */
export type WarPhase = 'invasion' | 'naktong' | 'counter' | 'ccf' | 'stalemate';

/** 전투 메타 — 목록·자산·스토리지 키·프레이밍의 단일 출처 */
export interface BattleMeta {
  id: string;                                  // URL slug·asset·스토리지 키
  name: { ko: string; en: string };
  phase: WarPhase;
  dateRange: { start: string; end: string };
  marker: LngLat;                              // 목록 지도 마커
  summary: string;                             // 목록 카드 1~2문장
  status: 'available' | 'planned';
  bbox?: Bbox;                                 // available이면 필수 (구 projection.BBOX)
  reliefBbox?: Bbox;
  relief?: { light: string; dark: string };    // '/relief/<id>-light.png'
  cartouche?: { title: string; en: string; sub: string; stamp?: string };
  intro?: { headline: string; body: string };  // TitleIntro 카피 데이터화
  /** 인셋 미니맵 — 이 전투 지점 라벨 + 서울 함락 주기 날짜 */
  inset?: { label?: string; seoulFallDate?: string };
}

export interface BattleOverview {
  kicker: string;
  rok: string;
  nk: string;
  result: {
    label: string;
    note: string;
    tone?: 'rok' | 'nk' | 'mixed';
  };
  sections: {
    title: string;
    paragraphs: string[];
    note?: boolean;
  }[];
  sourceNote: string;
}

/** 한 전투의 완결된 데이터 묶음 (dynamic import 단위) */
export interface BattleData {
  meta: BattleMeta;
  days: DayPhase[];
  events: BattleEvent[];
  movements: MovementArrow[];
  frontLines: FrontLine[];
  units: MilitaryUnit[];
  unitPositionsByDate: Record<string, UnitPosition[]>;
  terrainPoints: TerrainPoint[];
  terrainLines: TerrainLine[];
  boundary38: LngLat[];                          // 38선 도식 폴리라인
  plans?: {
    arrows: PlanArrow[];
    failedFrom: string;
    note: string;
    stamp?: { text: string; coord: LngLat; rotate?: number; scale?: number };
  };
  overview?: BattleOverview;
  coordNotes: Record<string, CoordNote>;
  footnotesByEvent: Record<string, Footnote[]>;
  eventSources: Record<string, string[]>;      // 공용 sources 카탈로그 id 참조
  eventPeople: Record<string, string[]>;        // 공용 people 카탈로그 id 참조
}
