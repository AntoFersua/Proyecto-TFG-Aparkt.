<?php

require "app/models/Conexion.php";
require "app/models/Usuario.php";
class LoginController
{
    private $usuarioModelo;

    public function __construct($conexion)
    {

        $this->usuarioModelo = new Usuario($conexion);
    }

    public function login()
    {
        // Obtener el contenido raw del body
        $inputJSON = file_get_contents('php://input');

        // Convertir a array asociativo
        $DatosPost = json_decode($inputJSON, true);

        $errores = [];

        $usuario = trim($DatosPost['usuario'] ?? '');
        $contrasena = trim($DatosPost['contrasena'] ?? '');


        if ($usuario == '') {
            $errores['usuario'] = "Introduce un usuario";
        }

        if ($contrasena == '') {
            $errores['contrasena'] = "Introduce un contraseña";
        }

        if (empty($errores)) {
            $user_info = $this->usuarioModelo->obtenerUsuario($usuario);
            if (!$user_info) {
                $errores['usuario'] = "Usuario no existe";
            } else {
                $contrasenaCorrecta = $this->usuarioModelo->verificarContrasena($contrasena, $user_info['contrasena']);
                if (!$contrasenaCorrecta) {
                    $errores['contrasena'] = "contraseña incorrecta";
                }
            }

            if ($user_info && $contrasenaCorrecta) {
                session_start();

                $_SESSION["usuario"] = $usuario;

                header('Content-Type: application/json');
                echo json_encode([
                    "status" => "ok",
                    "mensaje" => "Usuario inicio sesión correctamente"
                ]);
                exit();

            } else {
                echo json_encode([
                    "status" => "error",
                    "mensaje" => "Usuario no pudo iniciar sesión correctamente"
                ]);
                exit();
            }

        }

    }

}

?>