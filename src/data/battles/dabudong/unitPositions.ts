import type { LngLat } from '../../../types';

export interface UnitPosition {
  unitId: string;
  coord: LngLat;
  note?: string;
}

/** 날짜별 주요 부대 배치 — 연대급 이상 위치를 상황도 수준으로 근사했다. */
export const unitPositionsByDate: Record<string, UnitPosition[]> = {
  '1950-08-03': [
    { unitId: 'rok-1div', coord: [128.37, 36.17], note: '낙동강선으로 축차 철수' },
    { unitId: 'rok-11reg', coord: [128.34, 36.13], note: '왜관 북방 지연전' },
    { unitId: 'rok-12reg', coord: [128.41, 36.18], note: '낙동리~다부동 접근로' },
    { unitId: 'us-1cav', coord: [128.39, 35.99], note: '왜관 동안 방어·교량 차단' },
    { unitId: 'nk-3div', coord: [128.30, 36.22], note: '낙동강 접근' },
    { unitId: 'nk-13div', coord: [128.42, 36.26], note: '다부동 축선 남하' },
  ],
  '1950-08-10': [
    { unitId: 'rok-11reg', coord: [128.37, 36.08], note: '303고지~유학산 서측' },
    { unitId: 'rok-12reg', coord: [128.42, 36.10], note: '유학산~다부동 정면' },
    { unitId: 'rok-15reg', coord: [128.54, 36.13], note: '다부동 동측~가산' },
    { unitId: 'rok-1div-art', coord: [128.48, 36.02], note: '다부동 남방 포진' },
    { unitId: 'nk-3div', coord: [128.34, 36.12], note: '왜관 북방 압박' },
    { unitId: 'nk-13div', coord: [128.44, 36.17], note: '다부동 접근' },
    { unitId: 'nk-15div', coord: [128.51, 36.20], note: '유학산 동측 접근' },
  ],
  '1950-08-13': [
    { unitId: 'rok-15reg', coord: [128.37, 36.05], note: '328고지 공방' },
    { unitId: 'rok-12reg', coord: [128.41, 36.085], note: '유학산 주저항선' },
    { unitId: 'rok-11reg', coord: [128.49, 36.10], note: '다부동 중앙 연결' },
    { unitId: 'nk-3div', coord: [128.35, 36.08], note: '328고지 압박' },
    { unitId: 'nk-13div', coord: [128.43, 36.14], note: '다부동 북방' },
    { unitId: 'nk-15div', coord: [128.49, 36.15], note: '유학산 동측' },
  ],
  '1950-08-15': [
    { unitId: 'rok-11reg', coord: [128.38, 36.065], note: '유학산 서사면' },
    { unitId: 'rok-12reg', coord: [128.40, 36.075], note: '839고지 공방' },
    { unitId: 'rok-15reg', coord: [128.51, 36.10], note: '다부동 동측' },
    { unitId: 'rok-1div-art', coord: [128.46, 36.02], note: '고지 화력지원' },
    { unitId: 'nk-13div', coord: [128.42, 36.12], note: '유학산~다부동 공격' },
    { unitId: 'nk-15div', coord: [128.46, 36.13], note: '유학산 동측 공격' },
  ],
  '1950-08-18': [
    { unitId: 'rok-12reg', coord: [128.40, 36.055], note: '일부 진지 후퇴·수습' },
    { unitId: 'rok-15reg', coord: [128.49, 36.075], note: '다부동 동측 차단' },
    { unitId: 'rok-1div-art', coord: [128.46, 36.015], note: '다부동 도로 집중사격' },
    { unitId: 'us-27reg', coord: [128.46, 36.045], note: '반격 개시' },
    { unitId: 'nk-13div', coord: [128.44, 36.09], note: '도로축 돌파구' },
    { unitId: 'nk-105arm', coord: [128.46, 36.12], note: 'T-34 남하' },
  ],
  '1950-08-20': [
    { unitId: 'rok-1div', coord: [128.45, 36.055], note: '다부동 방어선 수습' },
    { unitId: 'rok-12reg', coord: [128.40, 36.065], note: '유학산 남사면' },
    { unitId: 'us-27reg', coord: [128.45, 36.09], note: '볼링장 도로 차단' },
    { unitId: 'nk-13div', coord: [128.45, 36.13], note: '야간 보병 공격' },
    { unitId: 'nk-105arm', coord: [128.46, 36.145], note: 'T-34 돌파 대기' },
    { unitId: 'nk-15div', coord: [128.52, 36.14], note: '영천 방면 전환 준비' },
  ],
  '1950-08-21': [
    { unitId: 'rok-1div', coord: [128.435, 36.065], note: '지휘부 전방 독려' },
    { unitId: 'rok-11reg', coord: [128.38, 36.07], note: '서부 고지선 회복' },
    { unitId: 'rok-12reg', coord: [128.41, 36.08], note: '국지 역습' },
    { unitId: 'rok-15reg', coord: [128.50, 36.10], note: '우익 진지 연결' },
    { unitId: 'us-27reg', coord: [128.45, 36.10], note: '도로축 지원' },
    { unitId: 'nk-13div', coord: [128.44, 36.13], note: '돌파구 축소' },
  ],
  '1950-08-25': [
    { unitId: 'rok-11reg', coord: [128.38, 36.08], note: '유학산 서부 재정착' },
    { unitId: 'rok-12reg', coord: [128.41, 36.095], note: '839고지 방어' },
    { unitId: 'rok-15reg', coord: [128.53, 36.12], note: '가산 방어' },
    { unitId: 'us-27reg', coord: [128.46, 36.075], note: '기동예비' },
    { unitId: 'nk-3div', coord: [128.35, 36.11], note: '공격력 소진' },
    { unitId: 'nk-13div', coord: [128.44, 36.15], note: '북방 재편' },
  ],
  '1950-09-02': [
    { unitId: 'rok-11reg', coord: [128.38, 36.06], note: '9월 공세 방어' },
    { unitId: 'rok-12reg', coord: [128.405, 36.07], note: '유학산 진지 분절' },
    { unitId: 'rok-15reg', coord: [128.50, 36.09], note: '가산 침투 대응' },
    { unitId: 'us-23reg', coord: [128.47, 36.035], note: '후방 차단선 증원' },
    { unitId: 'nk-3div', coord: [128.36, 36.10], note: '서부 공격' },
    { unitId: 'nk-13div', coord: [128.43, 36.115], note: '중앙 공격' },
  ],
  '1950-09-08': [
    { unitId: 'rok-12reg', coord: [128.40, 36.06], note: '유학산 국지 반격' },
    { unitId: 'rok-15reg', coord: [128.56, 36.085], note: '가산 침투전' },
    { unitId: 'us-23reg', coord: [128.50, 36.045], note: '우익·후방 보강' },
    { unitId: 'rok-1div-art', coord: [128.47, 36.00], note: '고지 화력지원' },
    { unitId: 'nk-13div', coord: [128.51, 36.115], note: '가산 능선 침투' },
    { unitId: 'nk-105arm', coord: [128.44, 36.105], note: '도로축 지원' },
  ],
  '1950-09-16': [
    { unitId: 'rok-1div', coord: [128.44, 36.095], note: '북진 반격 지휘' },
    { unitId: 'rok-11reg', coord: [128.38, 36.10], note: '유학산 북방 진출' },
    { unitId: 'rok-12reg', coord: [128.42, 36.12], note: '다부동 북방 공격' },
    { unitId: 'rok-15reg', coord: [128.55, 36.14], note: '가산 북방 공격' },
    { unitId: 'us-27reg', coord: [128.46, 36.12], note: '도로축 추격 지원' },
    { unitId: 'nk-13div', coord: [128.43, 36.18], note: '북방 철수' },
  ],
  '1950-09-22': [
    { unitId: 'rok-1div', coord: [128.44, 36.22], note: '상주 방향 추격' },
    { unitId: 'rok-11reg', coord: [128.36, 36.20], note: '서부 북진' },
    { unitId: 'rok-12reg', coord: [128.43, 36.24], note: '중앙 북진' },
    { unitId: 'rok-15reg', coord: [128.56, 36.25], note: '동부 북진' },
    { unitId: 'us-27reg', coord: [128.45, 36.18], note: '추격 지원' },
    { unitId: 'nk-13div', coord: [128.40, 36.30], note: '철수 중' },
  ],
};
