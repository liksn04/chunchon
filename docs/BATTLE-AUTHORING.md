# 전투 저작 가이드 — 새 전투를 추가하는 방법

이 문서는 `src/data/battles/<id>/` 아래에 새 전투 하나를 처음부터 완성해
`planned` → `available` 로 승격하기까지의 절차를 다룬다. 엔진(지도·타임라인·
브리핑·모핑)은 이미 데이터 주도로 짜여 있으므로, 전투 콘텐츠 하나를 추가하는
작업은 대부분 **이 디렉터리 안의 TypeScript 데이터 파일을 채우는 일**이다.
춘천–홍천(`src/data/battles/chuncheon/`)이 참고할 완결 예시다 — 막히면 그
디렉터리를 열어 대응 파일을 보라.

타입의 단일 출처는 `src/types.ts`다. 이 문서의 필드 설명은 그 타입 정의를
요약한 것이므로, 최종 진실은 항상 `types.ts` 쪽을 따른다.

## 0. 큰 그림 — 데이터가 조립되는 방식

```
src/battles/registry.ts        # battleMetas(eager) + id → loader(lazy) 맵
        │
        ├─ meta만 등록  → status: 'planned'  (목록에 "준비 중"으로만 노출)
        └─ loader 등록 → status: 'available' (전투 진입 가능)
                                │
                                ▼
        src/data/battles/<id>/index.ts   # BattleData 조립 (dynamic import 진입점)
                                │
                                ▼
        src/battles/bundle.ts  makeBundle()   # eventById 등 lookup·briefScript 파생
```

`registry.ts`와 `index.ts` 둘 다 이 저장소에서 내가 직접 건드릴 파일이 아니라면
(다른 에이전트가 `src/`를 리팩터링 중일 수 있다) 등록 절차만 알아두고 실제
편집은 조율해서 진행한다. 평상시 새 전투 작업은 §6에서 다룬다.

## 1. 디렉터리 템플릿과 파일별 설명

```
src/data/battles/<id>/
  meta.ts           # BattleMeta — 목록 카드·라우팅·프레이밍의 단일 출처
  days.ts           # DayPhase[] — 날짜 칩 순서, 그날 보여줄 사건/화살표/전선
  frontlines.ts      # FrontLine[] — 날짜별 전선 폴리라인 (모핑 대상)
  events.ts          # BattleEvent[] — 사건 마커 + 상세 패널 서술
  movements.ts        # MovementArrow[] — 부대 이동 화살표
  units.ts            # MilitaryUnit[] — 부대 카드 (전투 스냅샷)
  unitPositions.ts    # UnitPosition[] (날짜별) — APP-6 간이 부대기호 레이어
  terrain.ts           # TerrainPoint[] / TerrainLine[] — 지명·산·강·도로
  geo.ts                # CoordNote — 좌표 신뢰도 노트 (§3)
  footnotes.ts           # Footnote[] — 사건 서술 속 개별 주장의 고증 각주
  links.ts                # eventPeople / eventSources — 공용 카탈로그 조인 테이블
  plans.ts (선택)          # PlanArrow[] — "무산된 계획선" 같은 연출용 부가 레이어
  index.ts                 # 위 전부를 BattleData로 조립 (dynamic import 진입점)
```

전투에 계획선 연출이 필요 없다면 `plans.ts`는 만들지 않아도 된다 — `BattleData.plans`는
`optional`이다(춘천 전용 기능이 일반 스키마로 남은 흔적). `index.ts`에서 그냥 필드를
비우면 된다.

### 권장 저작 순서

파일을 알파벳 순으로 채우지 말 것. 아래 순서가 "먼저 확정해야 뒤가 편해지는" 의존
관계를 따른다.

1. **`meta.ts`** — `status: 'planned'`로 먼저 만든다. `id`·`name`·`phase`·`dateRange`·
   `marker`·`summary`만 있으면 목록 페이지에 뜬다. `bbox`/`relief`는 나중(§5)에 채운다.
