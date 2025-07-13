const mongoose = require('mongoose');

const visitaSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Visita', visitaSchema);
