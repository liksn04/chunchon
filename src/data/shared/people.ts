import type { Faction } from '../../types';
import type { ImageCredit } from './media';

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
    bio: '옥산포~소양강 방면으로 밀고 든 북한 2사단의 자주포(SU-76)에 맞서 대전차포로 응전, 여러 대를 격파해 춘천 방면의 기선을 제압한 인물로 알려졌다. 이 공로로 태극무공훈장을 받았고 이듬해 1951년 전사했다. 다만 그의 육탄공격 무용담은 논쟁이 있다 — 1981년 육군 조사에서 공적서 내용에 의문이 제기됐고 2016년 이대용 장군이 "신화는 사실과 다르다"고 주장했다. 2017년 국방부 공적확인위원회는 심일 소대가 자주포 3대를 격파한 전공은 사실로 재확인했으나, 육군군사연구소 등은 문헌 고증 문제를 들어 여전히 이견을 보인다.',
  },
  {
    id: 'kim-jongo',
    name: '김종오',
    rankRole: '대령 · 제6사단장',
    faction: 'ROK',
    bio: '개전 이틀 전인 6월 23일, 접경지대의 심상찮은 적 동태를 간파하고 야간 작전회의에서 전 장병의 외출·외박을 통제하고 비상경계를 유지시켰다. 이 예방 조치가 개전 당일 6사단의 조직적 대응력을 보존한 결정적 요인이 됐다. 무리한 방어 대신 요충을 옮겨가며 시간을 버는 지연전으로 북한 2군단을 3일간 붙들고 6사단을 온전히 후퇴시켰다. 훗날 백마고지 전투(9사단장)를 승리로 이끌고 육군참모총장에 올랐다.',
  },
  {
    id: 'im-butaek',
    name: '임부택',
    rankRole: '중령 · 제7연대장',
    faction: 'ROK',
    bio: '개전 전 김종오 사단장에게 경계 강화를 건의했고, 춘천 정면을 맡아 옥산포·소양강 방어선에서 북한 2사단의 주공을 저지했다. 6월 26일에는 원주에서 증원된 19연대 2대대의 측방 엄호를 받아 1대대(대대장 김용배 소령)에게 옥산포 역습을 명령해 집결 중이던 적 1개 대대를 전멸시켰다. 봉의산 피탈 뒤에도 원창고개·금병산으로 방어선을 옮겨가며 지연전을 이어갔다.',
  },
  {
    id: 'kim-yongbae',
    name: '김용배',
    rankRole: '소령 · 제7연대 1대대장',
    faction: 'ROK',
    bio: '옥산포에서 북한 2사단 6연대의 자주포 공격을 정면으로 받아냈고, 6월 26일 오전 8시 임부택 연대장의 명령에 따라 약진한계선을 삼거리로 통제하며 역습을 감행해 집결 중이던 적 대대를 기습·전멸시켰다. 이 전과로 북한군은 소양강을 즉시 도하하지 못하고 저지됐다.',
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
    bio: '말고개 매복에서 각자 81mm 박격포탄 1발과 수류탄 2발을 지닌 11명 특공대의 일원으로, 선두 자주포에 올라타 해치를 열고 포탄·수류탄을 까넣어 기동 불능으로 만들었다. 대열이 좁은 만곡부에서 앞뒤로 갇히면서 특공대는 아군 피해를 거의 내지 않고 적 기갑 대열을 격파·노획했고, 11용사는 전원 1~2계급 특진했다. 조달진은 이후 철수 중 상주 유곡 전투에서도 단신으로 적 전차 포구에 수류탄을 넣어 무력화하고 승무원들을 포로로 잡는 전공을 세웠다.',
  },
];

export const personById = new Map(people.map((p) => [p.id, p]));

/** 부가 정보 — 한자 표기, 훈장·특진, 실사 초상(있으면) */
export interface PersonMeta {
  hanja?: string;
  medals?: string[];
  /** 실사 초상(공개도메인/자유 라이선스). 없으면 도식 초상으로 폴백 */
  photo?: ImageCredit;
}

export const personMeta: Record<string, PersonMeta> = {
  'sim-il': {
    hanja: '沈鎰',
    medals: ['태극무공훈장'],
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Sim_Il.jpg',
      credit: '중앙일보 / Wikimedia Commons',
      license: 'Public Domain (KR)',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sim_Il.jpg',
      note: '1951년 이전',
    },
  },
  'kim-jongo': {
    hanja: '金鍾五',
    medals: ['태극무공훈장'],
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/General_Kim_Jong-oh.jpg',
      credit: '육군사관학교 박물관 / Wikimedia Commons',
      license: 'Public Domain (KR)',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:General_Kim_Jong-oh.jpg',
      note: '1954년',
    },
  },
  'im-butaek': { hanja: '林富澤' },
  'kim-yongbae': {
    hanja: '金容培',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/5/52/%EA%B9%80%EC%9A%A9%EB%B0%B0_1963.jpg',
      credit: '조선일보 / Wikimedia Commons',
      license: 'Public Domain (KR)',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:%EA%B9%80%EC%9A%A9%EB%B0%B0_1963.jpg',
      note: '1963년',
    },
  },
  'jeong-ogyeong': { hanja: '鄭五景' },
  'ham-byeongseon': { hanja: '咸炳善' },
  'min-byeonggwon': {
    hanja: '閔丙權',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Minbyungkwon.jpeg',
      credit: 'Huien2478 / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Minbyungkwon.jpeg',
    },
  },
  'jo-daljin': {
    hanja: '趙達鎭',
    medals: ['2계급 특진', '무공훈장'],
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/a/af/%EC%A1%B0%EB%8B%AC%EC%A7%84.png',
      credit: '노리쇠후퇴고정 / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:%EC%A1%B0%EB%8B%AC%EC%A7%84.png',
    },
  },
};
