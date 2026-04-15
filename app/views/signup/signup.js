// Validación con JustValidate
document.addEventListener("DOMContentLoaded", function () {
  console.log("Inicializando JustValidate");

  const form = document.getElementById("formUsuario");
  if (!form) {
    console.log("Formulario no encontrado");
    return;
  }

  const validador = new JustValidate("#formUsuario", {
    validateBeforeSubmitting: true,
    focusInvalidField: true,
  });

  console.log("Validador creado:", validador);

  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

  // NOMBRE
  validador.addField("#inputNombre", [
    { rule: "required", errorMessage: "Nombre obligatorio" },
    { rule: "minLength", value: 2, errorMessage: "Mínimo 2 caracteres" },
    { rule: "maxLength", value: 20, errorMessage: "Máximo 20 caracteres" },
  ]);

  // APELLIDO
  validador.addField("#inputApellidos", [
    { rule: "required", errorMessage: "Apellido obligatorio" },
    { rule: "minLength", value: 2, errorMessage: "Mínimo 2 caracteres" },
    { rule: "maxLength", value: 50, errorMessage: "Máximo 50 caracteres" },
  ]);

  // CIUDAD (select)
  validador.addField("#inputCiudad", [
    { rule: "required", errorMessage: "Selecciona una ciudad" },
  ]);

  // EMAIL
  validador.addField("#inputCorreo", [
    { rule: "required", errorMessage: "Email obligatorio" },
    { rule: "email", errorMessage: "Email inválido" },
  ]);

  // PASSWORD
  validador.addField("#inputContrasena", [
    { rule: "required", errorMessage: "Contraseña obligatoria" },
    { rule: "minLength", value: 6, errorMessage: "Mínimo 6 caracteres" },
    { rule: "maxLength", value: 15, errorMessage: "Máximo 15 caracteres" },
  ]);

  // CONFIRMAR PASSWORD
  validador.addField("#confirmarContrasena", [
    { rule: "required", errorMessage: "Repite la contraseña" },
    {
      validator: (value, fields) => {
        return value === fields["#inputContrasena"].elem.value;
      },
      errorMessage: "Las contraseñas no coinciden",
    },
  ]);

  // SUBMIT
  validador.onSuccess((event) => {
    event.preventDefault();

    const datos = {
      nombre: document.getElementById("inputNombre").value.trim(),
      apellido: document.getElementById("inputApellidos").value.trim(),
      ciudad: document.getElementById("inputCiudad").value,
      telefono: document.getElementById("inputTelefono")?.value.trim() || "",
      email: document.getElementById("inputCorreo").value.trim(),
      contrasena: document.getElementById("inputContrasena").value,
      confirmarContrasena: document.getElementById("confirmarContrasena").value,
      aceptarTerminos: document.getElementById("aceptarTerminos").checked,
    };

    fetch("../../controllers/SignupController.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          alert(data.mensaje);
          window.location.href = "../login/login.html";
        } else {
          alert(data.mensaje || "Error en el registro");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error de conexión");
      });
  });
});
