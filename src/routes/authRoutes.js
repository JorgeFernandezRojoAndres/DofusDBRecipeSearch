const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');


const User = require('../models/User');
const router = express.Router();
const { generateToken, verifyToken } = require('../utils/jwt');
const verificarToken = require('../middlewares/authMiddleware');
const enviarCorreo = require('../utils/email'); // Ya usás esto para verificar

// Registro
router.post('/register', async (req, res) => {
  let { email, password } = req.body;

  // ✅ Normalizamos el email
  email = email.trim().toLowerCase();

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email, // ✅ Ya está normalizado
      password: hashedPassword
      // isVerified se omitió para que use el valor default: false
    });

    await newUser.save();

    // 🔐 Generar token de verificación (válido por 1 día)
    const verificationToken = generateToken(
      { id: newUser._id, email: newUser.email },
      '1d'
    );

    // 🌐 Enlace de verificación
    const verificationUrl = `${process.env.BASE_URL}/api/verify?token=${verificationToken}`;

    await enviarCorreo(
      newUser.email,
      'Verificá tu cuenta',
      `
        <h2>¡Bienvenido a Recetas Dofus!</h2>
        <p>Para activar tu cuenta, hacé clic en el siguiente enlace:</p>
        <a href="${verificationUrl}">Verificar cuenta</a>
        <p>Este enlace expirará en 24 horas.</p>
      `
    );
    console.log('🔑 Token de verificación generado:', verificationToken);    

    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
      isPremium: newUser.isPremium
    });

    res.status(201).json({
      message: 'Usuario registrado correctamente. Revisa tu correo para activar tu cuenta.',
      token
    });

  } catch (err) {
    console.error('❌ Error en el registro:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});



// Login
router.post('/login', async (req, res) => {
  let { email, password } = req.body;

  // ✅ Normalizamos el email para evitar errores por espacios o mayúsculas
  email = email.trim().toLowerCase();

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Cuenta no verificada. Revisá tu correo electrónico.' });
    }

    const token = generateToken({ id: user._id, email: user.email, isPremium: user.isPremium });

    res.json({ message: 'Login exitoso', token });
  } catch (err) {
    console.error('❌ Error en login:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Recuperación de contraseña: Enviar correo con enlace de restablecimiento
router.post('/recuperar', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El email es requerido' });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: 'No se encontró un usuario con ese email' });
    }

    // Generar token válido por 30 minutos
    const token = generateToken({ id: user._id }, '30m');

    const url = `https://recetasdofus.com.ar/reset.html?token=${token}`;
    const html = `
      <h2>Recuperación de contraseña</h2>
      <p>Hacé clic en el botón para restablecer tu contraseña:</p>
      <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a>
      <p>Este enlace expirará en 30 minutos.</p>
    `;
    console.log('🔑 Token generado para recuperación:', token);
    console.log('🔗 URL enviada:', url);
    await enviarCorreo(email, 'Recuperación de contraseña', html);

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error al enviar enlace de recuperación:', err.message);
    res.status(500).json({ error: 'Ocurrió un error al intentar recuperar la contraseña' });
  }
});

// Perfil protegido
router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    message: '✅ Acceso autorizado al perfil del usuario',
    user: req.user
  });
});

// Verificación de cuenta por token



router.get('/verify', async (req, res) => {
  const token = req.query.token;

  if (!token) {
    console.warn('⚠️ Token faltante en verificación');
    return res.status(400).send('Token faltante');
  }

  try {
    const { id } = verifyToken(token);
    const user = await User.findById(id);

    if (!user) {
      console.warn('⚠️ Usuario no encontrado con el token');
      return res.status(404).send('Usuario no encontrado');
    }

    if (user.isVerified) {
      console.log('ℹ️ Usuario ya verificado');
      return res.status(200).send('Tu cuenta ya fue verificada anteriormente.');
    }

    user.isVerified = true;
    await user.save();

    // Verificamos si el archivo existe antes de servirlo
    const htmlPath = path.join(__dirname, '..', 'public', 'verificacionExitosa.html');
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    } else {
      console.warn('⚠️ Archivo verificacionExitosa.html no encontrado');
      return res.status(200).send('✅ Cuenta verificada. Pero falta la página de confirmación.');
    }

  } catch (err) {
    console.error('❌ Error verificando usuario:', err.message);
    return res.status(400).send('Enlace inválido o expirado');
  }
});

// ✅ Ruta para restablecer contraseña
router.post('/reset', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token y contraseña requeridos' });
  }

  try {
    const decoded = verifyToken(token); // 👉 decodifica y valida el token
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true });

  } catch (err) {
    console.error('❌ Error al restablecer la contraseña:', err.message);
    return res.status(400).json({ error: 'Token inválido o expirado' });
  }
});
// Validar token de restablecimiento  
router.post('/validate-reset-token', async (req, res) => {  
  const { token } = req.body;  
    
  if (!token) {  
    return res.status(400).json({ valid: false });  
  }  
    
  try {  
    // Verificar que el token sea válido  
    const decoded = verifyToken(token);  
    const user = await User.findById(decoded.id);  
      
    if (!user) {  
      return res.json({ valid: false });  
    }  
      
    res.json({ valid: true });  
  } catch (err) {  
    console.error('❌ Error al validar token de restablecimiento:', err.message);  
    res.json({ valid: false });  
  }  
});
// Ruta para reenviar correo de verificación  
router.post('/reenviar-verificacion', verificarToken, async (req, res) => {  
  try {  
    const userId = req.user.id;  
    const user = await User.findById(userId);  

    if (!user) {  
      return res.status(404).json({ error: 'Usuario no encontrado' });  
    }  

    if (user.isVerified) {  
      return res.status(400).json({ error: 'La cuenta ya está verificada' });  
    }  

    const verificationToken = generateToken({ id: user._id }, '24h');  
    const verificationUrl = `https://recetasdofus.com.ar/verificar.html?token=${verificationToken}`;  

    const html = `  
      <h2>Verificá tu cuenta</h2>  
      <p>Hacé clic en el siguiente enlace para completar tu registro:</p>  
      <a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verificar cuenta</a>  
      <p>Este enlace expirará en 24 horas.</p>  
    `;  

    await enviarCorreo(user.email, 'Verificación de cuenta - Recetas Dofus', html);  

    return res.json({ message: 'Correo de verificación reenviado correctamente' });  
  } catch (err) {  
    console.error('❌ Error al reenviar verificación:', err.message);  
    return res.status(500).json({ error: 'Error del servidor al reenviar verificación' });  
  }  
});

module.exports = router;
