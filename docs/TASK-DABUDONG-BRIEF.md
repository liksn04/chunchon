# 작업지시서 — 다부동 전투 콘텐츠 저작 (배경지식 포함)

> 이 문서는 외부 AI 에이전트(Codex 등)가 사전 대화 없이 곧바로 작업할 수 있도록
> ① 프로젝트 배경지식 전체와 ② 다부동 전투 저작 작업지시를 담은 단일 브리핑이다.
> **먼저 이 문서를 끝까지 읽고, `docs/BATTLE-AUTHORING.md`를 함께 참조하라.**

---

## 1부 — 프로젝트 배경지식

### 1.1 무엇을 만드는 앱인가

**"6·25 전쟁 전투 상황도"** — 한국전쟁의 주요 전투를 1950년대 야전 상황도(situation map)
미감으로 탐색하는 인터랙티브 웹앱. 각 전투는 다음 요소로 표현된다:

- **일별 타임라인**(DayRail): 하단 스크러버로 날짜를 이동하면 전선이 연속 보간(모핑)된다
- **전선(FrontLine)**: 날짜별 폴리라인, flubber로 부드럽게 모핑
- **이동 화살표(MovementArrow)**: 진격/공격/철수 축선
- **부대 심볼(UnitPosition)**: APP-6 스타일 군대부호, 날짜별 배치
- **사건 마커(BattleEvent)**: 클릭하면 우측 패널에 상세 서술·참전 부대·인물·출처·각주
- **브리핑 모드**: Space로 시작하는 자동 투어(날짜 인트로 → 사건 클로즈업, 타자기 자막)
- **지형**: 음영기복 래스터(WebP) + 수작업 지명·강·도로 linework

현재 **춘천–홍천 전투**(1950.6.25–7.1) 1개가 완성(`available`)돼 있고, 다부동을 포함한
15개 전투가 메타데이터만 등록된 골격(`planned`) 상태다. **이번 작업의 목표는 다부동
전투를 두 번째 `available` 전투로 완성하는 것이다.** 춘천 구현이 유일한 완성 예시이므로
**모든 판단이 애매할 때는 `src/data/battles/chuncheon/`을 모범 답안으로 삼아라.**

### 1.2 기술 스택

- React 19 + TypeScript ~6.0 + Vite 8, 상태는 zustand 단일 스토어
- 지도는 **D3 + SVG 직접 렌더링** (지도 라이브러리 없음): `d3-geo` Mercator
  `fitExtent`, `d3-zoom`, flubber(전선 모핑), framer-motion(UI)
- 라우팅은 라우터 라이브러리 없이 수제(`src/router.ts`): `/` = 전투 목록,
  `/b/:battleId?day=MMDD&event=<id>` = 전투 상황도
- PWA(서비스워커, 캐시 버전은 빌드 시 git SHA 자동 주입), Vercel 정적 배포(vercel.json)
- 린트 oxlint, 테스트 Playwright(스모크 6종), CI는 GitHub Actions
  (`.github/workflows/ci.yml`: lint → build → validate → e2e)

### 1.3 npm 스크립트

| 명령 | 용도 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | tsc 타입체크 + vite 빌드 (누락 import 전수 검출) |
| `npm run lint` | oxlint |
| `npm run validate` | **전투 데이터 무결성 검사** — 저작 중 수시로 실행하라 |
| `npm run test:e2e` | 빌드 + Playwright 스모크 (chromium 필요; 로컬 브라우저 경로는 `PLAYWRIGHT_CHROMIUM_PATH` 환경변수로 지정 가능) |
| `npm run relief:webp` | `public/relief/*.png` → WebP 일괄 변환 |

### 1.4 아키텍처 핵심 개념