2. **`days.ts`의 날짜 뼈대** — 이 전투가 다룰 날짜들과 각 날의 한 줄 `headline`만
   먼저 정한다(`activeEventIds` 등은 비워 둬도 됨). 장기전이면 §2를 먼저 읽는다.
3. **`terrain.ts`** — 지명·고개·강줄기를 좌표와 함께 박아 둔다. 이후 사건·화살표
   좌표를 잡을 때 지형 위에 정박시키는 기준점이 된다.
4. **`units.ts`** — 참전 부대 목록. 인물·장비는 아직 텍스트 필드(`commander`,
   `equipment`)로만 채워도 된다.
5. **`events.ts`** — 사건 하나하나. 이 단계에서 좌표 신뢰도를 판단하며 §3의
   워크플로를 따른다.
6. **`frontlines.ts`** — 날짜별 전선. `events.ts`에서 잡은 요충 좌표를 지나가도록
   그린다.
7. **`movements.ts`** — 화살표. 시작점·경유점·종점을 `terrain.ts`/`events.ts` 좌표에
   맞춘다.
8. **`unitPositions.ts`** — 날짜별 부대 위치. `events.ts`를 다 쓴 뒤라 "그날 이 부대가
   대략 어디 있었는지" 감이 잡혀 있을 때가 편하다.
9. **`geo.ts`(좌표 신뢰도)·`footnotes.ts`(고증 각주)** — 사건 서술을 쓰면서 발견한
   불확실성·이견을 정리한다.
10. **`links.ts`** — 사건 ↔ 공용 인물/출처 카탈로그 조인. §7에서 다룬다.
11. **`index.ts`** — 전부 조립.
12. **`days.ts`의 나머지** — `activeEventIds`/`activeArrowIds`/`frontLineDate`를
    채워 넣어 날짜 칩을 완성한다.
13. `meta.ts`를 `status: 'available'`로 승격하고 `bbox`/`relief`를 채운다(§5, §6).
14. `npm run validate` 통과 확인.

### 필드 의미 (요약 — 원본은 `src/types.ts`)

- **`BattleMeta`**
  - `id`: URL 슬러그 겸 자산 경로 겸 스토리지 키(§2 규칙).
  - `dateRange`: 이 전투 화면이 다루는 날짜 구간. `DayPhase`·`BattleEvent`·
    `FrontLine`·`MovementArrow.activeFrom`이 원칙적으로 이 안에 들어야 한다
    (전조·후일담처럼 의도적으로 살짝 벗어나는 서사적 예외는 있을 수 있다 —
    `npm run validate`가 이런 경우를 WARN으로만 표시하는 이유다).
  - `bbox`: 지도 뷰포트. `available`이면 필수.
  - `reliefBbox`: relief 래스터가 실제로 덮는 지리 범위. `bbox`보다 넉넉하게
    잡아 팬 시에도 래스터가 잘리지 않게 한다(§5).
  - `cartouche`/`intro`: 지도 장식 문안·타이틀 카피 데이터화.
- **`DayPhase`**: 날짜 칩 하나 = 그날의 `headline` + 활성화할 `activeEventIds`/
  `activeArrowIds` + 그릴 `frontLineDate`(다른 날짜의 FrontLine을 재활용해도 됨).
- **`BattleEvent`**: `axis`는 이제 전투마다 자유로운 문자열(전투 내부 축선 이름).
  `key: true`는 브리핑에서 강조되는 "결정적 순간" 표시.
- **`MilitaryUnit`**: `equipmentIds`/(사람은 events 단위로 `links.ts`에서 연결,
  unit에는 인물 필드 없음) 는 공용 카탈로그 id 참조, `equipment`는 사람이 읽는
  텍스트 요약 — 병기 카탈로그가 없어도 채울 수 있는 폴백.
- **`TerrainPoint.meta.submerged1950`/`uncertain`**: §4 참고.

