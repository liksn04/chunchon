import type { Faction } from '../../types';
import type { ImageCredit } from './media';

export type EquipKind = 'spgun' | 'tank' | 'armored-car' | 'howitzer' | 'atgun' | 'mortar';

export interface Equipment {
  id: string;
  name: string;
  origin: string;          // 제조/계열
  user: Faction;           // 이 전투에서 운용
  kind: EquipKind;
  klass: string;           // 분류 (자주포·전차 …)
  specs: { label: string; value: string }[];
  note: string;
  /** 실사 사진(공개도메인/자유 라이선스). 없으면 측면 실루엣으로 폴백 */
  photo?: ImageCredit;
}

export const equipment: Equipment[] = [
  {
    id: 'su-76',
    name: 'SU-76 자주포',
    origin: '소련제',
    user: 'NK',
    kind: 'spgun',
    klass: '자주포(경자주포)',
    specs: [
      { label: '주포', value: '76.2mm ZIS-3' },
      { label: '승무원', value: '4명' },
      { label: '중량', value: '약 10.8t' },
      { label: '구조', value: '개방형 전투실' },
    ],
    note: '북한 2사단이 옥산포·가래목에서 앞세운 주력 화력. 개방형 상부 탓에 보병 육박·포격에 취약했고, 논밭 정면 통과 실책과 병목 도하로 큰 피해를 입었다.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Ko%C5%82obrzeg_-Muzeum_Or%C4%99%C5%BCa_Polskiego-SU-76-12.05.2023_15-52-35.jpg',
      credit: 'Radosław Drożdżewski / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ko%C5%82obrzeg_-Muzeum_Or%C4%99%C5%BCa_Polskiego-SU-76-12.05.2023_15-52-35.jpg',
      note: '폴란드 무기박물관 전시(SU-76M)',
    },
  },
  {
    id: 't-34',
    name: 'T-34 전차',
    origin: '소련제',
    user: 'NK',
    kind: 'tank',
    klass: '중형전차',
    specs: [
      { label: '주포', value: '76.2 / 85mm' },
      { label: '승무원', value: '4~5명' },
      { label: '중량', value: '약 26~32t' },
      { label: '최고속도', value: '약 55km/h' },
    ],
    note: '북한 기갑의 핵심. 개전 초 국군에 대전차 수단이 부족했으나, 큰말고개에서는 지형 병목과 육탄공격으로 기동을 봉쇄당해 격파·노획됐다.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Museum_of_the_Revolution_T34_Tank.jpg',
      credit: 'Tony Hisgett / Wikimedia Commons',
      license: 'CC BY 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Museum_of_the_Revolution_T34_Tank.jpg',
      note: 'T-34-85',
    },
  },
  {
    id: 'ba-64',
    name: 'BA-64 장갑차',
    origin: '소련제',
    user: 'NK',
    kind: 'armored-car',
    klass: '경장갑차',
    specs: [
      { label: '무장', value: '7.62mm 기관총' },
      { label: '승무원', value: '2명' },
      { label: '중량', value: '약 2.4t' },
    ],
    note: '정찰·연락용 경장갑차. 2군단의 차량화 기동에 쓰였으나 지연전 국면에서 다수 손실됐다.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/BA-64_Dresden.jpg',
      credit: 'Pudelek (Marcin Szala) / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:BA-64_Dresden.jpg',
      note: '드레스덴 군사사박물관 전시(BA-64B)',
    },
  },
  {
    id: 'm3-105',
    name: 'M3 105mm 곡사포',
    origin: '미제',
    user: 'ROK',
    kind: 'howitzer',
    klass: '경곡사포',
    specs: [
      { label: '구경', value: '105mm' },
      { label: '사거리', value: '약 11km' },
      { label: '승무원', value: '약 8명' },
      { label: '중량', value: '약 2.2t' },
    ],
    note: '국군 16포병대대의 주력(13문). 가래목 병목에 몰린 북한군 도하 대열에 3개 포대가 집중포격을 퍼부어 2사단 전투력의 약 40%를 앗은 "대포격전"의 주역.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/M3_105mm_Howitzer.jpg',
      credit: 'Max Smith / Wikimedia Commons',
      license: 'Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M3_105mm_Howitzer.jpg',
      note: '미 육군박물관(하와이) 전시',
    },
  },
  {
    id: 'at-57',
    name: 'M1 57mm 대전차포',
    origin: '미제',
    user: 'ROK',
    kind: 'atgun',
    klass: '대전차포',
    specs: [
      { label: '구경', value: '57mm' },
      { label: '승무원', value: '약 5명' },
      { label: '용도', value: '대전차 직사' },
    ],
    note: '개전기 국군의 몇 안 되는 대전차 수단. 옥산포에서 심일 소대가 자주포에 응전했고, 큰말고개에서는 견제 사격으로 육탄공격의 틈을 열었다.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/6/64/U.S.M1_57mm_Gun%2810470718226%29.jpg',
      credit: 'Gary Todd / Wikimedia Commons',
      license: 'CC0 (Public Domain)',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:U.S.M1_57mm_Gun%2810470718226%29.jpg',
      note: '57 mm Gun M1',
    },
  },
  {
    id: 'm1-81mortar',
    name: '81mm 박격포',
    origin: '미제',
    user: 'ROK',
    kind: 'mortar',
    klass: '박격포',
    specs: [
      { label: '구경', value: '81mm' },
      { label: '용도', value: '보병 곡사 화력' },
    ],
    note: '큰말고개 육탄 11용사가 각자 지닌 81mm 포탄을, 매복 중 선두 자주포 해치를 열고 수류탄과 함께 까넣어 기동 불능으로 만든 상징적 무기.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/81_mm_Mortar_M1_in_South_Korea.jpg',
      credit: 'Twotwo2019 / Wikimedia Commons',
      license: 'CC BY 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:81_mm_Mortar_M1_in_South_Korea.jpg',
      note: '전쟁기념관 전시(M1 81mm)',
    },
  },
];

export const equipmentById = new Map(equipment.map((e) => [e.id, e]));
