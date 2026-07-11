# 춘천 1950 — 춘천·홍천 전투 인터랙티브 상황도

6.25 전쟁 초기 국군 제6사단의 춘천대첩(1950.6.25~7.1)을, 실제 지형 위에 손으로 그린
야전 작전상황도 양식으로 자유 탐색하는 웹 앱. 날짜 칩으로 그날의 전선·부대 이동을
갱신하고, 사건 마커를 눌러 전투 상세(부대·경과·결과·의의)를 본다.

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 타입체크 + 프로덕션 빌드
npm run preview  # 빌드 결과 로컬 확인
```

## 스택

- React 18+ · Vite · TypeScript
- **D3-geo + SVG** — 투영(`geoMercator.fitExtent`)·팬/줌(`d3-zoom`), 상황도 아트 완전 제어
- Zustand — `selectedDay` / `selectedEventId` / 레이어 토글 / 재생 / 테마
- 전선 모핑 — 폴리라인 리샘플·보간 자체 구현 (`src/lib/morph.ts`)

## 기능

- 날짜 칩 필터 + **▶ 브리핑** 자동 재생(4초 간격, 수동 조작 시 정지)
- 사건 마커 → 상세 패널(카메라 이동), 개요/피해/의의 패널
- **APP-6 간이 부대기호** — 날짜 선택 시 일자별 부대 위치 (`src/data/unitPositions.ts`)
- 도식 등고선/음영 기복 (`src/data/relief.ts`)
- **다크 "지휘소 콘솔" 테마** — 헤더 토글, localStorage 유지, 시스템 선호 기본값
- iOS Safari 대응: `100dvh`, safe-area, `viewport-fit=cover`, 44px 탭 타깃

## 구조

```
src/
  types.ts               # 데이터 모델 (BattleEvent, MovementArrow, FrontLine, DayPhase …)
  data/                  # P0 콘텐츠 — 부대·사건·이동·전선·일자·지형 (좌표 [lng, lat])
  lib/projection.ts      # d3 투영 + 폴리라인→path 헬퍼
  lib/morph.ts           # 전선 모핑(리샘플·lerp), reduced-motion 헬퍼
  store/useBattleStore.ts
  components/
    Map/                 # MapCanvas(zoom) · Terrain · FrontLine · Arrow · EventMarkers · Legend
    Timeline/DayRail.tsx # 날짜 칩 필터
    Panel/               # Overview(개요·피해·의의) · EventDetail · StatBar
```

## 데이터 주의

- ⚠ 표시 좌표(옥산포·가래목·고개·고지 등)는 **근사값** — 보정 환영.
- 강·도로 linework는 **1950년 지형 기준의 도식화된 근사**다. 현대 GeoJSON(OSM/NGII)은
  춘천댐·소양강댐·의암호 담수 이후라 그대로 쓰면 틀린다 (`src/data/terrain.ts` 노트 참고).
- 일부 시각적 겹침 방지를 위해 사건 마커 좌표를 실제 지점에서 미세 오프셋한 곳이 있다
  (`src/data/events.ts` 주석).

## 출처

국방부 군사편찬연구소 『6.25 전쟁사』 제2권, 한국민족문화대백과 「춘천전투」 등을
재서술. 나무위키 「춘천-홍천 전투」 참고(CC BY-NC-SA 2.0 KR — 본문 그대로 옮기지 않음).
