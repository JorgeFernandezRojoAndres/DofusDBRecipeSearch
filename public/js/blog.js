// public/js/blog.js  
document.addEventListener('DOMContentLoaded', () => {  
  const contenedorPosts = document.getElementById('contenedor-posts');  
  const ordenarPorSelect = document.getElementById('ordenarPor');  
  const filtroValorInput = document.getElementById('filtroValor');  
  const aplicarFiltrosBtn = document.getElementById('aplicarFiltros');  
  const formComentario = document.getElementById('formComentario');  
  const comentariosModal = new bootstrap.Modal(document.getElementById('comentariosModal'));  
    
  // Cargar posts al iniciar  
  cargarPosts();  
    
  // Evento para aplicar filtros  
  aplicarFiltrosBtn.addEventListener('click', cargarPosts);  
    
  // Evento para enviar comentario  
  formComentario.addEventListener('submit', enviarComentario);  
    
  async function cargarPosts() {  
    try {  
      const ordenarPor = ordenarPorSelect.value;  
      const filtroValor = filtroValorInput.value;  
        
      const url = `/api/posts?ordenarPor=${ordenarPor}&filtroValor=${filtroValor}`;  
      const res = await fetch(url);  
      const data = await res.json();  
        
      if (!data.success) {  
        throw new Error(data.error || 'Error al cargar los posts');  
      }  
        
      renderizarPosts(data.data);  
    } catch (error) {  
      console.error('Error:', error);  
      contenedorPosts.innerHTML = `<div class="col-12 text-center text-danger">  
        <p>Error al cargar los posts. Por favor, intenta de nuevo más tarde.</p>  
      </div>`;  
    }  
  }  
    
  function renderizarPosts(posts) {  
  if (!posts || posts.length === 0) {  
    contenedorPosts.innerHTML = `<div class="col-12 text-center">  
      <p>No hay posts disponibles con los filtros actuales.</p>  
    </div>`;  
    return;  
  }  
  
  contenedorPosts.innerHTML = '';  
  
  posts.forEach(post => {  
    const fechaActualizacion = new Date(post.fechaActualizacion);  
    const tiempoTranscurrido = obtenerTiempoTranscurrido(fechaActualizacion);  
  
    const card = document.createElement('div');  
    card.className = 'col-md-3 mb-4';  
  
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${post.imagen || 'images/default-item.png'}" class="card-img-top" alt="${post.nombre}">
        <div class="card-body text-center">
          <h5 class="card-title">${post.nombre}</h5>
          <p class="text-muted small">${tiempoTranscurrido}</p>
          <p class="text-danger fw-bold">Gasto: ${post.gasto || 0} kamas</p> <!-- 👈 AÑADIMOS GASTO -->
          <p class="text-success fw-bold">Valor: ${post.valor} kamas</p>
          ${post.ganancia !== undefined ? `
          <p class="fw-bold" style="color: ${post.ganancia >= 0 ? 'green' : 'red'}">
            ${post.ganancia >= 0 ? 'Ganancia' : 'Pérdida'}: ${Math.abs(post.ganancia)} kamas
          </p>
          ` : ''}
          <div class="d-flex justify-content-center gap-2 mt-3">
            <button class="btn btn-sm btn-outline-primary like-btn" data-id="${post._id}">
              <i class="fas fa-thumbs-up"></i> ${post.likes || 0}
            </button>
            <button class="btn btn-sm btn-outline-secondary comentario-btn" data-id="${post._id}">
              <i class="fas fa-comments"></i> Comentarios
            </button>
          </div>
        </div>
      </div>
    `;  
  
    contenedorPosts.appendChild(card);  
  });  
  
  // Asignar eventos a los nuevos botones  
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', manejarLike);
  });

  document.querySelectorAll('.comentario-btn').forEach(btn => {
    btn.addEventListener('click', mostrarComentarios);
  });
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

  // Función de ejemplo para enviar comentarios
  async function enviarComentario(e) {
    e.preventDefault();
    console.log('Comentario enviado (completa esta función)');
  }

  // Función de ejemplo para manejar likes
  function manejarLike(e) {
    const idPost = e.currentTarget.dataset.id;
    console.log(`Like al post ${idPost} (completa esta función)`);
  }

  // Función de ejemplo para mostrar comentarios
  function mostrarComentarios(e) {
    const idPost = e.currentTarget.dataset.id;
    console.log(`Mostrar comentarios del post ${idPost} (completa esta función)`);
    comentariosModal.show();
  }
});
