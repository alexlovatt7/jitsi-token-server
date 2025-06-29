const jwt = require('jsonwebtoken');

const APP_ID = process.env.APP_ID;
const SUB = process.env.SUB;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = (req, res) => {
  const room = req.query.room;
  if (!room) {
    res.status(400).json({ error: 'Missing room name' });
    return;
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
        name: "Tutor",
        email: "tutor@example.com",
        moderator: true
      }
    }
  };

  const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' });
  res.status(200).json({ token });
};
