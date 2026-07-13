import type { TerrainPoint, TerrainLine, LngLat } from '../types';

export const terrainPoints: TerrainPoint[] = [
  // ── 도시 ──
  { id: 'chuncheon', kind: 'city', name: '춘천', coord: [127.734, 37.885] },
  { id: 'hongcheon', kind: 'city', name: '홍천', coord: [127.889, 37.697] },
  { id: 'inje',      kind: 'city', name: '인제', coord: [128.170, 38.067] },
  { id: 'wonju',     kind: 'city', name: '원주', coord: [127.920, 37.342] },
  { id: 'hoengseong',kind: 'city', name: '횡성', coord: [127.985, 37.492] },
  { id: 'jecheon',   kind: 'city', name: '제천', coord: [128.191, 37.132] },
  { id: 'chungju',   kind: 'city', name: '충주', coord: [127.926, 36.991], meta: { note: '철수 종점 (7/1)' } },
  // 서편 맥락 — 북한군의 목표. 6사단 지연전이 이 축선(서울 우회 포위)을 무산시켰다.
  { id: 'seoul',     kind: 'city', name: '서울', coord: [126.978, 37.566], meta: { note: '적 최종 목표 (서편 맥락)' } },
  { id: 'suwon',     kind: 'city', name: '수원', coord: [127.010, 37.263], meta: { note: '2군단 재집결 지향 (7/5경)' } },
  // 서·남·주변 도시(광역 맥락, 팬 시 노출) — 대략 위치
  { id: 'uijeongbu', kind: 'city', name: '의정부', coord: [127.047, 37.738] },
  { id: 'gapyeong',  kind: 'city', name: '가평', coord: [127.511, 37.831] },
  { id: 'cheongpyeong', kind: 'city', name: '청평', coord: [127.421, 37.736] },
  { id: 'yangpyeong',kind: 'city', name: '양평', coord: [127.488, 37.492] },
  { id: 'yeoju',     kind: 'city', name: '여주', coord: [127.637, 37.298] },
  { id: 'pyeongchang', kind: 'city', name: '평창', coord: [128.390, 37.370] },
  { id: 'yeongwol',  kind: 'city', name: '영월', coord: [128.462, 37.184] },
  { id: 'danyang',   kind: 'city', name: '단양', coord: [128.366, 36.985] },

  // ── 적 집결지 ──
  { id: 'hwacheon',  kind: 'assembly', name: '화천', coord: [127.708, 38.106], meta: { note: '적 집결 포착' } },
  { id: 'yanggu',    kind: 'assembly', name: '양구', coord: [127.990, 38.108], meta: { note: '적 집결 포착' } },

  // ── 산 ──
  { id: 'bongui',    kind: 'peak', name: '봉의산', coord: [127.731, 37.887], meta: { elevation: 301, note: '6/27 피탈' } },
  // 금병산: 춘천 신동면, 김유정역 북동편 (실측 보정)
  { id: 'geumbyeong',kind: 'peak', name: '금병산', coord: [127.740, 37.806], meta: { elevation: 652, note: '6/28 방어' } },
  // 광역 주요 산 — 팬/줌 시 지형 인지용 (대략 위치·표고)
  { id: 'daeryong',  kind: 'peak', name: '대룡산', coord: [127.792, 37.855], meta: { elevation: 899 } },
  { id: 'gari',      kind: 'peak', name: '가리산', coord: [127.905, 37.905], meta: { elevation: 1051 } },
  { id: 'odae',      kind: 'peak', name: '오대산', coord: [128.543, 37.792], meta: { elevation: 1565 } },
  { id: 'gyebang',   kind: 'peak', name: '계방산', coord: [128.458, 37.732], meta: { elevation: 1577 } },
  { id: 'chiak',     kind: 'peak', name: '치악산', coord: [128.055, 37.372], meta: { elevation: 1288 } },
  { id: 'yongmun',   kind: 'peak', name: '용문산', coord: [127.553, 37.552], meta: { elevation: 1157 } },
  { id: 'hwaak',     kind: 'peak', name: '화악산', coord: [127.505, 38.045], meta: { elevation: 1468 } },
  { id: 'bukhan',    kind: 'peak', name: '북한산', coord: [126.988, 37.659], meta: { elevation: 836 } },

  // ── 다리 ──
  // 모진교: 현 춘천댐 부근 수몰 지점, 38선 이남 300m
  { id: 'mojin',     kind: 'bridge', name: '모진교', coord: [127.665, 37.997], meta: { submerged1950: true, note: '현 춘천댐 수몰', uncertain: true } },
  { id: 'soyang1',   kind: 'bridge', name: '소양1교', coord: [127.735, 37.878] },

  // ── 주요 지점 ──
  // 옥산포: 사농동 북한강 강변 (우두동 서쪽) — 실측 보정
  { id: 'oksanpo',   kind: 'spot', name: '옥산포',  coord: [127.715, 37.912], meta: { uncertain: true } },
  { id: 'garaemok',  kind: 'spot', name: '가래목',  coord: [127.752, 37.876], meta: { uncertain: true } },
  { id: 'inram',     kind: 'spot', name: '사북면 인람리', coord: [127.678, 38.000], meta: { uncertain: true, note: '최초 전초 피격' } },
  // 원창고개: 춘천 동산면, 5번 국도 춘천~홍천 사이
  { id: 'wonchang',  kind: 'spot', name: '원창고개', coord: [127.780, 37.818], meta: { uncertain: true } },
  // 말고개: 홍천 두촌면 자은리 남서쪽 44번 국도 고개 (육탄 11용사 전적지)
  { id: 'malgogae',  kind: 'spot', name: '말고개',   coord: [127.965, 37.820], meta: { uncertain: true } },
  { id: 'keunmal',   kind: 'spot', name: '큰말고개', coord: [127.982, 37.836], meta: { uncertain: true } },
  // 자은리: 홍천 두촌면 소재지, 44번 국도변
  { id: 'jaeun',     kind: 'spot', name: '자은리',   coord: [127.995, 37.848], meta: { uncertain: true, note: '2연대 지휘소' } },

  // ── 고지 ──
  { id: 'hill558',   kind: 'hill', name: '558고지', coord: [127.938, 37.788], meta: { uncertain: true } },
  { id: 'hill402',   kind: 'hill', name: '402고지', coord: [127.912, 37.762], meta: { uncertain: true } },

  // ── 하천 합류·요충 (광역) ──
  { id: 'dumulmeori', kind: 'spot', name: '두물머리', coord: [127.329, 37.545], meta: { note: '남한강·북한강 합류 → 한강' } },
];

