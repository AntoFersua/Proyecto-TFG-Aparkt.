import { iniciarAuth, obtenerUsuario, cerrarSesion } from '../auth.js';

let usuarioActual = null;

document.addEventListener("DOMContentLoaded", async function () {
  console.log("Inicializando Signup");

// Verificar sesión pero permitir acceso siempre al signup
  await iniciarAuth({
    alLoguearse: (usuario) => {
      // Está logueado, pero permitir acceso al signup
      inicializarFormulario();
    },
    alNoLoguearse: () => {
      // No está logueado
      inicializarFormulario();
    }
  });
});

function inicializarFormulario() {
  // Configurar botones de sesión
  configurarBotonesSesion();

  const form = document.getElementById("formUsuario");
  if (!form) {
    console.log("Formulario no encontrado");
    return;
  }

  const validador = new JustValidate("#formUsuario", {
    validateBeforeSubmitting: true,
    focusInvalidField: true,
  });

  // NOMBRE
  validador.addField("#inputNombre", [
    { rule: "required", errorMessage: "El nombre es obligatorio" },
    { rule: "minLength", value: 2, errorMessage: "Mínimo 2 caracteres" },
    { rule: "maxLength", value: 20, errorMessage: "Máximo 20 caracteres" },
  ], {
    errorsContainer: "#error-nombre",
  });

  // APELLIDOS
  validador.addField("#inputApellidos", [
    { rule: "required", errorMessage: "El apellido es obligatorio" },
    { rule: "minLength", value: 2, errorMessage: "Mínimo 2 caracteres" },
    { rule: "maxLength", value: 50, errorMessage: "Máximo 50 caracteres" },
  ], {
    errorsContainer: "#error-apellidos",
  });

  // EMAIL
  validador.addField("#inputCorreo", [
    { rule: "required", errorMessage: "El email es obligatorio" },
    { rule: "email", errorMessage: "Email inválido" },
  ], {
    errorsContainer: "#error-email",
  });

  // TELÉFONO
  validador.addField("#inputTelefono", [
    { rule: "required", errorMessage: "El teléfono es obligatorio" },
  ], {
    errorsContainer: "#error-telefono",
  });

  // CONTRASEÑA
  validador.addField("#inputContrasena", [
    { rule: "required", errorMessage: "La contraseña es obligatoria" },
    { rule: "minLength", value: 6, errorMessage: "Mínimo 6 caracteres" },
    { rule: "maxLength", value: 15, errorMessage: "Máximo 15 caracteres" },
  ], {
    errorsContainer: "#error-contrasena",
  });

  // CONFIRMAR CONTRASEÑA
  validador.addField("#confirmarContrasena", [
    { rule: "required", errorMessage: "Repite la contraseña" },
    {
      validator: (value, fields) => {
        return value === fields["#inputContrasena"].elem.value;
      },
      errorMessage: "Las contraseñas no coinciden",
    },
  ], {
    errorsContainer: "#error-confirmarContrasena",
  });

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
}

function configurarBotonesSesion() {
  // Los botones de sesión ya están configurados en funcionesGlobales.js
}