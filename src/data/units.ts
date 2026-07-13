import type { MilitaryUnit } from '../types';

export const units: MilitaryUnit[] = [
  // ── 국군 제6사단 ──
  {
    id: 'rok-6div', faction: 'ROK', designation: '국군 제6사단', echelon: 'division',
    commander: '대령 김종오', symbol: 'infantry',
    role: '춘천–홍천 지연전의 주역',
    strength: '3개 보병연대(7·2·19) + 제16포병대대',
    detail:
      '개전 전 경계태세를 유지한 덕에 기습의 충격을 흡수하고, 춘천·홍천 두 축에서 북한 2군단을 약 3일간 붙들었다. 요충을 옮겨가며 시간을 버는 지연전으로 부대를 온전히 보존해 7월 1일 충주에 집결했다.',
  },
  {
    id: 'rok-7reg', faction: 'ROK', designation: '제7연대', echelon: 'regiment', parent: 'rok-6div',
    commander: '중령 임부택', symbol: 'infantry',
    role: '춘천 정면 방어', equipmentIds: ['at-57'],
    detail:
      '옥산포·소양강 방어선에서 북한 2사단의 주공을 저지하고, 봉의산 피탈 뒤에도 원창고개·금병산으로 방어선을 옮겨가며 지연전을 이어갔다.',
  },
  {
    id: 'rok-2reg', faction: 'ROK', designation: '제2연대', echelon: 'regiment', parent: 'rok-6div',
    commander: '대령 함병선', symbol: 'infantry',
    role: '인제–홍천 축 방어',
    detail:
      '옹진에서 갓 이동해 지형도 익히지 못한 열세 속에서 558·402고지에 방어선을 치고 자은리에 지휘소를 세워 북한 12사단의 남하를 지연시켰다.',
  },
  {
    id: 'rok-19reg', faction: 'ROK', designation: '제19연대', echelon: 'regiment', parent: 'rok-6div',
    commander: '중령 민병권', symbol: 'infantry',
    role: '예비 → 춘천·홍천 증원', equipmentIds: ['m1-81mortar', 'at-57'],
    detail:
      '원주에서 열차로 춘천에 증원돼 옥산포 역습의 측방을 엄호했고, 이후 홍천 말고개로 기동해 육탄 11용사의 매복 저지를 이끌었다.',
  },
  {
    id: 'rok-16art', faction: 'ROK', designation: '제16포병대대', echelon: 'battalion', parent: 'rok-6div',
    commander: '소령 김성', symbol: 'artillery',
    role: '사단 화력 지원',
    equipment: 'M3 105mm 경곡사포 13문', equipmentIds: ['m3-105'],
    detail:
      '가래목에 몰린 북한군 도하 대열에 3개 포대의 집중포격을 퍼부어 2사단 전투력의 약 40%를 앗았고("대포격전"), 말고개에서도 12사단의 추격을 저지했다.',
  },

  // ── 북한 제2군단 ──
  {
    id: 'nk-2corps', faction: 'NK', designation: '북한 제2군단', echelon: 'corps',
    commander: '중장 김광협', symbol: 'infantry',
    role: '춘천·인제 축 총괄',
    strength: '제2·12·15사단, 제603모터찌클연대', equipmentIds: ['su-76', 't-34', 'ba-64'],
    detail:
      '춘천·홍천을 당일 돌파해 수원으로 우회, 국군 주력의 퇴로를 끊는 포위섬멸을 노렸으나 6사단의 지연전에 계획이 무산됐다. 패전 책임으로 군단장이 해임됐다.',
  },
  {
    id: 'nk-2div', faction: 'NK', designation: '제2사단', echelon: 'division', parent: 'nk-2corps',
    commander: '소장 리청송', symbol: 'armor',
    role: '화천–춘천 축 주공',
    equipment: 'SU-76 자주포 등', equipmentIds: ['su-76', 't-34', 'ba-64'],
    detail:
      '자주포를 앞세워 옥산포로 밀고 들었으나 대전차전과 역습에 저지됐고, 가래목 대포격전으로 전투력의 약 40%를 잃어 사실상 궤멸됐다.',
  },
  {
    id: 'nk-12div', faction: 'NK', designation: '제12사단', echelon: 'division', parent: 'nk-2corps',
    commander: '소장 전우', symbol: 'armor',
    role: '인제–홍천 축',
    equipment: '자주포·전차', equipmentIds: ['t-34', 'su-76'],
    detail:
      '인제에서 홍천으로 남하했으나 말고개·큰말고개에서 2·19연대의 지연·육탄전에 발이 묶였고, 2군단장의 "춘천 우선" 지시로 춘천으로 전환됐다.',
  },
  {
    id: 'nk-15div', faction: 'NK', designation: '제15사단', echelon: 'division', parent: 'nk-2corps',
    commander: '소장 박성철', symbol: 'infantry',
    role: '조공(助攻)',
    detail: '2군단의 조공을 맡아 측방에서 압박했다.',
  },
  {
    id: 'nk-603mot', faction: 'NK', designation: '제603 모터찌클연대', echelon: 'regiment', parent: 'nk-2corps',
    symbol: 'motorized',
    role: '차량화 돌파',
    detail:
      '홍천 돌파 뒤 12사단을 초월해 수원을 조기 점령하는 것이 임무였으나, 지연전으로 초월 기동의 발판 자체가 마련되지 못했다.',
  },
];

export const unitById = new Map(units.map((u) => [u.id, u]));
