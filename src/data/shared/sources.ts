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
  {
    id: 'imhc-naktong',
    label: '『6·25전쟁사』 제5권 — 낙동강선 방어작전',
    publisher: '국방부 군사편찬연구소',
    url: 'https://archives.imhc.mil.kr/collection/imhc/detail?cltnSeq=256',
  },
  {
    id: 'cmh-appleman',
    label: 'South to the Naktong, North to the Yalu (CMH Pub 20-2)',
    publisher: 'U.S. Army Center of Military History',
    url: 'https://history.army.mil/Publications/Publications-Catalog/South-to-the-Naktong-North-to-the-Yalu/',
  },
  {
    id: 'aks-dabudong',
    label: '다부동전투',
    publisher: '한국민족문화대백과사전',
    url: 'https://encykorea.aks.ac.kr/Article/E0013458',
  },
  {
    id: 'mpva-dabudong',
    label: '우리가 알아야 할 8월의 6·25 전투 — 다부동 전투',
    publisher: '국가보훈부',
    url: 'https://mpva.go.kr/mpva/selectBbsNttView.do?bbsNo=16&integrDeptCode=&key=77&nttNo=4913&pageIndex=1&searchCnd=all&searchCtgry=&searchKrwd=',
  },
  {
    id: 'dabu-museum',
    label: '다부동전투 — 단계별 전투 상황',
    publisher: '다부동전적기념관',
    url: 'https://www.dabu.or.kr/ver2/sub2/sub2_1.php',
  },
  {
    id: 'aks-paik',
    label: '백선엽',
    publisher: '한국민족문화대백과사전',
    url: 'https://encykorea.aks.ac.kr/Article/E0080643',
  },
  {
    id: 'mpva-kim-jeomgon',
    label: '4월의 6·25전쟁영웅 김점곤 육군 소장',
    publisher: '국가보훈부',
    url: 'https://mpva.go.kr/mpva/selectBbsNttView.do?bbsNo=16&integrDeptCode=&key=77&nttNo=4854&pageIndex=1&searchCnd=all&searchCtgry=&searchKrwd=',
  },
  {
    id: 'paik-memoir',
    label: '백선엽, 『군과 나: 6·25 한국전쟁 회고록』 개정판',
    publisher: '시대정신, 2016 (KAIST 도서관 서지)',
    url: 'https://library.kaist.ac.kr/search/ctlgSearch/posesn/view.do?bibctrlno=662206&se=b0&ty=B',
  },
];

export const sourceById = new Map(sources.map((s) => [s.id, s]));
