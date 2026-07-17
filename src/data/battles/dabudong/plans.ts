import type { PlanArrow } from '../chuncheon/plans';

/** 북한 제2군단이 다부동과 가산 축을 열어 대구로 진출하려 한 작전 기도. */
export const planArrows: PlanArrow[] = [
  {
    id: 'plan-tabudong-daegu',
    label: '다부동 도로 돌파 → 대구',
    path: [
      [128.468, 36.180],
      [128.447, 36.115],
      [128.436, 36.052],
      [128.500, 35.970],
      [128.585, 35.895],
    ],
    mapLabel: {
      text: '다부동 축 → 대구',
      index: 2,
      dx: 14,
      dy: 18,
      anchor: 'start',
      showAtAll: false,
    },
  },
  {
    id: 'plan-gasan-daegu',
    label: '가산 우회 → 대구 북동부',
    path: [
      [128.650, 36.175],
      [128.635, 36.105],
      [128.615, 36.035],
      [128.610, 35.955],
      [128.602, 35.875],
    ],
    mapLabel: {
      text: '가산 우회 기도',
      index: 2,
      dx: 14,
      dy: -12,
      anchor: 'start',
      showAtAll: false,
    },
  },
];

export const PLAN_FAILED_FROM = '1950-09-16';

export const planNote =
  '반투명 적색 점선은 다부동 도로와 가산 측방을 열어 대구로 진출하려 한 북한 제2군단의 작전 기도를 도식화한 것이다. ' +
  '8월 공세 뒤 9월 공세까지 반복됐지만 대구 북방선은 유지됐고, 9월 16일 국군·유엔군의 총반격이 시작되면서 이 기도는 최종적으로 좌절됐다.';

export const planStamp = {
  text: '대구 돌파 기도 좌절',
  // 대구 진출 기도 화살표 위에 겹쳐 찍는다 — 좌절된 계획 위의 소인(消印) 연출
  coord: [128.585, 35.990] as [number, number],
  rotate: -8,
  scale: 0.72,
};
