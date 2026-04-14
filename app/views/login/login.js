const validador = new JustValidate('#loginForm', {
  validateBeforeSubmitting: true,
  focusInvalidField: true
});

// EMAIL
validador.addField('#email', [
  {
    rule: 'required',
    errorMessage: 'El email es obligatorio'
  }
]);

// PASSWORD
validador.addField('#password', [
  {
    rule: 'required',
    errorMessage: 'La contraseña es obligatoria'
  }
]);

// SUBMIT
validador.onSuccess((event) => {
  event.preventDefault();

  const datos = {
    usuario: document.querySelector('#email').value.trim(),
    contrasena: document.querySelector('#password').value.trim()
  };

  fetch('../../controllers/LoginController.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          alert(data.mensaje);
          window.location.href = '../index.html';
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
});

  
