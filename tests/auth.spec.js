import { test, expect } from '@playwright/test';
async function googleStub(page){
 await page.route('https://accounts.google.com/gsi/client',route=>route.fulfill({contentType:'application/javascript',body:`window.google={accounts:{id:{initialize(options){window.testGoogleLogin=options.callback},renderButton(element){const button=document.createElement('button');button.textContent='Google test login';button.onclick=()=>window.testGoogleLogin({credential:'test-token'});element.append(button)}}}};`}));
}
test('login displays verification outages instead of blaming the account',async({page})=>{
 await googleStub(page);await page.route('**/api/auth/google',route=>route.fulfill({status:503,json:{code:'GOOGLE_UNAVAILABLE',error:'Server tidak dapat menghubungi Google untuk memverifikasi login.'}}));
 await page.goto('/admin');await page.getByRole('button',{name:'Google test login'}).click();await expect(page.locator('#login-status')).toContainText('Server tidak dapat menghubungi Google');await expect(page.locator('#account')).toHaveText('Mode baca');
});
test('successful Google callback enables the editor',async({page})=>{
 await googleStub(page);await page.route('**/api/auth/google',route=>route.fulfill({json:{user:{name:'Admin test',email:'admin@example.com'}}}));
 const response=await page.goto('/admin');expect(response.headers()['cross-origin-opener-policy']).toBe('same-origin-allow-popups');
 await page.getByRole('button',{name:'Google test login'}).click();await expect(page.locator('#account')).toHaveText('Admin test');await expect(page.locator('#login')).toBeHidden();await page.getByRole('button',{name:'Proyek',exact:true}).click();await expect(page.locator('#field-0-name')).toBeEnabled();
});
