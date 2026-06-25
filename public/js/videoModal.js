console.log("📦 Iniciando carga del modal desde videoModal.html...");

fetch('components/videoModal.html')
  .then(response => {
    console.log("✅ Respuesta del fetch:", response.status);
    return response.text();
  })
  .then(html => {
    console.log("📄 HTML del modal recibido. Insertando en el DOM...");
    document.body.insertAdjacentHTML('beforeend', html);

    const modalElement = document.getElementById('videoModal');
    if (!modalElement) {
      console.error("❌ No se encontró el elemento #videoModal en el DOM.");
      return;
    }

    console.log("🧱 Modal insertado correctamente. Inicializando Bootstrap.Modal...");
    const modal = new bootstrap.Modal(modalElement);

    // 🎥 Mostrar siempre el modal al cargar
    console.log("🎥 Mostrando modal...");
    modal.show();

    // 🛑 Detener el video cuando se cierra el modal
    modalElement.addEventListener('hidden.bs.modal', () => {
      console.log("🛑 Modal cerrado. Deteniendo reproducción del video...");

      const iframe = document.getElementById('youtubePlaylist');
      if (iframe) {
        const currentSrc = iframe.src;
        iframe.src = "";            // Limpiar src para detener el video
        iframe.src = currentSrc;    // Restaurar src para reiniciar en próxima apertura
      }
    });
  })
  .catch(err => {
    console.error("🚨 Error al cargar el modal:", err);
  });
