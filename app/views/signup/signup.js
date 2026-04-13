  document.addEventListener("DOMContentLoaded", function () {
    let form = document.querySelector("form");

    function mostrarError(elemento, mensaje) {
      let existente = elemento.parentNode.querySelector(".mensajeError");
      if (existente) existente.remove();
      let error = document.createElement("div");
      error.className = "mensajeError";
      error.style.color = "#f87171";
      error.style.fontSize = "0.9em";
      error.textContent = mensaje;
      elemento.parentNode.appendChild(error);
    }

    function limpiarErrores() {
      document.querySelectorAll(".mensajeError").forEach(el => el.remove());
    }

    form.onsubmit = function (e) {
      e.preventDefault();
      limpiarErrores();

      const passwordInput = document.getElementById("inputContrasena");
      const confirmarPasswordInput = document.getElementById("confirmarContrasena");
      const checkbox = document.getElementById("aceptarTerminos");

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

      let valido = true;

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
      }

      const confirmarPassword = confirmarPasswordInput.value.trim();
      if (confirmarPassword === "") {
        mostrarError(confirmarPasswordInput, "Debes confirmar la contraseña.");
        valido = false;
      } else if (confirmarPassword !== password) {
        mostrarError(confirmarPasswordInput, "Las contraseñas no coinciden.");
        valido = false;
      }

      if (!checkbox.checked) {
        mostrarError(checkbox, "Debes aceptar los términos.");
        valido = false;
      }

      if (!valido) {
        return;
      }

      const nombre = document.getElementById("inputNombre").value.trim();
      const apellido = document.getElementById("inputApellidos").value.trim();
      const email = document.getElementById("inputCorreo").value.trim();
      const ciudad = document.getElementById("inputCiudad").value.trim();

      const datos = {
        usuario: nombre,
        apellido: apellido,
        email: email,
        ciudad: ciudad,
        contrasena: password
      };

      fetch('../../controllers/SignupController.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      })
      .then(respuesta => respuesta.json())
      .then(data => {
        if (data.status === 'ok') {
          alert(data.mensaje);
          window.location.href = '../login/login.html';
        } else if (data.errores) {
          alert(Object.values(data.errores).join("\n"));
        } else {
          alert(data.mensaje || 'Error en el registro');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión');
      });
    };
  });
