import { calcularGanancia } from './calculo.js';

// Función para renderizar listas de efectos
export const renderEffects = (effects) => {
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

// Función para renderizar la receta en el frontend con inputs de precios
export const renderRecipe = (recipe) => {
  if (!recipe || recipe.length === 0) {
    return '<li class="text-on-surface-variant text-body-md">Receta no disponible</li>';
  }

  return recipe.map(ingredient => {
    const inputId = `precio-${ingredient.id}`;
    return `
      <li class="flex items-center gap-3 py-3 border-b border-outline-variant/20 last:border-0">
        <img src="${ingredient.image}" alt="${ingredient.name}" class="w-10 h-10 object-contain rounded border border-outline-variant/30 bg-surface-container-high" />
        <div class="flex-1 min-w-0">
          <p class="text-body-md font-bold text-white truncate">${ingredient.name}</p>
          <p class="text-label-sm font-label-sm text-gray-300">Cantidad: ${ingredient.quantity || "N/A"}</p>
        </div>
        <div class="relative flex-shrink-0 w-28">
          <input type="number" class="price-input w-full bg-surface-container-lowest border border-outline-variant focus:border-primary text-on-surface p-2 pr-6 text-sm rounded outline-none transition-all" id="${inputId}" placeholder="Precio ud." />
          <span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 opacity-50">k</span>
        </div>
      </li>
    `;
  }).join("");
};

// ✅ Función mejorada para asignar eventos de cálculo a los inputs después de renderizar la receta
export function asignarEventosCalculo() {
  document.querySelectorAll(".price-input").forEach(input => {
    input.removeEventListener("input", calcularGanancia); // 🔥 Evita eventos duplicados
    input.addEventListener("input", () => {
      console.log(`[DEBUG] Evento disparado en: ${input.id}`);
      calcularGanancia();
    });
  });

  // También escuchar cambios en cantidad a fabricar y precio del objeto
  const cantidadFabricarInput = document.getElementById("cantidadFabricar");
  if (cantidadFabricarInput) {
    cantidadFabricarInput.removeEventListener("input", calcularGanancia);
    cantidadFabricarInput.addEventListener("input", calcularGanancia);
  }

  const precioObjetoInput = document.getElementById("precioObjeto");
  if (precioObjetoInput) {
    precioObjetoInput.removeEventListener("input", calcularGanancia);
    precioObjetoInput.addEventListener("input", calcularGanancia);
  }
}
