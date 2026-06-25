const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '..', 'public', 'fonts');

if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const fonts = [
  // EB Garamond
  { name: 'EBGaramond-Regular', weight: '400', url: 'https://fonts.gstatic.com/s/ebgaramond/v32/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-6_RUAw.ttf' },
  { name: 'EBGaramond-Medium', weight: '500', url: 'https://fonts.gstatic.com/s/ebgaramond/v32/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-2fRUAw.ttf' },
  { name: 'EBGaramond-SemiBold', weight: '600', url: 'https://fonts.gstatic.com/s/ebgaramond/v32/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-NfNUAw.ttf' },
  { name: 'EBGaramond-Bold', weight: '700', url: 'https://fonts.gstatic.com/s/ebgaramond/v32/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-DPNUAw.ttf' },
  { name: 'EBGaramond-ExtraBold', weight: '800', url: 'https://fonts.gstatic.com/s/ebgaramond/v32/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-a_NUAw.ttf' },
  // Hanken Grotesk
  { name: 'HankenGrotesk-Regular', weight: '400', url: 'https://fonts.gstatic.com/s/hankengrotesk/v12/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_Ncs2Za4Q.ttf' },
  { name: 'HankenGrotesk-Medium', weight: '500', url: 'https://fonts.gstatic.com/s/hankengrotesk/v12/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_NcgWZa4Q.ttf' },
  { name: 'HankenGrotesk-SemiBold', weight: '600', url: 'https://fonts.gstatic.com/s/hankengrotesk/v12/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_NcbWFa4Q.ttf' },
  { name: 'HankenGrotesk-Bold', weight: '700', url: 'https://fonts.gstatic.com/s/hankengrotesk/v12/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_NcVGFa4Q.ttf' },
  // JetBrains Mono
  { name: 'JetBrainsMono-Regular', weight: '400', url: 'https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPQ.ttf' },
  { name: 'JetBrainsMono-Medium', weight: '500', url: 'https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8-qxjPQ.ttf' },
  { name: 'JetBrainsMono-Bold', weight: '700', url: 'https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8L6tjPQ.ttf' },
];

let completed = 0;
let errors = [];

fonts.forEach(font => {
  const filePath = path.join(fontsDir, font.name + '.ttf');
  
  // Skip if already exists
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${font.name} already exists`);
    completed++;
    if (completed === fonts.length) finish();
    return;
  }

  const file = fs.createWriteStream(filePath);
  
  https.get(font.url, response => {
    if (response.statusCode !== 200) {
      errors.push(`${font.name}: HTTP ${response.statusCode}`);
      file.close();
      fs.unlinkSync(filePath);
      completed++;
      if (completed === fonts.length) finish();
      return;
    }
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      const size = fs.statSync(filePath).size;
      console.log(`✓ ${font.name} downloaded (${size} bytes)`);
      completed++;
      if (completed === fonts.length) finish();
    });
  }).on('error', err => {
    errors.push(`${font.name}: ${err.message}`);
    file.close();
    completed++;
    if (completed === fonts.length) finish();
  });
});

function finish() {
  if (errors.length) {
    console.log('\n⚠ Errors:');
    errors.forEach(e => console.log(`  ${e}`));
  }
  console.log(`\n✅ ${completed - errors.length}/${fonts.length} fonts downloaded successfully`);
  console.log(`📁 Location: ${fontsDir}`);
  process.exit(errors.length > 0 ? 1 : 0);
}
