const form = document.getElementById('recuperarForm');
const resultado = document.getElementById('resultado');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim().toLowerCase();

  try {
    const response = await fetch('/api/recuperar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (data.success) {
      resultado.textContent = '✅ Revisa tu correo electrónico para recuperar tu contraseña.';
    } else {
      resultado.textContent = '❌ ' + (data.error || 'No se pudo procesar la solicitud.');
    }
  } catch (error) {
    resultado.textContent = '❌ Error en la conexión.';
    console.error(error);
  }
});
