document.addEventListener("DOMContentLoaded", function () {
  const registerBtn = document.getElementById("registerBtn");
  if (registerBtn) {
    registerBtn.addEventListener("click", handleRegister);
  }

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", handleLogin);
  }

  // Verificacion para hacer que el usuario logueado no pueda volver a acceder a la pagina de login o registro
  const isAuthPage =
    window.location.pathname.includes("sign-in.html") ||
    window.location.pathname.includes("sign-up.html");

  // si ya está logueado, se manda al dashboard (para que intennta volver a loguearse?)
  if (isAuthPage && isAuthenticated()) {
    window.location.href = "/pages/dashboard.html";
  }
});

// manejador del Form de registro
async function handleRegister() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const roleSelected = document.querySelector('input[name="role"]:checked');

  // validaciones sencillas
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
    // objeto con la info del usuario
    const userData = {
      email,
      role,
      name: email.split("@")[0], // Simple name extraction from email
      id: generateUserId(),
    };

    // Create a mock JWT token (in a real app this would come from the server)
    const token = generateMockJWT(userData);

    // Store user data and token
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));

    // Redirect to dashboard
    window.location.href = "/pages/dashboard.html";
  } catch (error) {
    console.error("Registration error:", error);
    alert("Error durante el registro. Intente nuevamente.");
  }
}

// Login handler
async function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Validation
  if (!email || !password) {
    alert("Por favor complete todos los campos");
    return;
  }

  try {
    // In a real app, this would be an API call
    // Here we'll simulate a successful login
    const userData = {
      email,
      role: "artist", // Default role for login simulation
      name: email.split("@")[0], // Simple name extraction from email
      id: generateUserId(),
    };

    // Create a mock JWT token
    const token = generateMockJWT(userData);

    // Guardamos los datos en el localStorage, solo es una simulacion
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));

    // redirigimos al dashboard despues de loguearse
    window.location.href = "/pages/dashboard.html";
  } catch (error) {
    console.error("Login error:", error);
    alert("Error durante el inicio de sesión. Intente nuevamente.");
  }
}

// Funcion para comprobar si el usuario está autenticado
function isAuthenticated() {
  const token = localStorage.getItem("authToken");

  // si no tiene token, entonces nunca se logueó
  if (!token) return false;

  try {
    return true;
  } catch (error) {
    return false;
  }
}

// Generate a simple mock JWT token - Pepazo
function generateMockJWT(userData) {
  // This is a simplified mock of a JWT token
  // In a real app, this would be created and signed on the server
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      ...userData,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours expiration
    })
  );
  const signature = btoa("mockSignature"); // In a real app, this would be a cryptographic signature

  return `${header}.${payload}.${signature}`;
}

// Generate a simple user ID
function generateUserId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// funcion para desloguear, simplemente se elimina el token y datos y se redirige al login
function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
  window.location.href = "/pages/sign-in.html";
}

// Export functions for use in other scripts
window.authUtils = {
  isAuthenticated,
  logout,
  getUserData: () => JSON.parse(localStorage.getItem("userData") || "{}"),
};
