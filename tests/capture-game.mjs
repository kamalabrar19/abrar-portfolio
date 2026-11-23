import { chromium } from '@playwright/test';
const browser = await chromium.launch({headless:true});
for (const width of [1366,390]) {
  const page = await browser.newPage({viewport:{width,height:1000}});
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173');
  await page.getByRole('button',{name:'Play shooter',exact:true}).click();
  await page.locator('#playground canvas').waitFor({state:'visible'});
  await page.mouse.move(0,0);
  await page.waitForTimeout(1200);
  await page.locator('.game-shell').screenshot({path:`test-results/game-${width}.png`});
  console.log(JSON.stringify({width,errors,screenshot:`test-results/game-${width}.png`,canvas:await page.locator('canvas').boundingBox()}));
  await page.close();
}
await browser.close();
