const axios = require('axios');
const puppeteer = require('puppeteer');
require('dotenv').config();

console.log('[DEBUG] scraperCompleto.js cargado correctamente');

async function obtenerIngredientes(itemId, nombreObjeto = '') {
    try {
        const apiUrl = `https://api.dofusdb.fr/recipes?resultId=${itemId}&lang=fr`;
        console.debug(`[DEBUG] Solicitando datos de receta desde: ${apiUrl}`);
        const response = await axios.get(apiUrl);
        const data = response.data.data[0];

        if (!data) {
            console.warn(`[WARN] No se encontraron datos de receta para itemId: ${itemId}. Fallback imagen por slug...`);
            return await obtenerImagenPorSlug(nombreObjeto) || await obtenerImagenBase(itemId, nombreObjeto);
        }

        const ingredients = await Promise.all(data.ingredients.map(async (ingredient, index) => {
            let imageUrl = ingredient.img || '/images/default-item.png';

            if (imageUrl.includes('default') || isGenericImage(imageUrl)) {
                console.warn(`[WARN] Imagen genérica para "${ingredient.name.es || ingredient.name.fr}". Intentando obtener imagen real...`);
                imageUrl = await obtenerImagenRealPorId(ingredient.id, ingredient.name.es || ingredient.name.fr);
            }

            return {
                id: ingredient.id,
                name: ingredient.name.es || ingredient.name.fr,
                image: imageUrl,
                quantity: data.quantities[index] || 1
            };
        }));

        return ingredients;

    } catch (error) {
        console.warn(`[WARN] Error al obtener receta para itemId ${itemId}. Intentando fallback...`, error.message);
        return await obtenerImagenPorSlug(nombreObjeto) || await obtenerImagenBase(itemId, nombreObjeto);
    }
}

function isGenericImage(url) {
    return url.includes('default') || url.includes('/img/items/') && url.match(/\/img\/items\/(0|1|default|.*default)/);
}

async function obtenerImagenRealPorId(itemId, nombreObjeto = '') {
    try {
        const apiUrl = `https://api.dofusdb.fr/items/${itemId}?lang=es`;
        console.debug(`[DEBUG] Solicitando imagen base desde: ${apiUrl}`);
        const response = await axios.get(apiUrl);
        const item = response.data;

        if (item && item.img) {
            console.log(`[INFO] Imagen obtenida por itemId ${itemId}: ${item.img}`);
            return item.img;
        } else {
            console.warn(`[WARN] No se encontró imagen real para itemId ${itemId}. Intentando fallback por slug...`);
            return await obtenerImagenPorSlug(nombreObjeto) || '/images/default-item.png';
        }
    } catch (error) {
        console.error(`[ERROR] Falla al obtener imagen real para itemId ${itemId}.`, error.message);
        return await obtenerImagenPorSlug(nombreObjeto) || '/images/default-item.png';
    }
}

// 🧩 Nuevo: Fallback por slug (nombre)
async function obtenerImagenPorSlug(nombreObjeto) {
    if (!nombreObjeto) return null;
    const slug = nombreObjeto.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const url = `https://api.dofusdb.fr/items?slug.es=${slug}&lang=es`;
    console.debug(`[DEBUG] Intentando obtener imagen por slug: ${slug}`);

    try {
        const response = await axios.get(url);
        const item = response.data.data[0];
        if (item && item.img) {
            console.log(`[INFO] Imagen obtenida por slug "${slug}": ${item.img}`);
            return [{ id: item.id, name: item.name.es || item.name.fr, image: item.img, quantity: 1 }];
        }
    } catch (err) {
        console.warn(`[WARN] Falla al obtener imagen por slug "${slug}".`, err.message);
    }
    return null;
}

// 🧩 Nuevo: Scraping con Puppeteer (opcional)
async function obtenerImagenConPuppeteer(nombreObjeto) {
    const url = `https://dofusdb.fr/es/database/objects`;
    console.debug(`[DEBUG] Scraping con Puppeteer para "${nombreObjeto}"`);
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url);

    // Simular búsqueda
    await page.type('input[placeholder="Search"]', nombreObjeto);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000); // Espera a que cargue resultados

    // Capturar imagen
    const imageUrl = await page.evaluate(() => {
        const imgElement = document.querySelector('.q-img_content img, .q-img_content');
        return imgElement ? (imgElement.src || imgElement.style.backgroundImage.replace(/url\(["']?|["']?\)/g, '')) : null;
    });

    await browser.close();
    if (imageUrl) {
        console.log(`[INFO] Imagen real por Puppeteer: ${imageUrl}`);
        return [{ id: 'puppeteer', name: nombreObjeto, image: imageUrl, quantity: 1 }];
    } else {
        console.warn(`[WARN] Puppeteer no encontró imagen para "${nombreObjeto}".`);
        return null;
    }
}

async function obtenerImagenBase(itemId, nombreObjeto) {
    return [{ id: itemId, name: nombreObjeto || 'Desconocido', image: await obtenerImagenRealPorId(itemId, nombreObjeto), quantity: 1 }];
}
(async () => {
  console.log(await obtenerIngredientes(10629));  // Cambia el itemId según quieras probar
})();

module.exports = { obtenerIngredientes, obtenerImagenPorSlug, obtenerImagenConPuppeteer };
