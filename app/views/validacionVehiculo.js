// Validation for vehicle form using JustValidate
window.inicializarValidacionVehiculo = function () {
  let form = document.getElementById("formVehiculo");
  if (!form) return;

  let validator = new window.JustValidate(form, {
    errorFieldCssClass: "error-field",
    errorLabelCssClass: "error-mensaje",
  });

  validator
    .addField("#tipoVehiculo", [
      {
        rule: "required",
        errorMessage: "Selecciona un tipo de vehículo",
      },
    ])
    .addField("#tamanoVehiculo", [
      {
        rule: "required",
        errorMessage: "Selecciona un tamaño",
      },
    ])
    .onSuccess(function (event) {
      event.preventDefault();
      let tipoVehiculo = document.getElementById("tipoVehiculo").value;
      let tamanoVehiculo = document.getElementById("tamanoVehiculo").value;

      const datos = {
        tipoVehiculo: tipoVehiculo,
        tamano: tamanoVehiculo,
      };

      console.log("Enviando:", datos);

      fetch("../../controllers/VehiculoController.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(datos),
      })
        .then((respuesta) => {
          console.log("Status:", respuesta.status);
          return respuesta.text();
        })
        .then((texto) => {
          console.log("Respuesta:", texto);
          return JSON.parse(texto);
        })
        .then((data) => {
          if (data.status === "ok") {
            alert(data.mensaje);
            document.getElementById("formVehiculo").reset();
          } else if (data.errores) {
            alert(Object.values(data.errores).join("\n"));
          } else {
            alert(data.mensaje || "Error al registrar vehículo");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error de conexión: " + error.message);
        });
    });

  return validator;
};

window.mostrarError = function (campo, mensaje) {
  let elemento = document.getElementById(campo);
  if (!elemento) return;

  let formGroup = elemento.closest(".form-group");
  if (!formGroup) formGroup = elemento.parentElement;

  let errorDiv = formGroup.querySelector(".error-mensaje");
  if (!errorDiv) {
    errorDiv = document.createElement("span");
    errorDiv.className = "error-mensaje";
    formGroup.appendChild(errorDiv);
  }

  errorDiv.textContent = mensaje;
};

window.limpiarError = function (campo) {
  let elemento = document.getElementById(campo);
  if (!elemento) return;

  let formGroup = elemento.closest(".form-group");
  if (!formGroup) formGroup = elemento.parentElement;

  let errorDiv = formGroup.querySelector(".error-mensaje");
  if (errorDiv) {
    errorDiv.remove();
  }
};

window.limpiarErrores = function () {
  let selects = document.querySelectorAll("#formVehiculo select");
  selects.forEach(function (select) {
    window.limpiarError(select.id);
  });
};
