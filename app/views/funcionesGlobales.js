document.addEventListener("DOMContentLoaded", () => {
  const navUl = document.querySelector(".navPrincipal ul");
  if (!navUl) return;
  
  const navLinks = document.querySelectorAll(".navPrincipal ul li");

  let spanDelante = document.createElement("span");
  spanDelante.className = "span-delante";
  navUl.appendChild(spanDelante);

  let spanDetras = document.createElement("span");
  spanDetras.className = "span-detras";
  navUl.appendChild(spanDetras);

  let circle = document.createElement("div");
  circle.className = "nav-circulo";
  navUl.appendChild(circle);

  function moverCirculo(li) {
    const liRect = li.getBoundingClientRect();
    const ulRect = navUl.getBoundingClientRect();
    const left = liRect.left - ulRect.left + liRect.width / 2 - 35;
    circle.style.transform = `translateY(calc(-50% + 17px)) translateX(${left}px) scale(1)`;
    spanDelante.style.transform = `translateY(calc(-50% + 17px)) translateX(${left}px) scale(1)`;
    spanDetras.style.transform = `translateY(calc(-50% + 17px)) translateX(${left}px) scale(1)`;
  }

  function ocultarCirculo() {
    circle.style.transform = "translateY(-50%) scale(0)";
    spanDelante.style.transform = "translateY(-50%) scale(0)";
    spanDetras.style.transform = "translateY(-50%) scale(0)";
  }

  navLinks.forEach((li) => {
    li.addEventListener("mouseenter", () => {
      moverCirculo(li);
    });
  });

  navUl.addEventListener("mouseleave", () => {
    ocultarCirculo();
  });

  // ========================================================================
  // BANNER LATERAL DE USUARIO - Funcionalidad para todas las páginas
  // ========================================================================
  
  const botonPerfil = document.getElementById("perfilUsuario");
  const banner = document.getElementById("bannerUsuario");
  const botonCerrarBanner = document.getElementById("cerrarBanner");

  // Botón de perfil - abre/cierra el banner
  if (botonPerfil && banner) {
    botonPerfil.addEventListener("click", function (e) {
      e.stopPropagation();
      banner.classList.toggle("abierto");
    });
  }

  // Botón de cerrar banner
  if (botonCerrarBanner && banner) {
    botonCerrarBanner.addEventListener("click", function (e) {
      e.stopPropagation();
      banner.classList.remove("abierto");
    });
  }

  // Cerrar banner al hacer click fuera de él
  document.addEventListener("click", function (e) {
    if (banner && banner.classList.contains("abierto")) {
      if (!banner.contains(e.target) && !botonPerfil.contains(e.target)) {
        banner.classList.remove("abierto");
      }
    }
  });

  // ========================================================================
  // CERRAR SESIÓN
  // ========================================================================

  const botonLogout = document.getElementById("logout");
  if (botonLogout) {
    botonLogout.addEventListener("click", function (e) {
      e.preventDefault();
      
      // Determinar la ruta base
      const path = window.location.pathname;
      let rutaBase = '';
      if (path.includes('/PRUEBAS/')) {
        rutaBase = '/PRUEBAS';
      }
      
      // Redirigir al logout
      window.location.href = rutaBase + '/app/controllers/Logout.php';
    });
  }

  // ========================================================================
  // FORMULARIO AÑADIR VEHÍCULO
  // ========================================================================

  const btnAnadirVehiculo = document.querySelector(".anadirVehiculo");
  const formVehiculo = document.getElementById("formVehiculo");

  if (btnAnadirVehiculo && formVehiculo) {
    formVehiculo.style.display = "none";
    btnAnadirVehiculo.addEventListener("click", function (e) {
      e.stopPropagation();
      if (formVehiculo.style.display === "none") {
        btnAnadirVehiculo.textContent = "Cancelar";
        formVehiculo.style.display = "flex";
      } else {
        btnAnadirVehiculo.textContent = "Añadir mi vehículo";
        formVehiculo.style.display = "none";
      }
    });
  }

  if (formVehiculo) {
    // Inicializar JustValidate
    console.log("JustValidate:", typeof window.JustValidate);
    if (typeof window.JustValidate !== "undefined") {
      window.inicializarValidacionVehiculo();
    } else {
      console.log("JustValidate no cargado");
    }

    // Para el efecto de label flotante
    const selects = formVehiculo.querySelectorAll("select");
    selects.forEach(function (select) {
      select.addEventListener("change", function () {
        if (this.value) {
          this.classList.add("has-value");
        } else {
          this.classList.remove("has-value");
        }
      });

      select.addEventListener("focus", function () {
        this.classList.add("has-value");
      });

      select.addEventListener("blur", function () {
        if (!this.value) {
          this.classList.remove("has-value");
        }
      });
    });
  }
});