```
src/
  types.ts                    ← 전 스키마 (Bbox, WarPhase, BattleMeta, BattleData,
                                 DayPhase, BattleEvent, FrontLine, MovementArrow,
                                 MilitaryUnit, TerrainPoint/Line …)
  battles/
    registry.ts               ← battleMetas(즉시 로드) + loaders(dynamic import) + loadBattle(id)
    bundle.ts                 ← makeBundle(): 파생 lookup Map(eventById, dayByDate,
                                 frontLineByDate, unitById)·briefScript·dayOrder 생성
    useBattle.ts              ← 컴포넌트용 훅: 활성 BattleBundle 반환
  data/
    battles/chuncheon/        ← ★ 완성 전투 예시 (이 구조를 그대로 복제한다)
    battles/planned.ts        ← 골격 전투 15개 메타 (다부동 포함)
    shared/                   ← 전쟁 공통 카탈로그: equipment, people, sources, media, korea
  store/useBattleStore.ts     ← loadBattle(id) 비동기 로드·세션 리셋·briefScript 진행
  components/Map/…            ← 렌더링 엔진 (이번 작업에서 원칙적으로 수정 금지)
  lib/projection.ts           ← createProjection(w, h, bbox) — meta.bbox로 자동 프레이밍
```

동작 원리 요약:

1. `registry.ts`의 `loaders`에 등록된 전투만 열 수 있다. 전투 데이터는
   `import('../data/battles/<id>')`로 **지연 로드**되어 별도 청크가 된다.
2. 로드되면 `makeBundle()`이 lookup Map과 브리핑 대본(briefScript = 날짜 인트로 +
   그날의 activeEventIds 순서)을 파생시킨다. **briefScript는 자동 생성이므로 별도
   저작이 필요 없다** — `days[].activeEventIds` 순서가 곧 브리핑 순서다.
3. 지도 프레이밍(투영), 경위선 눈금, 축척, 팬 한계, 카르투슈 문안은 전부
   `meta`(bbox·reliefBbox·cartouche)에서 **자동 유도**된다. 엔진 코드를 만질 필요 없다.
4. 전투 전환은 `key={battleId}` 리마운트로 처리되므로 상태 누수 걱정이 없다.

### 1.5 데이터 스키마 필수 이해 (`src/types.ts` 정독 필수)

- **`DayPhase`** — 타임라인의 등뼈. `date`, `label`('8.13' 형태), `headline`(그날 한 줄),
  `activeEventIds`(그날 강조 사건), `activeArrowIds`, `frontLineDate`(참조할 전선 날짜).
  ⚠️ **모든 달력일을 넣지 않는다.** 다부동처럼 긴 전역은 **주요 국면 10~12개만 선별**한다.
- **`BattleEvent`** — `id`, `date`, `time?`, `title`, `axis`(축선 구분용 자유 문자열),
  `coord [lng, lat]`, `unitIds`, `outcome('rok'|'nk'|'mixed'|'none')`, `summary`(1~2문장),
  `detail`(본 서술, 존댓말 아닌 평서형 학술 서술), `significance?`, `key?`(★ 핵심 사건).
- **`FrontLine`** — `date` + `coordinates: LngLat[]`. 인접 날짜 전선과 점 개수가 달라도
  모핑은 자동 리샘플링되지만, **전선의 진행 방향(서→동 등) 순서는 모든 날짜에서 동일**하게
  유지해야 모핑이 자연스럽다. `approx: true`로 도식화 표시 가능.
- **`MovementArrow`** — `faction('ROK'|'NK')`, `path: LngLat[]`, `style('advance'|'attack'|'withdraw')`,
  `activeFrom`(이 날짜부터 표시).
- **`MilitaryUnit`** — 전투별 스냅샷(같은 부대라도 전투마다 별도 항목). `equipmentIds`는
  `src/data/shared/equipment.ts` 카탈로그 id 참조.
- **`unitPositionsByDate`** — `Record<'YYYY-MM-DD', UnitPosition[]>`. 심볼 종류는
  `MilitaryUnit.symbol`(infantry/artillery/armor/motorized)과 echelon에서 유도된다.
- **`TerrainPoint/TerrainLine`** — 도시·고지·교량·강·도로. 좌표는 근사 linework 허용
  (`approx: true`), 1950년 당시 없던 지형(이후 댐 수몰지 등)은 `submerged1950` 메타 참조.
