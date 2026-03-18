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

    public function login($DatosPost)
    {

        $usuario = trim($DatosPost['usuario'] ?? '');
        $contrasena = trim($DatosPost['contrasena'] ?? '');
        $errores = false;

        if ($usuario == '') {
            $err_usuario = "Introduce un usuario";
            $errores = true;
        }

        if ($contrasena == '') {
            $err_contrasena = "Introduce un contraseña";
            $errores = true;
        }

        if (!$errores) {
            $user_info = $this->usuarioModelo->obtenerPorUsuario($usuario);
            if (!$user_info) {
                $err_usuario = "Usuario no existe";
                $errores = true;
            }

            if (!$this->usuarioModelo->verificarContrasena($contrasena, $user_info['contrasena'])) {
                $err_contrasena = "contraseña incorrecta";
                $errores = true;
            }

            if ($user_info && $this->usuarioModelo->verificarContrasena($contrasena, $user_info['contrasena'])) {
                session_start();

                $_SESSION["usuario"] = $usuario;

                header("location: ../index.php");
                exit();

            }
        }

    }

}

?>