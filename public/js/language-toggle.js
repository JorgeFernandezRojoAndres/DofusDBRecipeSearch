document.addEventListener("DOMContentLoaded", function () {
  const lang = document.documentElement.lang;

  const button = document.createElement("div");
  button.id = "languageToggle";
  button.textContent = lang.startsWith("es") ? "🌐 View in English" : "🌐 Ver en español";
  Object.assign(button.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#343a40",
    color: "white",
    padding: "8px 12px",
    borderRadius: "30px",
    fontSize: "14px",
    cursor: "pointer",
    zIndex: "9999",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    fontFamily: "inherit",
    userSelect: "none"
  });

  button.addEventListener("click", function () {
    if (lang.startsWith("es")) {
      window.location.href = "privacy.html";
    } else {
      window.location.href = "privacidad.html";
    }
  });

  document.body.appendChild(button);
});
