import type { LngLat, WarPhase } from '../../types';

/**
 * 전쟁 국면별 전선(戰線) — 목록 지도의 점령 양상 오버레이용 도식 근사.
 * 각 선은 서→동으로 한반도를 관통하며, 육지 클리핑을 위해 양끝을 해상까지
 * 연장한다. 선의 북쪽이 북한군 점령(적색), 남쪽이 국군·유엔군(청색).
 * 낙동강 단계는 부산 교두보 방어선이므로 남해상에서 시작해 동해상으로 빠진다
 * (선의 북·서쪽 전체가 적색 — 당시 전라·충청도 포함).
 */
export interface WarFrontStage {
  id: string;
  date: string;                          // 'YYYY.M' 표기용
  label: { ko: string; en: string };
  line: LngLat[];
  phase?: WarPhase;                      // 국면 필터 클릭 시 연동되는 단계
}

export const warFrontStages: WarFrontStage[] = [
  {
    id: 'outbreak',
    date: '1950.6',
    label: { ko: '개전 — 38선', en: 'Outbreak — 38th parallel' },
    phase: 'invasion',
    line: [
      [123.8, 38.0],
      [126.0, 38.0],
      [128.0, 38.0],
      [131.2, 38.0],
    ],
  },
  {
    id: 'naktong',
    date: '1950.9',
    label: { ko: '낙동강 방어선 (부산 교두보)', en: 'Pusan Perimeter' },
    phase: 'naktong',
    line: [
      [128.32, 33.8],
      [128.42, 35.20],
      [128.50, 35.60],
      [128.42, 36.00],
      [128.62, 36.10],
      [129.00, 36.25],
      [129.50, 36.48],
      [131.20, 36.55],
    ],
  },
  {
    id: 'recovery',
    date: '1950.10',
    label: { ko: '인천상륙·38선 회복', en: 'Inchon — back to the 38th' },
    line: [
      [123.8, 38.0],
      [126.2, 38.0],
      [128.1, 38.05],
      [131.2, 38.1],
    ],
  },
  {
    id: 'maxnorth',
    date: '1950.11',
    label: { ko: '최대 북진 — 압록강 접근', en: 'Farthest north — near the Yalu' },
    phase: 'counter',
    line: [
      [123.9, 39.70],
      [125.35, 39.85],
      [126.20, 40.15],
      [127.00, 40.55],
      [127.60, 41.05],
      [128.30, 41.40],
      [129.30, 41.55],
      [130.20, 41.85],
      [131.30, 42.15],
    ],
  },
  {
    id: 'retreat',
    date: '1951.1',
    label: { ko: '중공군 개입 — 1·4 후퇴', en: 'Chinese intervention — Jan 4 retreat' },
    phase: 'ccf',
    line: [
      [123.9, 37.00],
      [126.60, 37.00],
      [127.20, 37.12],
      [127.90, 37.25],
      [128.60, 37.30],
      [129.05, 37.38],
      [131.20, 37.50],
    ],
  },
  {
    id: 'stalemate',
    date: '1951.11',
    label: { ko: '전선 고착 — 고지전', en: 'Stalemate — the hill battles' },
    phase: 'stalemate',
    line: [
      [123.9, 37.85],
      [126.40, 37.90],
      [126.90, 38.15],
      [127.30, 38.30],
      [127.90, 38.30],
      [128.30, 38.50],
      [131.20, 38.65],
    ],
  },
  {
    id: 'armistice',
    date: '1953.7',
    label: { ko: '정전협정 — 군사분계선', en: 'Armistice — the MDL' },
    line: [
      [123.9, 37.90],
      [126.40, 37.95],
      [126.90, 38.20],
      [127.35, 38.33],
      [127.90, 38.32],
      [128.35, 38.62],
      [131.20, 38.70],
    ],
  },
];

/** 국면 필터 → 대표 전황 단계 인덱스 */
export const stageIndexByPhase: Partial<Record<WarPhase, number>> = Object.fromEntries(
  warFrontStages.flatMap((s, i) => (s.phase ? [[s.phase, i]] : [])),
);
