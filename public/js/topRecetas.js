document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('contenedor-recetas');
  
    try {
      const res = await fetch('data/topRecetas.json');
      const recetas = await res.json();
  
      recetas.forEach(receta => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
  
        card.innerHTML = `
          <div class="card mb-4 shadow-sm">
            <img src="${receta.image}" class="card-img-top" alt="${receta.name}">
            <div class="card-body">
              <h5 class="card-title">${receta.name}</h5>
              <p class="card-text">${receta.descripcion}</p>
              <p class="text-muted small">Ingredientes: ${receta.ingredientes.join(', ')}</p>
              <a href="${receta.url}" class="btn btn-primary">Ver receta</a>
            </div>
          </div>
        `;
  
        contenedor.appendChild(card);
      });
    } catch (err) {
      console.error('Error al cargar recetas destacadas:', err);
      contenedor.innerHTML = `<p class="text-danger">No se pudieron cargar las recetas. Intentalo más tarde.</p>`;
    }
  });
  