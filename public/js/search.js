import { renderRecipe, asignarEventosCalculo } from './render.js';
import { calcularGanancia } from './calculo.js';

const form = document.getElementById('searchForm');
const resultsDiv = document.getElementById('results');

// Agregamos un evento para manejar el envío del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const objectName = document.getElementById("objectName").value.trim();
  console.log("[DEBUG] Nombre del objeto enviado:", objectName);

  if (!objectName) {
    resultsDiv.innerHTML =
      '<p style="color: red;">Por favor, ingresa el nombre de un objeto.</p>';
    return;
  }

  try {
    resultsDiv.innerHTML = "<p>Buscando...</p>";

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
      console.log("[DEBUG] Datos recibidos del servidor:", item);

      // Renderizar el objeto con la receta y los inputs de precio
      resultsDiv.innerHTML = `
        <h2>${item.name || "Nombre no disponible"}</h2>
        
        <h3>Precio de Venta:</h3>
        <input type="number" id="precioObjeto" class="price-input" placeholder="Ingrese precio">

        <h3>Receta:</h3>
        <ul id="ingredientes">${renderRecipe(item.recipe)}</ul>

        <h3>Total Gasto: <span id="totalGasto">0</span> K</h3>
        <h3>Ganancia: <span id="ganancia">0</span> K</h3>

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
      resultsDiv.innerHTML = "<p>No se encontraron resultados para tu búsqueda.</p>";
      console.log("[DEBUG] Respuesta sin datos:", data);
    }
  } catch (error) {
    console.error("[ERROR] Error en la búsqueda:", error);
    resultsDiv.innerHTML =
      '<p style="color: red;">Hubo un error al realizar la búsqueda. Inténtalo de nuevo más tarde.</p>';
  }
});
