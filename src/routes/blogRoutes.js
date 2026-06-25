const express = require('express');  
const router = express.Router();  
const BlogPost = require('../models/BlogPost');  
const verificarToken = require('../middlewares/authMiddleware');  
  
// Obtener todos los posts (con filtros opcionales + paginación)  
router.get('/posts', async (req, res) => {  
  try {  
    const { ordenarPor, filtroValor, page = 1, limit = 6 } = req.query;

    const query = {};  
    const sort = {};  

    if (filtroValor) {  
      query.valor = { $gte: parseInt(filtroValor) };  
    }  

    if (ordenarPor === 'valor') {  
      sort.valor = -1;  
    } else if (ordenarPor === 'reciente') {  
      sort.fechaActualizacion = -1;  
    } else {  
      sort.fechaCreacion = -1;  
    }  

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [posts, total] = await Promise.all([
      BlogPost.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('usuariosLike', 'username')
        .populate('comentarios.usuario', 'username'),
      BlogPost.countDocuments(query)
    ]);

    res.json({ success: true, data: posts, total });  
  } catch (error) {  
    console.error('Error al obtener posts:', error);  
    res.status(500).json({ success: false, error: 'Error al obtener los posts' });  
  }  
});  
  
// Crear nuevo post (requiere autenticación)  
router.post('/posts', verificarToken, async (req, res) => {  
  try {  
    const { nombre, descripcion, imagen, valor, ingredientes } = req.body;  
      
    const newPost = new BlogPost({  
      nombre,  
      descripcion,  
      imagen,  
      valor,  
      ingredientes  
    });  
      
    await newPost.save();  
    res.status(201).json({ success: true, data: newPost });  
  } catch (error) {  
    console.error('Error al crear post:', error);  
    res.status(500).json({ success: false, error: 'Error al crear el post' });  
  }  
});  
  
// Dar like a un post  
router.post('/posts/:id/like', verificarToken, async (req, res) => {  
  try {  
    const post = await BlogPost.findById(req.params.id);  
    if (!post) {  
      return res.status(404).json({ success: false, error: 'Post no encontrado' });  
    }  
      
    const userIndex = post.usuariosLike.indexOf(req.user.id);  
      
    if (userIndex === -1) {  
      post.likes += 1;  
      post.usuariosLike.push(req.user.id);  
    } else {  
      post.likes -= 1;  
      post.usuariosLike.splice(userIndex, 1);  
    }  
      
    await post.save();  
    res.json({ success: true, data: post });  
  } catch (error) {  
    console.error('Error al procesar like:', error);  
    res.status(500).json({ success: false, error: 'Error al procesar el like' });  
  }  
});  
  
// Añadir comentario  
router.post('/posts/:id/comentario', verificarToken, async (req, res) => {  
  try {  
    const { texto } = req.body;  
      
    if (!texto) {  
      return res.status(400).json({ success: false, error: 'El comentario no puede estar vacío' });  
    }  
      
    const post = await BlogPost.findById(req.params.id);  
    if (!post) {  
      return res.status(404).json({ success: false, error: 'Post no encontrado' });  
    }  
      
    post.comentarios.push({  
      usuario: req.user.id,  
      texto  
    });  
      
    await post.save();  
    const updatedPost = await BlogPost.findById(req.params.id)  
      .populate('comentarios.usuario', 'username');  
        
    res.json({ success: true, data: updatedPost });  
  } catch (error) {  
    console.error('Error al añadir comentario:', error);  
    res.status(500).json({ success: false, error: 'Error al añadir el comentario' });  
  }  
});  
  
// Crear o actualizar automáticamente un post desde el buscador (sin autenticación)
router.post('/posts/updateOrCreate', async (req, res) => {
  try {
    console.log('[DEBUG] Petición recibida en updateOrCreate:', req.body);
    const { nombre, descripcion, imagen, valor, gasto, ganancia, ingredientes } = req.body;

    if (!nombre || !valor) {
      return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
    }

    const eliminados = await BlogPost.deleteMany({ nombre });
    console.log(`[INFO] Se eliminaron ${eliminados.deletedCount} versiones anteriores de "${nombre}"`);

    const nuevoPost = new BlogPost({
      nombre,
      descripcion,
      imagen: imagen,
      valor,
      gasto,
      ganancia,
      ingredientes,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });

    await nuevoPost.save();
    return res.status(201).json({ success: true, mensaje: 'Versión actualizada del objeto agregada al blog' });

  } catch (error) {
    console.error('Error en updateOrCreate:', error);
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

module.exports = router;
