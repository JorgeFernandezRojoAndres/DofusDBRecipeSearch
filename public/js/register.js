console.log('🔵 Script register.js cargado correctamente'); // Confirmamos que el archivo JS se está cargando

const form = document.getElementById('registerForm');
const resultado = document.getElementById('resultado');

if (!form) {
  console.error('❌ No se encontró el formulario registerForm en el HTML');
} else {
  console.log('✅ Formulario registerForm encontrado');
}

form.addEventListener('submit', async (e) => {
  console.log('🟡 Evento submit capturado en registerForm');

  e.preventDefault();

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (!emailInput || !passwordInput) {
    console.error('❌ No se encontraron los campos email o password en el formulario');
    return;
  }

  const email = emailInput.value;
  const password = passwordInput.value;

  console.log('📤 Preparando envío de datos:', { email, password });

  // 💥💥💥 AGREGÁ ESTE LOG
  console.log('🛫 Lanzando fetch hacia /api/register...');

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    console.log('📥 Respuesta recibida del servidor:', response);

    const data = await response.json();
    console.log('📄 Respuesta parseada a JSON:', data);

    if (response.ok) {
      console.log('✅ Registro exitoso, preparando redirección...');
      resultado.textContent = '✅ Registro exitoso. Revisa tu correo para verificar tu cuenta.';
      
      setTimeout(() => {
        console.log('➡️ Redirigiendo a login.html');
        window.location.href = 'login.html';
      }, 3000);
    } else {
      console.error('❌ Registro fallido. Error recibido:', data.error || 'Error desconocido');
      resultado.textContent = '❌ Error: ' + (data.error || 'No se pudo registrar');
    }
  } catch (error) {
    console.error('❌ Error en la conexión o fetch fallido:', error);
    resultado.textContent = '❌ Error en la conexión.';
  }
});
