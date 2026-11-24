import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const content = JSON.parse(readFileSync(new URL('../server/data/content.json', import.meta.url), 'utf8'));
async function mockAdmin(page) {
  await page.route('**/api/auth/me', route => route.fulfill({json:{user:{name:'Admin test',email:'test@example.com'}}}));
  await page.route('**/api/config', route => route.fulfill({json:{clientId:''}}));
  await page.route('**/api/content', route => route.fulfill({json:content}));
}
for(const width of [1366,390]) test(`dashboard preserves drafts and field types at ${width}px`, async ({page})=>{
  await page.setViewportSize({width,height:900}); await mockAdmin(page);
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/admin');
  await page.getByRole('button',{name:'Proyek',exact:true}).click();
  await expect(page.locator('#field-0-name')).toHaveValue('RAG Chatbot');
  await page.locator('#field-0-name').fill('Updated project');
  await page.getByRole('button',{name:'Momen',exact:true}).click();
  await expect(page.locator('#field-0-placeholder')).not.toBeChecked();
  await page.getByRole('button',{name:'Proyek',exact:true}).click();
  await expect(page.locator('#field-0-name')).toHaveValue('Updated project');
  let saved;
  await page.route('**/api/content',async route=>{saved=route.request().postDataJSON();await route.fulfill({json:{ok:true}});});
  await page.getByRole('button',{name:'Simpan perubahan'}).click();
  await expect(page.locator('#status')).toContainText('berhasil disimpan');
  expect(saved.projects[0].name).toBe('Updated project'); expect(saved.projects[0].link).toBeNull(); expect(saved.moments[0].placeholder).toBe(false);
  expect(saved.skills).toEqual(content.skills);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({path:`test-results/dashboard-${width}.png`,fullPage:true});
});
test('expired session retains unsaved draft and disables saving',async({page})=>{
  await mockAdmin(page);await page.goto('/admin');await page.getByRole('button',{name:'Proyek',exact:true}).click();await page.locator('#field-0-name').fill('Draft retained');
  await page.route('**/api/content',route=>route.fulfill({status:401,json:{error:'Unauthorized'}}));
  await page.getByRole('button',{name:'Simpan perubahan'}).click();
  await expect(page.locator('#status')).toContainText('Sesi berakhir');
  await expect(page.locator('#field-0-name')).toHaveValue('Draft retained');await expect(page.getByRole('button',{name:'Simpan perubahan'})).toBeDisabled();
});
test('failed content load provides recovery',async({page})=>{
  await mockAdmin(page);await page.route('**/api/content',route=>route.fulfill({status:500,json:{error:'Failed'}}));await page.goto('/admin');
  await expect(page.locator('#status')).toContainText('gagal dimuat');
  await page.route('**/api/content',route=>route.fulfill({json:content}));await page.getByRole('button',{name:'Muat ulang'}).click();await expect(page.locator('#status')).toHaveText('Konten siap.');
});
test('anonymous API writes are rejected without changing stored content',async({request,page})=>{
  const before=await(await request.get('/api/content')).json();const response=await request.put('/api/content',{data:{projects:[]}});expect(response.status()).toBe(401);expect(await(await request.get('/api/content')).json()).toEqual(before);
  await page.route('**/api/config',route=>route.fulfill({json:{clientId:''}}));await page.goto('/admin');await page.getByRole('button',{name:'Proyek',exact:true}).click();await expect(page.locator('#field-0-name')).toBeDisabled();
});
test('empty gallery does not crash the portfolio',async({page})=>{
  await page.route('**/api/content',route=>route.fulfill({json:{...content,moments:[]}}));await page.goto('/');await expect(page.getByText('Belum ada foto.')).toBeVisible();await expect(page.getByRole('heading',{name:'Kamal Abrar.',exact:true})).toBeVisible();
});

