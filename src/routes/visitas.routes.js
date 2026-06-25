const express = require('express');
const { contarVisita, totalUsuariosUnicos } = require('../controllers/visitas.controller');

const router = express.Router();

router.get('/visitas', contarVisita);
router.get('/usuarios-unicos', totalUsuariosUnicos); // 👈 nueva ruta

module.exports = router;
