export function calcularGanancia() {
  let totalGasto = 0;
  
  // Obtener la cantidad de objetos a fabricar
  const cantidadFabricarInput = document.getElementById("cantidadFabricar");
  const cantidadFabricar = cantidadFabricarInput ? parseInt(cantidadFabricarInput.value) || 1 : 1;
  
  console.log(`[DEBUG] Cantidad a fabricar: ${cantidadFabricar}`);

  // Verificar que la sección de ingredientes existe antes de acceder a sus datos
  const ingredientesElement = document.getElementById("ingredientes");
  if (!ingredientesElement || !ingredientesElement.dataset.ingredientes) {
    console.warn("[WARNING] No se encontraron ingredientes en el dataset.");
    return;
  }

  // Obtener los ingredientes desde el dataset
  const ingredientes = JSON.parse(ingredientesElement.dataset.ingredientes || "[]");
  console.log("[DEBUG] Ingredientes cargados:", ingredientes);

  let ingredientesTotalesHTML = "";

  ingredientes.forEach(ingrediente => {
    // Verificar si el input de precio del ingrediente existe
    const inputPrecio = document.getElementById(`precio-${ingrediente.id}`);
    
    if (!inputPrecio) {
      console.warn(`[WARNING] No se encontró el input para el ingrediente: ${ingrediente.name}`);
      return;
    }

    // Obtener el precio unitario ingresado por el usuario
    const precioUnitario = parseFloat(inputPrecio.value) || 0;
    console.log(`[DEBUG] Precio de ${ingrediente.name}: ${precioUnitario} K`);

    // Calcular el costo total del ingrediente
    totalGasto += precioUnitario * ingrediente.quantity;

    // Calcular cantidad total de ingredientes requeridos según la cantidad a fabricar
    const cantidadTotal = ingrediente.quantity * cantidadFabricar;
    ingredientesTotalesHTML += `
      <li>
        <img src="${ingrediente.image}" alt="${ingrediente.name}" style="width: 40px; height: 40px; vertical-align: middle;" />
        ${ingrediente.name}: <strong>${cantidadTotal}</strong> unidades
      </li>
    `;
  });

  // Verificar si el input del precio del objeto existe antes de obtener su valor
  const precioObjetoInput = document.getElementById("precioObjeto");
  const precioObjeto = precioObjetoInput ? parseFloat(precioObjetoInput.value) || 0 : 0;
  
  console.log("[DEBUG] Precio del objeto:", precioObjeto);

  // Calcular la ganancia correctamente
  const ganancia = (precioObjeto * cantidadFabricar) - totalGasto;
  const gananciaTotal = ganancia; // Ya se multiplica arriba por la cantidad a fabricar

  // Actualizar los valores en la interfaz
  const totalGastoElement = document.getElementById("totalGasto");
  if (totalGastoElement) totalGastoElement.textContent = totalGasto + " K";

  const gananciaElement = document.getElementById("ganancia");
  if (gananciaElement) gananciaElement.textContent = ganancia + " K";

  const gananciaTotalElement = document.getElementById("gananciaTotal");
  if (gananciaTotalElement) gananciaTotalElement.textContent = gananciaTotal + " K";

  const ingredientesTotalesElement = document.getElementById("ingredientesTotales");
  if (ingredientesTotalesElement) ingredientesTotalesElement.innerHTML = ingredientesTotalesHTML;

  console.log("[DEBUG] Cálculo completado: Gasto total:", totalGasto, "K | Ganancia:", ganancia, "K | Ganancia Total:", gananciaTotal, "K");
}
window.calcularGanancia = calcularGanancia; 