## 2. id 규칙

- **전투 id**: 소문자 슬러그, 예 `dabudong`, `jangjinho`. `registry.ts`의 키,
  `public/relief/<id>-*.png` 경로, localStorage 키(`kwatlas-introseen:<id>`)로
  그대로 쓰인다 — 나중에 바꾸면 세 곳을 다 고쳐야 하니 처음에 정한다.
- **사건/부대/화살표/지형 id**: `<slug>` 형태(하이픈 구분, 전투 접두어 없이)로
  **전투 내부에서만 유일**하면 된다. 여러 전투가 데이터를 공유하지 않고 전부
  dynamic import로 독립 로드되므로 전투 간 id 충돌은 문제되지 않는다. 다만 같은
  전투 안에서 `events`/`units`/`movements`/`terrainPoints`/`terrainLines`는 각각
  독립된 네임스페이스이므로(예: 사건 id `oksanpo`와 지형점 id `oksanpo`가 공존
  가능) 헷갈리지 않게 가급적 겹치지 않는 이름을 쓴다.
- 공용 카탈로그(§7)를 참조하는 id(`equipmentIds`, `eventPeople`/`eventSources`의
  값)는 전투 접두어 없이 카탈로그 쪽 id를 그대로 쓴다 — 예: `su-76`, `kim-jongo`.

## 3. `DayPhase` 큐레이션 — 장기전은 "선별"이 원칙

춘천–홍천처럼 7일짜리 전투는 날짜별 `DayPhase`를 하루하루 다 만들면 된다.
하지만 다부동(~55일)처럼 몇 주~몇 달짜리 방어전은 **매일을 만들지 않는다.**
날짜 칩 UI와 브리핑 투어는 "국면 전환점" 단위로 설계돼 있으므로:

- **선별된 주요 국면 10~12개**를 고른다 — 공세 개시, 요충 피탈/탈환, 결정적
  반격, 전투 종료 같은 전환점.
- 하나의 `DayPhase.date`가 반드시 달력상 하루일 필요는 없다. 여러 날에 걸친
  국면을 대표 날짜 하나에 묶고 `headline`에서 기간을 명시해도 된다
  (예: `headline: '8.18~8.20 다부동 돌파 위기'`).
- `FrontLine`은 `DayPhase`보다 촘촘해도 된다 — 스크러버 연속 보간이 날짜
  사이를 자연스럽게 잇는다. `DayPhase`가 성긴 것과 전선 데이터의 밀도는
  별개다.
- 무리해서 다 담으려 하지 말 것. 이 앱의 서사 단위는 "그날 무슨 일이 있었나"가
  아니라 "이 국면에서 무엇이 갈렸나"다.

## 4. 좌표 소싱 워크플로와 신뢰도 모델

### 신뢰도 3단계 (`geo.ts` 참고 — `src/data/battles/chuncheon/geo.ts`)

새 사건 좌표를 잡을 때마다 `CoordNote`를 하나씩 남긴다:

```ts
export type CoordConfidence = 'confirmed' | 'offset' | 'estimated';
```

- **`confirmed`**: 현존 지형지물(고개·산정·시가지)에 정박한 확정 위치.
- **`offset`**: 실제 위치는 알려졌지만 마커·라벨 겹침 방지를 위해 표시상
  미세 이동한 경우.
- **`estimated`**: 수몰·행정구역 개편·사료 이견으로 정확 지점이 불명 — 최선의
  근사. `basis`에 "무엇에 근거해 이 좌표를 골랐는지"를 문장으로 남긴다.

`confidence !== 'confirmed'`인 사건은 지도 위에 근사 표시(⚠ 배지 등)의 대상이
된다 — `chuncheon`의 `approxCoordIds` 처럼 전투마다 파생시켜도 된다.

### 소싱 순서 (권장)

1. 국립지리원(NGII) 지명·고도 데이터, 카카오/네이버 지도의 현재 지명으로
   1차 좌표를 잡는다.
