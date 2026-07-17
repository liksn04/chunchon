import type { MovementArrow } from '../../../types';

export const movements: MovementArrow[] = [
  {
    id: 'nk-3div-south', faction: 'NK', label: '북한 제3사단 → 왜관·유학산',
    activeFrom: '1950-08-03', style: 'advance',
    path: [[128.28,36.28],[128.31,36.20],[128.34,36.12],[128.37,36.06],[128.39,36.075]],
  },
  {
    id: 'nk-13div-corridor', faction: 'NK', label: '북한 제13사단 → 다부동 도로축',
    activeFrom: '1950-08-03', style: 'attack',
    path: [[128.42,36.28],[128.44,36.22],[128.46,36.16],[128.455,36.119],[128.436,36.052]],
  },
  {
    id: 'nk-15div-yuhak', faction: 'NK', label: '북한 제15사단 → 유학산 동측',
    activeFrom: '1950-08-10', style: 'attack',
    path: [[128.55,36.25],[128.52,36.19],[128.48,36.13],[128.42,36.09],[128.391,36.075]],
  },
  {
    id: 'nk-armor-bowling', faction: 'NK', label: 'T-34 야간 돌파 → 천평계곡',
    activeFrom: '1950-08-18', style: 'attack',
    path: [[128.47,36.18],[128.462,36.145],[128.455,36.119],[128.449,36.102],[128.442,36.075]],
  },
  {
    id: 'us-27-counterattack', faction: 'ROK', label: '미 제27연대 반격 → 다부동 북방',
    activeFrom: '1950-08-18', style: 'attack',
    path: [[128.51,35.96],[128.48,36.01],[128.45,36.06],[128.449,36.102],[128.455,36.13]],
  },
  {
    id: 'rok-line-recovery', faction: 'ROK', label: '국군 제1사단 국지 역습',
    activeFrom: '1950-08-21', style: 'attack',
    path: [[128.43,36.04],[128.43,36.07],[128.42,36.09],[128.40,36.11]],
  },
  {
    id: 'nk-15div-withdraw', faction: 'NK', label: '북한 제15사단 → 영천 방면 전환',
    activeFrom: '1950-08-20', style: 'withdraw',
    path: [[128.47,36.12],[128.55,36.08],[128.65,36.02],[128.72,35.98]],
  },
  {
    id: 'nk-september-offensive', faction: 'NK', label: '북한군 9월 공세',
    activeFrom: '1950-09-02', style: 'attack',
    path: [[128.36,36.18],[128.39,36.12],[128.41,36.075],[128.44,36.05]],
  },
  {
    id: 'rok-breakout', faction: 'ROK', label: '국군·유엔군 북진 반격',
    activeFrom: '1950-09-16', style: 'advance',
    path: [[128.43,36.04],[128.44,36.09],[128.45,36.15],[128.46,36.22],[128.44,36.29]],
  },
  {
    id: 'nk-general-withdrawal', faction: 'NK', label: '북한군 북방 철수',
    activeFrom: '1950-09-16', style: 'withdraw',
    path: [[128.42,36.08],[128.41,36.15],[128.40,36.22],[128.38,36.30]],
  },
];

export const movementById = new Map(movements.map((m) => [m.id, m]));
