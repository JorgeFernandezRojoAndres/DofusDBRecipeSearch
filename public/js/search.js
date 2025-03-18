import { renderResults } from "./render.js";

const form = document.getElementById('searchForm');
const resultsDiv = document.getElementById('results');

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const objectName = document.getElementById("objectName").value.trim();
  console.log("Nombre del objeto enviado:", objectName);

  if (!objectName) {
    resultsDiv.innerHTML =
      '<p style="color: red;">Por favor, ingresa el nombre de un objeto.</p>';
    return;
  }

  try {
    // Mostrar mensaje de búsqueda
    resultsDiv.innerHTML = "<p>Buscando...</p>";

    // Realizar la solicitud al servidor
    const response = await fetch("/api/recipes/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectName }),
    });

    // Parsear la respuesta JSON
    const data = await response.json();

    if (data.success && data.data) {
      const item = data.data;
      console.log("Datos recibidos del servidor:", item);
      
      // Llamar a la función de renderizado desde render.js
      renderResults(item);
    } else {
      resultsDiv.innerHTML = "<p>No se encontraron resultados para tu búsqueda.</p>";
      console.error("Respuesta sin datos:", data);
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    resultsDiv.innerHTML =
      '<p style="color: red;">Hubo un error al realizar la búsqueda. Inténtalo de nuevo más tarde.</p>';
  }
});
