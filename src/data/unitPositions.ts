import type { LngLat } from '../types';

/**
 * 일자별 주요 부대 위치 (APP-6 간이 기호 레이어용).
 * 서술 기록 기반의 도식적 근사 — 정확한 진지 좌표가 아니라
 * "그날 그 부대가 어느 축선에 있었나"를 보여주는 수준이다.
 */
export interface UnitPosition {
  unitId: string;   // MilitaryUnit id
  coord: LngLat;
  note?: string;    // 짧은 상태 주석 (마우스오버 title)
}

export const unitPositionsByDate: Record<string, UnitPosition[]> = {
  '1950-06-25': [
    { unitId: 'rok-7reg',  coord: [127.726, 37.898], note: '옥산포~소양강 북안 방어' },
    { unitId: 'rok-16art', coord: [127.740, 37.872], note: '춘천 시내 포진지' },
    { unitId: 'rok-2reg',  coord: [127.930, 37.775], note: '558·402고지 방어선' },
    { unitId: 'rok-19reg', coord: [127.920, 37.360], note: '원주 예비 — 북상 개시' },
    { unitId: 'nk-2div',   coord: [127.700, 37.950], note: '모진교 돌파, 옥산포 압박' },
    { unitId: 'nk-12div',  coord: [128.045, 37.925], note: '인제 돌파, 남하 중' },
  ],
  '1950-06-26': [
    { unitId: 'rok-7reg',  coord: [127.740, 37.888], note: '소양강 방어선' },
    { unitId: 'rok-16art', coord: [127.735, 37.868], note: '춘천역·나의동·우시장 포대' },
    { unitId: 'rok-19reg', coord: [127.760, 37.855], note: '2대대 춘천 증원' },
    { unitId: 'rok-2reg',  coord: [127.955, 37.812], note: '자은리 축선 지연전' },
    { unitId: 'nk-2div',   coord: [127.715, 37.915], note: '옥산포 재집결 — 기습당함' },
    { unitId: 'nk-12div',  coord: [128.005, 37.870], note: '어론리~자은리 남하' },
  ],
  '1950-06-27': [
    { unitId: 'rok-7reg',  coord: [127.735, 37.868], note: '봉의산 피탈, 시내 후퇴' },
    { unitId: 'rok-16art', coord: [127.728, 37.858], note: '가래목 집중포격' },
    { unitId: 'rok-19reg', coord: [127.975, 37.828], note: '말고개 증원' },
    { unitId: 'rok-2reg',  coord: [127.950, 37.808], note: '말고개 방어' },
    { unitId: 'nk-2div',   coord: [127.730, 37.895], note: '춘천 진입 — 전투력 40% 상실' },
    { unitId: 'nk-12div',  coord: [127.988, 37.845], note: '말고개 북측 압박' },
  ],
  '1950-06-28': [
    { unitId: 'rok-7reg',  coord: [127.758, 37.812], note: '금병산·원창고개 방어' },
    { unitId: 'rok-16art', coord: [127.790, 37.795], note: '원창 남측 포진지' },
    { unitId: 'rok-2reg',  coord: [127.972, 37.830], note: '큰말고개 매복 (육탄 11용사)' },
    { unitId: 'rok-19reg', coord: [127.992, 37.842], note: '3대대 매복 가세' },
    { unitId: 'nk-2div',   coord: [127.734, 37.882], note: '춘천 장악, 남진 재개' },
    { unitId: 'nk-12div',  coord: [127.940, 37.885], note: '주력 춘천 전환 중' },
  ],
  '1950-06-29': [
    { unitId: 'rok-7reg',  coord: [127.850, 37.740], note: '홍천 방면 철수' },
    { unitId: 'rok-2reg',  coord: [127.920, 37.720], note: '반격 취소 — 철수 개시' },
    { unitId: 'rok-19reg', coord: [127.940, 37.700], note: '철수 엄호' },
    { unitId: 'rok-16art', coord: [127.900, 37.690], note: '철수 지원' },
    { unitId: 'nk-2div',   coord: [127.790, 37.820], note: '남진 추격' },
    { unitId: 'nk-12div',  coord: [127.870, 37.800], note: '홍천 방면 포위 기동' },
  ],
  '1950-06-30': [
    { unitId: 'rok-6div',  coord: [127.985, 37.500], note: '횡성 경유 철수 종대' },
    { unitId: 'nk-2div',   coord: [127.890, 37.690], note: '홍천 진입' },
    { unitId: 'nk-12div',  coord: [127.930, 37.720], note: '추격 남하' },
  ],
  '1950-07-01': [
    { unitId: 'rok-6div',  coord: [127.930, 37.000], note: '충주 집결 — 재편성' },
    { unitId: 'nk-2corps', coord: [127.940, 37.560], note: '홍천~횡성 축선' },
  ],
};
