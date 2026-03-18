<?php
require 'app/models/Conexion.php';
require "app/models/Usuario.php";


class SignupController {

private $usuarioModelo;

public function __construct($conexion){
    $this->usuarioModelo = new Usuario($conexion);
}

public function registrar($DatosPost){

    $errores = [];

    $usuario = trim($DatosPost['usuario']) ?? "";
    $contrasena = trim($DatosPost['contrasena']) ?? "";

    if ($usuario == "" || strlen($usuario)<8 || strlen($usuario)>16) {
        $errores["usuario"] = "usuario debe tener entre 8 a 16 caracteres";
    }

    if ($contrasena == "" || !preg_match("/^(?=.*[A-Z])(?=.*[a-z])(?=.*[@!?%])[A-Za-z@!%?]{4,8}$/", $contrasena)) {
        $errores["constrasena"] = "usuario debe tener entre 8 a 16 caracteres";
    }
}

}

?>