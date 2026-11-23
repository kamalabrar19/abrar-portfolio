import { chromium } from '@playwright/test';
const browser=await chromium.launch();
for(const width of [1366,390]) {
 const page=await browser.newPage({viewport:{width,height:900}});
 await page.goto('http://127.0.0.1:5173');
 await page.locator('#moments').scrollIntoViewIfNeeded();
 await page.waitForTimeout(1500);
 console.log(width,await page.locator('#moments img').evaluateAll(images=>images.map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0}))));
 await page.locator('#moments').screenshot({path:`test-results/gallery-${width}.png`});
 await page.close();
}
await browser.close();
