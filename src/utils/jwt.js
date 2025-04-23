const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'claveSecretaUltraSegura'; // ¡Recordá guardar esto en .env!

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };
