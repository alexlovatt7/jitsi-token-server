const jwt = require('jsonwebtoken');

const APP_ID = process.env.APP_ID;
const SUB = process.env.SUB;
const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

export default function handler(req, res) {
  const { room } = req.query;

  if (!room) {
    return res.status(400).json({ error: 'Missing room name' });
  }

  const payload = {
    aud: 'jitsi',
    iss: APP_ID,
    sub: SUB,
    room,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    nbf: Math.floor(Date.now() / 1000),
    context: {
      user: {
        name: 'Tutor',
        email: 'tutor@example.com',
        moderator: true,
      }
    }
  };

  try {
    const token = jwt.sign(payload, PRIVATE_KEY, {
      algorithm: 'RS256',
      keyid: "beb107"  // This adds the kid header to your JWT
    });
    res.status(200).json({ token });
  } catch (err) {
    console.error("JWT signing error:", err);
    res.status(500).json({ error: 'Token generation failed' });
  }
}
