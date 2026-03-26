window.onload = function () {
  document.addEventListener("DOMContentLoaded", function () {
    let form = document.querySelector("form");
    let emailInput = document.getElementById("email");
    let passwordInput = document.getElementById("password");

    form.onsubmit = function (e) {
      e.preventDefault();
      limpiarErrores();
      let valido = true;

      // EMAIL (no vacía y no mayor de 50)
      if (emailInput.value == "") {
        mostrarError(emailInput, "El email es obligatorio.");
        valido = false;
      }else if(emailInput.value.length>50){
        mostrarError(emailInput, "El email es demasiado largo.");
        valido = false;
      }

      /**Contraseña (no vacía y mayor de 6) */
      if (passwordInput.value == "") {
        mostrarError(passwordInput, "La contraseña es obligatoria.");
        valido = false;
      }else if(passwordInput.length<6){
        mostrarError(passwordInput, "La contraseña debe ser mayor de 6 caracteres");
      }

      /**Paramos envío de formulario ante algún fallo */
      if (!valido){
        e.preventDefault(); 
      } 

      let datos = {
        usuario: emailInput.value.trim(),
        contrasena: passwordInput.value.trim()
      };

      fetch('../app/controllers/LoginController.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        //JS → String JSON
        body: JSON.stringify(datos)
      })
       //transforma la respuesta de JSON a objeto
      .then(response => response.json())
      //data = objeto respuesta
      .then(data => {
        if (data.status === 'ok') {
          alert(data.mensaje);
          window.location.href = 'index.html';
        } else {
          if (data.errores) {
            for (let campo in data.errores) {
              let input = campo === 'usuario' ? emailInput : passwordInput;
              mostrarError(input, data.errores[campo]);
            }
          } else {
            alert(data.mensaje || 'Error en el login');
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión');
      });
    };
    

    function mostrarError(elemento, mensaje) {
      const error = document.createElement("div");
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