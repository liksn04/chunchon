import type { DayPhase } from '../../../types';

export const days: DayPhase[] = [
  {
    date: '1950-06-25',
    label: '6.25',
    headline: '새벽 기습 남침 — 옥산포 방어, 홍천 정면 돌파',
    activeEventIds: ['oksanpo', 'hongcheon-breakthrough'],
    activeArrowIds: ['nk-2div-adv', 'nk-12div-adv'],
    frontLineDate: '1950-06-25',
  },
  {
    date: '1950-06-26',
    label: '6.26',
    headline: '옥산포 기습 전과, 소양강 공방',
    activeEventIds: ['soyang-defense'],
    activeArrowIds: ['nk-2div-adv', 'nk-12div-adv'],
    frontLineDate: '1950-06-26',
  },
  {
    date: '1950-06-27',
    label: '6.27',
    headline: '봉의산 피탈·춘천 함락, 그러나 가래목 대포격전',
    activeEventIds: ['bongui-fall', 'garaemok', 'malgogae'],
    activeArrowIds: ['nk-2div-adv', 'nk-12div-adv'],
    frontLineDate: '1950-06-27',
  },
  {
    date: '1950-06-28',
    label: '6.28',
    headline: '포위 시도 — 원창·금병 방어, 큰말고개 육탄전',
    activeEventIds: ['wonchang-geumbyeong', 'keunmalgogae'],
    activeArrowIds: ['nk-2div-adv', 'nk-12div-adv', 'nk-12div-divert'],
    frontLineDate: '1950-06-28',
  },
  {
    date: '1950-06-29',
    label: '6.29',
    headline: '포위 회피 — 철수 개시',
    activeEventIds: ['withdrawal'],
    activeArrowIds: ['nk-12div-divert', 'rok-withdraw'],
    frontLineDate: '1950-06-29',
  },
  {
    date: '1950-06-30',
    label: '6.30',
    headline: '전투 종료 — 지연전 완수',
    activeEventIds: [],
    activeArrowIds: ['rok-withdraw'],
    frontLineDate: '1950-06-30',
  },
  {
    date: '1950-07-01',
    label: '7.1',
    headline: '충주로 후퇴 완료',
    activeEventIds: ['withdrawal'],
    activeArrowIds: ['rok-withdraw'],
    frontLineDate: '1950-07-01',
  },
];

export const dayByDate = new Map(days.map((d) => [d.date, d]));
