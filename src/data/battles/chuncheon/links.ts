/**
 * 춘천–홍천 전투 조인 테이블 — 사건을 공용 카탈로그(people/sources) id에 잇는다.
 * 카탈로그 자체는 전쟁 공통이라 shared/에 두고, 사건별 매핑만 전투별로 둔다.
 */

/** 사건별 관련 인물 (shared/people 카탈로그 id 참조) */
export const eventPeople: Record<string, string[]> = {
  oksanpo: ['sim-il', 'im-butaek', 'kim-yongbae'],
  'hongcheon-breakthrough': ['ham-byeongseon'],
  'soyang-defense': ['im-butaek', 'kim-yongbae'],
  'bongui-fall': ['im-butaek', 'kim-jongo'],
  garaemok: ['jeong-ogyeong'],
  keunmalgogae: ['jo-daljin', 'min-byeonggwon'],
  withdrawal: ['kim-jongo'],
};

/** 사건별 참고 출처 (shared/sources 카탈로그 id 참조) */
export const eventSources: Record<string, string[]> = {
  'mojin-mine': ['namu', 'encykorea', 'kwnews'],
  oksanpo: ['encykorea', 'wiki-chuncheon', 'mpva', 'joongang', 'wiki-simil'],
  'hongcheon-breakthrough': ['namu', 'encykorea'],
  'soyang-defense': ['namu', 'encykorea', 'joongang'],
  'bongui-fall': ['namu', 'wiki-chuncheon'],
  garaemok: ['namu', 'mpva', 'imhc', 'kwnews'],
  malgogae: ['nculture-malgogae', 'namu'],
  'wonchang-geumbyeong': ['namu', 'imhc'],
  keunmalgogae: ['nculture-malgogae', 'namu', 'mpva', 'wiki-jodaljin'],
  withdrawal: ['encykorea', 'namu', 'imhc', 'wiki-kimjongo'],
};
