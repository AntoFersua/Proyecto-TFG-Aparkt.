const validador = new JustValidate('#formUsuario', {
  validateBeforeSubmitting: true,
  focusInvalidField: true
});

// ================= REGEX =================
const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
const soloNumeros = /^[0-9]+$/;

// ================= VALIDACIÓN =================
validador

// NOMBRE
.addField('#inputNombre', [
  { rule: 'required', errorMessage: 'Nombre obligatorio' },
  { rule: 'minLength', value: 2, errorMessage: 'Mínimo 2 caracteres' },
  { rule: 'maxLength', value: 20, errorMessage: 'Máximo 20 caracteres' },
  {
    validator: (value) => soloLetras.test(value),
    errorMessage: 'Solo letras'
  }
], {
  errorsContainer: '#error-nombre'
})

// APELLIDO
.addField('#inputApellidos', [
  { rule: 'required', errorMessage: 'Apellido obligatorio' },
  { rule: 'minLength', value: 2, errorMessage: 'Mínimo 2 caracteres' },
  { rule: 'maxLength', value: 50, errorMessage: 'Máximo 50 caracteres' },
  {
    validator: (value) => soloLetras.test(value),
    errorMessage: 'Solo letras'
  }
], {
  errorsContainer: '#error-apellido'
})

// CIUDAD (opcional)
.addField('#inputCiudad', [
  {
    validator: () => true
  }
], {
  errorsContainer: '#error-ciudad'
})

// TELÉFONO (opcional)
.addField('#inputTelefono', [
  {
    validator: (value) => {
      if (value === '') return true;
      return soloNumeros.test(value);
    },
    errorMessage: 'Solo números'
  }
], {
  errorsContainer: '#error-telefono'
})

// EMAIL
.addField('#inputCorreo', [
  { rule: 'required', errorMessage: 'Email obligatorio' },
  { rule: 'email', errorMessage: 'Email inválido' }
], {
  errorsContainer: '#error-email'
})

// PASSWORD
.addField('#inputContrasena', [
  { rule: 'required', errorMessage: 'Password obligatoria' },
  { rule: 'minLength', value: 6, errorMessage: 'Mínimo 6 caracteres' },
  { rule: 'maxLength', value: 15, errorMessage: 'Máximo 15 caracteres' },
  {
    validator: (value) =>
      /[A-Z]/.test(value) &&
      /[0-9]/.test(value) &&
      /[^A-Za-z0-9]/.test(value),
    errorMessage: 'Debe tener mayúscula, número y símbolo'
  }
], {
  errorsContainer: '#error-password'
})

// REPETIR PASSWORD
.addField('#confirmarContrasena', [
  { rule: 'required', errorMessage: 'Repite la contraseña' },
  {
    validator: (value, fields) => {
      return value === fields['#inputContrasena'].elem.value;
    },
    errorMessage: 'Las contraseñas no coinciden'
  }
], {
  errorsContainer: '#error-repetirPassword'
})

// ================= SUBMIT =================
.onSuccess((event) => {
  event.preventDefault();

 const datos = {
   nombre: document.querySelector('#inputNombre').value,
   apellido: document.querySelector('#inputApellidos').value,
   ciudad: document.querySelector('#inputCiudad').value,
   telefono: document.querySelector('#inputTelefono').value,
   email: document.querySelector('#inputCorreo').value,
   contrasena: document.querySelector('#inputContrasena').value,
   confirmarContrasena: document.querySelector('#confirmarContrasena').value,
   aceptarTerminos: document.querySelector('#aceptarTerminos').checked
 };

  console.log("Usuario válido:", datos);

    // MANDAAR AL BACK
  fetch('../../controllers/SignupController.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'ok') {
      alert(data.mensaje);
      window.location.href = '../login/login.html';
    } else {
      alert(data.mensaje || 'Error en el registro');
    }
  })
  .catch(err => {
    console.error(err);
    alert('Error de conexión');
  });
});










