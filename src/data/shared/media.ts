/**
 * 실사 이미지(초상·장비) 출처·라이선스 메타.
 * 개인 학습용 프로젝트지만 고증 신뢰도와 저작권 존중을 위해
 * 카드에 출처·라이선스를 함께 표기한다.
 * 이미지는 public/portraits, public/equipment 에 둔다(로컬 번들).
 */
export interface ImageCredit {
  /** public 기준 절대경로. 예: /portraits/kim-jongo.jpg */
  src: string;
  /** 소장/제작 출처. 예: 국가기록원, US Army, Wikimedia Commons */
  credit: string;
  /** 라이선스. 예: Public Domain, KOGL 제1유형, CC BY-SA 4.0 */
  license: string;
  /** 원본 페이지 URL(선택) */
  sourceUrl?: string;
  /** 촬영/연도 등 부가 캡션(선택) */
  note?: string;
}
