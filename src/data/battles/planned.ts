import type { BattleMeta } from '../../types';

/**
 * 골격 전투 메타(Stage 3 / A7) — 모두 `status: 'planned'`.
 * 상세 콘텐츠(사건·전선·부대 등)는 아직 없고 목록 지도·카드에 필요한
 * 최소 정보(이름·국면·기간·대표 좌표·요약)만 채운다. `bbox`/`relief`는
 * `planned` 전투에는 불필요하므로 비워 둔다.
 *
 * 좌표는 실제 지명의 대략적 위경도를 근거로 했다(전투가 벌어진 읍·면
 * 소재지 또는 대표 지형지물 기준 근사치 — 목록 지도 마커용이며 상세
 * 상황도의 정밀 좌표가 아니다). 요약은 알려진 사실에 근거해 과장 없이
 * 2~3문장으로 작성했다.
 */
export const plannedMetas: BattleMeta[] = [
  {
    id: 'hangang-line',
    name: { ko: '한강 방어선 전투', en: 'Han River Defensive Line' },
    phase: 'invasion',
    dateRange: { start: '1950-06-28', end: '1950-07-03' },
    marker: [126.96, 37.51],
    summary:
      '1950년 6월 28일 서울이 함락되고 한강대교가 조기 폭파되며 다수의 인명 피해가 발생한 가운데, 국군은 한강 남안을 따라 방어선을 형성해 며칠간 북한군의 도하를 저지했다. 이 방어선은 이후 병력 재편과 남쪽 방어선 구축을 위한 시간을 벌어주었다.',
    status: 'planned',
  },
  {
    id: 'daejeon',
    name: { ko: '대전 전투', en: 'Battle of Taejon' },
    phase: 'invasion',
    dateRange: { start: '1950-07-14', end: '1950-07-21' },
    marker: [127.38, 36.35],
    summary:
      '미 제24보병사단이 금강선에서 밀린 뒤 대전 시가지에서 북한군 제3·4사단을 상대로 지연전을 벌인 전투로, 사단장 윌리엄 딘 소장이 시가전 중 실종·포로가 되었다. 이 저항은 낙동강 방어선을 구축할 시간을 확보하는 대가로 큰 희생을 치렀다.',
    status: 'planned',
  },
  {
    id: 'dabudong',
    name: { ko: '다부동 전투', en: 'Battle of Tabu-dong' },
    phase: 'naktong',
    dateRange: { start: '1950-08-03', end: '1950-08-29' },
    marker: [128.4, 36.03],
    summary:
      '칠곡 다부동 일대에서 국군 제1사단이 대구로 향하는 관문을 지키기 위해 북한군 3개 사단의 집중 공세를 약 한 달간 저지한, 낙동강 방어선의 대표적 격전지다. 유학산 등 주요 고지의 주인이 여러 차례 바뀌는 공방 끝에 방어선이 유지되어 대구 함락을 막았다.',
    status: 'planned',
  },
  {
    id: 'pohang-angang',
    name: { ko: '포항–안강·기계 전투', en: 'Battles of Pohang–Angang-Gigye' },
    phase: 'naktong',
    dateRange: { start: '1950-08-09', end: '1950-09-14' },
    marker: [129.3, 36.02],
    summary:
      '낙동강 방어선 동부 전선에서 북한군이 포항과 안강·기계 일대를 반복적으로 공격·점령했고, 국군이 여러 차례 이를 탈환하며 한 달 넘게 공방이 이어졌다. 이 전선에는 학도의용군이 투입된 포항여중 전투도 포함되어 있다.',
    status: 'planned',
  },
  {
    id: 'incheon',
    name: { ko: '인천상륙작전', en: 'Operation Chromite (Incheon Landing)' },
    phase: 'counter',
    dateRange: { start: '1950-09-15', end: '1950-09-19' },
    marker: [126.62, 37.47],
    summary:
      '유엔군이 인천 월미도와 해안에 상륙해 서울 진격로를 확보한 작전으로, 낙동강 전선에 묶여 있던 북한군의 병참선을 끊는 전환점이 되었다. 조수간만 차가 큰 인천의 지형 조건 때문에 상륙 시각과 항로가 정밀하게 계산되었다.',
    status: 'planned',
  },
  {
    id: 'seoul-recapture',
    name: { ko: '서울 수복', en: 'Second Battle of Seoul' },
    phase: 'counter',
    dateRange: { start: '1950-09-22', end: '1950-09-28' },
    marker: [126.98, 37.57],
    summary:
      '인천상륙작전 이후 유엔군과 국군이 서울 외곽에서 북한군의 시가전 저항을 뚫고 9월 28일 중앙청에 태극기를 다시 게양하며 수복을 완료했다. 서울이 함락된 지 정확히 3개월 만의 탈환이었다.',
    status: 'planned',
  },
  {
    id: 'unsan',
    name: { ko: '운산 전투', en: 'Battle of Unsan' },
    phase: 'ccf',
    dateRange: { start: '1950-11-01', end: '1950-11-04' },
    marker: [125.8, 39.98],
    summary:
      '평안북도 운산에서 중공군이 처음으로 대규모 병력을 투입해 국군 제1사단과 미 제8기병연대를 기습한 전투로, 중국의 참전을 전선에서 처음 확인시킨 사건이다. 미 제8기병연대 3대대가 큰 피해를 입는 등 유엔군의 북진에 급격히 제동이 걸리는 계기가 되었다.',
    status: 'planned',
  },
  {
    id: 'jangjinho',
    name: { ko: '장진호 전투', en: 'Battle of Chosin Reservoir' },
    phase: 'ccf',
    dateRange: { start: '1950-11-27', end: '1950-12-11' },
    marker: [127.2, 40.48],
    summary:
      '함경남도 장진호 일대에서 미 해병 제1사단 등이 중공군 제9병단의 포위 공세를 뚫고 흥남으로 철수한 전투로, 영하 수십 도의 혹한 속에서 치러졌다. 포위망을 뚫고 조직적으로 철수에 성공하며 흥남 철수 작전의 기반을 마련했다.',
    status: 'planned',
  },
  {
    id: 'hungnam',
    name: { ko: '흥남 철수', en: 'Hungnam Evacuation' },
    phase: 'ccf',
    dateRange: { start: '1950-12-15', end: '1950-12-24' },
    marker: [127.62, 39.83],
    summary:
      '중공군 개입으로 전선이 붕괴하자 유엔군과 국군, 다수의 피난민이 흥남항을 통해 해상으로 철수한 작전이다. 약 열흘간 십만 명이 넘는 병력과 피난민이 선박으로 남쪽으로 이송되었고, 철수 완료 후 항만 시설은 폭파되었다.',
    status: 'planned',
  },
  {
    id: 'jipyeongri',
    name: { ko: '지평리 전투', en: 'Battle of Chipyong-ni' },
    phase: 'ccf',
    dateRange: { start: '1951-02-13', end: '1951-02-15' },
    marker: [127.57, 37.49],
    summary:
      '경기도 양평 지평리에서 미 제23연대전투단(프랑스대대 포함)이 사방을 포위한 중공군의 공세를 사흘간 방어해낸 전투로, 중공군 남하 이후 유엔군이 거둔 최초의 확실한 방어 성공 사례로 꼽힌다. 이를 계기로 중공군의 공세에 대한 유엔군의 자신감이 회복되었다.',
    status: 'planned',
  },
  {
    id: 'hyeonri',
    name: { ko: '현리 전투', en: 'Battle of Hyeon-ri' },
    phase: 'ccf',
    dateRange: { start: '1951-05-16', end: '1951-05-22' },
    marker: [128.35, 37.95],
    summary:
      '중공군의 5월 공세로 인제 현리 일대에서 국군 제3군단이 오마치 고개 퇴로를 차단당해 큰 피해를 입고 후퇴한 전투다. 이 패퇴는 국군 제3군단이 해체되는 등 지휘 체계를 재정비하는 계기가 되었다.',
    status: 'planned',
  },
  {
    id: 'yongmunsan',
    name: { ko: '용문산 전투', en: 'Battle of Yongmunsan' },
    phase: 'ccf',
    dateRange: { start: '1951-05-18', end: '1951-05-21' },
    marker: [127.5, 37.5],
    summary:
      '경기도 양평 용문산 일대에서 국군 제6사단이 중공군 5월 공세의 한 축을 격퇴한 전투로, 현리 전투로 흔들리던 중동부 전선에서 유엔군 측이 거둔 대표적 반격 성공 사례다. 이후 국군은 북한강을 넘어 추격전을 벌였다.',
    status: 'planned',
  },
  {
    id: 'baengmagoji',
    name: { ko: '백마고지 전투', en: 'Battle of White Horse Hill' },
    phase: 'stalemate',
    dateRange: { start: '1952-10-06', end: '1952-10-15' },
    marker: [127.09, 38.26],
    summary:
      '철원 북방 395고지(백마고지)를 두고 국군 제9사단과 중공군이 열흘간 고지의 주인이 여러 차례 바뀌는 공방을 벌인 전투로, 고지전 시기를 대표하는 격전 중 하나다. 격렬한 포격으로 고지의 지형이 바뀔 정도였다는 기록이 남아 있으며, 국군이 최종적으로 고지를 확보했다.',
    status: 'planned',
  },
  {
    id: 'sniper-ridge',
    name: { ko: '저격능선 전투', en: 'Battle of Sniper Ridge' },
    phase: 'stalemate',
    dateRange: { start: '1952-10-14', end: '1952-11-24' },
    marker: [127.47, 38.33],
    summary:
      '강원도 김화 오성산 남쪽 저격능선(597고지)을 두고 국군 제2사단과 중공군이 약 40일간 반복적인 쟁탈전을 벌인 고지전이다. 협소한 능선을 놓고 밀고 밀리는 공방이 이어지며 양측 모두 큰 손실을 입었다.',
    status: 'planned',
  },
  {
    id: 'kumsong',
    name: { ko: '금성 전투', en: 'Battle of Kumsong' },
    phase: 'stalemate',
    dateRange: { start: '1953-07-13', end: '1953-07-19' },
    marker: [127.62, 38.38],
    summary:
      '정전협정 체결 직전 중공군이 금성 지구 국군 전선을 대상으로 벌인 최후의 대규모 공세로, 국군 여러 사단이 밀려 전선이 남쪽으로 후퇴했다. 정전 발효 직전까지 공방이 이어져 6·25전쟁 최후의 대규모 전투로 꼽힌다.',
    status: 'planned',
  },
];
