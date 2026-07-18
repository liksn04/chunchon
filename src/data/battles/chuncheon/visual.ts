import type { MapLabelPlacement } from '../../../types';

/**
 * 춘천 전용 지도 편집값 (지도 스타일 표준 §전체 보기).
 * 전체 보기에는 전투 서사의 골격이 되는 5개 사건만 남긴다:
 * 옥산포 격퇴 → 봉의산 피탈 → 가래목 대포격전 → 큰말고개 육탄 → 철수 완수.
 * key 사건(garaemok·keunmalgogae)은 스키마 없이도 표시되지만 명시해 둔다.
 */
export const eventLabels: Record<string, MapLabelPlacement> = {
  // 춘천 시가 부근 3개 사건이 근접해 있어 좌우로 분산 배치한다
  oksanpo: { showAtAll: true, dx: -18, dy: -8, anchor: 'end', leader: true },
  'bongui-fall': { showAtAll: true, dx: 18, dy: -6, anchor: 'start', leader: true },
  garaemok: { showAtAll: true },
  keunmalgogae: { showAtAll: true },
  withdrawal: { showAtAll: true },
};
