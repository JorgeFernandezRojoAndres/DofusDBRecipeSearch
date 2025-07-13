const mongoose = require('mongoose'); // 👈 agregado para verificar estado de conexión
const Visita = require('../models/visita.model');

exports.contarVisita = async (req, res) => {
  try {
    console.log('[DEBUG] Estado conexión mongoose:', mongoose.connection.readyState); // 👈 log de conexión

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'desconocida';

    // Aseguramos que la IP no sea vacía
    if (!ip) {
      return res.status(400).json({ message: 'No se pudo obtener la IP' });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Buscar visitas del día actual
    const yaContada = await Visita.findOne({
      ip,
      fecha: { $gte: hoy }
    });

    // Guardar solo si no está registrada hoy
    if (!yaContada) {
      await Visita.create({ ip, fecha: new Date() });
    }

    // Contar visitas históricas (sin filtrar por fecha)
    const total = await Visita.countDocuments();

    console.log('[DEBUG] Total visitas:', total);
    res.json({ total });

  } catch (error) {
    console.error('[ERROR] al contar visitas:', error.message);
    res.status(500).json({ message: 'Error al contar visitas' });
  }
};

// 👇 función agregada sin borrar nada importante
exports.totalUsuariosUnicos = async (req, res) => {
  try {
    const totalUnicos = await Visita.distinct('ip');
    res.json({ total: totalUnicos.length });
  } catch (error) {
    console.error('[ERROR] al contar usuarios únicos:', error.message);
    res.status(500).json({ message: 'Error al contar usuarios únicos' });
  }
};