2. 전사(戰史) 서술에서 "OO면 OO리", "OO고개" 같은 행정지명을 읽고 위 지도에서
   대조한다.
3. 여러 사료가 다른 지점을 가리키면 `estimated`로 내리고 `basis`에 이견을
   기록한다 — 없애지 말고 남긴다(§8 각주와 연동).
4. 마커·라벨이 겹치면 좌표를 억지로 벌리지 말고, 실제 좌표는 유지한 채
   `offset`으로 표시상만 옮긴 뒤 그 사실을 `basis`에 밝힌다.

### 1950년대 지형 캐벗 — "지금 지도를 그대로 쓰면 틀린다"

한국 전쟁 이후 대형 댐·저수지가 다수 조성됐다. **현대 위성지도·OSM 하천망을
그대로 베끼면 1950년에는 없던 호수가 생긴다.** 춘천 사례(`terrain.ts` 주석
참고):

- 춘천댐(1965)·소양강댐(1973)·의암호 담수로 북한강·소양강 하안선이 크게
  바뀌었다. 모진교처럼 **다리 자체가 수몰**된 경우도 있다 — 이런 지점은
  `TerrainPoint.meta.submerged1950 = true`로 표시하고 좌표는 `estimated`로
  내린다.
- 강·도로 linework는 정밀 GeoJSON이 아니라 **손으로 그린 도식화 근사**
  (`TerrainLine.approx: true`)로 충분하다 — 이 앱은 야전 상황도 미감을
  지향하지, 측량도가 아니다. 정밀 보정이 필요하면 OSM Overpass
  (`waterway=river`)나 NGII 하천망도를 1950년 지형 기준으로 편집해 교체한다.
- 새 전투 지역에 비슷한 담수 시설이 있는지(다부동 인근 낙동강 보 등) 먼저
  확인하고, 있다면 같은 방식으로 `submerged1950`/`estimated`를 붙인다.

## 5. Relief 래스터 파이프라인

지형 음영(hillshade) 배경은 코드가 아니라 **PNG 두 장**으로 공급한다. 손으로
그린 벡터 산괴(`relief.ts`의 `ReliefMassif` — "래스터가 없는 전투용 폴백"으로
보존된 소재)와 달리, DEM 기반 래스터가 있으면 훨씬 사실적이다.

### 절차

1. **DEM 확보** — SRTM 30m 또는 국내 오픈 DEM(국토정보플랫폼)에서 전투 지역
   `reliefBbox` 예정 범위를 다운로드.
2. **Hillshade 생성** — QGIS(래스터 → 분석 → 음영기복) 또는 GDAL:
   ```bash
   gdaldem hillshade dem.tif hillshade.tif -z 2 -az 315 -alt 45
   ```

   > **지름길 — `npm run relief:make <battle-id>`**: GIS 없이도 위 1~4단계를
   > 한 번에 수행하는 스크립트가 있다. AWS 공개 표고 타일(terrarium, z12)을
   > `meta.reliefBbox` 범위로 수집해 Horn 힐셰이드를 계산하고, 춘천 래스터의
   > 명암 팔레트를 샘플링해 라이트/다크 PNG를 `public/relief/`에 출력한다
   > (웹 메르카토르 타일이므로 reliefBbox와 자동 정합). 출력 후
   > `npm run relief:webp` → `meta.relief` 연결 순서는 동일하다. 다부동
   > 래스터가 이 방식으로 제작되었다. 더 높은 해상도·수체 마스킹 등이
   > 필요할 때만 아래 GIS 수동 절차를 쓰면 된다.
3. **톤 매칭 — 라이트/다크 두 벌** — 앱은 테마 토글이 있으므로 각 테마에 맞는
   버전을 따로 만든다. 배경색은 `src/styles/tokens.css`의 `--map-buff`
   팔레트에 맞춘다:
   - 라이트: `#e4dec9` 계열(종이 베이지) 위에 음영을 얹는다.
   - 다크: `#131a24` 계열(지휘소 콘솔 남색) 위에 음영을 얹는다.
   두 PNG는 같은 지리 범위·같은 해상도로, 명도/채도만 테마에 맞게 보정한다.
