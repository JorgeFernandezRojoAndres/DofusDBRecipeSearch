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
    return "<li>Receta no disponible</li>";
  }

  return recipe.map(ingredient => {
    const inputId = `precio-${ingredient.id}`;
    return `
      <li>
        <img src="${ingredient.image}" alt="${ingredient.name}" style="width: 40px; height: 40px; vertical-align: middle;" />
        ${ingredient.name} (Cantidad: ${ingredient.quantity || "N/A"})
        <input type="number" class="price-input" id="${inputId}" placeholder="Precio por unidad">
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
}
