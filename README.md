# 🏹 DofusDB Recipe Search

DofusDB Recipe Search es una herramienta web que permite buscar recetas de objetos en **Dofus**, mostrando ingredientes, costos de fabricación y ganancia estimada según el precio de venta. Desarrollado con Node.js, Express y Axios, obtiene datos desde la API de DofusDB. También permite calcular ingredientes para fabricar múltiples unidades.

![Vista previa](public/images/screenshot.png)

## 🚀 Características

- 🔍 **Búsqueda de recetas** de objetos por nombre.
- 📜 **Lista de ingredientes** con imágenes y cantidades.
- 💰 **Cálculo de costos y ganancias** basado en los precios ingresados.
- 🛠️ **Cálculo de ingredientes necesarios** para fabricar múltiples unidades.
- 🌐 **Datos en tiempo real** desde la API de DofusDB.
- 📊 **SEO y analítica** integrada con Google Analytics y Google Search Console.

## 🛠️ Tecnologías utilizadas

- **Node.js** + **Express** para el backend.
- **Axios** para obtener datos desde la API de DofusDB.
- **HTML + CSS + JavaScript** (ES Modules) para la interfaz.
- **Puppeteer** (versión anterior, ahora reemplazado por la API).
- **Render** para despliegue en producción.
- **Google Analytics + Search Console** para seguimiento y posicionamiento.

## 🌐 SEO implementado

- `robots.txt` configurado: permite rastreo completo.
- `sitemap.xml` enviado a Google Search Console.
- Metadatos `<meta>` en `index.html` (descripción, keywords, Open Graph).
- Etiqueta de seguimiento de Google (`gtag.js`) integrada.

## 📦 Instalación

1. Cloná este repositorio:

   ```sh
   git clone https://github.com/JorgeFernandezRojoAndres/DofusDBRecipeSearch.git
   cd DofusDBRecipeSearch
   ```

2. Instalá las dependencias y ejecutá el servidor:

   ```sh
   npm install
   npm start
   ```

3. Accedé a `http://localhost:3000` para usar la app localmente.

## 🔗 Producción

Sitio en vivo: 👉 [Sitio en vivo](https://recetasdofus.com.ar)

## 📁 Estructura del proyecto

public/
├── css/
├── images/
├── js/
├── index.html
├── sitemap.xml
└── robots.txt

src/
├── controllers/
├── routes/
├── utils/
└── views/

## 👤 Autor

**Jorge Fernández Rojo Andrés**  
Estudiante de Ingeniería de Software | Desarrollador Full Stack  
[LinkedIn](https://www.linkedin.com/in/jorgeandresfernandezrojo/)

📬 Si querés colaborar o reportar errores, abrí un issue o pull request. ¡Toda ayuda es bienvenida!
