const express = require('express');
const path = require('path');
const axios = require('axios');
const { obtenerIngredientes } = require('./src/utils/scraper');
const authRoutes = require('./src/routes/authRoutes');
const mongoose = require('mongoose');
const verificarToken = require('./src/middlewares/authMiddleware');
const blogRoutes = require('./src/routes/blogRoutes');
require('dotenv').config();

const app = express();
const DOFUSDB_API_URL = process.env.DOFUSDB_API_URL || "https://api.dofusdb.fr/items";

// Función para quitar acentos
function quitarAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rutas
app.use('/api', blogRoutes);
app.use('/api', authRoutes);

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado correctamente a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar a MongoDB Atlas:', err));

// Ruta búsqueda recetas con fallback de acentos
app.post('/api/recipes/search', async (req, res) => {
  let { objectName } = req.body;

  if (!objectName || !/^[\p{L}0-9\s+]+$/u.test(objectName)) {
    return res.status(400).json({ success: false, error: 'El nombre del objeto es inválido o está vacío.' });
  }

  // Decodificar + a espacios
  objectName = decodeURIComponent(objectName).replace(/\+/g, ' ');

  // Función interna para consultar la API externa
  async function buscarEnApi(nombreBuscado) {
    const formattedName = nombreBuscado.split(' ').join('+');
    const url = `${DOFUSDB_API_URL}?slug.es[$search]=${formattedName}&level[$gte]=0&level[$lte]=200&lang=es`;

    console.log(`[DEBUG] URL construida: ${url}`);

    try {
      const response = await axios.get(url, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "es-ES,es;q=0.9",
          Referer: "https://dofusdb.fr/",
        },
      });

      if (response.data.data.length === 0) {
        console.log(`[INFO] No se encontraron resultados para: ${nombreBuscado}`);
        return null;
      }

      const item = response.data.data[0];
      const recipeDetails = await obtenerIngredientes(item.id);

      return {
        name: item.name?.es || 'Nombre no disponible',
        recipe: recipeDetails,
        image: item.image || ""
      };
    } catch (error) {
      console.error('[ERROR] Error al buscar la receta:', error.message);
      throw error;
    }
  }

  try {
    // Primero busco con el nombre original
    let resultado = await buscarEnApi(objectName);

    // Si no encontró, busco sin acentos (fallback)
    if (!resultado) {
      const nombreSinAcentos = quitarAcentos(objectName);
      resultado = await buscarEnApi(nombreSinAcentos);
    }

    if (!resultado) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: resultado });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al buscar la receta.' });
  }
});

// Ruta protegida perfil
app.get('/api/perfil', verificarToken, (req, res) => {
  res.json({
    message: 'Perfil accedido correctamente',
    usuario: req.user
  });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
