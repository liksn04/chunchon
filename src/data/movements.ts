import type { MovementArrow } from '../types';

export const movements: MovementArrow[] = [
  {
    id: 'nk-2div-adv',
    faction: 'NK',
    label: '북한 2사단 → 춘천',
    activeFrom: '1950-06-25',
    style: 'attack',
    path: [
      [127.710, 38.000], // 38선
      [127.700, 37.985], // 사북 인람리 ⚠
      [127.742, 37.930], // 옥산포 ⚠
      [127.734, 37.885], // 춘천
    ],
  },
  {
    id: 'nk-12div-adv',
    faction: 'NK',
    label: '북한 12사단 → 인제·홍천',
    activeFrom: '1950-06-25',
    style: 'attack',
    path: [
      [128.100, 38.150],
      [128.170, 38.067], // 인제
      [128.050, 37.950], // 말고개 ⚠
      [128.020, 37.920], // 큰말고개 ⚠
      [127.950, 37.820],
      [127.900, 37.760], // 홍천 북방 ⚠
    ],
  },
  {
    id: 'nk-12div-divert',
    faction: 'NK',
    label: '12사단 주력 → 춘천 전환',
    activeFrom: '1950-06-28',
    style: 'advance',
    path: [
      [128.020, 37.920], // 큰말고개 ⚠
      [127.950, 37.900],
      [127.850, 37.890],
      [127.750, 37.885],
      [127.734, 37.885], // 춘천
    ],
  },
  {
    id: 'rok-withdraw',
    faction: 'ROK',
    label: '국군 6사단 철수 (→충주)',
    activeFrom: '1950-06-29',
    style: 'withdraw',
    path: [
      [127.790, 37.830], // 춘천 남 ⚠
      [127.889, 37.697], // 홍천
      [127.985, 37.492], // 횡성
      [127.920, 37.342], // 원주
      [128.191, 37.132], // 제천
      [127.926, 36.991], // 충주
    ],
  },
];

export const movementById = new Map(movements.map((m) => [m.id, m]));
