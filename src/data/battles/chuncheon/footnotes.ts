/**
 * 주장별 각주 — 사건 서술 안의 특정 수치·논쟁을 개별 출처와 고증 노트로 뒷받침한다.
 * (사건 단위 '출처' 목록과 별개로, 무엇이 확정이고 무엇이 이견인지 분리해 밝힘)
 */
export interface Footnote {
  eventId: string;
  /** 각주 대상 주장(짧게) */
  claim: string;
  /** 고증 노트 — 근거·사료 간 편차·유의점 */
  note: string;
  /** sources.ts의 Source id */
  sourceIds: string[];
}

export const footnotes: Footnote[] = [
  {
    eventId: 'mojin-mine',
    claim: '지뢰 매설을 알고도 노인을 통과시켰다',
    note: '개전 전조를 상징하는 일화로 여러 대중 사료에 실렸으나, 일차 사료가 아닌 회고·언론 서술에 근거한다. 세부(노인의 신원·정확 일자)는 확인되지 않는다.',
    sourceIds: ['namu', 'kwnews'],
  },
  {
    eventId: 'oksanpo',
    claim: '심일 소위의 자주포 격파 전공',
    note: '격파 대수와 육탄공격 여부는 오랜 논쟁 대상이다. 1981년 육군 조사에서 공적서에 의문이 제기됐고, 2016년 이대용 장군이 “신화”라 비판했다. 2017년 국방부 공적확인위원회는 심일 소대의 자주포 3대 격파 전공을 사실로 재확인했으나, 육군군사연구소 등은 문헌 고증 문제로 여전히 이견을 보인다.',
    sourceIds: ['wiki-simil', 'joongang', 'imhc'],
  },
  {
    eventId: 'oksanpo',
    claim: '7연대 9중대 “100여 명” 사상·실종',
    note: '개전 새벽 모진교 남단 피해 규모다. 사료에 따라 사상·실종 합계가 달리 전해지며, 여기서는 다수 서술의 개략치를 따랐다.',
    sourceIds: ['encykorea', 'namu'],
  },
  {
    eventId: 'garaemok',
    claim: '“북한 2사단 전투력 약 40% 궤멸”',
    note: '“16포병대대 대포격전”의 성과를 나타내는 수치로 군사편찬연구소 계열 서술에서 인용된다. 40%는 개략 평가치이며, 동원 화력은 105 mm 경곡사포 13문(3개 포대)으로 전한다.',
    sourceIds: ['imhc', 'kwnews', 'mpva'],
  },
  {
    eventId: 'keunmalgogae',
    claim: '격파·노획 기갑 대수',
    note: '사료마다 편차가 크다 — 4대 완파·6대 노획, 혹은 “십수 대”로도 전한다. 아군 피해가 부상 1명에 그쳤다는 점은 대체로 일치한다.',
    sourceIds: ['nculture-malgogae', 'namu'],
  },
  {
    eventId: 'keunmalgogae',
    claim: '상대 부대는 12사단',
    note: '당시 국군은 상대를 7사단으로 오인 보고했으나, 이 축선의 진공 주체는 북한 12사단으로 정리된다.',
    sourceIds: ['nculture-malgogae', 'imhc'],
  },
  {
    eventId: 'withdrawal',
    claim: '북한군 손실 “약 2,000~6,900명”',
    note: '집계 편차 구간이다. 하한(약 2,000)은 귀순자 증언 계열, 상한(6,900여)은 6사단 집계에 가깝다. 국군 6사단 자체 손실은 407명으로 전한다.',
    sourceIds: ['encykorea', 'namu', 'imhc'],
  },
  {
    eventId: 'withdrawal',
    claim: '거시 연표(양평 도하 7/1, 수원 도달 7/5)',
    note: '춘천–홍천의 약 3일 지연이 북한 2군단의 서울 우회 포위를 늦춘 결과다. 날짜는 전사(戰史) 계열 서술의 개략 연표를 따랐다.',
    sourceIds: ['imhc', 'encykorea'],
  },
];

export const footnotesByEvent: Record<string, Footnote[]> = footnotes.reduce(
  (acc, f) => {
    (acc[f.eventId] ??= []).push(f);
    return acc;
  },
  {} as Record<string, Footnote[]>,
);
