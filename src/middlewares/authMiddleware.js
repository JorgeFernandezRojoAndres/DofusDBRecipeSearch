const { verifyToken } = require('../utils/jwt');

// ✅ Middleware para proteger rutas y verificar el token
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.warn('⚠️ Token no proporcionado en el header Authorization');
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    console.warn('⚠️ Token vacío o mal formado después de limpiar Bearer');
    return res.status(401).json({ error: 'Token inválido o vacío' });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      console.warn('⚠️ Token decodificado vacío');
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.user = decoded; // Guardamos los datos del usuario en el request
    next(); // Continuamos con la siguiente función
  } catch (error) {
    console.error('❌ Error al verificar token:', error.message);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = verificarToken;