- **좌표계**: 항상 `[경도, 위도]` 순서 (d3-geo 관례). 절대 위도-경도 순으로 쓰지 말 것.
- **조인 테이블**(`links.ts`): `eventPeople`(사건→인물 카탈로그 id), `eventSources`(사건→출처 id).
  인물·출처·장비의 **카탈로그 본체는 `src/data/shared/`에 있고 id로만 참조**한다.
  다부동에 필요한 인물(예: 백선엽)·장비·출처가 카탈로그에 없으면 **shared에 추가**한다
  (전쟁 공통 자산이므로).
- **좌표 신뢰도 모델**(`geo.ts`): 사건마다 `confirmed`(지명·문헌으로 특정) /
  `offset`(가독성 위해 의도적 이격) / `estimated`(추정) 중 하나로 표기하고 근거 메모를 남긴다.
  UI가 추정 좌표에 점선 링을 표시한다. **학술 신뢰도의 핵심 장치이므로 성실히 작성하라.**

### 1.6 프로젝트 컨벤션

- 코드 주석·데이터 서술은 **한국어**. 기존 파일의 문체(간결한 학술 평서형, 과장 금지)를 따른다.
- id 규칙: 전투 내 유일한 kebab-case 슬러그 (예: `yuhaksan-839`, `bowling-alley`).
  춘천은 접두사 없이 썼으므로 다부동도 동일하게 하되 전투 폴더 안에서만 유일하면 된다.
- 서사는 한국어 전용(영문 번역 보류 정책). `meta.name`의 `en`만 영문 필수.
- UI 문자열을 추가할 일이 있으면 `src/i18n/strings.ts`의 `{ko, en}` 패턴을 따른다
  (이번 작업에서는 원칙적으로 불필요).
- 검증 기준: `npm run validate`가 **error 0**이어야 한다. warning은 의도된 광역
  linework 등에 한해 허용되며, 각 warning이 왜 괜찮은지 설명할 수 있어야 한다.

---

## 2부 — 작업지시: 다부동 전투 저작

### 2.0 목표와 완료 기준 (Definition of Done)

`src/data/battles/dabudong/`을 완성하여 registry에 `available`로 등록하고,
`/b/dabudong`에서 춘천과 동일한 수준의 체험(타임라인 스크럽, 전선 모핑, 사건 상세,
브리핑 투어)이 되도록 한다.

완료 기준 — 아래 전부 충족:

