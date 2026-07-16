/**
 * scripts/validate-battles.ts — 전투 데이터 무결성 검증 (`npm run validate`)
 *
 * `src/battles/registry.ts`에 등록된 'available' 전투를 전수 로드해
 * 참조 무결성(id 해석)·지리 정합성(bbox/reliefBbox)·날짜 정합성(dateRange)·
 * 중복 id를 검사한다. `docs/BATTLE-AUTHORING.md`의 저작 체크리스트와 짝을 이루는
 * 안전망으로, 새 전투를 'planned' → 'available'로 승격할 때마다 돌려본다.
 *
 * 설계 원칙:
 *   - ERROR: 렌더링이 실제로 깨지거나(끊긴 참조·중복 id) 지도가 명백히 잘못
 *     그려지는(reliefBbox 밖 좌표) 문제. 종료 코드 1의 사유가 된다.
 *   - WARN: 의도적일 수 있는 경계 사례(예: 서사상 원경 지점이 주 화면 bbox
 *     밖에 있는 경우, relief 래스터가 아직 옮겨지지 않은 경우) — 저작자가
 *     확인은 해야 하지만 빌드를 막을 정도는 아니다.
 *
 * 이 스크립트는 아직 `build`에 연결돼 있지 않다(별도 CI 단계로 붙일 것).
 */

import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { battleMetas, loadBattle } from '../src/battles/registry';
import type { BattleBundle } from '../src/battles/bundle';
import type { Bbox, LngLat } from '../src/types';
import { equipmentById } from '../src/data/shared/equipment';
import { personById } from '../src/data/shared/people';
import { sourceById } from '../src/data/shared/sources';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(REPO_ROOT, 'public');

/** bbox 경계 밖이어도 이 정도(도, 위경도)까지는 "근접" 취급 — 소음 방지용 여유 */
const BBOX_TOLERANCE_DEG = 0.05;

type Level = 'ERROR' | 'WARN';

interface Issue {
  level: Level;
  msg: string;
}

class Reporter {
  issues: Issue[] = [];
  error(msg: string) {
    this.issues.push({ level: 'ERROR', msg });
  }
  warn(msg: string) {
    this.issues.push({ level: 'WARN', msg });
  }
  get errorCount() {
    return this.issues.filter((i) => i.level === 'ERROR').length;
  }
  get warnCount() {
    return this.issues.filter((i) => i.level === 'WARN').length;
  }
}

function inBbox([lng, lat]: LngLat, bbox: Bbox, margin = 0): boolean {
  return (
    lng >= bbox.sw[0] - margin &&
    lng <= bbox.ne[0] + margin &&
    lat >= bbox.sw[1] - margin &&
    lat <= bbox.ne[1] + margin
  );
}

function inDateRange(date: string, range: { start: string; end: string }): boolean {
  // 'YYYY-MM-DD' 형식이므로 문자열 비교로 충분
  return date >= range.start && date <= range.end;
}

function findDuplicateIds<T>(items: T[], idOf: (item: T) => string): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const item of items) {
    const id = idOf(item);
    if (seen.has(id)) dupes.add(id);
    seen.add(id);
  }
  return [...dupes];
}

/** 좌표 하나를 bbox(경고)·reliefBbox(오류) 기준으로 검사 — 지점형 개체(사건·지형점 등)용 */
function checkCoord(r: Reporter, label: string, coord: LngLat, bbox: Bbox | undefined, reliefBbox: Bbox | undefined) {
  if (bbox && !inBbox(coord, bbox, BBOX_TOLERANCE_DEG)) {
    r.warn(`${label} 좌표 [${coord.join(', ')}] 가 meta.bbox(+여유 ${BBOX_TOLERANCE_DEG}°) 밖입니다.`);
  }
  if (reliefBbox && !inBbox(coord, reliefBbox)) {
    r.error(`${label} 좌표 [${coord.join(', ')}] 가 meta.reliefBbox 밖입니다 — relief 래스터 범위를 벗어나 지형이 어긋나 보일 수 있습니다.`);
  }
}

