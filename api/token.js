// api/token.js  ── Generates a JaaS JWT and returns { token : "…" }
import jwt from 'jsonwebtoken';

const APP_ID      = process.env.APP_ID;      // e.g. vpaas-magic-cookie-c676d66f911c49e582272680109cda13
const PRIVATE_KEY = process.env.PRIVATE_KEY; // full RSA key with BEGIN/END + real line-breaks

export default function handler(req, res) {
  /* ---------- 1. CORS so WordPress can call us ---------- */
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  /* ---------- 2. Basic validation ---------- */
  const room = req.query.room;
  if (!room) {
    res.status(400).json({ error : 'Missing room name' });
    return;
  }

  // NEW: Read moderator flag from query string
  const isModerator = req.query.moderator === 'true';

  /* ---------- 3. Build JWT payload ---------- */
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud : 'jitsi',
    iss : 'chat', // JaaS requires 'chat' as the issuer
    sub : APP_ID,
    room,
    nbf : now,
    exp : now + 60 * 60,              // 1-hour validity
    context : {
      user : {
        name      : isModerator ? 'Tutor' : 'Student',
        moderator : isModerator
      },
      features : {
        livestreaming : true,
        recording     : true
      }
    }
  };

  /* ---------- 4. Sign and return ---------- */
  try {
    const token = jwt.sign(payload, PRIVATE_KEY, {
      algorithm : 'RS256',
      keyid     : APP_ID + '/beb107'   // replace “beb107” with the kid shown in the JaaS portal
    });
    res.status(200).json({ token });
  } catch (err) {
    console.error('JWT error:', err);
    res.status(500).json({ error : 'Token generation failed' });
  }
}