/** 38선 (북위 38도) — 뷰를 가로지르는 위도선 */
export const boundary38: LngLat[] = [
  [127.60, 38.00],
  [128.25, 38.00],
];

/*
 ── 강·도로 linework 노트 ──
 아래 폴리라인은 상황도 양식의 "도식화된 근사"(approx: true)다.
 1950년 당시 하안선 기준(춘천댐·소양강댐·의암호 담수 이전)으로,
 현대 OSM/NGII 지오메트리를 그대로 쓰면 호수가 그려지므로 의도적으로 단순 작도했다.
 정밀 보정 시: OSM Overpass(waterway=river) · NGII 하천망도를 1950 지형 기준으로 편집해 교체.
*/
export const terrainLines: TerrainLine[] = [
  {
    id: 'bukhan-river',
    kind: 'river',
    name: '북한강',
    approx: true,
    coordinates: [
      [127.708, 38.130], // 화천 상류
      [127.690, 38.060],
      [127.660, 38.020],
      [127.685, 37.980], // 모진교 부근 (모진강)
      [127.705, 37.945],
      [127.718, 37.910],
      [127.705, 37.878], // 춘천 서편, 소양강 합류부
      [127.680, 37.840],
      [127.655, 37.795],
      [127.615, 37.755],
      [127.600, 37.720],
    ],
  },
  {
    id: 'soyang-river',
    kind: 'river',
    name: '소양강',
    approx: true,
    coordinates: [
      [128.220, 38.090], // 인제 상류
      [128.140, 38.040],
      [128.060, 38.000],
      [127.980, 37.960],
      [127.900, 37.930],
      [127.820, 37.905],
      [127.760, 37.888],
      [127.735, 37.878], // 소양1교·가래목
      [127.705, 37.878], // 북한강 합류
    ],
  },
  {
    id: 'hongcheon-river',
    kind: 'river',
    name: '홍천강',
    approx: true,
    coordinates: [
      [128.080, 37.690],
      [127.990, 37.685],
      [127.889, 37.697], // 홍천
      [127.790, 37.715],
      [127.700, 37.735],
      [127.620, 37.740],
    ],
  },
  {
    id: 'han-river',
    kind: 'river',
    name: '한강',
    approx: true,
    coordinates: [
      [127.330, 37.535], // 두물머리(양수리) 부근
      [127.210, 37.540],
      [127.100, 37.520], // 잠실 부근
      [126.985, 37.520], // 서울 남
      [126.895, 37.560],
      [126.815, 37.585], // 행주 부근
      [126.720, 37.615],
    ],
  },
  {
    id: 'namhan-river',
    kind: 'river',
    name: '남한강',
    approx: true,
    coordinates: [
      [128.462, 37.190], // 영월
      [128.360, 36.995], // 단양
      [128.080, 37.010],
      [127.870, 37.035], // 충주 부근
      [127.700, 37.150],
      [127.610, 37.300], // 여주
      [127.490, 37.490], // 양평
      [127.355, 37.535], // 두물머리(합류)
    ],
  },
  {
    id: 'gyeongchun-road',
    kind: 'road',
    name: '경춘가도(서울–춘천)',
    approx: true,
    coordinates: [
      [126.990, 37.575], // 서울
      [127.090, 37.605],
      [127.210, 37.640], // 금곡 부근
      [127.335, 37.700], // 청평 부근
      [127.470, 37.795],
      [127.511, 37.831], // 가평
      [127.630, 37.875],
      [127.734, 37.885], // 춘천
    ],
  },
  {
    id: 'route-5',
    kind: 'road',
    name: '5번 국도',
    approx: true,
    coordinates: [
      [127.708, 38.106], // 화천
      [127.700, 38.010],
      [127.715, 37.912], // 옥산포(사농동) 부근
      [127.734, 37.885], // 춘천
      [127.780, 37.818], // 원창고개
      [127.840, 37.760],
      [127.889, 37.697], // 홍천
      [127.940, 37.590],
      [127.985, 37.492], // 횡성
      [127.920, 37.342], // 원주
      [128.050, 37.230],
      [128.191, 37.132], // 제천
      [128.060, 37.050],
      [127.926, 36.991], // 충주
    ],
  },
  {
    id: 'route-44',
    kind: 'road',
    name: '인제–홍천 도로',
    approx: true,
    coordinates: [
      [128.170, 38.067], // 인제
      [128.100, 37.990],
      [128.060, 37.945], // 신남 부근
      [128.020, 37.895], // 어론리 부근
      [127.995, 37.848], // 자은리
      [127.965, 37.820], // 말고개
      [127.925, 37.760],
      [127.889, 37.697], // 홍천
    ],
  },
];
