import type { TerrainPoint, TerrainLine, LngLat } from '../../../types';

/**
 * 다부동 전투 지형점.
 * 전투 당시 상황도와 현 지명을 대조한 도식 좌표이며, 고지·옛 도로의 세부 위치는
 * meta.uncertain 및 사건별 geo.ts에서 신뢰도를 별도로 밝힌다.
 */
export const terrainPoints: TerrainPoint[] = [
  { id: 'daegu', kind: 'city', name: '대구', coord: [128.601, 35.871], meta: { note: '방어 대상·남쪽 앵커' } },
  { id: 'waegwan', kind: 'city', name: '왜관', coord: [128.399, 35.990] },
  { id: 'dabudong', kind: 'spot', name: '다부동', coord: [128.436, 36.052], meta: { note: '상주–대구 축선 관문' } },
  { id: 'gunwi', kind: 'city', name: '군위', coord: [128.572, 36.242] },
  { id: 'chilgok', kind: 'city', name: '칠곡', coord: [128.479, 35.995] },
  { id: 'nakjeong', kind: 'spot', name: '낙정리', coord: [128.275, 36.252], meta: { uncertain: true, note: '낙동강 도하·지연전 맥락' } },
  { id: 'sangju-road', kind: 'spot', name: '상주 방면', coord: [128.190, 36.285], meta: { note: '북방 접근로' } },

  { id: 'yuhaksan', kind: 'peak', name: '유학산 839고지', coord: [128.391, 36.075], meta: { elevation: 839, note: '서부 주저항선' } },
  { id: 'gasan', kind: 'peak', name: '가산 902고지', coord: [128.638, 36.105], meta: { elevation: 902, note: '동부 측방 요충' } },
  { id: 'suamsan', kind: 'peak', name: '수암산 518고지', coord: [128.463, 36.086], meta: { elevation: 518, uncertain: true } },
  { id: 'hill328', kind: 'hill', name: '328고지', coord: [128.363, 36.043], meta: { elevation: 328, uncertain: true } },
  { id: 'hill303', kind: 'hill', name: '303고지(자고산)', coord: [128.374, 36.010], meta: { elevation: 303, uncertain: true } },
  { id: 'hill373', kind: 'hill', name: '373고지', coord: [128.505, 36.031], meta: { elevation: 373, uncertain: true } },

  { id: 'cheonpyeong', kind: 'spot', name: '천평계곡', coord: [128.455, 36.119], meta: { uncertain: true, note: '볼링장 전투 축선' } },
  { id: 'bowling-road', kind: 'spot', name: '볼링장 도로', coord: [128.449, 36.102], meta: { uncertain: true, note: '전차·대전차포 야간 교전로' } },
  { id: 'waegwan-bridge', kind: 'bridge', name: '왜관철교', coord: [128.397, 35.991], meta: { note: '8월 3일 폭파' } },
  { id: 'gasan-fortress', kind: 'spot', name: '가산산성', coord: [128.632, 36.096], meta: { uncertain: true, note: '가산 일대 침투로' } },
];

/** 전투권 밖인 38선은 이 상황도에 표시하지 않는다. */
export const boundary38: LngLat[] = [];

/**
 * 1950년 하천·도로의 도식 linework.
 * 현대 낙동강 보·도로 선형을 그대로 복제하지 않고 상황도 수준으로 단순화했다.
 */
export const terrainLines: TerrainLine[] = [
  {
    id: 'naktong-river',
    kind: 'river',
    name: '낙동강',
    approx: true,
    width: 2.2,                          // 광역 축척에서 과대 표현 방지
    coordinates: [
      [128.285, 36.305],
      [128.300, 36.260],
      [128.315, 36.210],
      [128.330, 36.160],
      [128.350, 36.110],
      [128.365, 36.060],
      [128.385, 36.015],
      [128.399, 35.990],
      [128.410, 35.945],
      [128.423, 35.895],
      [128.435, 35.835],
    ],
  },
  {
    id: 'geumho-river',
    kind: 'river',
    name: '금호강',
    approx: true,
    width: 1.5,
    coordinates: [
      [128.360, 35.925],
      [128.420, 35.915],
      [128.480, 35.905],
      [128.535, 35.895],
      [128.590, 35.885],
      [128.640, 35.875],
    ],
  },
  {
    id: 'daegu-dabudong-road',
    kind: 'road',
    name: '대구–다부동–상주 국도',
    approx: true,
    coordinates: [
      [128.601, 35.871],
      [128.555, 35.910],
      [128.510, 35.960],
      [128.470, 36.010],
      [128.436, 36.052],
      [128.450, 36.105],
      [128.470, 36.155],
      [128.505, 36.210],
      [128.545, 36.270],
    ],
  },
  {
    id: 'waegwan-daegu-rail',
    kind: 'road',
    name: '왜관–대구 철도',
    approx: true,
    coordinates: [
      [128.397, 35.991],
      [128.430, 35.965],
      [128.470, 35.940],
      [128.520, 35.915],
      [128.565, 35.895],
      [128.601, 35.871],
    ],
  },
];
