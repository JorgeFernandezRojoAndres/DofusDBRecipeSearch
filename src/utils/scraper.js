const axios = require('axios');
require('dotenv').config(); 

console.log('[DEBUG] scraper.js ha sido cargado correctamente');

async function obtenerIngredientes(itemId) {
    try {
        // Construir la URL de la API con el ID del objeto
        const apiUrl = `https://api.dofusdb.fr/recipes?resultId=${itemId}&lang=es`;
        console.debug(`[DEBUG] Solicitando datos desde: ${apiUrl}`);

        // Hacer la solicitud HTTP
        const response = await axios.get(apiUrl);
        const data = response.data.data[0]; // Extraer el primer resultado de la API

        if (!data) {
            console.error(`[ERROR] No se encontraron datos para el objeto con ID: ${itemId}`);
            return [];
        }

        // Extraer los ingredientes y sus cantidades
        const ingredients = data.ingredients.map((ingredient, index) => ({
            id: ingredient.id,
            name: ingredient.name.es, // Nombre en español
            image: ingredient.img || '/default-image.png', // Imagen del ingrediente
            quantity: data.quantities[index] || 1 // Cantidad correspondiente
        }));

        console.debug('[DEBUG] Ingredientes extraídos correctamente:', ingredients);
        return ingredients;
    } catch (error) {
        console.error(`[ERROR] Error al obtener ingredientes:`, error.message);
        return [];
    }
}

// Exportar la función para ser utilizada en otros archivos
module.exports = { obtenerIngredientes };
