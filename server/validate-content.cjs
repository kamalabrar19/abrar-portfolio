const schemas = {
  projects: { id:'string', number:'string', title:'string', name:'string', category:'string', kind:'string', description:'string', tags:'array', detail:'string', link:'link' },
  experience: { date:'string', company:'string', role:'string', description:'string', tags:'array' },
  skills: { title:'string', label:'string', code:'string', items:'array' },
  moments: { id:'string', title:'string', category:'string', caption:'string', src:'image', fullSrc:'image', alt:'string', placeholder:'boolean' },
};
const safeLink = value => value === null || value === '' || (typeof value === 'string' && /^https?:\/\//i.test(value) && (()=>{try {new URL(value); return true;} catch {return false;}})());
const safeImage = value => typeof value === 'string' && ((value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) || (value.length > 0 && safeLink(value)));
function validateContent(content) {
  if (!content || typeof content !== 'object' || Array.isArray(content)) return 'Konten harus berupa objek.';
  for (const [section,schema] of Object.entries(schemas)) {
    if (!Array.isArray(content[section])) return `${section} harus berupa daftar.`;
    const ids = new Set();
    for (const item of content[section]) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return `Item ${section} tidak valid.`;
      for (const [key,type] of Object.entries(schema)) {
        const value = item[key];
        const valid = type === 'array' ? Array.isArray(value) && value.every(v=>typeof v === 'string') : type === 'link' ? safeLink(value) : type === 'image' ? safeImage(value) : typeof value === type;
        if (!valid) return `${section}.${key} tidak valid.`;
      }
      if ('link' in item && !safeLink(item.link)) return `${section}.link harus berupa URL HTTP atau HTTPS.`;
      const identity = item.id ?? item.code;
      if (identity !== undefined) { if(!identity.trim() || ids.has(identity)) return `ID ${section} harus unik dan tidak kosong.`; ids.add(identity); }
    }
  }
  return null;
}
module.exports = { validateContent };
