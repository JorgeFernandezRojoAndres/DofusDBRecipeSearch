document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('jwtToken');

  const btnLogin = document.getElementById('btnRedirectLogin');
  const btnRegister = document.getElementById('btnRedirectRegister');
  const btnUltimasRecetas = document.getElementById('btnUltimasRecetas');
  const btnVolversePremium = document.getElementById('btnVolversePremium');
  const btnBeneficios = document.getElementById('btnBeneficios');
  const btnLogout = document.getElementById('btnLogout');

  if (!token) {
    // Usuario no logueado
    if (btnLogin) btnLogin.hidden = false;
    if (btnRegister) btnRegister.hidden = false;
    if (btnLogout) btnLogout.hidden = true;
    if (btnUltimasRecetas) btnUltimasRecetas.hidden = true;
    if (btnVolversePremium) btnVolversePremium.hidden = true;
    if (btnBeneficios) btnBeneficios.hidden = true;
  } else {
    try {
      const response = await fetch('/api/perfil', {
        headers: { Authorization: 'Bearer ' + token }
      });

      const data = await response.json();

      if (!data.user || !data.user.isVerified) {
        // Usuario logueado pero NO verificado
        if (btnLogin) btnLogin.hidden = true;
        if (btnRegister) btnRegister.hidden = true;
        if (btnLogout) btnLogout.hidden = false;

        if (btnUltimasRecetas) btnUltimasRecetas.hidden = true;
        if (btnVolversePremium) btnVolversePremium.hidden = true;
        if (btnBeneficios) btnBeneficios.hidden = true;

        mostrarModalVerificacion(); // ✅ Mostrar modal en vez de alert
      } else {
        // Usuario logueado y verificado
        if (btnLogin) btnLogin.hidden = true;
        if (btnRegister) btnRegister.hidden = true;
        if (btnLogout) btnLogout.hidden = false;

        if (btnUltimasRecetas) btnUltimasRecetas.hidden = false;
        if (btnVolversePremium) btnVolversePremium.hidden = false;
        if (btnBeneficios) btnBeneficios.hidden = false;
      }
    } catch (error) {
      console.error('❌ Error al verificar sesión:', error);
    }
  }

  // ✅ Evento para botón de Cerrar Sesión
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      console.log('🔴 Cerrando sesión: Borrando token...');
      localStorage.removeItem('jwtToken'); // Borramos el token del navegador
      window.location.href = 'login.html'; // Redirigimos al login
    });
  }

  // ✅ Evento para botón de Registrarse
  if (btnRegister) {
    btnRegister.addEventListener('click', () => {
      console.log('🔵 Redirigiendo a register.html');
      window.location.href = 'register.html';
    });
  }

  // ✅ Evento para botón de Iniciar Sesión
  if (btnLogin) {
    btnLogin.addEventListener('click', () => {
      console.log('🔵 Redirigiendo a login.html');
      window.location.href = 'login.html';
    });
  }
});

// ✅ Función para mostrar el modal de verificación
function mostrarModalVerificacion() {
  const verificacionModal = new bootstrap.Modal(document.getElementById('verificacionModal'));
  verificacionModal.show();

  document.getElementById('btnReenviarVerificacion').addEventListener('click', async function () {
    try {
      const token = localStorage.getItem('jwtToken');

      if (!token) {
        console.error('❌ No hay token disponible');
        return;
      }

      const response = await fetch('/api/reenviar-verificacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        document.querySelector('.modal-body').innerHTML = `
          <div class="alert alert-success">
            ✅ Correo de verificación enviado correctamente. Por favor, revisá tu bandeja de entrada.
          </div>
        `;
        document.getElementById('btnReenviarVerificacion').style.display = 'none';
      } else {
        document.querySelector('.modal-body').innerHTML += `
          <div class="alert alert-danger">
            ❌ Error: ${data.error || 'No se pudo enviar el correo de verificación'}
          </div>
        `;
      }
    } catch (error) {
      console.error('❌ Error al reenviar verificación:', error);
      document.querySelector('.modal-body').innerHTML += `
        <div class="alert alert-danger">
          ❌ Error de conexión. Intentá nuevamente más tarde.
        </div>
      `;
    }
  });
}
document.getElementById('btnBlog').addEventListener('click', () => {  
  window.location.href = 'blog.html';  
});