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
    mouseDrag: false,
    touchDrag: false,
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

  // Funciones de validación por paso
  /*function mostrarExito(elemento, mensaje) {
    limpiarExito(elemento);
    let ok = document.createElement("div");
    ok.className = "mensajeExito";
    ok.style.color = "#4ade80";
    ok.style.fontSize = "0.9em";
    ok.textContent = "✓ " + mensaje;
    elemento.parentNode.appendChild(ok);
  }

  function limpiarExito(elemento) {
    let existente = elemento.parentNode.querySelector(".mensajeExito");
    if (existente) existente.remove();
  }

  function mostrarError(elemento, mensaje) {
    limpiarError(elemento);
    let error = document.createElement("div");
    error.className = "mensajeError";
    error.style.color = "#f87171";
    error.style.fontSize = "0.9em";
    error.textContent = mensaje;
    elemento.parentNode.appendChild(error);
  }

  function limpiarError(elemento) {
    let existente = elemento.parentNode.querySelector(".mensajeError");
    if (existente) existente.remove();
  }

  function limpiarMensajes() {
    document.querySelectorAll(".mensajeError, .mensajeExito").forEach(el => el.remove());
  }

  function validarPaso1() {
    let valido = true;
    const nombreInput = document.getElementById("inputNombre");
    const apellidoInput = document.getElementById("inputApellidos");
    limpiarMensajes();

    const nombre = nombreInput.value.trim();
    if (nombre === "") {
      mostrarError(nombreInput, "El nombre es obligatorio.");
      valido = false;
    } else if (nombre.length < 3) {
      mostrarError(nombreInput, "El nombre es demasiado corto.");
      valido = false;
    } else {
      mostrarExito(nombreInput, "Nombre válido");
    }

    const apellido = apellidoInput.value.trim();
    if (apellido === "") {
      mostrarError(apellidoInput, "El apellido es obligatorio.");
      valido = false;
    } else {
      mostrarExito(apellidoInput, "Apellido válido");
    }

    return valido;
  }

  function validarPaso2() {
    let valido = true;
    const emailInput = document.getElementById("inputCorreo");
    const ciudadInput = document.getElementById("inputCiudad");
    limpiarMensajes();

    const dominiosEmail = [
      "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
      "live.com", "icloud.com", "aol.com", "mail.com", "zoho.com", "protonmail.com",
    ];

    const email = emailInput.value.trim();
    const partesCorreo = email.split("@");
    const parteDominio = partesCorreo[1];

    if (email === "") {
      mostrarError(emailInput, "El email es obligatorio.");
      valido = false;
    } else if (!email.includes("@") || !email.includes(".")) {
      mostrarError(emailInput, "El email no es válido.");
      valido = false;
    } else if (email.split("@").length !== 2) {
      mostrarError(emailInput, "El email no es válido.");
      valido = false;
    } else if (!dominiosEmail.includes(parteDominio)) {
      mostrarError(emailInput, "El dominio del email no es válido.");
      valido = false;
    } else {
      mostrarExito(emailInput, "Email válido");
    }

    const ciudad = ciudadInput.value.trim();
    if (ciudad === "") {
      mostrarError(ciudadInput, "La ciudad es obligatoria.");
      valido = false;
    } else {
      mostrarExito(ciudadInput, "Ciudad válida");
    }

    return valido;
  }

  function validarPaso3() {
    let valido = true;
    const passwordInput = document.getElementById("inputContrasena");
    const confirmarPasswordInput = document.getElementById("confirmarContrasena");
    const checkbox = document.getElementById("aceptarTerminos");
    limpiarMensajes();

    const password = passwordInput.value.trim();
    const especiales = "@!?%";
    let tieneMayuscula = false;
    let tieneMinuscula = false;
    let tieneEspecial = false;

    for (let i = 0; i < password.length; i++) {
      let c = password[i];
      if (c >= "A" && c <= "Z") tieneMayuscula = true;
      if (c >= "a" && c <= "z") tieneMinuscula = true;
      if (especiales.includes(c)) tieneEspecial = true;
    }

    if (password === "") {
      mostrarError(passwordInput, "La contraseña es obligatoria.");
      valido = false;
    } else if (password.length < 6 || password.length > 15) {
      mostrarError(passwordInput, "Debe tener entre 6 y 15 caracteres.");
      valido = false;
    } else if (!tieneMayuscula) {
      mostrarError(passwordInput, "Debe tener al menos una mayúscula.");
      valido = false;
    } else if (!tieneMinuscula) {
      mostrarError(passwordInput, "Debe tener al menos una minúscula.");
      valido = false;
    } else if (!tieneEspecial) {
      mostrarError(passwordInput, "Debe tener al menos un símbolo (@!?%).");
      valido = false;
    } else {
      mostrarExito(passwordInput, "Contraseña válida");
    }

    const confirmarPassword = confirmarPasswordInput.value.trim();
    if (confirmarPassword === "") {
      mostrarError(confirmarPasswordInput, "Debes confirmar la contraseña.");
      valido = false;
    } else if (confirmarPassword !== password) {
      mostrarError(confirmarPasswordInput, "Las contraseñas no coinciden.");
      valido = false;
    } else {
      mostrarExito(confirmarPasswordInput, "Las contraseñas coinciden");
    }

    if (!checkbox.checked) {
      mostrarError(checkbox, "Debes aceptar los términos.");
      valido = false;
    }

    return valido;
  }

  // Interceptar botón Siguiente
  function configurarBotonSiguiente() {
    const btnSiguiente = navCarrusel.querySelector(".owl-next");
    if (btnSiguiente) {
      btnSiguiente.addEventListener("click", function (e) {
        const indiceActual = carrusel.data("owl.carousel").relative(carrusel.data("owl.carousel").current());
        let valido = false;

        if (indiceActual === 0) valido = validarPaso1();
        else if (indiceActual === 1) valido = validarPaso2();

        if (!valido) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      });
    }
  }*/

  // Esperar a que Owl Carousel cree los botones
  /*setTimeout(configurarBotonSiguiente, 100);

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

  actualizarUI(0);*/
})();
