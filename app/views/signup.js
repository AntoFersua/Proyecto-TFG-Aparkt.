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
      limpiarErrores();
        /**Aceptar condiciones */


      /**Si algo falla paramos el onsubmit */
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