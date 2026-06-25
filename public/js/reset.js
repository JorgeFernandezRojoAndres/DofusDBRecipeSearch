const form = document.getElementById('resetForm');
const resultado = document.getElementById('resultado');

// 🧠 Obtener el token de la URL
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

if (!token) {
  resultado.textContent = '❌ Token no proporcionado en el enlace.';
  form.style.display = 'none';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    resultado.textContent = '❌ Las contraseñas no coinciden.';
    return;
  }

  try {
    const res = await fetch('/api/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, token })
    });

    const data = await res.json();

    if (data.success) {
      resultado.textContent = '✅ Contraseña actualizada correctamente. Redirigiendo...';
      setTimeout(() => window.location.href = 'login.html', 2000);
    } else {
      resultado.textContent = '❌ ' + (data.error || 'Error al actualizar la contraseña.');
    }

  } catch (err) {
    console.error(err);
    resultado.textContent = '❌ Error en la conexión con el servidor.';
  }
});
