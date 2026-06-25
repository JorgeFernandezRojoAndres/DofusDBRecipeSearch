document.addEventListener("DOMContentLoaded", function () {
  const lang = navigator.language || navigator.userLanguage;

  const isEnglish = lang.toLowerCase().startsWith('en');
  const currentPath = window.location.pathname;

  // Redirige solo si estás en una versión neutral o incorrecta
  if (currentPath.endsWith('/privacidad.html') && isEnglish) {
    window.location.href = 'privacy.html';
  } else if (currentPath.endsWith('/privacy.html') && lang.toLowerCase().startsWith('es')) {
    window.location.href = 'privacidad.html';
  }
});
