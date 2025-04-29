const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'andy46587@gmail.com',
    pass: 'vfkv sqwd varz iwtc'
  }
});

transporter.sendMail({
  from: 'Recetas Dofus <andy46587@gmail.com>',
  to: 'andy46587@gmail.com',
  subject: '🚀 Prueba de SMTP desde Node.js',
  text: 'Hola Jorge, si ves este mensaje es porque funciona el envío con Gmail.'
}, (err, info) => {
  if (err) return console.error('❌ Error al enviar:', err);
  console.log('✅ Correo enviado correctamente:', info.response);
});