4. **해상도** — 가로 약 2000px 기준(그 이상은 페이로드만 늘고 체감 차이가
   작다). PNG는 반투명(알파) 배경으로 내보내 지도 종이 질감과 자연스럽게
   섞이게 한다.
5. **파일 배치 및 WebP 변환** — GIS에서 내보낸 PNG를 우선
   `public/relief/<id>-light.png`, `public/relief/<id>-dark.png`로 둔 다음
   ```bash
   npm run relief:webp
   ```
   를 실행한다 — `public/relief/` 안의 모든 `*.png`를 같은 이름의 `.webp`
   (quality ~82)로 변환한다(용량 약 93% 절감, 육안 화질 차이 없음). 원본
   PNG는 스크립트가 지우지 않으므로 결과를 확인한 뒤 직접
   `git rm public/relief/<id>-{light,dark}.png`로 정리한다. `meta.ts`에는
   **`.webp` 경로**로 등록한다:
   ```ts
   relief: {
     light: '/relief/<id>-light.webp',
     dark: '/relief/<id>-dark.webp',
   },
   ```

### ⚠️ 1순위 실수 — `reliefBbox`는 래스터의 실제 지리 범위와 "정확히" 일치해야 한다

`TerrainLayer`는 `meta.reliefBbox`가 가리키는 사각형에 PNG를 그대로 늘려
붙인다. **`reliefBbox`가 실제로 내보낸 래스터의 지리 범위(DEM/hillshade
export 시 지정한 extent)와 조금이라도 다르면, 산등성이가 실제 좌표와 어긋나
보인다** — 고개는 평지에, 봉우리는 계곡에 얹히는 식으로. 이 오차는 눈으로
바로 티가 나지 않을 수도 있어(전체적으로는 "산처럼 보이므로") 특히 위험하다.

체크리스트:
- QGIS/GDAL에서 내보낼 때 사용한 extent(좌표)를 **그대로 복사해서**
  `reliefBbox.sw`/`reliefBbox.ne`에 붙여넣는다 — 눈대중으로 다시 입력하지
  않는다.
- `reliefBbox`는 `bbox`(뷰포트)를 완전히 포함해야 팬 시 래스터가 잘리지
  않는다 — 보통 `bbox`보다 사방으로 여유를 둔다(춘천은 약 1° 여유).
- `npm run validate`는 각종 좌표가 `reliefBbox` 밖이면 ERROR로 잡아준다 —
  이건 좌표 데이터가 래스터 범위를 벗어났다는 뜻이지 `reliefBbox` 자체가
  잘못 기록됐다는 뜻은 아니다. **`reliefBbox` 오기 자체(래스터 extent와
  다르게 옮겨 적은 실수)는 지금 스크립트가 감지할 수 없다** — 반드시 화면에
  띄워 놓고 지형지물(고개·산정)이 실제 위치에 겹치는지 눈으로 대조한다.

## 6. 레지스트리 등록 — planned → available 승격

### 1단계: planned로 골격만 등록

```ts
// src/battles/registry.ts
import { newBattleMeta } from '../data/battles/<id>/meta';

export const battleMetas: BattleMeta[] = [chuncheonMeta, newBattleMeta, ...];
```

`meta.ts`는 `status: 'planned'`, `bbox`/`relief` 없이도 된다 — 목록 페이지에
"준비 중" 카드로 뜬다. `loaders`에는 아직 아무것도 추가하지 않는다(로더가
없으면 `planned`로 남는다).

### 2단계: available로 승격

콘텐츠(§1의 13단계까지)가 끝나면:

