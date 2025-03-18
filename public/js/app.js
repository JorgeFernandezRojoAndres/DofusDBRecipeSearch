// Seleccionamos el formulario y el div donde se mostrarán los resultados
const form = document.getElementById('searchForm');
const resultsDiv = document.getElementById('results');

// Función para renderizar listas de efectos
const renderEffects = (effects) => {
  if (!effects || effects.length === 0) {
    return "<li>Sin efectos disponibles</li>";
  }
  return effects
    .map(
      (effect) =>
        `<li>${effect.characteristic || "Efecto desconocido"}: ${effect.from || 0} a ${effect.to || 0}</li>`
    )
    .join("");
};

// Nueva función para calcular gasto, ganancia y cantidad total de ingredientes
function calcularGanancia() {
  let totalGasto = 0;
  const cantidadFabricar = parseInt(document.getElementById("cantidadFabricar").value) || 1;
  const ingredientes = JSON.parse(document.getElementById("ingredientes").dataset.ingredientes || "[]");

  let ingredientesTotalesHTML = "";

  ingredientes.forEach(ingrediente => {
    const precioUnitario = parseFloat(document.getElementById(`precio-${ingrediente.id}`)?.value) || 0;
    totalGasto += precioUnitario * ingrediente.quantity;

    // Calcular cantidad total de ingredientes requeridos
    const cantidadTotal = ingrediente.quantity * cantidadFabricar;
    ingredientesTotalesHTML += `
      <li>
        <img src="${ingrediente.image}" alt="${ingrediente.name}" style="width: 40px; height: 40px; vertical-align: middle;" />
        ${ingrediente.name}: <strong>${cantidadTotal}</strong> unidades
      </li>
    `;
  });

  const precioObjeto = parseFloat(document.getElementById("precioObjeto").value) || 0;
  const ganancia = precioObjeto - totalGasto;
  const gananciaTotal = ganancia * cantidadFabricar;

  document.getElementById("totalGasto").textContent = totalGasto + " K";
  document.getElementById("ganancia").textContent = ganancia + " K";
  document.getElementById("gananciaTotal").textContent = gananciaTotal + " K";
  document.getElementById("ingredientesTotales").innerHTML = ingredientesTotalesHTML;
}

// Función para renderizar la receta en el frontend con inputs de precios
const renderRecipe = (recipe) => {
  if (!recipe || recipe.length === 0) {
    return "<li>Receta no disponible</li>";
  }
  return recipe.map(ingredient => `
    <li>
      <img src="${ingredient.image}" alt="${ingredient.name}" style="width: 40px; height: 40px; vertical-align: middle;" />
      ${ingredient.name} (Cantidad: ${ingredient.quantity || "N/A"})
      <input type="number" class="price-input" id="precio-${ingredient.id}" placeholder="Precio por unidad" oninput="calcularGanancia()">
    </li>
  `).join("");
};

// Agregamos un evento para manejar el envío del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const objectName = document.getElementById("objectName").value.trim();
  console.log("Nombre del objeto enviado:", objectName);

  if (!objectName) {
    resultsDiv.innerHTML =
      '<p style="color: red;">Por favor, ingresa el nombre de un objeto.</p>';
    return;
  }

  try {
    // Mostrar mensaje de búsqueda
    resultsDiv.innerHTML = "<p>Buscando...</p>";

    // Realizar la solicitud al servidor
    const response = await fetch("/api/recipes/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectName }),
    });

    // Parsear la respuesta JSON
    const data = await response.json();

    if (data.success && data.data) {
      const item = data.data;
      console.log("Datos recibidos del servidor:", item);

      // Renderizar el objeto con la receta y los inputs de precio
      resultsDiv.innerHTML = `
        <h2>${item.name || "Nombre no disponible"}</h2>
        
        <h3>Precio de Venta:</h3>
        <input type="number" id="precioObjeto" class="price-input" placeholder="Ingrese precio" oninput="calcularGanancia()">

        <h3>Receta:</h3>
        <ul id="ingredientes">${renderRecipe(item.recipe)}</ul>

        <h3>Total Gasto: <span id="totalGasto">0</span> K</h3>
        <h3>Ganancia: <span id="ganancia">0</span> K</h3>

        <label>Cantidad a fabricar:
          <input type="number" id="cantidadFabricar" value="1" min="1" class="price-input" oninput="calcularGanancia()">
        </label>

        <h3>Ganancia Total: <span id="gananciaTotal">0</span> K</h3>

        <h3>Ingredientes Totales Necesarios:</h3>
        <ul id="ingredientesTotales"></ul>
      `;

      // Guardar ingredientes en dataset para cálculos
      document.getElementById("ingredientes").dataset.ingredientes = JSON.stringify(item.recipe);

    } else {
      // Mostrar mensaje si no hay resultados
      resultsDiv.innerHTML =
        "<p>No se encontraron resultados para tu búsqueda.</p>";
      console.log("Respuesta sin datos:", data);
    }
  } catch (error) {
    // Manejo de errores en la solicitud
    console.error("Error en la búsqueda:", error);
    resultsDiv.innerHTML =
      '<p style="color: red;">Hubo un error al realizar la búsqueda. Inténtalo de nuevo más tarde.</p>';
  }
});
