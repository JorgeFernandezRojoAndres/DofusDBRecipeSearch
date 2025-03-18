export function renderRecipe(recipe) {
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
}

export function renderResults(item) {
    const resultsDiv = document.getElementById("results");
    if (!resultsDiv) {
        console.error("[ERROR] No se encontró el contenedor #results en el HTML.");
        return;
    }

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

    document.getElementById("ingredientes").dataset.ingredientes = JSON.stringify(item.recipe);
}
