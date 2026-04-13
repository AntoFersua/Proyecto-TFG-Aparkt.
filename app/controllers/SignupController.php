<?php
//importar los archivos
require __DIR__ . '/../models/Conexion.php';
require __DIR__ . '/../models/Usuario.php';

class SignupController
{

    private $usuarioModelo;

    public function __construct($conexion)
    {
        $this->usuarioModelo = new Usuario($conexion);
    }

    public function registrar()
    {
        //Obtener el contenido raw del body
        $inputJSON = file_get_contents('php://input');

        //Convertir a array asociativo
        $DatosPost = json_decode($inputJSON, true);

        $errores = [];

        //obtener datos
        $nombre = trim($DatosPost['nombre'] ?? "");
        $apellido = trim($DatosPost['apellido'] ?? "");
        $ciudad = trim($DatosPost['ciudad'] ?? "");
        $telefono = trim($DatosPost['telefono'] ?? "");
        $contrasena = trim($DatosPost['contrasena'] ?? "");
        $email = trim($DatosPost["email"] ?? "");

        $ciudadesPermitidas = ["Malaga", "Sevilla", "Granada", "Cordoba"];

        //validar datos
        if ($nombre == "") {
            $errores["nombre"] = "Introduzca un nombre";
        } elseif (!preg_match('/^[\p{L}]{2,20}$/u', $nombre)) {
            $errores["nombre"] = "nombre inválido: debe empezar con letra, solo letras, números y _, entre 2 y 20 caracteres";
        }

        if ($apellido == "") {
            $errores["apellido"] = "Introduzca el apellido";
        } elseif (!preg_match('/^[\p{L}]+(?:\s[\p{L}]+){0,49}$/u', $apellido)) {
            $errores["apellido"] = "El apellido solo puede contener letras y espacios (2-50 caracteres)";
        }

        //PONER LAS MISMAS CIUDADES EN CIUDADESPERMITIDAS
        if ($ciudad == "") {
            $errores["ciudad"] = "Seleccione una ciudad";
        } elseif (!in_array($ciudad, $ciudadesPermitidas, true)) {
            $errores["ciudad"] = "Ciudad no válida";
        }


        if ($telefono == "") {
            $errores["telefono"] = "Teléfono no válido";
        } elseif (!preg_match('/^[0-9]{9,15}$/', $telefono)) {
            $errores["telefono"] = "Formato de teléfono no válido";
        } elseif ($this->usuarioModelo->verificarTelefono($telefono) > 0) {
            $errores["telefono"] = "El teléfono ya está registrado";
        }
        //IMPORTANTE, MIRAR LA VAALIDACIÓN DEL FRONTEND, FALTA AÑADIR NUMEROS A LA PASS
        if ($contrasena == "") {
            $errores["contrasena"] = "Introduzca una contraseña";
        } elseif (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,15}$/', $contrasena)) {
            $errores["contrasena"] = "mínimo 6 caracteres y máximo 15, al menos una mayúscula, al menos una minúscula, al menos un símbolo (@!?%)";
        }

        if ($email == "") {
            $errores["email"] = "Introduzca un email";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errores["email"] = "Formato de correo no válido";
        } elseif ($this->usuarioModelo->existeEmail($email) > 0) {
            $errores["email"] = "El email ya esta registrado";
        }

        /**
         * 
         * obtenerUsuario sirve como comprobante de si hay o no usuario
         * hay usuario-> return row de datos 
         * No hay usuario->return false
         */
        //si no hay errores
        if (empty($errores)) {
            if ($this->usuarioModelo->obtenerUsuario($nombre)) {
                $errores["nombre"] = "Ya existe un usuario con ese nombre";
            }
        }

        //cabecera json
        header('Content-Type: application/json');
        //si no hay errores
        if (empty($errores)) {
            //hashear contraseña y crear usuario
            $contrasenaHasheada = password_hash($contrasena, PASSWORD_DEFAULT);
            if ($this->usuarioModelo->crearUsuario($nombre, $apellido, $ciudad, $contrasenaHasheada, $email, $telefono)) {
                echo json_encode([
                    "status" => "ok",
                    "mensaje" => "usuario registrado correctamente"
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "mensaje" => "Error al insertar usuario"
                ]);
            }
        } else {
            echo json_encode([
                "status" => "error",
                "errores" => $errores
            ]);
        }
    }
}
if (basename($_SERVER['SCRIPT_FILENAME']) === 'SignupController.php') {
    $conexion = require __DIR__ . '/../models/Conexion.php';
    $controller = new SignupController($conexion);
    $controller->registrar();
}
?>