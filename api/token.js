const jwt = require('jsonwebtoken');

const APP_ID = process.env.APP_ID || 'vpaas-magic-cookie-c676d66f911c49e582272680109cda13';
const SUB = process.env.SUB || '8x8.vc';
const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

export default function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { room } = req.query;

  if (!room) {
    return res.status(400).json({ error: 'Missing room name' });
  }

  const payload = {
    aud: 'jitsi',
    iss: APP_ID,
    sub: SUB,
    room,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,  // expires in 1 hour
    nbf: Math.floor(Date.now() / 1000),
    context: {
      user: {
        name: 'Tutor',
        email: 'tutor@example.com',
        moderator: true,
      },
      features: {
        livestreaming: true,
        recording: true,
        transcription: false,
      }
    }
  };

  try {
    const token = jwt.sign(payload, PRIVATE_KEY, {
      algorithm: 'RS256',
      keyid: `${APP_ID}/beb107`,
    });
    
    console.log('Generated token payload:', payload);
    res.status(200).json({ token });
  } catch (err) {
    console.error("JWT signing error:", err);
    res.status(500).json({ error: 'Token generation failed' });
  }
}