import { renderRecipe, asignarEventosCalculo } from './render.js';
import { calcularGanancia } from './calculo.js';
let imagenBuscada = "";

const form = document.getElementById('searchForm');
const resultContainer = document.getElementById('resultContainer');
const emptyState = document.getElementById('emptyState');

// Referencias a los elementos del nuevo layout dinámico
const nombreObjeto = document.getElementById('nombreObjeto');
const imagenObjeto = document.getElementById('imagenObjeto');
const descripcionObjeto = document.getElementById('descripcionObjeto');
const efectosObjeto = document.getElementById('efectosObjeto');
const ingredientesList = document.getElementById('ingredientes');
const recipeItemsCount = document.getElementById('recipeItemsCount');

const precioObjeto = document.getElementById('precioObjeto');
const cantidadFabricar = document.getElementById('cantidadFabricar');
const gasto = document.getElementById('gasto');
const ganancia = document.getElementById('ganancia');
const gananciaTotal = document.getElementById('gananciaTotal');
const gastoTotal = document.getElementById('gastoTotal');
const ingredientesTotalesList = document.getElementById('ingredientesTotales');

function mostrarResultados(show) {
  if (resultContainer) resultContainer.style.display = show ? 'grid' : 'none';
  if (emptyState) emptyState.style.display = show ? 'none' : 'block';
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const objectNameRaw = document.getElementById("objectName").value.trim();
  const objectName = objectNameRaw.normalize("NFC");

  console.log("[DEBUG] Nombre del objeto enviado:", objectName);

  if (!objectName) {
    mostrarResultados(false);
    return;
  }

  try {
    mostrarResultados(true);
    if (nombreObjeto) nombreObjeto.textContent = "Buscando...";
    if (imagenObjeto) imagenObjeto.innerHTML = "";
    if (descripcionObjeto) descripcionObjeto.textContent = "";
    if (efectosObjeto) efectosObjeto.innerHTML = "";
    if (ingredientesList) ingredientesList.innerHTML = "<li class='text-on-surface-variant'>Cargando...</li>";

    const response = await fetch("/api/recipes/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectName }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      const item = data.data;
      window.item = item;
      imagenBuscada = item.image || item.img || "/default-image.png";

      // Nombre
      if (nombreObjeto) nombreObjeto.textContent = item.name || "Nombre no disponible";
      if (recipeItemsCount) recipeItemsCount.textContent = item.recipe ? `${item.recipe.length} INGREDIENTES` : "RECETA";

      // Imagen
      if (imagenObjeto) {
        imagenObjeto.innerHTML = item.image
          ? `<img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-contain metallic-border p-2 bg-surface-container-high rounded" />`
          : "";
      }

      // Descripción
      if (descripcionObjeto) {
        descripcionObjeto.textContent = item.description || "";
      }

      // Efectos
      if (efectosObjeto && item.effects) {
        efectosObjeto.innerHTML = `
          <h3 class="text-title-md font-title-md text-primary mb-sm">Efectos</h3>
          <div class="space-y-1">
            ${item.effects.map(ef => `
              <div class="flex items-center gap-2 text-body-md text-on-surface-variant">
                <span class="material-symbols-outlined text-[16px] text-primary">flash_on</span>
                <span>${ef.characteristic || "Efecto"}: ${ef.from || 0} a ${ef.to || 0}</span>
              </div>
            `).join("")}
          </div>
        `;
      }

      // Receta (ingredientes)
      if (ingredientesList) {
        ingredientesList.innerHTML = renderRecipe(item.recipe);
      }

      // Resetear inputs de cálculo
      if (precioObjeto) precioObjeto.value = "";
      if (cantidadFabricar) cantidadFabricar.value = "1";
      if (gasto) gasto.textContent = "0";
      if (ganancia) ganancia.textContent = "0";
      if (gastoTotal) gastoTotal.textContent = "0";
      if (gananciaTotal) gananciaTotal.textContent = "0";
      if (ingredientesTotalesList) ingredientesTotalesList.innerHTML = "";

      if (item.recipe) {
        const ingredientesData = item.recipe.map(ing => ({
          id: ing.id,
          name: ing.name,
          quantity: ing.quantity
        }));
        if (ingredientesList) {
          ingredientesList.dataset.ingredientes = JSON.stringify(ingredientesData);
        }
      }

      asignarEventosCalculo();

    } else {
      mostrarResultados(false);
      console.log("[DEBUG] Respuesta sin datos:", data);
    }
  } catch (error) {
    console.error("[ERROR] Error en la búsqueda:", error);
    mostrarResultados(false);
  }
});

function sincronizarConBlog() {
  const nombre = document.getElementById("nombreObjeto")?.textContent;
  const descripcion = window.item?.description || "";
  const imagen = imagenBuscada || "/default-image.png";
  const id = window.item?.id || null;
  const slug = window.item?.slug || null;

  const cantidad = parseInt(document.getElementById("cantidadFabricar")?.value || "1");
  const valorUnitario = parseInt(document.getElementById("precioObjeto")?.value || "0");

  const gastoTotalText = document.getElementById("gastoTotal")?.textContent?.replace(/[^0-9]/g, "") || "0";
  const gananciaTotalText = document.getElementById("gananciaTotal")?.textContent?.replace(/[^0-9]/g, "") || "0";
  const gastoTotalVal = parseInt(gastoTotalText);
  const gananciaTotalVal = parseInt(gananciaTotalText);

  const valor = valorUnitario;
  const gasto = cantidad > 0 ? Math.round(gastoTotalVal / cantidad) : 0;
  const ganancia = cantidad > 0 ? Math.round(gananciaTotalVal / cantidad) : 0;

  const listaIngredientes = JSON.parse(document.getElementById("ingredientes")?.dataset?.ingredientes || "[]");
  const ingredientes = listaIngredientes.map(ing => ing.name);

  if (!nombre || valor === 0 || isNaN(valor)) {
    console.warn("[BLOG] No se sincronizó porque falta el nombre o el valor es inválido");
    return;
  }

  fetch("/api/posts/updateOrCreate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, slug, nombre, descripcion, imagen, valor, gasto, ganancia, ingredientes })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log("[BLOG] Objeto sincronizado correctamente con el blog:", data.mensaje);
      } else {
        console.warn("[BLOG] Error al sincronizar:", data.error);
      }
    })
    .catch(err => console.error("[BLOG] Error de red al sincronizar:", err));
}

window.sincronizarConBlog = sincronizarConBlog;
