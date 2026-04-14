document.addEventListener("DOMContentLoaded", () => {
  const navUl = document.querySelector(".navPrincipal ul");
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

  // Banner lateral de usuario
  const botonPerfil = document.getElementById("perfilUsuario");
  const banner = document.getElementById("bannerUsuario");
  const cerrarBanner = document.getElementById("cerrarBanner");
  const btnLogout = document.getElementById("logout");

  // Verificar si hay sesión activa
  const sesionActiva = localStorage.getItem("sesionActiva") === "true";

  if (botonPerfil && banner) {
    // Solo mostrar botón si hay sesión
    botonPerfil.style.display = sesionActiva ? "block" : "none";

    botonPerfil.addEventListener("click", function (e) {
      console.log("Click en perfil");
      banner.classList.toggle("abierto");
      console.log("Banner abierto:", banner.classList.contains("abierto"));
      console.log("Banner display:", window.getComputedStyle(banner).display);
    });
  }

  if (cerrarBanner && banner) {
    cerrarBanner.addEventListener("click", function (e) {
      banner.classList.remove("abierto");
    });
  }

  // Logout - borrar sesión y recargar
  if (btnLogout) {
    console.log("Logout button found, adding event");
    btnLogout.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Logout clicked!");
      localStorage.removeItem("sesionActiva");
      window.location.href = "../login/login.html";
    });
  }

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
        btnAnadirVehiculo.textContent = "Añadir vehículo";
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
