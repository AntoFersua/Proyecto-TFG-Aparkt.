document.addEventListener("DOMContentLoaded", function () {
  alert("JS ajajj");
  let form = document.querySelector("form");
  let nombreInput = document.getElementById("inputNombre");
  let apellidosInput = document.getElementById("inputApellidos");
  let emailInput = document.getElementById("inputCorreo");
  let telefonoInput = document.getElementById("inputTelefono");
  let passwordInput = document.getElementById("inputContrasena");
  let confirmarPasswordInput = document.getElementById("confirmarContrasena");
  let checkbox = document.getElementById("aceptarTerminos");

  form.onsubmit = function (e) {
    e.preventDefault();
    limpiarErrores();
    let valido = true;

    /**Aceptar condiciones que este checked */
    if (!checkbox.checked) {
      mostrarError(checkbox, "Debes aceptar los términos.");
      valido = false;
    }

    /**NOMBRE (que no sea vacío,  empezar con letra, solo letras y entre 2 y 15 caracteres) */
    let nombre = nombreInput.value.trim();
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,15}$/;

    if (nombre === "") {
      mostrarError(nombreInput, "El nombre es obligatorio");
      valido = false;
    } else if (!regexNombre.test(nombre)) {
      mostrarError(nombreInput, "El nombre no cumple con el formato");
      valido = false;
    }

    /**APELLIDOS (que no esté vacío, solo pueden contener letras, espacios y tildes) */
    let apellidos = apellidosInput.value.trim();
    const regexApellidos = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]{3,100}$/;

    if (apellidos === "") {
      mostrarError(apellidosInput, "Los apellidos son obligatorios");
      valido = false;
    } else if (!regexApellidos.test(apellidos)) {
      mostrarError(apellidosInput, "Los apellidos no cumplen con el formato");
      valido = false;
    }

    // EMAIL (no vacío, dominio válido, @ y .)
    let email = emailInput.value.trim();

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      mostrarError(emailInput, "El email es obligatorio");
      valido = false;
    } else if (!regexEmail.test(email)) {
      mostrarError(emailInput, "El email no tiene el formato");
      valido = false;
    }

    /**TELÉFONO (no vacío, solo números y >9) */
    let telefono = telefonoInput.value.trim();
    const regexTelefono = /^\d{9,}$/;
    if (telefono === "") {
      mostrarError(telefonoInput, "El teléfono es obligatorio");
      valido = false;
    } else if (!regexTelefono.test(telefono)) {
      mostrarError(telefonoInput,"El teléfono debe tener al menos 9 dígitos y solo números");
      valido = false;
    }

    /**CONTRASEÑA (no vacío, con número, mayúscula, caracter especial) */
    let password = passwordInput.value.trim();

    const regexPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@!?%])[A-Za-z@!%?]{6,15}$/;

    if (password === "") {
      mostrarError(passwordInput, "La contraseña es obligatoria");
      valido = false;
    } else if (!regexPass.test(password)) {
      mostrarError(
        passwordInput,
        "La contraseña debe tener entre 6 y 15 caracteres, una mayúscula, una minúscula y un carácter especial",
      );
      valido = false;
    }

    /**Confirmar contraseña (que sea la misma que la anterior) */
    let confirmarPassword = confirmarPasswordInput.value.trim();

    if (confirmarPassword === "") {
      mostrarError(confirmarPasswordInput, "Debes confirmar la contraseña.");
      valido = false;
    } else if (confirmarPassword !== password) {
      mostrarError(confirmarPasswordInput, "Las contraseñas no coinciden.");
      valido = false;
    }

    /**Si algo falla paramos el onsubmit */
    if (!valido) {
      e.preventDefault();
    } else {
      const datos = {
        usuario: nombre,
        apellidos: apellidos,
        email: email,
        telefono: telefono,
        contrasena: password,
      };

      fetch(
        "http://localhost/tfg/Proyecto-TFG-Aparkt/app/controllers/SignupController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        },
      )
        .then((respuesta) => respuesta.json())
        .then((data) => {
          if (data.status === "ok") {
            alert(data.mensaje);
            window.location.href = "/app/views/login/login.html";
          } else if (data.errores) {
            for (let campo in data.errores) {
              let input = document.getElementById(
                "input" + campo.charAt(0).toUpperCase() + campo.slice(1),
              );
              if (input) mostrarError(input, data.errores[campo]);
            }
          } else {
            alert(data.mensaje || "Error en el registro");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error de conexión");
        });
    }
  };

  /**FUNCIONES PARA MOSTRAR ERRORES Y QUITARLOS */
  function mostrarError(elemento, mensaje) {
    let error = document.createElement("div");
    error.className = "mensajeError";
    error.style.color = "red";
    error.style.fontSize = "0.9em";
    error.textContent = mensaje;

    elemento.parentNode.appendChild(error);
  }

  function limpiarErrores() {
    let errores = document.querySelectorAll(".mensajeError");
    for (let i = 0; i < errores.length; i++) {
      errores[i].parentNode.removeChild(errores[i]);
    }
  }
});
