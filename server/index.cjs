require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

const PORT = process.env.PORT || 5000;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'kamalabrar19@gmail.com';
const DATA_FILE = path.join(__dirname, 'data', 'content.json');
const SESSIONS = new Map();

const oauthClient = new OAuth2Client(CLIENT_ID);

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

function getSession(req) {
  const sid = req.cookies && req.cookies.sid;
  if (!sid) return null;
  const session = SESSIONS.get(sid);
  if (!session) return null;
  if (session.expires < Date.now()) { SESSIONS.delete(sid); return null; }
  return session;
}

function requireAdmin(req, res, next) {
  const session = getSession(req);
  if (!session || session.user.email !== ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = session.user;
  next();
}

app.get('/api/config', (req, res) => {
  res.json({ clientId: CLIENT_ID, adminEmail: ADMIN_EMAIL });
});

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body || {};
  if (!credential) return res.status(400).json({ error: 'Missing credential' });
  if (!CLIENT_ID) return res.status(500).json({ error: 'GOOGLE_CLIENT_ID not configured' });
  try {
    const ticket = await oauthClient.verifyIdToken({ idToken: credential, audience: CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload || !payload.email_verified) return res.status(401).json({ error: 'Email not verified' });
    if (payload.email !== ADMIN_EMAIL) return res.status(403).json({ error: 'Not allowed' });
    const sid = crypto.randomBytes(32).toString('hex');
    SESSIONS.set(sid, { user: { email: payload.email, name: payload.name, picture: payload.picture }, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 });
    res.cookie('sid', sid, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: { email: payload.email, name: payload.name, picture: payload.picture } });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ user: session.user });
});

app.post('/api/auth/logout', (req, res) => {
  const sid = req.cookies && req.cookies.sid;
  if (sid) SESSIONS.delete(sid);
  res.clearCookie('sid');
  res.json({ ok: true });
});

app.get('/api/content', (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    res.type('json').send(raw);
  } catch (err) {
    res.status(500).json({ error: 'Cannot read content' });
  }
});

app.put('/api/content', (req, res) => {
  try {
    const content = req.body;
    if (!content || typeof content !== 'object') return res.status(400).json({ error: 'Invalid content' });
    fs.writeFileSync(DATA_FILE, JSON.stringify(content, null, 2));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Cannot save content' });
  }
});

const adminDir = path.join(__dirname, 'public');
app.use('/admin', express.static(adminDir));
app.get('/admin', (req, res) => res.sendFile(path.join(adminDir, 'admin.html')));
app.get('/admin/{*path}', (req, res) => res.sendFile(path.join(adminDir, 'admin.html')));

// Serve built frontend if present
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('/{*path}', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/admin')) return res.status(404).end();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
});
