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

  // Banner lateral de usuario - la lógica de sesión está en aparkt.js
  // El botón de perfil y el banner se controlan desde aparkt.js

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
