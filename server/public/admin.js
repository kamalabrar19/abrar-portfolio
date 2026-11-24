const $ = id => document.getElementById(id);
const sections = { projects: 'Proyek', experience: 'Pengalaman', skills: 'Keahlian', moments: 'Momen' };
const labels = {title:'Judul',name:'Nama',category:'Kategori',kind:'Jenis visual',description:'Deskripsi',tags:'Tag',detail:'Detail',link:'Tautan',date:'Periode',company:'Perusahaan',role:'Peran',label:'Label',code:'Kode',items:'Daftar keahlian',caption:'Keterangan',src:'Foto',fullSrc:'Foto ukuran penuh',alt:'Deskripsi foto',placeholder:'Foto ilustrasi'};
let data, original, tab = 'overview', user = null, busy = false;
const dirty = () => data && JSON.stringify(data) !== original;
function status(message, error = false) { $('status').textContent = message; $('status').classList.toggle('error', error); }
function updateSave() { $('save').disabled = !data || !dirty() || !user || busy; $('save-state').textContent = busy ? 'Menyimpan...' : dirty() ? 'Ada perubahan belum disimpan' : 'Semua perubahan tersimpan'; }
async function api(url, options) { const response = await fetch(url, options); const body = await response.json(); if (!response.ok) { const error = new Error(body.error || 'Permintaan gagal'); error.status = response.status; throw error; } return body; }
function authView() { $('account').textContent = user ? user.name || user.email : 'Mode baca'; $('logout').hidden = !user; $('login').hidden = !!user; updateSave(); }
function draw() {
  $('nav').replaceChildren();
  for (const [key, name] of Object.entries({ overview:'Ringkasan', ...sections })) { const button = document.createElement('button'); button.textContent = name; button.className = key === tab ? 'active' : ''; button.setAttribute('aria-current',key === tab ? 'page' : 'false'); button.onclick = () => { tab = key; draw(); }; $('nav').append(button); }
  $('stats').replaceChildren();
  for (const [key, name] of Object.entries(sections)) { const card = document.createElement('div'); card.className = 'stat'; const label = document.createElement('span'); label.textContent = name; const count = document.createElement('strong'); count.textContent = data[key].length; card.append(label,count); $('stats').append(card); }
  $('title').textContent = sections[tab] || 'Portfolio dalam satu tempat';
  $('description').textContent = tab === 'overview' ? 'Pilih bagian untuk mulai mengedit konten.' : 'Perubahan antarbagian tetap tersimpan sebagai draf sampai kamu menekan Simpan.';
  $('content').replaceChildren();
  if (tab === 'overview') { const p = document.createElement('p'); p.className = 'overview'; p.textContent = 'Kelola proyek unggulan, perjalanan karier, keahlian, dan galeri foto. Gunakan Lihat portfolio untuk melihat halaman publik setelah perubahan disimpan.'; $('content').append(p); return; }
  const grid = document.createElement('div'); grid.className = 'grid';
  data[tab].forEach((item,index) => { const article = document.createElement('article'); article.className = 'item'; const heading = document.createElement('h3'); heading.textContent = item.name || item.role || item.title || `Item ${index+1}`; article.append(heading);
    for (const [key,value] of Object.entries(item)) { if (['id','number'].includes(key)) continue;
      const label = document.createElement('label'); const array = Array.isArray(value); const boolean = typeof value === 'boolean'; const field = document.createElement(array || ['description','caption'].includes(key) ? 'textarea' : 'input'); field.id = `field-${index}-${key}`; label.htmlFor = field.id;
      if (boolean) { field.type = 'checkbox'; field.checked = value; } else { field.value = array ? value.join('\n') : value ?? ''; if(field.tagName === 'INPUT') field.type = 'text'; }
      label.append(document.createTextNode(labels[key] || key),field); if(array) { const hint = document.createElement('small'); hint.textContent = 'Satu item per baris.'; label.append(hint); }
      field.disabled = !user || busy;
      field.addEventListener('input', () => { item[key] = boolean ? field.checked : array ? field.value.split('\n').map(s=>s.trim()).filter(Boolean) : key === 'link' && !field.value.trim() ? null : field.value; updateSave(); }); article.append(label);
    } grid.append(article);
  }); $('content').append(grid);
}
async function load() { $('reload').disabled = true; try { const loaded = await api('/api/content'); if(!Object.keys(sections).every(k=>Array.isArray(loaded[k]))) throw new Error('Format konten tidak valid.'); data = loaded; original = JSON.stringify(data); draw(); updateSave(); status('Konten siap.'); } catch { status('Konten gagal dimuat. Pastikan backend aktif lalu klik Muat ulang.',true); } finally { $('reload').disabled = false; } }
$('reload').onclick = () => { if(!dirty() || confirm('Buang perubahan yang belum disimpan dan muat ulang?')) load(); };
$('save').onclick = async () => { if(!user || !dirty() || busy) return; busy = true; updateSave(); draw(); status('Menyimpan perubahan...'); try { await api('/api/content',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); original = JSON.stringify(data); status('Perubahan berhasil disimpan. Portfolio sudah diperbarui.'); } catch(error) { if(error.status === 401) { user = null; authView(); } status(error.status === 401 ? 'Sesi berakhir. Masuk kembali untuk menyimpan draf.' : `Gagal menyimpan: ${error.message}. Draf tetap tersedia.`,true); } finally { busy = false; updateSave(); draw(); } };
$('logout').onclick = async () => { if(dirty() && !confirm('Keluar dan buang perubahan yang belum disimpan?')) return; try { await api('/api/auth/logout',{method:'POST'}); user = null; if(original) data = JSON.parse(original); authView(); if(data) draw(); status('Kamu sudah keluar.'); } catch { status('Gagal keluar. Coba lagi.',true); } };
window.addEventListener('beforeunload',event=>{if(dirty()){event.preventDefault();event.returnValue='';}});
async function init() { try { user = (await api('/api/auth/me')).user; } catch { user = null; } authView(); await load(); try { const config = await api('/api/config'); if(!config.clientId) { $('login-status').textContent = 'Login Google belum dikonfigurasi di server.'; return; } const script = document.createElement('script'); script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.onerror = () => { $('login-status').textContent = 'Google Login gagal dimuat. Periksa koneksi lalu muat ulang halaman.'; }; script.onload = () => { google.accounts.id.initialize({client_id:config.clientId,callback:async response=>{ $('login-status').textContent = 'Memverifikasi login...'; try { user = (await api('/api/auth/google',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({credential:response.credential})})).user; authView(); if(data) draw(); status('Login berhasil. Kamu dapat mengedit konten.'); } catch(error) { $('login-status').textContent = error.status ? error.message : 'Tidak dapat menghubungi server. Pastikan backend aktif lalu coba lagi.'; } }}); google.accounts.id.renderButton($('google-button'),{theme:'outline',size:'large'}); }; document.head.append(script); } catch { $('login-status').textContent = 'Konfigurasi login tidak dapat dimuat.'; } }
init();
