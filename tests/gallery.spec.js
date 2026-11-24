import { test, expect } from '@playwright/test';
for (const width of [1366,390]) test(`gallery navigation and accessible lightbox ${width}`, async ({page}) => {
  await page.setViewportSize({width,height:900});
  await page.goto('/');
  const gallery=page.locator('#moments');
  await expect(gallery.getByRole('heading',{name:'Life through the lens.'})).toBeVisible();
  await gallery.getByRole('button',{name:'Next moment',exact:true}).click();
  await expect(gallery.locator('[data-testid="moment-title"]')).toHaveText('Building AI RAG chatbots');
  await gallery.getByRole('button',{name:'Enlarge photo'}).click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(dialog.getByRole('heading')).toHaveText('Connecting the workflow');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(gallery.getByRole('button',{name:'Enlarge photo'})).toBeFocused();
  // Wait for the newly selected photo, rather than the outgoing animated node.
  const photo=gallery.locator('.moment-photo').filter({has:page.getByRole('img',{name:'Working on workflow automation and connected operations'})});
  await expect(photo).toBeVisible();
  await photo.scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  const box=await photo.boundingBox();
  await page.mouse.move(box.x+box.width*.8,box.y+box.height*.5);
  await page.mouse.down();
  await page.mouse.move(box.x+box.width*.2,box.y+box.height*.5,{steps:12});
  await page.mouse.up();
  await expect(gallery.locator('[data-testid="moment-title"]')).toHaveText('A community, a shared stage');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
