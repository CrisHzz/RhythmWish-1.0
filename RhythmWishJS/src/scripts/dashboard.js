document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.querySelector(".logout-button");
  //console.log("boton de logout todo bien:", logoutBtn);

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      //console.log("boton de logout clickeado"); // Verificar en consola

      // verificamos si nuestro  objeto authUtils existe
      if (window.authUtils && typeof window.authUtils.logout === "function") {
        window.authUtils.logout();
      } else {
        // Alternativa si authUtils no está disponible
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        console.log("Sesión cerrada al machetazo");
      }

      // Redirigir a la página de inicio o login después de cerrar sesión
      window.location.href = "../index.html";
    });
  }
});
