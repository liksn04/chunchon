/**
 * 좌표 신뢰도 모델 — 단일 ⚠ 대신 3단계로 나눠 학술적 투명성을 높인다.
 *
 *  - confirmed : 현존 지형지물(고개·산정·시가지)에 정박한 확정 위치.
 *  - offset    : 실제 위치는 알려졌으나, 마커·라벨 겹침 방지를 위해 표시상 미세 이동.
 *  - estimated : 수몰·이설·사료 이견으로 정확 지점 불명 — 최선의 근사 추정.
 *
 * basis는 "이 좌표를 무엇에 정박했는가"를 밝힌 근거 문장이다.
 */
export type CoordConfidence = 'confirmed' | 'offset' | 'estimated';

export interface CoordNote {
  confidence: CoordConfidence;
  basis: string;
}

export const eventCoordNotes: Record<string, CoordNote> = {
  'mojin-mine': {
    confidence: 'estimated',
    basis:
      '옛 모진교(모진강 도하점, 신북읍 오탄리·38선 이남 약 300m)는 1965년 준공된 춘천댐에 수몰됐다. 좌표는 현 춘천댐 담수구역 기준의 추정.',
  },
  oksanpo: {
    confidence: 'estimated',
    basis:
      '옥산포는 신북읍·사농동 북한강 동안의 옛 나루 지명이다. 역습·도하 개활지 일대를 대표하는 지점으로, 정확한 나루 위치는 사료마다 조금씩 다르다.',
  },
  'hongcheon-breakthrough': {
    confidence: 'estimated',
    basis:
      '홍천 북방 2연대 방어선(558·402고지) 일대. 고지 표고를 기준으로 한 도식 위치이며 정상 좌표는 근사값이다.',
  },
  'soyang-defense': {
    confidence: 'offset',
    basis:
      '소양강 도섭 방어 구간(소양1교 동편)을 대표하는 지점. 봉의산·가래목 마커와의 겹침을 피해 표시상 오프셋했다.',
  },
  'bongui-fall': {
    confidence: 'offset',
    basis:
      '봉의산(해발 301.5 m) 정상부가 실제 피탈 지점. 지형 라벨과의 겹침을 피해 마커를 북서로 오프셋했다.',
  },
  garaemok: {
    confidence: 'estimated',
    basis:
      '소양1교 동편, 강폭이 좁아지는 “가래목” 여울의 도하 병목. 옛 여울 지형 기준의 근사이며 봉의산 마커와 분리해 표시했다.',
  },
  malgogae: {
    confidence: 'estimated',
    basis:
      '홍천 두촌면 자은리~철정 사이 옛 44번 국도 말고개(육탄 11용사 전적 구간). 1950년 도로 선형은 현재와 다르며 좌표는 전적지 인근 추정.',
  },
  'wonchang-geumbyeong': {
    confidence: 'confirmed',
    basis:
      '춘천 동산면 원창고개(옛 5번 국도 춘천–홍천 분수령). 현존 고개에 정박했으며, 병행한 금병산(652 m) 전투와 묶어 표시한다.',
  },
  keunmalgogae: {
    confidence: 'estimated',
    basis:
      '말고개 전적 구간 내 S자 만곡부(자은리 남서). 매복 지점의 정확 좌표는 불명이며, 말고개 마커와 분리하기 위해 근접 오프셋했다.',
  },
  withdrawal: {
    confidence: 'confirmed',
    basis: '6사단이 지휘 계통을 유지한 채 전 부대가 집결한 최종 지점 — 충주 시가(1950년 7월 1일).',
  },
};

/** confidence !== 'confirmed' 인 사건 = 지도상 ≈ 표시 대상 */
export const approxCoordIds = new Set(
  Object.entries(eventCoordNotes)
    .filter(([, n]) => n.confidence !== 'confirmed')
    .map(([id]) => id),
);
