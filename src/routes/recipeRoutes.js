const express = require('express');
const router = express.Router();
const axios = require('axios');
const obtenerIngredientes = require('../utils/scraper'); // ✅ Asegúrate de que está bien importado

require('dotenv').config();

// Ruta para buscar recetas
router.post('/search', async (req, res) => {
  let { objectName } = req.body;

if (!objectName || objectName.trim() === '') {
  return res.status(400).json({ success: false, error: 'El nombre del objeto es obligatorio.' });
}

// Decodificar + a espacios si es necesario
objectName = decodeURIComponent(objectName).replace(/\+/g, ' ');



  try {
    const response = await axios.get(process.env.DOFUSDB_API_URL, {
      params: {
        'slug.es[search]': objectName,
        'level[$gte]': 0,
        'level[$lte]': 200,
        sort: '-id',
        lang: 'es',
      },
    });

    if (response.data.data.length === 0) {
      return res.json({ success: true, data: null });
    }

    const item = response.data.data[0];

    // ✅ Llamar correctamente a la función
    const recipeDetails = await obtenerIngredientes(item.id);

    const formattedData = {
      name: item.name?.es || 'Nombre no disponible',
      recipe: recipeDetails,
      image: item.img || '/default-image.png',
    };

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Error al buscar en la API:', error.message);
    res.status(500).json({ success: false, error: 'Error al buscar la receta.' });
  }
});

module.exports = router;
