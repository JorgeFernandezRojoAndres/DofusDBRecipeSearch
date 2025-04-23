const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const { generateToken } = require('../utils/jwt');
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Validación simple
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error('❌ Error en el registro:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Verificar que se enviaron datos
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = generateToken({ id: user._id, email: user.email, isPremium: user.isPremium });

    res.json({ message: 'Login exitoso', token });
  } catch (err) {
    console.error('❌ Error en login:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});
module.exports = router;
