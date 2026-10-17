// ===== Referencias al DOM =====
const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");
const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passError = document.getElementById("password-error");
const messageBox = document.getElementById("message-box");
const messageText = document.getElementById("error-message");
const rememberChk = document.getElementById("recordar");
const loginBtn = document.getElementById("login-btn");
const eyeBtn = document.getElementById("toggle-password");

// Usuario de prueba
const USER_TEST = { email: "usuario@example.com", password: "contrasena" };

// ===== 1. Modo claro / oscuro =====
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "Modo claro" : "Modo oscuro";
  try { localStorage.setItem("apex-theme", theme); } catch (e) {}
}
themeBtn.addEventListener("click", () => {
  const actual = root.getAttribute("data-theme");
  applyTheme(actual === "dark" ? "light" : "dark");
});

// ===== 2. Mostrar / ocultar contraseña =====
eyeBtn.addEventListener("click", () => {
  const oculto = passInput.type === "password";
  passInput.type = oculto ? "text" : "password";
  eyeBtn.textContent = oculto ? "Ocultar" : "Ver";
});

// ===== 3. Mensajes (manipulación del DOM) =====
function showMessage(text, ok = false) {
  messageText.textContent = text;
  messageBox.classList.toggle("success", ok);
  messageBox.hidden = false;
}
function hideMessage() { messageBox.hidden = true; }

function setFieldState(input, errorEl, msg) {
  errorEl.textContent = msg;
  input.classList.toggle("invalid", msg !== "");
  input.classList.toggle("valid", msg === "" && input.value !== "");
}

// ===== 4. Validaciones =====
function validateEmail() {
  const v = emailInput.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let msg = "";
  if (v === "") msg = "El correo es obligatorio.";
  else if (!regex.test(v)) msg = "Ingresa un correo válido (ej: nombre@dominio.com).";
  setFieldState(emailInput, emailError, msg);
  return msg === "";
}
function validatePassword() {
  const v = passInput.value;
  let msg = "";
  if (v === "") msg = "La contraseña es obligatoria.";
  else if (v.length < 6) msg = "Debe tener mínimo 6 caracteres.";
  setFieldState(passInput, passError, msg);
  return msg === "";
}

// Validación en tiempo real
emailInput.addEventListener("input", () => { validateEmail(); hideMessage(); });
passInput.addEventListener("input", () => { validatePassword(); hideMessage(); });

// ===== 5. Inicio de sesión =====
function login(event) {
  event.preventDefault();
  const emailOk = validateEmail();
  const passOk = validatePassword();
  if (!emailOk || !passOk) {
    showMessage("Por favor, ingrese un correo electrónico y una contraseña válidos.");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "ENTRANDO...";

  setTimeout(() => {
    if (emailInput.value.trim() === USER_TEST.email && passInput.value === USER_TEST.password) {
      showMessage("¡Inicio de sesión exitoso! Bienvenido a Apex.", true);
      try {
        if (rememberChk.checked) localStorage.setItem("apex-email", emailInput.value.trim());
        else localStorage.removeItem("apex-email");
      } catch (e) {}
    } else {
      showMessage("ERROR: La contraseña que has escrito para el usuario es incorrecta. Intente de nuevo.");
    }
    loginBtn.disabled = false;
    loginBtn.textContent = "INICIAR SESIÓN";
  }, 600);
}
form.addEventListener("submit", login);

// ===== 6. Al cargar: restaurar tema y correo recordado =====
(function init() {
  let tema = "dark", correo = null;
  try {
    tema = localStorage.getItem("apex-theme") || "dark";
    correo = localStorage.getItem("apex-email");
  } catch (e) {}
  applyTheme(tema);
  if (correo) { emailInput.value = correo; rememberChk.checked = true; }
})();
