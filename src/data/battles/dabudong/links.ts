/** 사건별 관련 인물 (shared/people 카탈로그 id 참조) */
export const eventPeople: Record<string, string[]> = {
  'line-contraction': ['paik-sunyup'],
  'yuhaksan-839': ['kim-jeomgon'],
  'tabudong-breach': ['paik-sunyup', 'kim-jeomgon', 'john-michaelis'],
  'bowling-alley-opening': ['john-michaelis'],
  'bowling-alley-night-battles': ['john-michaelis'],
  'paik-frontline': ['paik-sunyup'],
  'august-offensive-contained': ['paik-sunyup'],
  'september-offensive': ['paik-sunyup', 'kim-jeomgon'],
  'counteroffensive': ['paik-sunyup'],
  'northward-recovery': ['paik-sunyup'],
};

/** 사건별 참고 출처 (shared/sources 카탈로그 id 참조) */
export const eventSources: Record<string, string[]> = {
  'nakjeong-delay': ['imhc-naktong', 'aks-dabudong'],
  'waegwan-bridge-demolition': ['cmh-appleman', 'imhc-naktong'],
  'line-contraction': ['aks-dabudong', 'imhc-naktong'],
  'hill328-opening': ['dabu-museum', 'imhc-naktong'],
  'yuhaksan-839': ['dabu-museum', 'imhc-naktong', 'aks-dabudong'],
  'tabudong-breach': ['cmh-appleman', 'imhc-naktong', 'mpva-dabudong'],
  'daegu-shelling': ['aks-dabudong', 'imhc-naktong'],
  'bowling-alley-opening': ['cmh-appleman', 'imhc-naktong'],
  'bowling-alley-night-battles': ['cmh-appleman', 'imhc-naktong', 'dabu-museum'],
  'paik-frontline': ['paik-memoir', 'aks-paik'],
  'august-offensive-contained': ['aks-dabudong', 'imhc-naktong'],
  'september-offensive': ['mpva-dabudong', 'imhc-naktong'],
  'gasan-fighting': ['imhc-naktong', 'dabu-museum'],
  'counteroffensive': ['imhc-naktong', 'mpva-dabudong'],
  'northward-recovery': ['mpva-dabudong', 'imhc-naktong'],
};