/**
 * 다점 폴리라인(전선·이동 경로·지형선 등)용 검사.
 * bbox 이탈은 점 단위로 나열하면 (특히 광역 맥락용 강·도로 linework에서)
 * 소음이 커지므로 선(개체) 단위로 한 줄에 집계한다. reliefBbox 이탈은
 * 실제로 지형이 어긋나 보이는 버그일 가능성이 높으므로 점 단위로 그대로 낸다.
 */
function checkCoordsBulk(r: Reporter, label: string, coords: LngLat[], bbox: Bbox | undefined, reliefBbox: Bbox | undefined) {
  let outOfBboxCount = 0;
  coords.forEach((coord, i) => {
    if (bbox && !inBbox(coord, bbox, BBOX_TOLERANCE_DEG)) outOfBboxCount += 1;
    if (reliefBbox && !inBbox(coord, reliefBbox)) {
      r.error(`${label}.coordinates[${i}] 좌표 [${coord.join(', ')}] 가 meta.reliefBbox 밖입니다 — relief 래스터 범위를 벗어나 지형이 어긋나 보일 수 있습니다.`);
    }
  });
  if (outOfBboxCount > 0) {
    r.warn(`${label}: ${outOfBboxCount}/${coords.length}개 점이 meta.bbox(+여유 ${BBOX_TOLERANCE_DEG}°) 밖입니다 (광역 맥락용 linework라면 예상된 상태).`);
  }
}

