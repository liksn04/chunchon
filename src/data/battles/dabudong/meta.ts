import type { BattleMeta } from '../../../types';

/** 다부동 전투 메타 — 8월 방어전부터 9월 반격 전환까지 포괄한다. */
export const dabudongMeta: BattleMeta = {
  id: 'dabudong',
  name: { ko: '다부동 전투', en: 'Battle of Tabu-dong' },
  phase: 'naktong',
  dateRange: { start: '1950-08-03', end: '1950-09-22' },
  marker: [128.436, 36.052],
  summary:
    '1950년 8~9월 국군 제1사단과 미군 증원부대가 대구 북방 다부동 축선에서 북한군 제3·13·15사단의 공세를 저지한 방어전이다. 유학산·수암산·가산과 천평계곡을 둘러싼 반복 공방 끝에 방어선을 유지하고 9월 반격으로 전환했다.',
  status: 'available',
  bbox: {
    // 전투 정면(왜관–유학산–다부동–가산)이 화면 중앙 과반을 차지하도록 조인 프레이밍.
    // 대구는 남동 모서리에 걸치고, 군위·상주 방면은 팬으로 확인한다.
    sw: [128.25, 35.83],
    ne: [128.70, 36.28],
  },
  reliefBbox: {
    sw: [128.05, 35.68],
    ne: [128.94, 36.42],
  },
  cartouche: {
    title: '다부동 전투 상황도',
    en: 'BATTLE OF TABU-DONG',
    sub: '군 작전상황도(도식) · 1950. 8.–9.',
    stamp: '작전참고 № 2',
  },
  intro: {
    headline: '다부동 전투',
    body: '— 대구 북방의 최후 방어선 —',
  },
  inset: {
    label: '다부동',
  },
};
