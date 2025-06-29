const jwt = require('jsonwebtoken');

const APP_ID = process.env.APP_ID || 'vpaas-magic-cookie-c676d66f911c49e582272680109cda13';
const SUB = process.env.SUB || '8x8.vc'; // For 8x8/vpaas service
const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

export default function handler(req, res) {
  const { room } = req.query;

  if (!room) {
    return res.status(400).json({ error: 'Missing room name' });
  }

  const payload = {
    aud: 'jitsi',
    iss: APP_ID,  // For vpaas, this should be the full APP_ID
    sub: SUB,     // This should be your Jitsi domain
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
      keyid: `${APP_ID}/beb107`,  // For vpaas: APP_ID/KEY_ID format
    });
    
    console.log('Generated token payload:', payload); // Debug logging
    res.status(200).json({ token });
  } catch (err) {
    console.error("JWT signing error:", err);
    res.status(500).json({ error: 'Token generation failed' });
  }
}
