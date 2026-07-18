import type { MovementArrow } from '../../../types';

export const movements: MovementArrow[] = [
  {
    id: 'nk-2div-adv',
    faction: 'NK',
    label: '북한 2사단 → 춘천',
    activeFrom: '1950-06-25',
    style: 'attack',
    path: [
      [127.672, 38.020], // 38선 이북 접근로
      [127.678, 38.000], // 사북 인람리 ⚠
      [127.700, 37.955],
      [127.715, 37.912], // 옥산포(사농동) ⚠
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
      [128.150, 38.150],
      [128.170, 38.067], // 인제
      [128.060, 37.945], // 신남 부근
      [128.020, 37.895], // 어론리 부근
      [127.982, 37.836], // 큰말고개 ⚠
      [127.965, 37.820], // 말고개 ⚠
      [127.920, 37.755], // 홍천 북방 ⚠
    ],
  },
  {
    id: 'nk-12div-divert',
    faction: 'NK',
    label: '12사단 주력 → 춘천 전환',
    activeFrom: '1950-06-28',
    style: 'advance',
    path: [
      [127.995, 37.848], // 자은리 ⚠
      [127.960, 37.880],
      [127.880, 37.895],
      [127.790, 37.892],
      [127.740, 37.887], // 춘천
    ],
  },
  {
    id: 'rok-withdraw',
    faction: 'ROK',
    label: '국군 6사단 철수 (→충주)',
    activeFrom: '1950-06-29',
    style: 'withdraw',
    path: [
      [127.780, 37.815], // 원창고개 남 ⚠
      [127.889, 37.697], // 홍천
      [127.985, 37.492], // 횡성
      [127.920, 37.342], // 원주
      [128.191, 37.132], // 제천
      [127.926, 36.991], // 충주
    ],
  },
];

export const movementById = new Map(movements.map((m) => [m.id, m]));
