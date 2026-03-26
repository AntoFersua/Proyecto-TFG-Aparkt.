document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const btnCrear = document.getElementById("btnCrear");

  if (btnCrear) {
    btnCrear.addEventListener("click", function (e) {
      e.preventDefault();
      enviarFormulario();
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      enviarFormulario();
    });
  }

  function enviarFormulario() {
    const nombreInput = document.getElementById("inputNombre");
    const apellidosInput = document.getElementById("inputApellidos");
    const emailInput = document.getElementById("inputCorreo");
    const ciudadInput = document.getElementById("inputCiudad");
    const telefonoInput = document.getElementById("inputTelefono");
    const passwordInput = document.getElementById("inputContrasena");

    if (!nombreInput || !apellidosInput || !emailInput || !ciudadInput || !telefonoInput || !passwordInput) {
      alert("Error: No se encontraron los campos del formulario");
      return;
    }

    const nombre = nombreInput.value.trim();
    const apellido = apellidosInput.value.trim();
    const email = emailInput.value.trim();
    const ciudad = ciudadInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const contrasena = passwordInput.value.trim();

    const datos = {
      usuario: nombre,
      apellido: apellido,
      email: email,
      ciudad: ciudad,
      telefono: telefono,
      contrasena: contrasena
    };

    fetch("../../controllers/SignupController.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((respuesta) => respuesta.json())
      .then((data) => {
        if (data.status === "ok") {
          alert(data.mensaje);
          window.location.href = "../login/login.html";
        } else if (data.errores) {
          alert(Object.values(data.errores).join("\n"));
        } else {
          alert(data.mensaje || "Error en el registro");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error de conexiÃ³n");
      });
  }
});