function validateBattle(data: BattleBundle): Reporter {
  const r = new Reporter();
  const meta = data.meta;
  const { bbox, reliefBbox } = meta;

  if (meta.status === 'available' && !bbox) {
    r.error(`meta.bbox 가 없습니다 — 'available' 전투는 bbox가 필수입니다.`);
  }

  // ── days ──
  if (data.days.length === 0) {
    r.error(`days 배열이 비어 있습니다.`);
  }

  const eventIds = new Set(data.events.map((e) => e.id));
  const arrowIds = new Set(data.movements.map((m) => m.id));
  const frontLineDates = new Set(data.frontLines.map((f) => f.date));
  const unitIds = new Set(data.units.map((u) => u.id));

  const referencedEventIds = new Set<string>();

  for (const day of data.days) {
    if (!inDateRange(day.date, meta.dateRange)) {
      r.warn(`day[${day.date}] 날짜가 meta.dateRange(${meta.dateRange.start}~${meta.dateRange.end}) 밖입니다.`);
    }
    for (const eid of day.activeEventIds) {
      referencedEventIds.add(eid);
      if (!eventIds.has(eid)) {
        r.error(`day[${day.date}].activeEventIds 가 존재하지 않는 event id '${eid}' 를 참조합니다.`);
      }
    }
    for (const aid of day.activeArrowIds) {
      if (!arrowIds.has(aid)) {
        r.error(`day[${day.date}].activeArrowIds 가 존재하지 않는 movement id '${aid}' 를 참조합니다.`);
      }
    }
    if (!frontLineDates.has(day.frontLineDate)) {
      r.error(`day[${day.date}].frontLineDate '${day.frontLineDate}' 에 해당하는 FrontLine이 없습니다.`);
    }
  }

  // 어느 day에서도 참조되지 않는 event 경고
  for (const e of data.events) {
    if (!referencedEventIds.has(e.id)) {
      r.warn(`event '${e.id}' 는 어떤 day.activeEventIds 에서도 참조되지 않습니다.`);
    }
  }

  // ── events ──
  const dupEvents = findDuplicateIds(data.events, (e) => e.id);
  for (const id of dupEvents) r.error(`event id 중복: '${id}'`);

  for (const e of data.events) {
    if (!inDateRange(e.date, meta.dateRange)) {
      r.warn(`event '${e.id}' 날짜(${e.date})가 meta.dateRange(${meta.dateRange.start}~${meta.dateRange.end}) 밖입니다.`);
    }
    checkCoord(r, `event '${e.id}'`, e.coord, bbox, reliefBbox);
    for (const uid of e.unitIds) {
      if (!unitIds.has(uid)) {
        r.error(`event '${e.id}'.unitIds 가 존재하지 않는 unit id '${uid}' 를 참조합니다.`);
      }
    }
  }

  // ── units ──
  const dupUnits = findDuplicateIds(data.units, (u) => u.id);
  for (const id of dupUnits) r.error(`unit id 중복: '${id}'`);

  for (const u of data.units) {
    for (const eqid of u.equipmentIds ?? []) {
      if (!equipmentById.has(eqid)) {
        r.error(`unit '${u.id}'.equipmentIds 가 공용 장비 카탈로그에 없는 id '${eqid}' 를 참조합니다.`);
      }
    }
    if (u.parent && !unitIds.has(u.parent)) {
      r.error(`unit '${u.id}'.parent 가 존재하지 않는 unit id '${u.parent}' 를 참조합니다.`);
    }
  }

  // ── movements ──
  const dupMovements = findDuplicateIds(data.movements, (m) => m.id);
  for (const id of dupMovements) r.error(`movement id 중복: '${id}'`);

  for (const m of data.movements) {
    if (!inDateRange(m.activeFrom, meta.dateRange)) {
      r.warn(`movement '${m.id}'.activeFrom(${m.activeFrom})이 meta.dateRange 밖입니다.`);
    }
    checkCoordsBulk(r, `movement '${m.id}'.path`, m.path, bbox, reliefBbox);
  }

  // ── frontLines ──
  const dupFrontLines = findDuplicateIds(data.frontLines, (f) => f.date);
  for (const id of dupFrontLines) r.error(`frontLine 날짜 중복: '${id}'`);

  for (const f of data.frontLines) {
    if (!inDateRange(f.date, meta.dateRange)) {
      r.warn(`frontLine[${f.date}] 날짜가 meta.dateRange 밖입니다.`);
    }
    checkCoordsBulk(r, `frontLine[${f.date}].coordinates`, f.coordinates, bbox, reliefBbox);
  }

  // ── unitPositionsByDate ──
  for (const [date, positions] of Object.entries(data.unitPositionsByDate)) {
    if (!inDateRange(date, meta.dateRange)) {
      r.warn(`unitPositionsByDate['${date}'] 날짜가 meta.dateRange 밖입니다.`);
    }
    for (const pos of positions) {
      if (!unitIds.has(pos.unitId)) {
        r.error(`unitPositionsByDate['${date}'] 가 존재하지 않는 unit id '${pos.unitId}' 를 참조합니다.`);
      }
      checkCoord(r, `unitPositionsByDate['${date}'][${pos.unitId}]`, pos.coord, bbox, reliefBbox);
    }
  }

  // ── terrain ──
  // terrainPoints는 개전 무대 밖 "광역 맥락" 지명(서울·원주·충주 등, 팬 시 노출)을
  // 의도적으로 다수 포함하므로, bbox 이탈은 점별로 나열하지 않고 한 줄로 집계한다.
  const dupTerrainPoints = findDuplicateIds(data.terrainPoints, (t) => t.id);
  for (const id of dupTerrainPoints) r.error(`terrainPoint id 중복: '${id}'`);
  const terrainPointsOutOfBbox: string[] = [];
  for (const t of data.terrainPoints) {
    if (bbox && !inBbox(t.coord, bbox, BBOX_TOLERANCE_DEG)) terrainPointsOutOfBbox.push(t.id);
    if (reliefBbox && !inBbox(t.coord, reliefBbox)) {
      r.error(`terrainPoint '${t.id}' 좌표 [${t.coord.join(', ')}] 가 meta.reliefBbox 밖입니다.`);
    }
  }
  if (terrainPointsOutOfBbox.length > 0) {
    r.warn(
      `terrainPoints: ${terrainPointsOutOfBbox.length}/${data.terrainPoints.length}개가 meta.bbox(+여유 ${BBOX_TOLERANCE_DEG}°) 밖입니다 (광역 맥락 지명이라면 예상된 상태): ${terrainPointsOutOfBbox.join(', ')}`,
    );
  }

  const dupTerrainLines = findDuplicateIds(data.terrainLines, (t) => t.id);
  for (const id of dupTerrainLines) r.error(`terrainLine id 중복: '${id}'`);
  for (const t of data.terrainLines) {
    checkCoordsBulk(r, `terrainLine '${t.id}'.coordinates`, t.coordinates, bbox, reliefBbox);
  }

  // ── plans (선택 필드 — 방어적으로 optional chaining) ──
  const planArrows = data.plans?.arrows ?? [];
  const dupPlanArrows = findDuplicateIds(planArrows, (p) => p.id);
  for (const id of dupPlanArrows) r.error(`plan arrow id 중복: '${id}'`);
  for (const p of planArrows) {
    checkCoordsBulk(r, `plan arrow '${p.id}'.path`, p.path, bbox, reliefBbox);
  }

  // ── eventPeople / eventSources 조인 ──
  for (const [eid, people] of Object.entries(data.eventPeople ?? {})) {
    if (!eventIds.has(eid)) {
      r.warn(`eventPeople 의 키 '${eid}' 가 존재하지 않는 event id 입니다.`);
    }
    for (const pid of people) {
      if (!personById.has(pid)) {
        r.error(`eventPeople['${eid}'] 가 공용 인물 카탈로그에 없는 id '${pid}' 를 참조합니다.`);
      }
    }
  }

  for (const [eid, srcs] of Object.entries(data.eventSources ?? {})) {
    if (!eventIds.has(eid)) {
      r.warn(`eventSources 의 키 '${eid}' 가 존재하지 않는 event id 입니다.`);
    }
    for (const sid of srcs) {
      if (!sourceById.has(sid)) {
        r.error(`eventSources['${eid}'] 가 공용 출처 카탈로그에 없는 id '${sid}' 를 참조합니다.`);
      }
    }
  }

  // ── relief 래스터 파일 존재 ──
  // NOTE: 스펙상 "누락 시 오류"이지만, 현재 저장소는 A8(에셋 재배치:
  // public/relief-*.png → public/relief/<id>-*.png)이 아직 반영되지 않았고
  // 이 스크립트의 쓰기 범위는 scripts/·docs/·package.json 뿐이라 자산을
  // 직접 옮길 수 없다. 그래서 지금은 WARN으로 낮춰 두되, A8이 landed되면
  // (아래 조건을 ERROR로 되돌리면) 이후엔 진짜 오탈자/누락을 잡아준다.
  if (meta.relief) {
    for (const [tone, rel] of Object.entries(meta.relief)) {
      const abs = path.join(PUBLIC_DIR, rel.replace(/^\//, ''));
      if (!existsSync(abs)) {
        r.warn(
          `meta.relief.${tone} = '${rel}' 파일이 public/ 아래에 없습니다 (${path.relative(REPO_ROOT, abs)}). ` +
            `A8(에셋 재배치)이 아직 반영되지 않았다면 예상된 상태입니다 — 반영 후에도 계속 뜨면 실제 누락입니다.`,
        );
      }
    }
  }

  return r;
}

async function main() {
  const available = battleMetas.filter((m) => m.status === 'available');

  if (available.length === 0) {
    console.log('검증할 available 전투가 없습니다.');
    process.exit(0);
  }

  let totalErrors = 0;
  let totalWarns = 0;

  for (const meta of available) {
    console.log(`\n=== ${meta.id} (${meta.name.ko}) ===`);
    let bundle: BattleBundle;
    try {
      bundle = await loadBattle(meta.id);
    } catch (e) {
      console.log(`  [ERROR] 로드 실패: ${(e as Error).message}`);
      totalErrors += 1;
      continue;
    }

    const r = validateBattle(bundle);
    if (r.issues.length === 0) {
      console.log('  이상 없음.');
    } else {
      for (const issue of r.issues) {
        console.log(`  [${issue.level}] ${issue.msg}`);
      }
    }
    console.log(`  — ${r.errorCount} error(s), ${r.warnCount} warning(s)`);
    totalErrors += r.errorCount;
    totalWarns += r.warnCount;
  }

  console.log(`\n총 ${available.length}개 전투 검증 — ${totalErrors} error(s), ${totalWarns} warning(s)`);

  if (totalErrors > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
