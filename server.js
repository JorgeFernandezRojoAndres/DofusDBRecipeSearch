const express = require('express');
const path = require('path');
const axios = require('axios');
const { obtenerIngredientes } = require('./src/utils/scraper');
 
console.log('[DEBUG] Tipo de obtenerIngredientes:', typeof obtenerIngredientes);
const app = express();
const DOFUSDB_API_URL = process.env.DOFUSDB_API_URL || "https://api.dofusdb.fr/items";
const mongoose = require('mongoose');
require('dotenv').config();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado correctamente a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar a MongoDB Atlas:', err));
// Ruta para la API de búsqueda de recetas
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

    // Delegar el scraping de ingredientes a la función importada
    const recipeDetails = await obtenerIngredientes(item.id);

    // Formatear los datos para la respuesta
    const formattedData = {
      name: item.name?.es || 'Nombre no disponible',
      recipe: recipeDetails // Solo devolvemos el nombre y la receta
    };

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('[ERROR] Error al buscar la receta:', error.message);
    res.status(500).json({ success: false, error: 'Error al buscar la receta.' });
  }
});

// Ruta base para servir el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