1. `npm run build` · `npm run lint` · `npm run validate` 모두 통과 (validate error 0)
2. `npm run test:e2e` 6종 통과 (기존 테스트가 다부동 추가로 깨지지 않아야 함 —
   특히 `tests/smoke.spec.ts`의 국면 필터 테스트는 "남침기 필터 시 다부동 카드가
   사라짐"을 확인하므로 available 전환 후에도 통과하는지 확인)
3. `/b/dabudong?day=0818` 같은 딥링크가 동작
4. 브리핑(Space) 전체 재생이 어색한 점프 없이 완주
5. 목록 페이지에서 다부동 마커가 available 스타일(이중 링 + 맥동)로 표시되고 클릭 진입
6. 사건 최소 12개 이상, 모든 key 사건에 출처(`eventSources`)와 좌표 신뢰도(`geo.ts`) 부여

### 2.1 사전 확인

- 현재 다부동 메타(`src/data/battles/planned.ts`): id `dabudong`,
  기간 `1950-08-03 ~ 1950-08-29`, marker `[128.4, 36.03]`, status `planned`.
- **기간은 사료 검증 후 조정 가능**(예: 9월 공세를 포함해 9월 중순까지 늘리는 안).
  단, 모든 데이터 날짜는 최종 `dateRange` 안에 있어야 validate를 통과한다.
  개전 전야 프롤로그성 사건은 warning으로 허용된다(춘천의 모진교 사례 참조).

### 2.2 작업 절차 (권장 순서 — BATTLE-AUTHORING.md §순서와 동일)

**STEP 1. 폴더 생성 및 meta 이관**
- `src/data/battles/dabudong/` 생성. `planned.ts`에서 다부동 항목을 **제거**하고
  `dabudong/meta.ts`로 이관·확장한다 (춘천 `meta.ts` 구조 복제):
  - `bbox`: 전투 정면을 담는 프레이밍. 왜관~다부동~군위 일대,
    대략 `sw [128.25, 35.82] ~ ne [128.75, 36.30]`에서 시작해 실제 데이터를 넣어보며 조정.
  - `reliefBbox`: bbox보다 크게(팬 여유). 래스터를 만들 경우 **래스터의 지리 범위와
    정확히 일치**해야 한다(1순위 실수 포인트).
  - `relief`: 래스터를 만들지 않는 1차 저작에서는 **필드 자체를 생략**하라.
    생략하면 TerrainLayer가 종이 배경 + 수작업 지형만으로 렌더하며 validate도 통과한다.
    (래스터 제작은 STEP 8 선택 과제)
  - `cartouche`: `{ title: '다부동 전투 상황도', en: 'BATTLE OF TABU-DONG', sub: '1950. 8. …', stamp?: … }`
    춘천 문안의 톤을 따를 것.
  - `intro`: 타이틀 스플래시 카피. 예: headline '대구를 지킨 55일' 류 — 사실에 부합하게.
  - `inset`: `{ label: '다부동' }` (인셋 미니맵 표기). `seoulFallDate`는 다부동과 무관하므로 생략.
- `status: 'available'` 전환과 `registry.ts` loader 등록
  (`dabudong: () => import('../data/battles/dabudong').then(m => m.battle)`)은
  **마지막 STEP 7에서** 한다. 그 전까지는 빌드가 깨지지 않도록 planned 상태 유지.

**STEP 2. terrain.ts — 무대 만들기**
- TerrainPoint: 대구(도시·남쪽 앵커), 왜관, 다부동, 유학산(839), 가산(902),
  수암산(519), 328고지, 천평계곡(볼링장 = Bowling Alley 별칭 메모), 왜관철교,
  낙정리·상주 방면 참고점 등.
- TerrainLine: 낙동강 본류(이 전투의 서쪽 경계, `approx: true` 도식 linework),
  대구–다부동–상주 국도(현 5번·25번 국도 축), 왜관–대구 철도.
- 고지 표고는 `meta.elevation`에 기록.

**STEP 3. units.ts + shared 카탈로그 보강**
- 국군: 제1사단(사단장 백선엽 준장)과 예하 11·12·15연대, 사단 포병.
  증원: 미 제27연대(마이켈리스)·제23연대(전차 포함), 국군 제10연대(제8사단) 등
  사료로 확인되는 증원 부대.
- 북한군: 제2군단 예하 제3·13·15사단, 제105전차사단 일부(T-34 지원).
- `equipmentIds`: shared 카탈로그(`src/data/shared/equipment.ts`)를 먼저 확인 —
  T-34/85, 105mm 곡사포 등 춘천에서 이미 등록된 장비는 재사용. M26 퍼싱, 3.5인치
  로켓포 등 다부동에서 처음 등장하는 장비는 **shared에 신규 추가**(출처·사진 크레딧은
  `media.ts`·`docs/IMAGE-SOURCES.md` 규칙 참조, 사진 없으면 텍스트 카드만).
- `src/data/shared/people.ts`에 백선엽 등 다부동 지휘관 인물 카드 추가
  (김종오처럼 기존 인물이 재등장하면 재사용).

**STEP 4. days.ts + frontlines.ts — 뼈대 (가장 중요한 저작 판단)**
- **국면 선별 10~12개** 제안(사료 검증 후 확정하라):
  1. 8.3 낙동강 방어선 전환·왜관철교 폭파 (전주곡)
  2. 8.5~8.9 북한군 8월 공세 개시, 낙동강 도하 시도
  3. 8.12~13 328고지 공방 개시 (이후 15회 주인 교체의 시작)
  4. 8.15 유학산 839고지 공방
  5. 8.18 위기 — 다부동 정면 압박·대구 시내 포탄 낙하, 정부 부산 이동
  6. 8.18~20 볼링장(Bowling Alley) 전투 — 미 27연대 야간 전차·포격전
  7. 8.21 백선엽 사단장 진두 돌격 일화(사료 확인), 전선 회복
  8. 8.24~29 8월 공세 격퇴·전선 안정
  9. (기간을 9월로 늘릴 경우) 9.2~9.8 북한군 9월 공세, 9.16 반격 전환
- 각 국면(DayPhase)마다 그 날짜의 `FrontLine`을 그린다. 전선은 낙동강-유학산-가산을
  잇는 호(弧) 형태로, 국면마다 남하/북상 변화가 보이게. **모든 전선 폴리라인은 같은
  방향(예: 서쪽 낙동강변 → 동쪽 가산)으로 그릴 것**(모핑 품질).
- `headline`은 신문 헤드라인이 아니라 상황도 주기(注記) 톤으로.

**STEP 5. events.ts + movements.ts + unitPositions.ts — 살 붙이기**
- 사건 12~20개. 각 사건: 좌표(신뢰도 표기 필수), 참전 unitIds, outcome, summary/detail.
  detail은 춘천 사건들 분량(4~8문장)과 톤을 따른다. 수치(병력·포탄 수 등)는 출처가
  분명할 때만 쓰고 `footnotes.ts`에 각주로 근거를 단다.
- movements: 북한군 3개 사단의 남진 축선(advance), 볼링장 야간 공격(attack),
  8월 말 격퇴(withdraw) 등 국면과 연동되는 화살표. `activeFrom`을 DayPhase와 맞출 것.
- unitPositions: 최소한 각 DayPhase 날짜마다 양측 주요 부대(연대급 이상) 배치.
- 춘천의 `plans.ts`(적 기도 유령 화살표)는 **다부동에 없어도 된다** — `BattleData.plans`는
  optional이며 생략 시 범례·레이어가 자동으로 숨는다. 다만 "북한군 8월 공세 기도"를
  같은 장치로 표현하면 품질이 올라간다(선택).

**STEP 6. links.ts + geo.ts + footnotes.ts + index.ts**
- `eventSources`: 모든 key 사건에 최소 1개 출처. 출처 카탈로그(`shared/sources.ts`)에
  다부동 사료 추가 — 권장: 국방부 군사편찬연구소 『6·25전쟁사』 해당 권, 육군본부
  『다부동전투』 전사, 다부동전적기념관 자료, 백선엽 회고록(『군과 나』) 등.
  **웹 검색이 가능하면 서지사항을 실제 확인하고, 불가능하면 서지 표기를 보수적으로.**
- `geo.ts`: 사건별 좌표 신뢰도 + 근거 메모 (춘천 `geo.ts` 형식 복제).
- `index.ts`: 춘천 `index.ts`를 복제해 `export const battle: BattleData` 조립.
  `plans` 미사용 시 해당 필드 생략.

**STEP 7. 등록 및 전수 검증**
- `registry.ts`에 loader 추가, meta `status: 'available'`.
- `npm run validate` → error 0 될 때까지 수정. `npm run build`, `npm run lint`,
  `npm run test:e2e` 통과 확인.
- `npm run dev`로 수동 점검: 목록→다부동 진입, 스크럽 왕복(전선 모핑 순서 꼬임 확인),
  브리핑 완주, 사건 카드 전부 열어보기, 딥링크 새로고침, 라이트/다크 테마.

**STEP 8 (선택·후속). 음영기복 래스터**
- DEM(SRTM 등) → QGIS/gdaldem hillshade → `reliefBbox`와 정확히 일치하는 범위로 클립
  → 라이트/다크 2종 PNG(~2000px 폭, 토큰 팔레트 톤 매칭) → `public/relief/`에 저장
  → `npm run relief:webp` → `meta.relief`/`meta.reliefBbox` 설정. 세부는
  BATTLE-AUTHORING.md §릴리프 파이프라인.

### 2.3 역사 골자 (저작 출발점 — 반드시 사료로 재검증할 것)

- 배경: 1950.8월 초 국군·유엔군은 낙동강 방어선(부산 교두보)으로 전환. 다부동은
  대구 북방 22km, 상주–대구 축선의 관문으로 왜관–다부동–군위를 잇는 방어선의 요충.
- 대치: 국군 제1사단(백선엽)이 정면 약 20km에서 북한군 제2군단 예하 3개 사단
  (제3·13·15사단, 병력 약 2만, T-34 지원)의 집중 공세를 받음.
- 전개: 328고지·유학산 839고지 등 고지 쟁탈이 수차례 반복(328고지 15회,
  유학산 9회 주인 교체로 널리 인용됨 — 수치는 출처 표기 필수). 8월 중순 대구에
  포탄이 떨어져 정부가 부산으로 이동. 미 제27연대가 증원되어 천평계곡 직선 도로에서
  야간 전차·포격전("볼링장 전투"). 8월 하순 공세 격퇴.
- 의의: 대구 사수로 낙동강 방어선 전체가 유지되었고, 9월 인천상륙작전 반격의
  발판이 됨. 국군 1사단과 미군의 최초 본격 연합작전 사례로 평가.
- ⚠️ 위 서술은 브리핑용 요약이다. **날짜·수치·부대 번호는 반드시 1차/공간 사료와
  대조해 확정하고, 이견이 있는 대목은 detail 서술에 병기하거나 각주 처리하라.**

### 2.4 금지·주의 사항

1. **엔진 수정 금지가 원칙**: `src/components/`, `src/lib/`, `src/store/`,
   `src/battles/`(registry 등록 제외)는 건드리지 않는다. 다부동 저작 중 엔진 결함을
   발견하면(예: DayRail이 국면 10개에서 UI가 깨짐) 데이터로 우회할 수 없는 경우에만
   최소 수정하고 커밋 메시지에 사유를 명시한다.
2. **춘천 데이터 무회귀**: `src/data/battles/chuncheon/`, `shared/` 기존 항목의 내용을
   변경하지 않는다(카탈로그 **추가**만 허용). 기존 Playwright 테스트가 그 감시자다.
3. 좌표는 반드시 `[경도, 위도]`. 다부동 일대 경도는 128.2~128.8, 위도는 35.8~36.3
   범위를 벗어나면 의심하라 (validate가 bbox 밖 좌표를 경고/오류로 잡는다).
4. 스키마(`src/types.ts`) 변경은 최후 수단. 필요하면 optional 필드 추가만.
5. 사실 과장·추정 단정 금지. 확인 안 되는 서술은 쓰지 않거나 "~로 전해진다"로
   한정하고 각주 처리.
6. 브랜치·커밋 규칙은 저장소 운영자(사용자)의 지시를 따른다. 이 브랜치
   (`claude/korean-war-battles-expansion-ml3vsz`)의 기존 커밋을 리베이스/강제 푸시로
   변경하지 말 것.

### 2.5 참조 파일 빠른 목록

| 목적 | 경로 |
|---|---|
| 스키마 전체 | `src/types.ts` |
| 완성 전투 예시(모범 답안) | `src/data/battles/chuncheon/*` |
| 저작 가이드(절차·규칙 상세) | `docs/BATTLE-AUTHORING.md` |
| 골격 메타(다부동 현재 상태) | `src/data/battles/planned.ts` |
| 레지스트리(loader 등록 위치) | `src/battles/registry.ts` |
| 공용 카탈로그 | `src/data/shared/{equipment,people,sources,media}.ts` |
| 검증 스크립트 | `scripts/validate-battles.ts` |
| 스모크 테스트 | `tests/smoke.spec.ts`, `playwright.config.ts` |
| 이미지 출처 규칙 | `docs/IMAGE-SOURCES.md` |
