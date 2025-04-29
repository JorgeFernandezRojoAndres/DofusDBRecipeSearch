const nodemailer = require('nodemailer');

// ✅ Configuramos el transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'andy46587@gmail.com', // 👉 Tu correo real
    pass: 'vfkv sqwd varz iwtc'   // 👉 Tu contraseña de aplicación de Gmail
  }
});

// ✅ Función para enviar correo de verificación
async function enviarCorreoVerificacion(destinatario, token) {
  const urlVerificacion = `http://localhost:3000/api/verify?token=${token}`; // En producción deberías cambiar "localhost" por tu dominio real.

  const mailOptions = {
    from: '"Recetas Dofus" <andy46587@gmail.com>', // 👉 Bien escrito, nombre entre comillas
    to: destinatario,
    subject: 'Verificá tu cuenta en Recetas Dofus',
    html: `
      <h2>¡Bienvenido a Recetas Dofus!</h2>
      <p>Hacé clic en el siguiente botón para verificar tu cuenta:</p>
      <a href="${urlVerificacion}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verificar Cuenta</a>
      <p>Este enlace expirará en 1 hora.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Correo de verificación enviado a ${destinatario}: ${info.response}`);
  } catch (error) {
    console.error('❌ Error al enviar correo de verificación:', error);
  }
}

// ✅ Exportamos la función
module.exports = enviarCorreoVerificacion;
