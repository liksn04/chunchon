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

  await expect(page.locator('.app-title')).toHaveText('6·25 전쟁 전투 상황도');
  await expect(page.locator('.index-map-svg')).toBeVisible();

  const cards = page.locator('.index-card');
  expect(await cards.count()).toBeGreaterThanOrEqual(16);

  await expect(page.locator('.index-card-name', { hasText: '다부동 전투' })).toBeVisible();
  await page.locator('.index-filter-chip--invasion').click();
  await expect(page.locator('.index-card-name', { hasText: '다부동 전투' })).toHaveCount(0);
  await expect(page.locator('.index-card-name', { hasText: '춘천–홍천 전투' })).toBeVisible();
});

test('navigate: available card opens battle view', async ({ page }) => {
  await page.goto('/');
  await page.locator('.index-card', { hasText: '춘천' }).click();

  await expect(page).toHaveURL(/\/b\/chuncheon/);
  await expect(page.locator('.map-canvas-wrap svg').first()).toBeVisible();
  await expect(page.locator('.day-rail')).toBeVisible();
});

test('deep link: day + event restores the event detail panel', async ({ page }) => {
  await page.goto('/b/chuncheon?day=0627&event=garaemok');
  await expect(page.locator('.panel-title')).toContainText('가래목 대포격전');
});

test('dabudong overview uses battle-specific panel and restrained labels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/b/dabudong');

  await expect(page.locator('.map-canvas-wrap svg').first()).toBeVisible();
  await expect(page.locator('.panel-title')).toHaveText('다부동 전투');
  await expect(page.locator('.fact-table')).toContainText('국군 제1사단');
  await expect(page.locator('.panel-inner')).not.toContainText('춘천–홍천 전투');

  const overviewEventLabels = page.locator('.event-marker text');
  expect(await overviewEventLabels.count()).toBeLessThanOrEqual(4);
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
  await expect(page).toHaveURL(/\/b\/nonexistent/);
});

test('keyboard: ArrowRight advances the day', async ({ page }) => {
  await page.goto('/b/chuncheon');

  await expect(page.locator('.day-rail')).toBeVisible();
  await expect(page).not.toHaveURL(/day=/);
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/day=0625/);
});
