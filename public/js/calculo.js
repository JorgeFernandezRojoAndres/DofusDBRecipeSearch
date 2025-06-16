export function calcularGanancia() {
  let gasto = 0; // Reiniciamos el gasto

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

    // Obtener el precio unitario ingresado por el usuario
    const precioUnitario = parseFloat(inputPrecio.value) || 0;
    console.log(`[DEBUG] Precio de ${ingrediente.name}: ${precioUnitario} K`);

    // 🔥 Calcular el costo total del ingrediente (precio unitario * cantidad requerida)
    const costoIngrediente = precioUnitario * ingrediente.quantity;
    gasto += costoIngrediente; // Sumar al gasto total de la receta

    // Calcular cantidad total de ingredientes requeridos según la cantidad a fabricar
    const cantidadTotal = ingrediente.quantity * cantidadFabricar;
    ingredientesTotalesHTML += `
      <li>
        <img src="${ingrediente.image}" alt="${ingrediente.name}" style="width: 40px; height: 40px; vertical-align: middle;" />
        ${ingrediente.name}: <strong>${cantidadTotal}</strong> unidades
      </li>
    `;
  });

  // 🔥 Calcular el Gasto Total multiplicando el gasto base por la cantidad a fabricar
  const gastoTotal = gasto * cantidadFabricar;

  // Verificar si el input del precio del objeto existe antes de obtener su valor
  const precioObjetoInput = document.getElementById("precioObjeto");
  const precioObjeto = precioObjetoInput ? parseFloat(precioObjetoInput.value) || 0 : 0;

  console.log("[DEBUG] Precio del objeto:", precioObjeto);

  // Calcular la ganancia correctamente
  const gananciaUnidad = precioObjeto - gasto;
  const gananciaTotal = gananciaUnidad * cantidadFabricar;


  // ✅ Actualizar el Gasto en la sección verde
  const gastoElement = document.getElementById("gasto");
  if (gastoElement) gastoElement.textContent = `${gasto} K`;

  // ✅ Actualizar la Ganancia en la sección verde
  const gananciaElement = document.getElementById("ganancia");
  if (gananciaElement) gananciaElement.textContent = `${gananciaUnidad} K`;

  // ✅ Actualizar la Ganancia Total en la sección azul
  const gananciaTotalElement = document.getElementById("gananciaTotal");
  if (gananciaTotalElement) gananciaTotalElement.textContent = `${gananciaTotal} K`;

  // ✅ Restaurar la actualización de "Gasto Total" en la sección azul
  let gastoTotalElement = document.getElementById("gastoTotal");
  if (!gastoTotalElement) {
    const calculationDetails = document.getElementById("calculationDetails");
    gastoTotalElement = document.createElement("h3");
    gastoTotalElement.id = "gastoTotal";
    calculationDetails.appendChild(gastoTotalElement);
  }
  gastoTotalElement.textContent = `Gasto Total: ${gastoTotal} K`;

  // Actualizar la lista de ingredientes totales necesarios
  const ingredientesTotalesElement = document.getElementById("ingredientesTotales");
  if (ingredientesTotalesElement) ingredientesTotalesElement.innerHTML = ingredientesTotalesHTML;

  console.log("[DEBUG] Cálculo completado:");
console.log(` - Gasto: ${gasto} K`);
console.log(` - Gasto Total: ${gastoTotal} K`);
console.log(` - Ganancia por unidad: ${gananciaUnidad} K`);
console.log(` - Ganancia total: ${gananciaTotal} K`);



  // ✅ Sincronizar con el blog (solo si la función está definida)
  if (typeof sincronizarConBlog === 'function') {
    sincronizarConBlog();
  }
}

// Asegurar que la función sea accesible globalmente
window.calcularGanancia = calcularGanancia;
