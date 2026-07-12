import type { Faction } from '../types';

/**
 * 전투 관련 인물. 약력은 사료를 바탕으로 자기 문장으로 재서술한 사실 기록이다.
 * (허구 인물·창작 기록 없음)
 */
export interface Person {
  id: string;
  name: string;
  rankRole: string;   // "소위 · 7연대 대전차포중대"
  faction: Faction;
  bio: string;
}

export const people: Person[] = [
  {
    id: 'sim-il',
    name: '심일',
    rankRole: '소위 · 제7연대 대전차포중대',
    faction: 'ROK',
    bio: '옥산포로 밀고 든 북한 2사단의 자주포 대열을 향해 대전차포와 육박공격을 병행해 여러 대를 격파, 춘천 방면의 기선을 제압했다. 이 공로로 태극무공훈장을 받았으며, 6.25 전쟁 초기 국군의 대표적 대전차전 영웅으로 꼽힌다. 이듬해 1951년 전사했다.',
  },
  {
    id: 'kim-jongo',
    name: '김종오',
    rankRole: '대령 · 제6사단장',
    faction: 'ROK',
    bio: '개전 초 전 전선이 무너지는 가운데 춘천–홍천에서 지연전을 지휘해 북한 2군단을 3일간 붙들었다. 무리한 방어 대신 요충을 옮겨가며 시간을 버는 판단으로 6사단을 온전히 후퇴시켰다. 훗날 백마고지 전투(9사단장)를 승리로 이끌고 육군참모총장에 올랐다.',
  },
  {
    id: 'im-butaek',
    name: '임부택',
    rankRole: '중령 · 제7연대장',
    faction: 'ROK',
    bio: '춘천 정면을 맡아 옥산포·소양강 방어선에서 북한 2사단의 주공을 저지했다. 봉의산이 피탈되자 시내로 물러선 뒤에도 원창고개·금병산으로 방어선을 옮겨가며 지연전을 이어갔다.',
  },
  {
    id: 'jeong-ogyeong',
    name: '정오경',
    rankRole: '대위 · 제16포병대대 3포대장',
    faction: 'ROK',
    bio: '봉의산 관측소에서 가래목에 몰린 북한군 도하 대열을 포착하고 좌표를 지정, 병목이 절정에 이른 순간 일제 포격 신호를 내렸다. 이 집중포격으로 북한 2사단은 전투력의 약 40%를 잃었다("16포병대대의 대포격전").',
  },
  {
    id: 'ham-byeongseon',
    name: '함병선',
    rankRole: '대령 · 제2연대장',
    faction: 'ROK',
    bio: '인제–홍천 축을 맡았다. 옹진에서 갓 이동해 지형도 익히지 못한 열세 속에서 558·402고지에 방어선을 치고 자은리에 지휘소를 세워 12사단의 남하를 지연시켰다.',
  },
  {
    id: 'min-byeonggwon',
    name: '민병권',
    rankRole: '중령 · 제19연대장',
    faction: 'ROK',
    bio: '큰말고개에서 접근하는 북한 전차를 상대로 시체로 위장해 매복하라는 지침을 내렸다. 이 매복으로 육탄 11용사가 선두 전차를 기동 불능으로 만들고 후속 전차들을 고립·격파했다.',
  },
  {
    id: 'jo-daljin',
    name: '조달진',
    rankRole: '일병 · 육탄 11용사',
    faction: 'ROK',
    bio: '큰말고개 매복에서 선두 전차의 해치를 열고 81mm 박격포탄과 수류탄을 까넣어 기동 불능으로 만들었다. 뒤따르던 전차들이 앞뒤로 갇히면서 육탄 11용사가 자주포·전차 10대를 격파·노획했고, 조달진은 2계급 특진했다.',
  },
];

export const personById = new Map(people.map((p) => [p.id, p]));

/** 사건별 관련 인물 */
export const eventPeople: Record<string, string[]> = {
  oksanpo: ['sim-il', 'im-butaek'],
  'hongcheon-breakthrough': ['ham-byeongseon'],
  'soyang-defense': ['im-butaek'],
  'bongui-fall': ['im-butaek', 'kim-jongo'],
  garaemok: ['jeong-ogyeong'],
  keunmalgogae: ['jo-daljin', 'min-byeonggwon'],
  withdrawal: ['kim-jongo'],
};
