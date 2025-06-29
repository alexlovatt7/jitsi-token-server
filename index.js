require('dotenv').config();
const fs = require('fs');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;  // Use PORT from env for Vercel

const APP_ID = process.env.APP_ID;
const SUB = process.env.SUB;
const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');


app.get('/', (req, res) => {
  res.send('Hello from Jitsi Token Server!');
});

app.get('/token', (req, res) => {
  const room = req.query.room;
  if (!room) return res.status(400).json({ error: 'Missing room name' });

  const payload = {
    aud: 'jitsi',
    iss: APP_ID,
    sub: SUB,
    room: room,
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
  res.json({ token });
});

app.listen(port, () => {
  console.log(`✅ Jitsi token server running at http://localhost:${port}`);
});

