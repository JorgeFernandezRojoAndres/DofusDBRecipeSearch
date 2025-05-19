// src/models/BlogPost.js  
const mongoose = require('mongoose');  
  
const commentSchema = new mongoose.Schema({  
  usuario: {  
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'User',  
    required: true  
  },  
  texto: {  
    type: String,  
    required: true  
  },  
  fecha: {  
    type: Date,  
    default: Date.now  
  }  
});  
  
const blogPostSchema = new mongoose.Schema({  
  nombre: {  
    type: String,  
    required: true  
  },  
  descripcion: String,  
  imagen: String,  
  valor: {  
    type: Number,  
    default: 0  
  },  
  ingredientes: [String],  
  likes: {  
    type: Number,  
    default: 0  
  },  
  usuariosLike: [{  
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'User'  
  }],  
  comentarios: [commentSchema],  
  fechaCreacion: {  
    type: Date,  
    default: Date.now  
  },  
  fechaActualizacion: {  
    type: Date,  
    default: Date.now  
  }  
});  
  
// Middleware para actualizar fechaActualizacion automáticamente  
blogPostSchema.pre('save', function(next) {  
  if (this.isModified()) {  
    this.fechaActualizacion = Date.now();  
  }  
  next();  
});  
  
module.exports = mongoose.model('BlogPost', blogPostSchema);