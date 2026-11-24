import { beforeAll, afterAll, afterEach, expect, test, vi } from 'vitest';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { OAuth2Client } = require('google-auth-library');
const app = require('./index.cjs');
let server, origin;
beforeAll(async()=>{server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));origin=`http://127.0.0.1:${server.address().port}`;});
afterEach(()=>vi.restoreAllMocks());
afterAll(()=>new Promise(resolve=>server.close(resolve)));
const login = credential => fetch(`${origin}/api/auth/google`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({credential})});
test('certificate network failures return 503 without issuing a session',async()=>{
  vi.spyOn(console,'warn').mockImplementation(()=>{});
  vi.spyOn(OAuth2Client.prototype,'verifyIdToken').mockRejectedValue(Object.assign(new Error('Failed to retrieve verification certificates: network failure'),{code:'EACCES'}));
  const response=await login('test-credential');expect(response.status).toBe(503);expect((await response.json()).code).toBe('GOOGLE_UNAVAILABLE');expect(response.headers.get('set-cookie')).toBeNull();
});
test('invalid tokens and audience mismatches still fail closed',async()=>{
  const verify=vi.spyOn(OAuth2Client.prototype,'verifyIdToken').mockRejectedValue(new Error('Invalid token signature'));
  let response=await login('test-credential');expect(response.status).toBe(401);expect((await response.json()).code).toBe('INVALID_GOOGLE_TOKEN');expect(response.headers.get('set-cookie')).toBeNull();
  verify.mockRejectedValue(new Error('Wrong recipient, payload audience != requiredAudience'));
  response=await login('test-credential');expect(response.status).toBe(401);expect((await response.json()).code).toBe('GOOGLE_CLIENT_MISMATCH');
});
test('non-admin accounts cannot create a session',async()=>{
  vi.spyOn(OAuth2Client.prototype,'verifyIdToken').mockResolvedValue({getPayload:()=>({email:'other@example.com',email_verified:true})});
  const response=await login('test-credential');expect(response.status).toBe(403);expect(response.headers.get('set-cookie')).toBeNull();
});
test('verified admin receives a usable session and logout revokes it',async()=>{
  const config=await(await fetch(`${origin}/api/config`)).json();
  const verify=vi.spyOn(OAuth2Client.prototype,'verifyIdToken').mockResolvedValue({getPayload:()=>({email:config.adminEmail.toUpperCase(),email_verified:true,name:'Admin'})});
  const response=await login('test-credential');expect(response.status).toBe(200);expect(verify).toHaveBeenCalledWith({idToken:'test-credential',audience:config.clientId});
  const cookie=response.headers.get('set-cookie');expect(cookie).toContain('HttpOnly');const headers={Cookie:cookie.split(';')[0]};
  expect((await fetch(`${origin}/api/auth/me`,{headers})).status).toBe(200);
  await fetch(`${origin}/api/auth/logout`,{method:'POST',headers});expect((await fetch(`${origin}/api/auth/me`,{headers})).status).toBe(401);
});
test('rejects malformed credentials before verification',async()=>{const verify=vi.spyOn(OAuth2Client.prototype,'verifyIdToken');expect((await login({token:'bad'})).status).toBe(400);expect(verify).not.toHaveBeenCalled();});
test('admin page allows popup communication',async()=>{const response=await fetch(`${origin}/admin/`);expect(response.headers.get('cross-origin-opener-policy')).toBe('same-origin-allow-popups');});
