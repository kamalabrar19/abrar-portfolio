import { test, expect } from '@playwright/test';

for (const width of [1366, 390]) {
  test(`real WebGL shots destroy targets, score and restart at ${width}px`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 900 });
    // Spawn on the centre line; no rendering, collision or score is mocked.
    await page.addInitScript(() => { Math.random = () => .5; });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const assets = [];
    page.on('request', request => assets.push(request.url()));
    await page.goto('/');
    expect(assets.some(url => url.includes('ShooterCanvas'))).toBe(false);
    await page.getByRole('button', { name: 'Play shooter', exact: true }).click();
    const arena = page.getByRole('group', { name: 'Shooter arena' });
    await expect(arena.locator('canvas')).toBeVisible();
    await page.mouse.move(0, 0);
    await arena.focus();
    await expect(arena).toHaveAttribute('data-enemy-ids', '1');
    // The desktop uses held Space; mobile uses its on-screen fire control.
    if (width > 600) await page.keyboard.down('Space');
    else {
      for (let i = 0; i < 24; i++) {
        await page.getByRole('button', { name: 'Fire weapons' }).click();
        await page.waitForTimeout(200);
        if (Number(await page.getByTestId('score').innerText()) > 0) break;
      }
    }
    await expect.poll(async () => Number(await page.getByTestId('score').innerText()), { timeout: 20000 }).toBeGreaterThan(0);
    await page.keyboard.up('Space');
    await expect.poll(async () => (await arena.getAttribute('data-enemy-ids')).split(',')).not.toContain('1');
    const earned = Number(await page.getByTestId('score').innerText());
    await expect.poll(async () => Number(await page.getByTestId('best-score').innerText())).toBeGreaterThanOrEqual(earned);
    await page.getByRole('button', { name: 'Pause', exact: true }).click();
    await expect(page.getByText('Mission paused', { exact: true })).toBeVisible();
    const frozen = await arena.getAttribute('data-enemy-ids');
    await page.waitForTimeout(250);
    await expect(arena).toHaveAttribute('data-enemy-ids', frozen);
    await page.getByRole('button', { name: 'Resume mission' }).click();
    await page.getByRole('button', { name: 'Restart', exact: true }).click();
    await expect(page.getByTestId('score')).toHaveText('0');
    await expect(page.getByTestId('lives')).toHaveText('3 / 3');
    await page.getByRole('button', { name: 'Move fighter up' }).click();
    await expect.poll(async () => Number(await arena.getAttribute('data-player-y'))).toBeGreaterThan(0);
    await page.getByRole('button', { name: 'Move fighter right' }).click();
    await expect.poll(async () => Number(await arena.getAttribute('data-player-x'))).toBeGreaterThan(-4.2);
    await page.getByRole('button', { name: 'Close game' }).click();
    await expect(page.locator('#playground canvas')).toHaveCount(0);
    await page.reload();
    await page.getByRole('button', { name: 'Play shooter', exact: true }).click();
    await expect.poll(async () => Number(await page.getByTestId('best-score').innerText())).toBeGreaterThanOrEqual(earned);
    await expect(page.getByTestId('score')).toHaveText('0');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
