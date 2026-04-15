document.addEventListener("DOMContentLoaded", function () {
  console.log("Inicializando JustValidate en Login");

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

  const validador = new JustValidate("#loginForm", {
    validateBeforeSubmitting: true,
    focusInvalidField: true,
  });

  // EMAIL
  validador.addField("#email", [
    {
      rule: "required",
      errorMessage: "El email es obligatorio",
    },
    {
      rule: "email",
      errorMessage: "Email inválido",
    },
  ]);

  // PASSWORD
  validador.addField("#password", [
    {
      rule: "required",
      errorMessage: "La contraseña es obligatoria",
    },
  ]);

  // SUBMIT
  validador.onSuccess((event) => {
    event.preventDefault();

    const datos = {
      usuario: document.querySelector("#email").value.trim(),
      contrasena: document.querySelector("#password").value.trim(),
    };

    fetch("../../controllers/LoginController.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          alert(data.mensaje);
          window.location.href = "../index.html";
        } else {
          if (data.errores) {
            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");
            for (let campo in data.errores) {
              let input = campo === "usuario" ? emailInput : passwordInput;
              mostrarError(input, data.errores[campo]);
            }
          } else {
            alert(data.mensaje || "Error en el login");
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error de conexión");
      });
  });
});
