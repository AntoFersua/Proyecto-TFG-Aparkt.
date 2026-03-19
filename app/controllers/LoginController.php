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

        $errores=[];

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
            }

            $contrasenaInfo = $this->usuarioModelo->verificarContrasena($contrasena, $user_info['contrasena']);
            if (!$contrasenaInfo) {
                $errores['contrasena'] = "contraseña incorrecta";
            }

            if ($user_info && $contrasenaInfo) {
                session_start();

                $_SESSION["usuario"] = $usuario;

                header("location: ../index.php");
                exit();

            }else{
                return $errores;
            }
        }

    }

}

?>