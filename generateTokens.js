const fs = require('fs');
const jwt = require('jsonwebtoken'); // for creating JWT tokens

// Your 8x8 Jitsi App ID here
const APP_ID = 'vpaas-magic-cookie-c676d66f911c49e582272680109cda13';

// Read your private RSA key from file
const PRIVATE_KEY = fs.readFileSync('private.key', 'utf8');

// List of all room names you want to generate tokens for
const rooms = [
  'room_tutor1',
  'room_tutor2',
  'room_tutor3',
  // Add more rooms here each week if needed
];

// Set token expiration: now + 7 days (in seconds)
const expiration = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);

// Object to store room tokens
const tokens = {};

// Loop over each room, create a token and add to tokens object
rooms.forEach(room => {
  // Define JWT payload
  const payload = {
    aud: 'jitsi',            // audience
    iss: APP_ID,             // issuer
    sub: APP_ID,             // subject (your app id again)
    room: room,              // room name
    exp: expiration,         // expiration timestamp
    context: {               // user info (optional but useful)
      user: {
        name: room          // can be replaced with a real name if you want
      }
    }
  };

  // Create the JWT token signed with your private key
  const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' });

  // Save the token under the room name
  tokens[room] = token;
});

// Save all tokens into a JSON file to use later
fs.writeFileSync('tokens.json', JSON.stringify(tokens, null, 2));

console.log('Tokens generated and saved to tokens.json');

