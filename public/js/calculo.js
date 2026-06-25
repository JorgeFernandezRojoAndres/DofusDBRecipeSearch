export function calcularGanancia() {
  let gasto = 0;

  // Obtener la cantidad de objetos a fabricar
  const cantidadFabricarInput = document.getElementById("cantidadFabricar");
  const cantidadFabricar = cantidadFabricarInput ? parseInt(cantidadFabricarInput.value) || 1 : 1;

  console.log(`[DEBUG] Cantidad a fabricar: ${cantidadFabricar}`);

  // Obtener los ingredientes desde el dataset
  const ingredientesElement = document.getElementById("ingredientes");
  if (!ingredientesElement || !ingredientesElement.dataset.ingredientes) {
    console.warn("[WARNING] No se encontraron ingredientes en el dataset.");
    return;
  }

  const ingredientes = JSON.parse(ingredientesElement.dataset.ingredientes || "[]");
  console.log("[DEBUG] Ingredientes cargados:", ingredientes);

  let ingredientesTotalesHTML = "";

  ingredientes.forEach(ingrediente => {
    const inputPrecio = document.getElementById(`precio-${ingrediente.id}`);

    if (!inputPrecio) {
      console.warn(`[WARNING] No se encontró el input para el ingrediente: ${ingrediente.name}`);
      return;
    }

    const precioUnitario = parseFloat(inputPrecio.value) || 0;
    const costoIngrediente = precioUnitario * ingrediente.quantity;
    gasto += costoIngrediente;

    const cantidadTotal = ingrediente.quantity * cantidadFabricar;
    ingredientesTotalesHTML += `
      <li class="flex items-center gap-2 py-1">
        <img src="${ingrediente.image}" alt="${ingrediente.name}" class="w-8 h-8 object-contain rounded border border-outline-variant/30" />
        <span class="text-body-md text-white">${ingrediente.name}: <strong class="text-primary">${cantidadTotal}</strong> unidades</span>
      </li>
    `;
  });

  const gastoTotal = gasto * cantidadFabricar;

  const precioObjetoInput = document.getElementById("precioObjeto");
  const precioObjeto = precioObjetoInput ? parseFloat(precioObjetoInput.value) || 0 : 0;

  const gananciaUnidad = precioObjeto - gasto;
  const gananciaTotalVal = gananciaUnidad * cantidadFabricar;

  // Actualizar Gasto por unidad
  const gastoElement = document.getElementById("gasto");
  if (gastoElement) gastoElement.textContent = gasto.toLocaleString();

  // Actualizar Ganancia por unidad
  const gananciaElement = document.getElementById("ganancia");
  if (gananciaElement) gananciaElement.textContent = gananciaUnidad.toLocaleString();

  // Actualizar Gasto Total
  const gastoTotalElement = document.getElementById("gastoTotal");
  if (gastoTotalElement) gastoTotalElement.textContent = gastoTotal.toLocaleString();

  // Actualizar Ganancia Total
  const gananciaTotalElement = document.getElementById("gananciaTotal");
  if (gananciaTotalElement) gananciaTotalElement.textContent = gananciaTotalVal.toLocaleString();

  // Actualizar Ingredientes Totales
  const ingredientesTotalesElement = document.getElementById("ingredientesTotales");
  if (ingredientesTotalesElement) ingredientesTotalesElement.innerHTML = ingredientesTotalesHTML;

  console.log("[DEBUG] Cálculo completado:");
  console.log(` - Gasto por unidad: ${gasto} K`);
  console.log(` - Gasto Total: ${gastoTotal} K`);
  console.log(` - Ganancia por unidad: ${gananciaUnidad} K`);
  console.log(` - Ganancia total: ${gananciaTotalVal} K`);

  // Sincronizar con el blog
  if (typeof sincronizarConBlog === 'function') {
    sincronizarConBlog();
  }
}

window.calcularGanancia = calcularGanancia;
