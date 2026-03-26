window.onload = function () {
  document.addEventListener("DOMContentLoaded", function () {
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

      /**Nombre (que no sea vacío y >3) */
      let nombre = nombreInput.value.trim();
      if (nombre === "") {
        mostrarError(nombreInput, "El nombre es obligatorio");
        valido = false;
      } else if (nombre.length < 3) {
        mostrarError(nombreInput, "El nombre es demasiado corto.");
        valido = false;
      }

      /**Apellidos (que no esté vacío) */
      let apellidos = apellidosInput.value.trim();

      if (apellidos === "") {
        mostrarError(apellidosInput, "Los apellidos son obligatorios.");
        valido = false;
      }

      // EMAIL (no vacío, dominio válido, @ y .)
      let email = emailInput.value.trim();

      /**Email válidos */
      let dominiosEmail = [
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "hotmail.com",
        "live.com",
        "icloud.com",
        "aol.com",
        "mail.com",
        "zoho.com",
        "protonmail.com",
      ];
    
      /**Separo el email por el arroba, me queda un array  */
      let partesCorreo = email.split("@");
      let parteDominio = partesCorreo[1]; /**me quedo con la parte de después del arroba, índice 1 */

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
      }

      /**TELÉFONO (no vacío, solo números y >9) */
      let telefono = telefonoInput.value.trim();
      let soloNumeros = true;

      for (let i = 0; i < telefono.length; i++) {
        if (telefono[i] < "0" || telefono[i] > "9") {
          soloNumeros = false;
        }
      }

      if (telefono === "") {
        mostrarError(telefonoInput, "El teléfono es obligatorio.");
        valido = false;
      } else if (!soloNumeros) {
        mostrarError(telefonoInput, "El teléfono solo debe contener números.");
        valido = false;
      } else if (telefono.length < 9) {
        mostrarError(telefonoInput, "El teléfono debe tener al menos 9 dígitos.");
        valido = false;
      }

      /**Contraseña (no vacío, con número, mayúscula, caracter especial) */
      let password = passwordInput.value.trim();
      let tieneNumero = false;
      let tieneMayuscula = false;
      let tieneEspecial = false;
      let especiales = "!@#$%^&*_";

      for (let i = 0; i < password.length; i++) { 
        let c = password[i]; /**cada caracter de la contraseña */

        if (c >= "0" && c <= "9") {
          tieneNumero = true;
        }
        if (c >= "A" && c <= "Z") {
          tieneMayuscula = true;
        }

        for (let j = 0; j < especiales.length; j++) {
          if (c === especiales[j]) tieneEspecial = true;
        }
      }

      if (password === "") {
        mostrarError(passwordInput, "La contraseña es obligatoria.");
        valido = false;
      } else if (password.length < 8) {
        mostrarError(passwordInput, "Debe tener al menos 8 caracteres.");
        valido = false;
      } else if (!tieneNumero) {
        mostrarError(passwordInput, "Debe tener al menos un número.");
        valido = false;
      } else if (!tieneMayuscula) {
        mostrarError(passwordInput, "Debe tener una mayúscula.");
        valido = false;
      } else if (!tieneEspecial) {
        mostrarError(passwordInput, "Debe tener un carácter especial.");
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
        e.preventDefault();
        
        const datos = {
          usuario: nombre,
          apellidos: apellidos,
          email: email,
          telefono: telefono,
          contrasena: password
        };
        fetch('../app/controllers/SignupController.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        })
        .then(respuesta => respuesta.json())
        .then(data => {
          if (data.status === 'ok') {
            alert(data.mensaje);
            window.location.href = 'login.html';
          } else if (data.errores) {
            for (let campo in data.errores) {
              let input = document.getElementById('input' + campo.charAt(0).toUpperCase() + campo.slice(1));
              if (input) mostrarError(input, data.errores[campo]);
            }
          } else {
            alert(data.mensaje || 'Error en el registro');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error de conexión');
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
};
