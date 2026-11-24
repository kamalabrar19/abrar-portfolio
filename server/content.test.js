import { test, expect } from 'vitest';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const {validateContent} = require('./validate-content.cjs');
const content = require('./data/content.json');
test('accepts existing content and empty galleries',()=>{expect(validateContent(content)).toBeNull();expect(validateContent({...content,moments:[]})).toBeNull();});
test('rejects missing sections, malformed arrays, and changed boolean types',()=>{
  expect(validateContent([])).toBeTruthy();expect(validateContent({projects:[]})).toBeTruthy();
  const draft=structuredClone(content);draft.moments[0].placeholder='false';expect(validateContent(draft)).toContain('placeholder');
  draft.moments[0].placeholder=false;draft.projects[0].tags='AI';expect(validateContent(draft)).toContain('tags');
});
test('rejects executable links and duplicate identities',()=>{
  const draft=structuredClone(content);draft.projects[0].link='javascript:alert(1)';expect(validateContent(draft)).toContain('link');
  draft.projects[0].link=null;draft.moments[0].src='javascript:alert(1)';expect(validateContent(draft)).toContain('src');
  draft.moments[0].src='/moments/photo.jpg';draft.projects[1].id=draft.projects[0].id;expect(validateContent(draft)).toContain('unik');
});
