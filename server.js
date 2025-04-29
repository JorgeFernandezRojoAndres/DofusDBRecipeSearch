const express = require('express');
const path = require('path');
const axios = require('axios');
const { obtenerIngredientes } = require('./src/utils/scraper');
const authRoutes = require('./src/routes/authRoutes'); 
const mongoose = require('mongoose');
const verificarToken = require('./src/middlewares/authMiddleware');

require('dotenv').config();

const app = express();
const DOFUSDB_API_URL = process.env.DOFUSDB_API_URL || "https://api.dofusdb.fr/items";

// ✅ Middleware para archivos estáticos (html, css, js, imágenes, etc)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Middleware para interpretar JSON
app.use(express.json());

// ✅ Tus rutas de autenticación
app.use('/api', authRoutes);

// ✅ Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado correctamente a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar a MongoDB Atlas:', err));

// ✅ Ruta de búsqueda de recetas
app.post('/api/recipes/search', async (req, res) => {
  const { objectName } = req.body;

  if (!objectName || !/^[a-zA-Z0-9\s]+$/.test(objectName)) {
    return res.status(400).json({ success: false, error: 'El nombre del objeto es inválido o está vacío.' });
  }

  try {
    const formattedName = objectName.split(' ').join('+');
    const url = `${DOFUSDB_API_URL}?slug.es[$search]=${formattedName}&level[$gte]=0&level[$lte]=200&lang=es`;

    console.log(`[DEBUG] URL construida: ${url}`);
    const response = await axios.get(url, {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "es-ES,es;q=0.9",
        Referer: "https://dofusdb.fr/",
      },
    });

    if (response.data.data.length === 0) {
      console.log(`[INFO] No se encontraron resultados para: ${objectName}`);
      return res.json({ success: true, data: null });
    }

    const item = response.data.data[0];
    const recipeDetails = await obtenerIngredientes(item.id);

    const formattedData = {
      name: item.name?.es || 'Nombre no disponible',
      recipe: recipeDetails
    };

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('[ERROR] Error al buscar la receta:', error.message);
    res.status(500).json({ success: false, error: 'Error al buscar la receta.' });
  }
});

// ✅ Ruta protegida para obtener el perfil
app.get('/api/perfil', verificarToken, (req, res) => {
  res.json({
    message: 'Perfil accedido correctamente',
    usuario: req.user
  });
});

// ✅ Si no encuentra ruta, sirve automáticamente el HTML correspondiente o error
// (Esto lo hace automáticamente express.static)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
// console.log('🔴 Cerrando sesión: Borrando token...');  
