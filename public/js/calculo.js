// calculo.js
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
  