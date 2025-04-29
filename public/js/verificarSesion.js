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

        alert('⚠️ Tu cuenta todavía no está verificada. Revisá tu correo.');
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