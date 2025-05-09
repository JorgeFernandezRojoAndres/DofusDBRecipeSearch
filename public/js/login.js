document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
  
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });
  
          const data = await response.json();
  
          if (response.ok) {
            // Si login exitoso, guardar token y redirigir
            localStorage.setItem('jwtToken', data.token);
            window.location.href = 'index.html';
          } else if (response.status === 403 && data.error.includes('no verificada')) {
            // Mostrar el modal en lugar de alert si la cuenta no está verificada
            mostrarModalVerificacion();
          } else {
            // Mostrar otros errores
            alert(`❌ Error: ${data.error || 'Ocurrió un error inesperado'}`);
          }
        } catch (error) {
          console.error('❌ Error en login:', error);
          alert('❌ Error de conexión. Intentá nuevamente más tarde.');
        }
      });
    }
  });
  