export interface Footnote {
  eventId: string;
  claim: string;
  note: string;
  sourceIds: string[];
}

export const footnotes: Footnote[] = [
  {
    eventId: 'waegwan-bridge-demolition',
    claim: '왜관철교 폭파와 피란민 피해',
    note: '교량 폭파 자체는 미 육군 전사에 확인되지만 교량 위 민간인 수와 피해 규모는 증언·후대 서술에 편차가 크다. 본문은 수치를 제시하지 않고 피해 발생 쟁점만 기록했다.',
    sourceIds: ['cmh-appleman', 'imhc-naktong'],
  },
  {
    eventId: 'line-contraction',
    claim: '303고지–다부동–군위–보현산 방어선 조정',
    note: '한국민족문화대백과사전은 육군본부의 조정 시점을 8월 11일로 서술한다. DayPhase는 장기전 큐레이션을 위해 8월 10일 국면으로 묶었다.',
    sourceIds: ['aks-dabudong', 'imhc-naktong'],
  },
  {
    eventId: 'hill328-opening',
    claim: '328고지의 반복 점령 교대',
    note: '전적지 안내에서는 고지 주인이 여러 차례, 흔히 15회 바뀌었다고 소개한다. 일별 전투기록의 집계 기준이 일정하지 않아 본문에는 횟수를 단정하지 않았다.',
    sourceIds: ['dabu-museum', 'imhc-naktong'],
  },
  {
    eventId: 'yuhaksan-839',
    claim: '유학산 839고지의 반복 공방',
    note: '유학산은 여러 날 동안 피탈과 탈환이 반복된 전장이다. “9회” 등 널리 인용되는 횟수는 소개자료의 집계이므로 본문은 연속 공방이라는 사실만 채택했다.',
    sourceIds: ['dabu-museum', 'imhc-naktong', 'aks-dabudong'],
  },
  {
    eventId: 'tabudong-breach',
    claim: '8월 17일 제13사단 돌파와 미 제27연대 긴급 투입',
    note: '미 육군 전사는 제13사단의 다부동 회랑 진출과 제27연대의 대구 북방 이동을 같은 위기 국면으로 서술한다. 전선 좌표는 시간대별 위치를 하나의 대표점으로 압축했다.',
    sourceIds: ['cmh-appleman', 'imhc-naktong'],
  },
  {
    eventId: 'daegu-shelling',
    claim: '8월 18일 대구역 피탄과 정부의 부산 이동',
    note: '한국민족문화대백과사전의 전투 항목에 근거한다. 포탄의 발사부대·탄착 세부는 자료마다 간략하므로 가산 침투부대의 박격포 사격이라는 수준으로 서술했다.',
    sourceIds: ['aks-dabudong', 'imhc-naktong'],
  },
  {
    eventId: 'bowling-alley-night-battles',
    claim: 'M26 전차·3.5인치 로켓포와 T-34의 야간 교전',
    note: '미 육군 전사는 제27연대의 반격, M26 전차 지원, 북한군 T-34 전차의 반복 야간 접근을 상세히 기록한다. 전차 대수와 격파 수는 날짜·자료에 따라 달라 본문에서 특정하지 않았다.',
    sourceIds: ['cmh-appleman', 'imhc-naktong'],
  },
  {
    eventId: 'paik-frontline',
    claim: '백선엽 사단장의 “내가 후퇴하면 쏘라”는 취지의 독려',
    note: '백선엽의 회고와 후대 전승에서 널리 알려진 일화다. 정확한 발언 문구·시각·장소를 동시대 작전일지로 확정하기 어려워 본문은 회고 자료임을 명시하고 지휘행동의 맥락만 채택했다.',
    sourceIds: ['paik-memoir', 'aks-paik'],
  },
  {
    eventId: 'august-offensive-contained',
    claim: '8월 20일 무렵 북한 제15사단의 영천 방면 전환',
    note: '한국민족문화대백과사전은 제15사단의 전환을 8월 다부동 위기 해소의 지표로 제시한다. 전투 자체는 이후에도 계속됐다.',
    sourceIds: ['aks-dabudong', 'imhc-naktong'],
  },
  {
    eventId: 'september-offensive',
    claim: '9월 초 북한군의 재공세',
    note: '다부동 전투를 8월 말로 끝내는 서술도 있으나 국가보훈부와 군사편찬 자료는 9월 공세와 반격까지 전투 범위에 포함한다.',
    sourceIds: ['mpva-dabudong', 'imhc-naktong'],
  },
  {
    eventId: 'northward-recovery',
    claim: '전투 저작 범위 1950년 8월 3일~9월 22일',
    note: '전적기념관·지역 자료는 7월 말~9월 24일 등 더 넓은 범위를 쓰기도 한다. 본 데이터는 국가보훈부의 공식 기념 보도자료가 제시한 8월 3일~9월 22일을 채택했다.',
    sourceIds: ['mpva-dabudong', 'dabu-museum', 'imhc-naktong'],
  },
];

export const footnotesByEvent: Record<string, Footnote[]> = footnotes.reduce(
  (acc, f) => {
    (acc[f.eventId] ??= []).push(f);
    return acc;
  },
  {} as Record<string, Footnote[]>,
);
