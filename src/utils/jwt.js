const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'claveSecretaUltraSegura';

// ✅ Permitir duración personalizada (por defecto 1h)
function generateToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };
