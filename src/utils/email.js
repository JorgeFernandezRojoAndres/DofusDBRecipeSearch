const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'andy46587@gmail.com',
    pass: process.env.GMAIL_PASS || 'vfkv sqwd varz iwtc'
  }
});

// ✅ Versión reutilizable: permite enviar cualquier correo con HTML personalizado
async function enviarCorreo(destinatario, asunto, html) {
  const mailOptions = {
    from: `"Recetas Dofus" <${process.env.GMAIL_USER || 'andy46587@gmail.com'}>`,
    to: destinatario,
    subject: asunto,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Correo enviado a ${destinatario}: ${info.response}`);
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
  }
}

// 🟢 (Opcional) Función específica para verificación, que usa la genérica
async function enviarCorreoVerificacion(destinatario, token) {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  const urlVerificacion = `${BASE_URL}/api/verify?token=${token}`;

  const html = `
    <h2>¡Bienvenido a Recetas Dofus!</h2>
    <p>Hacé clic en el siguiente botón para verificar tu cuenta:</p>
    <a href="${urlVerificacion}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verificar Cuenta</a>
    <p>Este enlace expirará en 1 hora.</p>
  `;

  await enviarCorreo(destinatario, 'Verificá tu cuenta en Recetas Dofus', html);
}

// ✅ Exporta la función genérica como principal
module.exports = enviarCorreo;
