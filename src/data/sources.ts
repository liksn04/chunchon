/**
 * 사료 출처 — 각 사건 서술의 근거를 밝힌다.
 * 나무위키 텍스트는 CC BY-NC-SA 2.0 KR이므로 원문을 옮기지 않고 재서술했으며,
 * 아래 링크는 교차 확인용 참고처다.
 */
export interface Source {
  id: string;
  label: string;
  publisher: string;
  url: string;
}

export const sources: Source[] = [
  {
    id: 'encykorea',
    label: '춘천지구 전투',
    publisher: '한국민족문화대백과사전',
    url: 'https://encykorea.aks.ac.kr/Article/E0058023',
  },
  {
    id: 'wiki-chuncheon',
    label: '춘천 전투',
    publisher: '위키백과',
    url: 'https://ko.wikipedia.org/wiki/%EC%B6%98%EC%B2%9C_%EC%A0%84%ED%88%AC',
  },
  {
    id: 'namu',
    label: '춘천-홍천 전투',
    publisher: '나무위키 (CC BY-NC-SA 2.0 KR)',
    url: 'https://namu.wiki/w/%EC%B6%98%EC%B2%9C-%ED%99%8D%EC%B2%9C%20%EC%A0%84%ED%88%AC',
  },
  {
    id: 'mpva',
    label: '춘천전투 — 6.25 주요전투',
    publisher: '국가보훈부 히어로드',
    url: 'https://mpva.go.kr/mpva/contents.do?key=2147',
  },
  {
    id: 'nculture-malgogae',
    label: '한국 6.25전쟁과 홍천 말고개 전투',
    publisher: '향토문화전자대전',
    url: 'https://www.nculture.org/lib/libraryDetail.do?contentId=933',
  },
  {
    id: 'imhc',
    label: '『6.25 전쟁사』 제2권',
    publisher: '국방부 군사편찬연구소',
    url: 'https://www.imhc.mil.kr/',
  },
  {
    id: 'joongang',
    label: '6·25 전환점 춘천대첩',
    publisher: '중앙일보 Focus 인사이드',
    url: 'https://www.joongang.co.kr/article/25172273',
  },
  {
    id: 'kwnews',
    label: '대한민국을 지켜낸 3일',
    publisher: '강원일보',
    url: 'https://www.kwnews.co.kr/page/view/2023011711132167586',
  },
  {
    id: 'wiki-simil',
    label: '심일',
    publisher: '위키백과',
    url: 'https://ko.wikipedia.org/wiki/%EC%8B%AC%EC%9D%BC',
  },
  {
    id: 'wiki-jodaljin',
    label: '조달진',
    publisher: '위키백과',
    url: 'https://ko.wikipedia.org/wiki/%EC%A1%B0%EB%8B%AC%EC%A7%84',
  },
  {
    id: 'wiki-kimjongo',
    label: '김종오',
    publisher: '위키백과',
    url: 'https://ko.wikipedia.org/wiki/%EA%B9%80%EC%A2%85%EC%98%A4',
  },
  {
    id: 'jinsil-bodo',
    label: '청원 국민보도연맹 사건',
    publisher: '진실·화해를위한과거사정리위원회',
    url: 'https://jinsil.go.kr/KoreanWar/25.do',
  },
];

export const sourceById = new Map(sources.map((s) => [s.id, s]));

/** 사건별 참고 출처 */
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

/**
 * 좌표가 도식적 근사(⚠)인 사건 — "위치 추정" 배지 대상.
 * 실제 지점에서 시각적 겹침 방지를 위해 미세 오프셋한 경우도 포함한다.
 */
export const approxEventIds = new Set<string>([
  'mojin-mine',
  'oksanpo',
  'hongcheon-breakthrough',
  'soyang-defense',
  'bongui-fall',
  'garaemok',
  'malgogae',
  'wonchang-geumbyeong',
  'keunmalgogae',
]);
