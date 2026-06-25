document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('contenedor-recetas');
  
    try {
      const res = await fetch('data/topRecetas.json');
      const recetas = await res.json();
  
      recetas.forEach(receta => {
        const card = document.createElement('div');
        card.className = 'recipe-card rounded overflow-hidden';
  
        card.innerHTML = `
          <div class="bg-surface-container-low flex flex-col h-full">
            <div class="bg-surface-container-highest">
              <img src="${receta.image}" class="w-full h-48 object-cover" alt="${receta.name}">
            </div>
            <div class="p-md flex flex-col flex-1 bg-surface-container-low">
              <h5 class="text-title-md font-title-md text-primary mb-sm">${receta.name}</h5>
              <p class="text-body-md text-on-surface-variant mb-sm flex-1">${receta.descripcion}</p>
              <p class="text-label-sm font-label-sm text-on-surface-variant mb-md">Ingredientes: ${receta.ingredientes.join(', ')}</p>
              <a href="${receta.url}" class="inline-block self-start bg-primary text-on-primary font-bold py-2 px-4 text-label-sm font-label-sm outer-glow-gold transition-all active:scale-[0.98] rounded">Ver receta</a>
            </div>
          </div>
        `;
  
        contenedor.appendChild(card);
      });
    } catch (err) {
      console.error('Error al cargar recetas destacadas:', err);
      contenedor.innerHTML = `<p class="text-body-lg text-error text-center py-xl">No se pudieron cargar las recetas. Intentalo más tarde.</p>`;
    }
  });
  