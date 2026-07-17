import { test, expect } from '@playwright/test';

/**
 * 스모크 테스트 — 핵심 사용자 흐름이 프로덕션 빌드에서 깨지지 않는지 확인.
 * 결정성을 위해 온보딩 오버레이(TitleIntro·Coachmarks)를 localStorage로 미리
 * '본 것'으로 씨딩하고 언어를 ko로 고정한다(안정적 셀렉터).
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('kwatlas-lang', 'ko');
      localStorage.setItem('kwatlas-theme', 'light');
      localStorage.setItem('kwatlas-onboarded', '1');
      localStorage.setItem('kwatlas-introseen:chuncheon', '1');
      localStorage.setItem('kwatlas-introseen:dabudong', '1');
    } catch {
      /* localStorage 불가 환경 무시 */
    }
  });
});

test('index loads: header, map, cards, phase filter', async ({ page }) => {
  await page.goto('/');

  // 헤더 제목
  await expect(page.locator('.app-title')).toHaveText('6·25 전쟁 전투 상황도');

  // 목록 지도 SVG
  await expect(page.locator('.index-map-svg')).toBeVisible();

  // 전투 카드 ≥ 16
  const cards = page.locator('.index-card');
  expect(await cards.count()).toBeGreaterThanOrEqual(16);

  // 국면 필터: 남침기(invasion) 클릭 → 비(非)남침기 카드 숨김
  await expect(page.locator('.index-card-name', { hasText: '다부동 전투' })).toBeVisible();
  await page.locator('.index-filter-chip--invasion').click();
  await expect(page.locator('.index-card-name', { hasText: '다부동 전투' })).toHaveCount(0);
  // 남침기 카드(춘천)는 계속 보인다
  await expect(page.locator('.index-card-name', { hasText: '춘천–홍천 전투' })).toBeVisible();
});

test('navigate: available card opens battle view', async ({ page }) => {
  await page.goto('/');

  await page.locator('.index-card', { hasText: '춘천' }).click();

  await expect(page).toHaveURL(/\/b\/chuncheon/);
  // 지도 렌더 + DayRail
  await expect(page.locator('.map-canvas-wrap svg').first()).toBeVisible();
  await expect(page.locator('.day-rail')).toBeVisible();
});

test('deep link: day + event restores the event detail panel', async ({ page }) => {
  await page.goto('/b/chuncheon?day=0627&event=garaemok');

  // 사건 상세 패널 + 사건 제목(가래목 대포격전)
  await expect(page.locator('.panel-title')).toContainText('가래목 대포격전');
});

test('dabudong mobile deep link renders map and event detail', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/b/dabudong?day=0818&event=bowling-alley-opening');

  await expect(page.locator('.map-canvas-wrap svg').first()).toBeVisible();
  await expect(page.locator('.day-rail')).toBeVisible();
  await expect(page.locator('.panel-title')).toContainText('미 제27연대 반격 개시');
  await expect(page).toHaveURL(/\/b\/dabudong\?day=0818&event=bowling-alley-opening/);
});

test('legacy redirect: /?day=&event= becomes /b/chuncheon', async ({ page }) => {
  await page.goto('/?day=0627&event=garaemok');

  await expect(page).toHaveURL(/\/b\/chuncheon/);
  await expect(page.locator('.panel-title')).toContainText('가래목 대포격전');
});

test('unknown battle id shows not-found notice', async ({ page }) => {
  await page.goto('/b/nonexistent');

  await expect(page.locator('.battle-notice-title')).toHaveText('해당 전투를 찾을 수 없습니다');
  await expect(page.locator('.battle-notice-id')).toContainText('nonexistent');
  // URL은 /b/:id 그대로 유지 (자동 이동 없음)
  await expect(page).toHaveURL(/\/b\/nonexistent/);
});

test('keyboard: ArrowRight advances the day', async ({ page }) => {
  await page.goto('/b/chuncheon');

  await expect(page.locator('.day-rail')).toBeVisible();
  // 초기엔 day 파라미터 없음('전체')
  await expect(page).not.toHaveURL(/day=/);

  // 새 로드 직후 포커스는 body(입력 요소 아님) → 전역 키 핸들러가 처리
  await page.keyboard.press('ArrowRight');

  // 첫 날짜(6.25)로 이동 → URL에 day=0625
  await expect(page).toHaveURL(/day=0625/);
});
