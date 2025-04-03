document.addEventListener("DOMContentLoaded", function () {
  const registerBtn = document.getElementById("registerBtn");
  if (registerBtn) {
    registerBtn.addEventListener("click", handleRegister);
  }

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", handleLogin);
  }

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault(); // Evita que el enlace navegue
      logout();
    });
  }

  // Evita que usuarios autenticados accedan a la página de login o registro
  const isAuthPage =
    window.location.pathname.includes("sign-in.html") ||
    window.location.pathname.includes("sign-up.html");

  if (isAuthPage && isAuthenticated()) {
    window.location.href = "/pages/dashboard.html";
  }
});

// Maneja el registro de usuario
async function handleRegister() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const roleSelected = document.querySelector('input[name="role"]:checked');

  if (!email || !password || !confirmPassword) {
    alert("Por favor complete todos los campos");
    return;
  }

  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden");
    return;
  }

  if (!roleSelected) {
    alert("Por favor seleccione un rol");
    return;
  }

  const role = roleSelected.value;

  try {
    const userData = {
      email,
      role,
      name: email.split("@")[0], // Extrae el nombre desde el correo
      id: generateUserId(),
    };

    // Genera un token de autenticación ficticio
    const token = generateMockJWT(userData);

    // Guarda el token y los datos del usuario en localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));

    // Redirige al dashboard
    window.location.href = "/pages/dashboard.html";
  } catch (error) {
    console.error("Error durante el registro:", error);
    alert("Error durante el registro. Intente nuevamente.");
  }
}

// Maneja el inicio de sesión
async function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Por favor complete todos los campos");
    return;
  }

  try {
    const userData = {
      email,
      role: "artist", // Se usa un rol predeterminado en esta simulación
      name: email.split("@")[0],
      id: generateUserId(),
    };

    const token = generateMockJWT(userData);

    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));

    window.location.href = "/pages/dashboard.html";
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
    alert("Error durante el inicio de sesión. Intente nuevamente.");
  }
}

// Verifica si el usuario está autenticado
function isAuthenticated() {
  const token = localStorage.getItem("authToken");
  return !!token;
}

// Genera un token JWT de prueba (sin cifrado real)
function generateMockJWT(userData) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      ...userData,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Expira en 24 horas
    })
  );
  const signature = btoa("mockSignature"); // Simulación de firma

  return `${header}.${payload}.${signature}`;
}

// Genera un ID de usuario aleatorio
function generateUserId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Cierra sesión del usuario
function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
  window.location.href = "/pages/sign-in.html";
}

// Exporta las funciones para usarlas en otros scripts
window.authUtils = {
  isAuthenticated,
  logout,
  getUserData: () => JSON.parse(localStorage.getItem("userData") || "{}"),
};