1. `meta.ts`의 `status`를 `'available'`로, `bbox`/`relief`를 채운다.
2. `registry.ts`의 `loaders`에 추가:
   ```ts
   const loaders: Record<string, () => Promise<BattleData>> = {
     chuncheon: () => import('../data/battles/chuncheon').then((m) => m.battle),
     '<id>': () => import('../data/battles/<id>').then((m) => m.battle),
   };
   ```
3. `npm run validate` 실행 — ERROR가 0이어야 승격 완료. WARN은 읽어보고
   의도된 것(광역 맥락 지명, 서사적 전후 여백 등)인지 확인만 한다.
4. 실제 화면에서 확인: 날짜 스크럽·브리핑 투어·레이어 토글·테마 전환까지
   한 바퀴 돌려본다 — 검증 스크립트는 "데이터가 스스로 앞뒤가 맞는지"만
   보고, 실제로 보기 좋은지는 보지 않는다.

## 7. 공용 카탈로그 — shared vs 전투 로컬

`src/data/shared/`는 **전쟁 전체 공통** 자산이다. 인물 하나(김종오)가
춘천에도 백마고지에도 등장할 수 있으므로, "누구인지/무엇인지"는 공용에,
"이 전투에서 어떤 역할을 했는지"는 전투 로컬에 둔다.

| 무엇 | 어디 | 이유 |
|---|---|---|
| 인물 약력(`Person`) | `shared/people.ts` | 여러 전투에 걸쳐 등장 가능 |
| 사건 ↔ 인물 매핑(`eventPeople`) | 전투 로컬 `links.ts` | "이 사건에 누가 관여했나"는 전투마다 다름 |
| 장비 제원(`Equipment`) | `shared/equipment.ts` | T-34·SU-76 등은 여러 전투 공통 장비 |
| 부대의 장비 보유(`MilitaryUnit.equipmentIds`) | 전투 로컬 `units.ts` | 장비 id만 참조 |
| 사료 출처(`Source`) | `shared/sources.ts` | 같은 문헌(『6.25 전쟁사』 등)을 여러 전투가 인용 |
| 사건 ↔ 출처 매핑(`eventSources`) | 전투 로컬 `links.ts` | 사건별로 다름 |
| 부대 자체(`MilitaryUnit`) | **전투 로컬** `units.ts` | 같은 6사단이어도 전투마다 전력·역할 서술이 다르므로 스냅샷을 공유하지 않는다 |
| 이미지 출처 메타(`ImageCredit`) | `shared/media.ts`의 타입만 공용, 실제 항목은 `people.ts`/`equipment.ts` 안에 | — |
| 한반도 외곽선 등 지리 상수 | `shared/korea.ts` | 인셋 미니맵 등 전투 무관 공통 소재 |

새 인물/장비/출처가 필요할 때 판단 기준: **"이 항목이 다른 전투에도 나올
수 있는가?"** — 그렇다면 공용에 추가하고 전투 쪽에서는 id로만 참조한다.
이미 그 인물/장비가 공용에 있다면(예: T-34, 흔한 지휘관) 새로 만들지 말고
기존 id를 재사용한다 — `personById`/`equipmentById`/`sourceById`
(각 `shared/*.ts`의 export)로 기존 id 목록을 먼저 확인한다.

## 8. 마무리 체크리스트

- [ ] `npm run validate` — ERROR 0
- [ ] `days`가 비어 있지 않고, 각 날짜가 사건 최소 하나 또는 뚜렷한 헤드라인을
      가진다
- [ ] 모든 사건에 `geo.ts`의 `CoordNote`가 있다 (confirmed가 아니면 필수)
- [ ] 근거가 갈리는 수치·주장은 `footnotes.ts`에 남겼다
- [ ] `reliefBbox`를 래스터 export extent와 눈으로 대조했다(§5)
- [ ] 화면에서 날짜 스크럽 · 브리핑 투어 · 레이어 토글 · 테마 전환을 한 번씩
      확인했다
