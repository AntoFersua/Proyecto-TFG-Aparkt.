import { z } from "zod";
//import { z } from "https://cdn.jsdelivr.net/npm/zod@3.23.8/lib/index.esm.js";

/* ESQUEMA ZOD QUE SIGUE LA VALIDACIÓN */
const ciudadesPermitidas = ["Malaga", "Sevilla", "Granada", "Cordoba"]; //cuando hagamos el select

const esquemaUsuario = z.object({
  nombre: z.string().min(2).max(20).regex(/^[\p{L}\s]+$/u),
  apellido: z.string().min(2).max(50).regex(/^[\p{L}\s]+$/u),
  email: z.string().email(),
  ciudad: z.string().min(2).max(30),   //comprobar porque nosotros no tenemos select 
  contrasena: z.string()
    .min(6)
    .max(15)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
  confirmarPassword: z.string(),
  aceptarTerminos: z.boolean(),
}).refine((data) => data.contrasena === data.confirmarPassword, { //refine para personalizar 
  message: "Las contraseñas no coinciden",
  path: ["confirmarPassword"]
}).refine((data) => data.aceptarTerminos === true, {
  message: "Debes aceptar los términos",
  path: ["aceptarTerminos"]
});


/*APUNTAR A CADA INPUT DEL FORMULARIO */
const form = document.querySelector("form");

const inputNombre = document.querySelector("#inputNombre");
const inputApellidos = document.querySelector("#inputApellidos");
const inputCorreo = document.querySelector("#inputCorreo");
const inputCiudad = document.querySelector("#inputCiudad");
const inputContrasena = document.querySelector("#inputContrasena");
const inputConfirmar = document.querySelector("#confirmarContrasena");
const inputTerminos = document.querySelector("#aceptarTerminos");



/*FUNCIÓN QUE VALIDA CADA INPUT Y SU VALOR */
function validarCampo(campo, valor) {
  const esquema = z.object({
    [campo]: esquemaUsuario.shape[campo],  //shape es un objeto que tiene todos los campos del schema
  });

  return esquema.safeParse({ //no te revienta el código si algo falla
    [campo]: valor,
  });
}


//VALIDACIÓN DE CADA UNO DE LOS INPUT POR SEPARADO

//NOMBRE
inputNombre.addEventListener("input", (e) => {
  const res = validarCampo("nombre", e.target.value);
  console.log("nombre:", res.success ? "OK" : res.error.errors[0].message);
});

// APELLIDOS
inputApellidos.addEventListener("input", (e) => {
  const res = validarCampo("apellido", e.target.value);
  console.log("apellido:", res.success ? "OK" : res.error.errors[0].message);
});

// EMAIL
inputCorreo.addEventListener("input", (e) => {
  const res = validarCampo("email", e.target.value);
  console.log("email:", res.success ? "OK" : res.error.errors[0].message);
});

// CIUDAD
inputCiudad.addEventListener("input", (e) => {
  const res = validarCampo("ciudad", e.target.value);
  console.log("ciudad:", res.success ? "OK" : res.error.errors[0].message);
});

// CONTRASEÑA
inputContrasena.addEventListener("input", (e) => {
  const res = validarCampo("contrasena", e.target.value);
  console.log("contrasena:", res.success ? "OK" : res.error.errors[0].message);
});

// CONFIRMAR PASSWORD
inputConfirmar.addEventListener("input", (e) => {
  const coincide = e.target.value === inputContrasena.value;
  console.log("confirmar:", coincide ? "OK" : "No coincide");
});

// TÉRMINOS
inputTerminos.addEventListener("change", (e) => {
  console.log("terminos:", e.target.checked ? "OK" : "Debes aceptarlos");
});



// VALIDACIÓN FINAL CUANDO SE HACE EL SUBMIT 
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const datos = {
    nombre: inputNombre.value.trim(),
    apellido: inputApellidos.value.trim(),
    email: inputCorreo.value.trim(),
    ciudad: inputCiudad.value.trim(),
    contrasena: inputContrasena.value,
    confirmarPassword: inputConfirmar.value,
    aceptarTerminos: inputTerminos.checked,
  };

  const resultado = esquemaUsuario.safeParse(datos);

  if (!resultado.success) {
    console.log("FORMULARIO INVÁLIDO");
    console.log(resultado.error.flatten().fieldErrors);
    return;
  }

  console.log("FORMULARIO VÁLIDO");
  console.log(resultado.data);


  // MANDAAR AL BACK
  fetch('../../controllers/SignupController.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resultado.data)
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







