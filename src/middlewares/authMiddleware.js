const { verifyToken } = require('../utils/jwt');

// ✅ Middleware para proteger rutas y verificar el token
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Guardamos los datos del usuario en el request
    next(); // Continuamos con la siguiente función
  } catch (error) {
    console.error('❌ Error al verificar token:', error.message);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = verificarToken;
