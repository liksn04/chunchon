export type CoordConfidence = 'confirmed' | 'offset' | 'estimated';

export interface CoordNote {
  confidence: CoordConfidence;
  basis: string;
}

/** 사건 좌표의 신뢰도와 표시 근거. */
export const eventCoordNotes: Record<string, CoordNote> = {
  'nakjeong-delay': {
    confidence: 'estimated',
    basis: '낙동리 일대 도하·지연전 서술을 지도 가독성에 맞춰 낙동강 동안의 대표 지점으로 근사했다.',
  },
  'waegwan-bridge-demolition': {
    confidence: 'confirmed',
    basis: '현존 왜관철교(호국의 다리) 위치에 정박했다. 교량 구조는 전쟁 뒤 복구·변경됐으나 도하점 자체는 확인 가능하다.',
  },
  'line-contraction': {
    confidence: 'confirmed',
    basis: '방어선 명칭의 중심인 다부동 마을과 현 다부동전적기념관 일대에 정박했다.',
  },
  'hill328-opening': {
    confidence: 'estimated',
    basis: '전사에 등장하는 왜관 북방 328고지를 유학산 서측 능선의 표고·전투축과 대조한 근사 위치다.',
  },
  'yuhaksan-839': {
    confidence: 'confirmed',
    basis: '현 유학산 정상 839고지에 정박했다. 사건은 정상부와 동서 능선 전체의 반복 공방을 대표한다.',
  },
  'tabudong-breach': {
    confidence: 'estimated',
    basis: '유학산–다부동 사이에서 제13사단이 파고든 돌파구를 도로 북방의 대표 지점으로 표시했다. 정확한 접촉선은 시간대별로 달랐다.',
  },
  'daegu-shelling': {
    confidence: 'confirmed',
    basis: '박격포탄 낙하가 기록된 대구역 일대에 정박했다. 사격 진지는 가산 일대였으나 사건 마커는 피탄 지점을 나타낸다.',
  },
  'bowling-alley-opening': {
    confidence: 'offset',
    basis: '천평계곡의 다부동 도로축에 정박하되 야간전 사건 마커와 겹치지 않도록 남쪽으로 미세 이동했다.',
  },
  'bowling-alley-night-battles': {
    confidence: 'estimated',
    basis: 'Bowling Alley는 단일 점이 아니라 다부동 북방 천평계곡의 직선 도로 구간을 가리킨다. 마커는 구간 중심의 대표 좌표다.',
  },
  'paik-frontline': {
    confidence: 'estimated',
    basis: '백선엽 사단장의 전방 독려 일화가 전하는 다부동 남북 도로와 국군 진지 사이의 대표 지점이다. 정확한 출발·발언 위치는 회고마다 특정되지 않는다.',
  },
  'august-offensive-contained': {
    confidence: 'offset',
    basis: '유학산–다부동–가산 방어선 전체의 안정화를 대표하므로 중앙 지점에 두고 인접 사건과의 겹침을 피했다.',
  },
  'september-offensive': {
    confidence: 'offset',
    basis: '9월 공세는 전면 사건이다. 유학산과 다부동 사이 주공 축에 대표 마커를 두되 839고지 라벨과 겹치지 않게 이동했다.',
  },
  'gasan-fighting': {
    confidence: 'confirmed',
    basis: '현 가산산성·가산 정상부에 정박했다. 사건은 산성 주변 능선과 골짜기의 침투전을 함께 대표한다.',
  },
  'counteroffensive': {
    confidence: 'estimated',
    basis: '9월 16일 반격의 주축인 다부동 북방 도로와 천평계곡 사이를 대표하는 지점이다. 반격은 넓은 전선에서 동시에 진행됐다.',
  },
  'northward-recovery': {
    confidence: 'estimated',
    basis: '다부동 북방에서 상주 방향으로 이어지는 추격 축선의 대표 지점이다. 전투 종료를 단일 고지 점령으로 특정하지 않는다.',
  },
};

export const approxCoordIds = new Set(
  Object.entries(eventCoordNotes)
    .filter(([, n]) => n.confidence !== 'confirmed')
    .map(([id]) => id),
);
