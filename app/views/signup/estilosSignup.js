(() => {
  const carrusel = $(".owl-carousel");
  const pasos = document.querySelectorAll(".indicador-paso .paso");
  const btnCrear = document.getElementById("btnCrear");
  const navCarrusel = document.querySelector(".nav-carrusel");

  const totalPasos = 3;

  carrusel.owlCarousel({
    items: 1,
    navText: ["Atrás", "Siguiente"],
    navContainer: ".nav-carrusel",
    dots: false,
    smartSpeed: 300,
    loop: false,
  });

  function actualizarUI(index) {
    pasos.forEach((p, i) => {
      p.classList.toggle("activo", i <= index);
    });

    const btnAtras = navCarrusel.querySelector(".owl-prev");
    const btnSiguiente = navCarrusel.querySelector(".owl-next");

    btnAtras.style.display = index > 0 ? "block" : "none";

    if (index === totalPasos - 1) {
      btnSiguiente.style.display = "none";
      btnCrear.classList.add("visible");
    } else {
      btnSiguiente.style.display = "block";
      btnCrear.classList.remove("visible");
    }
  }

  carrusel.on("changed.owl.carousel", function (e) {
    actualizarUI(e.item.index);
  });

  document.querySelectorAll(".ver-contrasena").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.closest(".input-field").querySelector("input");
      const esPassword = input.type === "password";
      input.type = esPassword ? "text" : "password";
      btn.setAttribute(
        "aria-label",
        esPassword ? "Ocultar contraseña" : "Mostrar contraseña"
      );
      btn.querySelector("svg").innerHTML = esPassword
        ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/>'
        : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>';
    });
  });

  actualizarUI(0);
})();
