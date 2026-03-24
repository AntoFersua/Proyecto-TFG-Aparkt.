(() => {
  const secciones = document.querySelectorAll(".seccion-formulario");
  const pasos = document.querySelectorAll(".indicador-paso .paso");
  const btnAtras = document.getElementById("btnAtras");
  const btnSiguiente = document.getElementById("btnSiguiente");
  const btnCrear = document.getElementById("btnCrear");

  let pasoActual = 0;
  const totalPasos = secciones.length;

  function mostrarPaso(index) {
    secciones.forEach((s, i) => {
      s.classList.toggle("activa", i === index);
    });

    pasos.forEach((p, i) => {
      p.classList.toggle("activo", i <= index);
    });

    btnAtras.classList.toggle("visible", index > 0);
    btnSiguiente.classList.toggle("oculto", index === totalPasos - 1);
    btnCrear.classList.toggle("visible", index === totalPasos - 1);
  }

  btnSiguiente.addEventListener("click", () => {
    if (pasoActual < totalPasos - 1) {
      pasoActual++;
      mostrarPaso(pasoActual);
    }
  });

  btnAtras.addEventListener("click", () => {
    if (pasoActual > 0) {
      pasoActual--;
      mostrarPaso(pasoActual);
    }
  });

  // Toggle ver contraseña
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

  // Estado inicial
  mostrarPaso(0);
})();
