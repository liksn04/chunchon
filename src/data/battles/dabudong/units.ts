import type { MilitaryUnit } from '../../../types';

export const units: MilitaryUnit[] = [
  {
    id: 'rok-1div', faction: 'ROK', designation: '국군 제1사단', echelon: 'division',
    commander: '준장 백선엽', symbol: 'infantry',
    role: '다부동 정면 주방어',
    strength: '제11·12·15연대와 사단 포병',
    detail:
      '낙동강선으로 철수한 뒤 왜관 북방에서 군위에 이르는 대구 북방 방어를 맡았다. 전선을 압축하면서 유학산–다부동–가산선에 주저항선을 형성하고, 미군 예비대와 연계해 8월·9월 공세를 견딘 뒤 반격으로 전환했다.',
  },
  {
    id: 'rok-11reg', faction: 'ROK', designation: '국군 제11연대', echelon: 'regiment',
    parent: 'rok-1div', commander: '대령 최경록', symbol: 'infantry',
    role: '다부동 중앙·서부 연결 방어',
    equipmentIds: ['m1-81mortar', 'at-57'],
    detail:
      '다부동 중앙과 인접 고지의 방어를 맡아 북한군 주공이 도로축으로 내려오는 것을 저지했다. 전선이 흔들릴 때 예비대를 내어 인접 연대의 진지를 연결했다.',
  },
  {
    id: 'rok-12reg', faction: 'ROK', designation: '국군 제12연대', echelon: 'regiment',
    parent: 'rok-1div', commander: '중령 김점곤', symbol: 'infantry',
    role: '유학산 839고지·다부동 정면 방어',
    equipmentIds: ['m1-81mortar', 'at-57'],
    detail:
      '유학산 839고지와 다부동 북방의 주공 축선을 담당했다. 급경사 능선에서 공격과 역습을 반복하며 북한군 제13사단의 남하를 지연시켰다.',
  },
  {
    id: 'rok-15reg', faction: 'ROK', designation: '국군 제15연대', echelon: 'regiment',
    parent: 'rok-1div', symbol: 'infantry',
    role: '왜관 북방·328고지 방어',
    equipmentIds: ['m1-81mortar'],
    detail:
      '왜관 북방의 303·328고지와 낙동강 동안 연결부를 담당했다. 북한군 제3사단과 반복 공방을 벌이며 유학산으로 이어지는 서부 방어선을 유지했다.',
  },
  {
    id: 'rok-1div-art', faction: 'ROK', designation: '국군 제1사단 포병', echelon: 'battalion',
    parent: 'rok-1div', symbol: 'artillery',
    role: '사단 직접 화력지원',
    equipment: '105mm 곡사포·박격포',
    equipmentIds: ['m3-105'],
    detail:
      '고지 공방과 다부동 도로축 방어에 집중화력을 제공했다. 미군 포병·전차와 연계하면서 야간 침투와 기갑 접근을 차단했다.',
  },
  {
    id: 'rok-10reg', faction: 'ROK', designation: '국군 제10연대(제8사단)', echelon: 'regiment',
    symbol: 'infantry',
    role: '위기 국면 증원',
    detail:
      '다부동 정면이 흔들릴 때 예비대로 투입돼 방어선의 틈을 메웠다. 전투 기간 전체가 아니라 위기 국면에 한정해 운용된 증원부대로 표시한다.',
  },
  {
    id: 'us-27reg', faction: 'ROK', designation: '미 제27보병연대', echelon: 'regiment',
    commander: '대령 존 H. 마이켈리스', symbol: 'motorized',
    role: '다부동 도로축 기동예비·반격',
    equipmentIds: ['m26-pershing', 'bazooka-35'],
    detail:
      '8월 17일 대구 북방으로 긴급 이동해 다부동 남쪽 도로를 막고 이튿날 반격에 나섰다. 전차·대전차화기·포병을 결합해 천평계곡의 야간 기갑전을 수행했다.',
  },
  {
    id: 'us-23reg', faction: 'ROK', designation: '미 제23보병연대', echelon: 'regiment',
    symbol: 'motorized',
    role: '9월 공세 대응 증원',
    equipmentIds: ['m26-pershing', 'bazooka-35'],
    detail:
      '9월 공세 국면에 대구 북방 방어를 보강하고 국군 제1사단과 연계했다. 미 제27연대와 함께 유엔군 예비대가 다부동 축선에 제공한 종심을 상징한다.',
  },
  {
    id: 'us-1cav', faction: 'ROK', designation: '미 제1기병사단', echelon: 'division',
    symbol: 'motorized',
    role: '왜관·낙동강 서부 인접 방어',
    equipmentIds: ['m26-pershing'],
    detail:
      '왜관 일대 낙동강 방어와 교량 차단을 맡아 국군 제1사단의 서측과 연결됐다. 다부동 주전장 밖의 인접 전선을 이해하기 위한 맥락 부대다.',
  },

  {
    id: 'nk-2corps', faction: 'NK', designation: '북한 제2군단', echelon: 'corps',
    symbol: 'infantry',
    role: '대구 북방 공세 총괄',
    strength: '제3·13·15사단과 기갑 지원',
    detail:
      '대구 북방의 여러 축선에 사단들을 집중해 국군 방어선을 분리·돌파하려 했다. 8월 공세가 멈춘 뒤에도 전력을 재편해 9월 초 다시 대규모 공격을 감행했다.',
  },
  {
    id: 'nk-3div', faction: 'NK', designation: '북한 제3사단', echelon: 'division',
    parent: 'nk-2corps', symbol: 'infantry',
    role: '왜관–유학산 서부 축 공격',
    equipmentIds: ['t-34', 'su-76'],
    detail:
      '왜관 북방과 유학산 서측에서 국군 제15연대와 미 제1기병사단 사이를 압박했다. 낙동강 도하 손실 뒤에도 고지군을 따라 남하를 시도했다.',
  },
  {
    id: 'nk-13div', faction: 'NK', designation: '북한 제13사단', echelon: 'division',
    parent: 'nk-2corps', symbol: 'infantry',
    role: '다부동 도로축 주공',
    equipmentIds: ['t-34', 'su-76'],
    detail:
      '유학산과 다부동 북방에서 국군 제12연대를 밀어붙이며 상주–대구 도로축 돌파를 노렸다. 8월 17일 전선 틈을 파고들어 다부동 위기를 만들었으나 미 제27연대의 반격과 화력에 저지됐다.',
  },
  {
    id: 'nk-15div', faction: 'NK', designation: '북한 제15사단', echelon: 'division',
    parent: 'nk-2corps', symbol: 'infantry',
    role: '유학산·동부 축 보조공격',
    equipmentIds: ['t-34'],
    detail:
      '유학산과 다부동 동측에서 압박을 가했으나 8월 20일 무렵 영천 방면으로 전환됐다. 그 이동은 8월 다부동 위기가 완화되는 전환점이 됐다.',
  },
  {
    id: 'nk-105arm', faction: 'NK', designation: '북한 제105전차사단 일부', echelon: 'battalion',
    parent: 'nk-2corps', symbol: 'armor',
    role: 'T-34 기갑 지원',
    equipmentIds: ['t-34'],
    detail:
      '보충된 T-34 전차를 다부동 도로축과 천평계곡에 투입해 야간 돌파를 시도했다. 좁고 곧은 도로에서 전차 대열이 관측·포격·대전차화기에 노출되며 진격이 멈췄다.',
  },
];

export const unitById = new Map(units.map((u) => [u.id, u]));
