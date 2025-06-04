document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("cookiesDecision")) {
    const banner = document.createElement("div");
    banner.id = "cookieBanner";
    banner.className = "alert alert-dark fixed-bottom text-center mb-0";
    banner.innerHTML = `
      Este sitio utiliza cookies para análisis y funcionalidad. 
      <a href="privacidad.html" class="text-warning text-decoration-underline">Más información</a>.
      <br>
      <button id="aceptarCookies" class="btn btn-success btn-sm mt-2 me-2">Aceptar</button>
      <button id="rechazarCookies" class="btn btn-outline-light btn-sm mt-2">Rechazar</button>
    `;
    document.body.appendChild(banner);

    // Aceptar cookies
    document.getElementById("aceptarCookies").addEventListener("click", function () {
      gtag('consent', 'update', {
        'ad_storage': 'granted',
        'analytics_storage': 'granted'
      });
      localStorage.setItem("cookiesDecision", "accepted");
      banner.remove();
    });

    // Rechazar cookies
    document.getElementById("rechazarCookies").addEventListener("click", function () {
      gtag('consent', 'update', {
        'ad_storage': 'denied',
        'analytics_storage': 'denied'
      });
      localStorage.setItem("cookiesDecision", "rejected");
      banner.remove();
    });
  }
});
