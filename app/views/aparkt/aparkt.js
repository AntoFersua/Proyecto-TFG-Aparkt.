import {
  getSession,
  getUser,
  initAuthUI,
  showIfLoggedIn,
  hideIfLoggedOut,
} from "../auth.js";

let currentUser = null;

async function initPage() {
  try {
    const session = await getSession();

    console.log("Sesión:", session.logged ? "LOGUEADO" : "NO LOGUEADO");
    console.log("Usuario:", session.user);

    if (session.logged) {
      currentUser = session.user;
      setupAuthenticatedUI();
    } else {
      setupPublicUI();
    }
  } catch (error) {
    console.error("Error al inicializar la página:", error);
  }
}

function setupAuthenticatedUI() {
  console.log("Ejecutando setupAuthenticatedUI");
  initAuthUI();

  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    console.log("Logout button encontrado");
    logoutBtn.addEventListener("click", handleLogout);
  }

  const perfilBtn = document.getElementById("perfilUsuario");
  console.log("Boton perfil:", perfilBtn);
  if (perfilBtn) {
    perfilBtn.addEventListener("click", () => {
      console.log("Click en perfil --abriendo banner");
      const banner = document.getElementById("bannerUsuario");
      console.log("Banner:", banner);
      if (banner) {
        banner.classList.add("abierto");
      }
    });
  }

  const userName =
    currentUser.nombre || currentUser.name || currentUser.email || "Usuario";
  console.log(`Bienvenido, ${userName}`);
}

function setupPublicUI() {
  // No hacer nada al hacer click en perfil si no está logueado
}

function getBasePath() {
  return window.location.pathname.includes("/PRUEBAS/") ? "/PRUEBAS" : "";
}

async function handleLogout() {
  const basePath = getBasePath();
  window.location.href = basePath + "/app/controllers/Logout.php";
}

document.addEventListener("DOMContentLoaded", initPage);

export { currentUser };
