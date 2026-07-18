import type { MapLabelPlacement, TerrainContour } from '../../../types';

/**
 * 다부동 전용 지도 편집값.
 * 실제 지리 좌표는 원본 데이터에 유지하고, 라벨의 축약명·오프셋·노출 단계만 분리한다.
 */
export const eventLabels: Record<string, MapLabelPlacement> = {
  'nakjeong-delay': { text: '낙동강선 지연 철수', dx: 18, dy: -14, anchor: 'start', leader: true, showAtAll: false },
  'waegwan-bridge-demolition': { text: '왜관철교 폭파', dx: 18, dy: 18, anchor: 'start', leader: true, showAtAll: false },
  'line-contraction': { text: '다부동 방어선 압축', dx: 20, dy: -18, anchor: 'start', leader: true, showAtAll: false },
  'hill328-opening': { text: '328고지 공방', dx: -20, dy: 18, anchor: 'end', leader: true, showAtAll: false },
  'yuhaksan-839': { text: '유학산 839고지 공방', dx: -28, dy: -30, anchor: 'end', leader: true, showAtAll: true },
  'tabudong-breach': { text: '다부동 돌파 위기', dx: 30, dy: -26, anchor: 'start', leader: true, showAtAll: true },
  'daegu-shelling': { text: '대구역 피탄', dx: 18, dy: -16, anchor: 'start', leader: true, showAtAll: false },
  'bowling-alley-opening': { text: '27연대 투입', dx: -30, dy: -16, anchor: 'end', leader: true, showAtAll: false },
  'bowling-alley-night-battles': { text: '볼링장 야간 전차전', dx: 32, dy: 32, anchor: 'start', leader: true, showAtAll: true },
  'paik-frontline': { text: '전방 지휘·진지 회복', dx: -22, dy: 22, anchor: 'end', leader: true, showAtAll: false },
  'august-offensive-contained': { text: '8월 공세 둔화', dx: 20, dy: 20, anchor: 'start', leader: true, showAtAll: false },
  'september-offensive': { text: '북한군 9월 공세', dx: -22, dy: -20, anchor: 'end', leader: true, showAtAll: false },
  'gasan-fighting': { text: '가산 침투전', dx: 20, dy: -18, anchor: 'start', leader: true, showAtAll: false },
  'counteroffensive': { text: '9.16 반격 전환', dx: 30, dy: -40, anchor: 'start', leader: true, showAtAll: true },
  'northward-recovery': { text: '대구 북방선 회복', dx: 20, dy: -18, anchor: 'start', leader: true, showAtAll: false },
};

export const movementLabels: Record<string, MapLabelPlacement> = {
  'nk-3div-south': { text: '제3사단 서부 압박', showAtAll: false, showPathAtAll: false, dx: -8, dy: -12, anchor: 'end' },
  'nk-13div-corridor': { text: '제13사단 주공', showAtAll: true, showPathAtAll: true, dx: -12, dy: -12, anchor: 'end' },
  'nk-15div-yuhak': { text: '제15사단 동측 공격', showAtAll: false, showPathAtAll: false, dx: 10, dy: -10, anchor: 'start' },
  'nk-armor-bowling': { text: 'T-34 돌파축', showAtAll: false, showPathAtAll: true, dx: 10, dy: 16, anchor: 'start' },
  'us-27-counterattack': { text: '미 27연대 반격', showAtAll: false, showPathAtAll: false, dx: -10, dy: -14, anchor: 'end' },
  'rok-line-recovery': { text: '국군 국지 역습', showAtAll: false, showPathAtAll: false, dx: 10, dy: -12, anchor: 'start' },
  'nk-15div-withdraw': { text: '제15사단 전환', showAtAll: false, showPathAtAll: false, dx: 8, dy: 15, anchor: 'start' },
  'nk-september-offensive': { text: '9월 공세', showAtAll: false, showPathAtAll: false, dx: -10, dy: -12, anchor: 'end' },
  'rok-breakout': { text: '9.16 북진 반격', showAtAll: false, showPathAtAll: true, dx: 10, dy: -14, anchor: 'start' },
  'nk-general-withdrawal': { text: '북한군 철수', showAtAll: false, showPathAtAll: false, dx: -10, dy: 15, anchor: 'end' },
};

export const terrainPointLabels: Record<string, MapLabelPlacement> = {
  daegu: { text: '대구', dx: 12, dy: 15, anchor: 'start', leader: true },
  waegwan: { text: '왜관', dx: -10, dy: 15, anchor: 'end' },
  dabudong: { text: '다부동', dx: -16, dy: 18, anchor: 'end', leader: true },
  gunwi: { text: '군위', dx: 10, dy: -10, anchor: 'start' },
  chilgok: { text: '칠곡', dx: 10, dy: 14, anchor: 'start', minZoom: 1.8 },
  nakjeong: { text: '낙정리', dx: -10, dy: -10, anchor: 'end', minZoom: 1.7 },
  'sangju-road': { text: '상주 방면', dx: -8, dy: -10, anchor: 'end', minZoom: 1.4 },
  yuhaksan: { text: '유학산 839', dx: -18, dy: -16, anchor: 'end', leader: true, minZoom: 1.4 },
  gasan: { text: '가산 902', dx: 6, dy: 22, anchor: 'start', leader: true, minZoom: 1.2 },
  suamsan: { text: '수암산 518', dx: 16, dy: 14, anchor: 'start', minZoom: 1.7 },
  hill328: { text: '328고지', dx: -14, dy: 14, anchor: 'end', minZoom: 1.9 },
  hill303: { text: '303고지', dx: -12, dy: 14, anchor: 'end', minZoom: 2.1 },
  hill373: { text: '373고지', dx: 12, dy: 14, anchor: 'start', minZoom: 2 },
  cheonpyeong: { text: '천평계곡·볼링장', dx: 16, dy: 18, anchor: 'start', leader: true, minZoom: 1.5 },
  'bowling-road': { text: '볼링장 도로', dx: 12, dy: 14, anchor: 'start', minZoom: 2.1 },
  'waegwan-bridge': { text: '왜관철교', dx: 14, dy: -10, anchor: 'start', minZoom: 1.6 },
  'gasan-fortress': { text: '가산산성', dx: 12, dy: 15, anchor: 'start', minZoom: 2 },
};

export const terrainContours: Record<string, TerrainContour> = {
  yuhaksan: { rxDeg: 0.075, ryDeg: 0.043, rings: 6, rotate: -18 },
  gasan: { rxDeg: 0.088, ryDeg: 0.052, rings: 6, rotate: 14 },
  suamsan: { rxDeg: 0.050, ryDeg: 0.030, rings: 4, rotate: -8 },
  hill328: { rxDeg: 0.038, ryDeg: 0.024, rings: 4, rotate: 12 },
  hill373: { rxDeg: 0.036, ryDeg: 0.023, rings: 3, rotate: -12 },
};

export const terrainLineLabels: Record<string, MapLabelPlacement> = {
  'naktong-river': { text: '낙동강', dx: -8, dy: -8, anchor: 'end' },
  'geumho-river': { text: '금호강', dx: 8, dy: -6, anchor: 'start', minZoom: 1.4 },
  'daegu-dabudong-road': { text: '상주–다부동–대구 축', dx: 10, dy: -10, anchor: 'start', minZoom: 1.3 },
  'waegwan-daegu-rail': { text: '왜관–대구 철도', dx: 8, dy: 12, anchor: 'start', minZoom: 1.8 },
};

export const emphasizedTerrainLines = new Set(['daegu-dabudong-road']);
