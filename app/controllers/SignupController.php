<?php
require 'app/models/Conexion.php';
require "app/models/Usuario.php";


class SignupController
{

    private $usuarioModelo;

    public function __construct($conexion)
    {
        $this->usuarioModelo = new Usuario($conexion);
    }

    public function registrar()
    {
        // Obtener el contenido raw del body
        $inputJSON = file_get_contents('php://input');

        // Convertir a array asociativo
        $DatosPost = json_decode($inputJSON, true);

        $errores = [];

        $usuario = trim($DatosPost['usuario'] ?? "");
        $contrasena = trim($DatosPost['contrasena'] ?? "");
        $email = strtolower(trim($DatosPost['email'] ?? ""));

        if ($usuario == "") {
            $errores["usuario"] = "Introduzca un nombre de usuario";
        } elseif (strlen($usuario) < 8 || strlen($usuario) > 16) {
            $errores["usuario"] = "usuario debe tener entre 8 a 16 caracteres";
        }

        if ($contrasena == "") {
            $errores["contrasena"] = "Introduzca una contraseña";
        } elseif (!preg_match("/^(?=.*[A-Z])(?=.*[a-z])(?=.*[@!?%])[A-Za-z@!%?]{6,15}$/", $contrasena)) {
            $errores["contrasena"] = "mínimo 4 caracteres y máximo 8, al menos una mayúscula, al menos una minúscula, al menos un símbolo (@!?%)";
        }

        if ($email == "") {
            $errores["email"] = "Introduzca un email";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errores["email"] = "Formato incorrecto de email";
        }
        /**
         * 
         * obtenerUsuario sirve como comprobante de si hay o no usuario
         * hay usuario-> return row de datos 
         * No hay usuario->return false
         */
        if (empty($errores)) {
            if ($this->usuarioModelo->obtenerUsuario($usuario)) {
                $errores["usuario"] = "Ya existe un usuario con ese nombre";
            }
            if ($this->usuarioModelo->existeEmail($email)) {
                $errores["email"] = "Ya existe un usuario con ese email";
            }
        }

        header('Content-Type: application/json');
        if (empty($errores)) {
            $contrasenaHasheada = password_hash($contrasena, PASSWORD_DEFAULT);
            $this->usuarioModelo->crearUsuario($usuario, $contrasenaHasheada, $email);
            echo json_encode([
                "status" => "ok",
                "mensaje" => "usuario registrado correctamente",
                ]);
        } else {
        echo json_encode([
                "status" => "error",
                "errores" => $errores
            ]);
        }


    }

}

?>