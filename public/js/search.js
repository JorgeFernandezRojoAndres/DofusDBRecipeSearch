import { renderRecipe, asignarEventosCalculo } from './render.js';
import { calcularGanancia } from './calculo.js';
let imagenBuscada = "";
const form = document.getElementById('searchForm');
const recipeSummary = document.getElementById('recipeSummary');
const calculationDetails = document.getElementById('calculationDetails');
const ingredientesList = document.getElementById('ingredientes');
const ingredientesTotalesList = document.getElementById('ingredientesTotales');

// Agregamos un evento para manejar el envío del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const objectName = document.getElementById("objectName").value.trim();
  console.log("[DEBUG] Nombre del objeto enviado:", objectName);

  if (!objectName) {
    recipeSummary.innerHTML =
      '<p style="color: red;">Por favor, ingresa el nombre de un objeto.</p>';
    calculationDetails.innerHTML = "";
    return;
  }

  try {
    recipeSummary.innerHTML = "<p>Buscando...</p>";
    calculationDetails.innerHTML = "";

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
      imagenBuscada = item.image || ""; // ✅ Guardamos la imagen globalmente
      console.log("[DEBUG] Datos recibidos del servidor:", data);
      console.log("[DEBUG] Datos recibidos del servidor:", item);

      // Renderizar la información en `recipeSummary`
      recipeSummary.innerHTML = `
        <h2 id="nombreObjeto">${item.name || "Nombre no disponible"}</h2>
        
        <h3>Precio de Venta:</h3>
        <input type="number" id="precioObjeto" class="price-input" placeholder="Ingrese precio">

        <h3>Receta:</h3>
        <ul id="ingredientes">${renderRecipe(item.recipe)}</ul>

        <h3>Gasto: <span id="gasto">0</span> K</h3>
        <h3>Ganancia: <span id="ganancia">0</span> K</h3>
      `;

      // Renderizar la sección de cálculos en `calculationDetails`
      calculationDetails.innerHTML = `
        <label>Cantidad a fabricar:
          <input type="number" id="cantidadFabricar" value="1" min="1" class="price-input">
        </label>

        <h3>Ganancia Total: <span id="gananciaTotal">0</span> K</h3>

        <h3>Ingredientes Totales Necesarios:</h3>
        <ul id="ingredientesTotales"></ul>
      `;

      // Guardar ingredientes en dataset para cálculos
      document.getElementById("ingredientes").dataset.ingredientes = JSON.stringify(item.recipe);

      // Asignar eventos dinámicamente para calcular la ganancia al modificar los valores
      asignarEventosCalculo();

    } else {
      recipeSummary.innerHTML = "<p>No se encontraron resultados para tu búsqueda.</p>";
      calculationDetails.innerHTML = "";
      console.log("[DEBUG] Respuesta sin datos:", data);
    }
  } catch (error) {
    console.error("[ERROR] Error en la búsqueda:", error);
    recipeSummary.innerHTML =
      '<p style="color: red;">Hubo un error al realizar la búsqueda. Inténtalo de nuevo más tarde.</p>';
    calculationDetails.innerHTML = "";
  }
});

function sincronizarConBlog() {
  const nombre = document.getElementById("nombreObjeto")?.textContent;
  const descripcion = ""; // Se puede enriquecer más adelante
  const imagen = imagenBuscada;


  const valor = parseInt(document.getElementById("precioObjeto")?.value || "0");
  const gasto = parseInt(document.getElementById("gasto")?.textContent || "0");
  const ganancia = parseInt(document.getElementById("ganancia")?.textContent || "0");
  const listaIngredientes = JSON.parse(document.getElementById("ingredientes")?.dataset.ingredientes || "[]");
  const ingredientes = listaIngredientes.map(ing => ing.name);

  if (!nombre || valor === 0 || isNaN(valor)) {
    console.warn("[BLOG] No se sincronizó porque falta el nombre o el valor es inválido");
    return;
  }

  fetch("/api/posts/updateOrCreate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre,
      descripcion,
      imagen,
      valor,
      ingredientes
    })
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
