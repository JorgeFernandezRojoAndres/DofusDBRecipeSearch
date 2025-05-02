const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const router = express.Router();
const { generateToken, verifyToken } = require('../utils/jwt');
const verificarToken = require('../middlewares/authMiddleware');


router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      isVerified: true // ✅ lo marcamos como verificado automáticamente
    });

    await newUser.save();

    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
      isPremium: newUser.isPremium
    });

    res.status(201).json({ message: 'Usuario registrado correctamente', token });
  } catch (err) {
    console.error('❌ Error en el registro:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

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

router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    message: '✅ Acceso autorizado al perfil del usuario',
    user: req.user
  });
});

router.get('/verify', async (req, res) => {
  const token = req.query.token;

  if (!token) return res.status(400).send('Token faltante');

  try {
    const { id } = verifyToken(token);
    const user = await User.findById(id);

    if (!user) return res.status(404).send('Usuario no encontrado');

    user.isVerified = true;
    await user.save();

    // ✅ Redireccionar a página HTML con el GIF
    res.redirect('/verificacionExitosa.html');

  } catch (err) {
    console.error('❌ Error verificando usuario:', err.message);
    res.status(400).send('Token inválido o expirado');
  }
});

module.exports = router;
