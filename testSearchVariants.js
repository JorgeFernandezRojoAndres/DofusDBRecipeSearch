const fetch = require('node-fetch'); // si no lo tienes instalado: npm install node-fetch@2

const BASE_URL = "http://localhost:3000";

async function probarVariantesBusqueda(objectName) {
  const variantes = [
    { nombre: "Sin modificar", valor: objectName },
    { nombre: "Espacios por +", valor: objectName.split(" ").join("+") },
    { nombre: "encodeURI", valor: encodeURI(objectName.split(" ").join("+")) },
  ];

  for (const variante of variantes) {
    console.log(`Probando variante: ${variante.nombre} → "${variante.valor}"`);

    try {
      const response = await fetch(`${BASE_URL}/api/recipes/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objectName: variante.valor }),
      });

      if (!response.ok) {
        console.warn(`Error HTTP ${response.status} en variante "${variante.nombre}"`);
        continue;
      }

      const data = await response.json();
      console.log(`Respuesta para variante "${variante.nombre}":`, data);

      if (data.success && data.data) {
        console.log(`¡Éxito con variante "${variante.nombre}"!`);
        return;
      }
    } catch (error) {
      console.error(`Error en fetch variante "${variante.nombre}":`, error);
    }
  }

  console.error("Ninguna variante devolvió resultados exitosos.");
}

const nombreParaProbar = "Cinturón de Koxys";

probarVariantesBusqueda(nombreParaProbar);
