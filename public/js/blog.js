document.addEventListener('DOMContentLoaded', () => {  
  const contenedorPosts = document.getElementById('contenedor-posts');  
  const ordenarPorSelect = document.getElementById('ordenarPor');  
  const filtroValorInput = document.getElementById('filtroValor');  
  const aplicarFiltrosBtn = document.getElementById('aplicarFiltros');  
  const formComentario = document.getElementById('formComentario');  
  const comentariosModal = new bootstrap.Modal(document.getElementById('comentariosModal'));  
  let paginaActual = 1;
  const limitePorPagina = 6;

  cargarPosts();  
  aplicarFiltrosBtn.addEventListener('click', () => {
    paginaActual = 1;
    cargarPosts();
  });  
  formComentario.addEventListener('submit', enviarComentario);  

  async function cargarPosts() {  
    try {  
      const ordenarPor = ordenarPorSelect.value;  
      const filtroValor = filtroValorInput.value;  
      const url = `/api/posts?ordenarPor=${ordenarPor}&filtroValor=${filtroValor}&page=${paginaActual}&limit=${limitePorPagina}`;

      const res = await fetch(url);  
      const data = await res.json();  

      if (!data.success) throw new Error(data.error || 'Error al cargar los posts');

      renderizarPosts(data.data);
      renderizarPaginacion(data.total, limitePorPagina);
    } catch (error) {  
      console.error('Error:', error);  
      contenedorPosts.innerHTML = `<div class="text-center py-xl">  
        <p class="text-body-lg text-error">Error al cargar los posts. Por favor, intenta de nuevo más tarde.</p>  
      </div>`;  
    }  
  }  

  function renderizarPosts(posts) {  
    if (!posts || posts.length === 0) {  
      contenedorPosts.innerHTML = `<div class="text-center py-xl">  
        <p class="text-body-lg text-on-surface-variant">No hay posts disponibles con los filtros actuales.</p>  
      </div>`;  
      return;  
    }  

    contenedorPosts.innerHTML = '';  

    posts.forEach(post => {  
      const fechaActualizacion = new Date(post.fechaActualizacion);  
      const tiempoTranscurrido = obtenerTiempoTranscurrido(fechaActualizacion);  

      const card = document.createElement('div');
      card.className = 'recipe-card rounded overflow-hidden mb-lg';
      card.innerHTML = `
        <div class="bg-surface-container-low">
          <img loading="lazy" src="${post.imagen || 'images/default-item.png'}" class="w-full h-48 object-cover" alt="${post.nombre}">
        </div>
        <div class="p-md text-center bg-surface-container-low">
          <h5 class="text-title-md font-title-md text-primary mb-sm">${post.nombre}</h5>
          ${post.descripcion ? `<p class="text-body-md text-on-surface-variant italic mb-sm">${post.descripcion}</p>` : ''}
          <p class="text-label-sm font-label-sm text-on-surface-variant mb-sm">${tiempoTranscurrido}</p>
          <p class="text-body-md font-bold text-error">Gasto: ${post.gasto || 0} kamas</p>
          <p class="text-body-md font-bold text-green-500">Valor: ${post.valor} kamas</p>
          ${post.ganancia !== undefined ? `<p class="text-body-md font-bold" style="color: ${post.ganancia >= 0 ? '#22c55e' : '#ffb4ab'}">
            ${post.ganancia >= 0 ? 'Ganancia' : 'Pérdida'}: ${Math.abs(post.ganancia)} kamas</p>` : ''}
          <div class="flex justify-center gap-2 mt-md">
            <button class="like-btn border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-all px-3 py-1 text-label-sm font-label-sm rounded" data-id="${post._id}">
              👍 ${post.likes || 0}
            </button>
            <button class="comentario-btn border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-all px-3 py-1 text-label-sm font-label-sm rounded" data-id="${post._id}">
              💬 Comentarios
            </button>
          </div>
        </div>
      `;

      contenedorPosts.appendChild(card);  
    });  

    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', manejarLike);
    });
    document.querySelectorAll('.comentario-btn').forEach(btn => {
      btn.addEventListener('click', mostrarComentarios);
    });
  }

  function renderizarPaginacion(totalPosts, postsPorPagina) {
    let paginacion = document.getElementById('paginacion');
    if (!paginacion) {
      paginacion = document.createElement('ul');
      paginacion.id = 'paginacion';
      paginacion.className = 'flex justify-center gap-2 mt-lg';
      contenedorPosts.after(paginacion);
    }
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(totalPosts / postsPorPagina);

    for (let i = 1; i <= totalPaginas; i++) {
      const li = document.createElement('li');
      li.className = (i === paginaActual 
        ? 'bg-primary text-on-primary font-label-sm font-label-sm px-3 py-1 rounded cursor-pointer' 
        : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary font-label-sm font-label-sm px-3 py-1 rounded cursor-pointer transition-all');
      li.innerHTML = `${i}`;
      li.addEventListener('click', (e) => {
        e.preventDefault();
        paginaActual = i;
        cargarPosts();
      });
      paginacion.appendChild(li);
    }
  }

  function obtenerTiempoTranscurrido(fecha) {
    const ahora = new Date();
    const segundos = Math.floor((ahora - fecha) / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    if (dias > 0) return `Actualizado hace ${dias} día(s)`;
    if (horas > 0) return `Actualizado hace ${horas} hora(s)`;
    if (minutos > 0) return `Actualizado hace ${minutos} minuto(s)`;
    return `Actualizado hace unos segundos`;
  }

  async function enviarComentario(e) {
    e.preventDefault();
    console.log('Comentario enviado (completa esta función)');
  }

  function manejarLike(e) {
    const idPost = e.currentTarget.dataset.id;
    console.log(`Like al post ${idPost} (completa esta función)`);
  }

  function mostrarComentarios(e) {
    const idPost = e.currentTarget.dataset.id;
    console.log(`Mostrar comentarios del post ${idPost} (completa esta función)`);
    comentariosModal.show();
  }
});
document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.card-img-top').forEach(img => {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (x - centerX) / -20;

    img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });
});

document.addEventListener('mouseleave', () => {
  document.querySelectorAll('.card-img-top').forEach(img => {
    img.style.transform = 'rotateX(0) rotateY(0) scale(1)';
  });
});
