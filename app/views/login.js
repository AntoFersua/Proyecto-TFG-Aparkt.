window.onload = function () {
  document.addEventListener("DOMContentLoaded", function () {
    let form = document.querySelector("form");
    let emailInput = document.getElementById("email");
    let passwordInput = document.getElementById("password");

    form.onsubmit = function (e) {
      limpiarErrores(); //que no se acumulen los errores
      let valido = true;

      // EMAIL
      let email = emailInput.value.trim();
      let tieneArroba = false;
      let tienePunto = false;
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

      for (let i = 0; i < email.length; i++) {
        if (email[i] === "@") {
          tieneArroba = true;
        }
        if (email[i] === ".") {
          tienePunto = true;
        }
      }

      if (email === "") {
        mostrarError(emailInput, "El email es obligatorio.");
        valido = false;
      } else if (!tieneArroba || !tienePunto) {
        mostrarError(emailInput, "El email no es válido.");
        valido = false;
      }

      // CONTRASEÑA
      let password = passwordInput.value.trim();
      let tieneNumero = false;
      let tieneMayuscula = false;
      let tieneEspecial = false;
      let especiales = "!@#$%^&*_";

      for (let i = 0; i < password.length; i++) {
        let c = password[i];
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
      } else if (password.length < 6) {
        mostrarError(
          passwordInput,
          "La contraseña debe tener al menos 6 caracteres.",
        );
        valido = false;
      } else if (!tieneNumero) {
        mostrarError(
          passwordInput,
          "La contraseña debe contener al menos un número.",
        );
        valido = false;
      } else if (!tieneMayuscula) {
        mostrarError(
          passwordInput,
          "La contraseña debe contener al menos una letra mayúscula.",
        );
        valido = false;
      } else if (!tieneEspecial) {
        mostrarError(
          passwordInput,
          "La contraseña debe contener al menos un carácter especial (!@#$%^&*_)",
        );
        valido = false;
      }

      if (!valido) {
        e.preventDefault();
      }
    };

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
