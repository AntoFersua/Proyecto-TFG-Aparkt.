<?php
    //importar los archivos
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
            //Obtener el contenido raw del body
            $inputJSON = file_get_contents('php://input');

            //Convertir a array asociativo
            $DatosPost = json_decode($inputJSON, true);

            $errores = [];

            //obtener datos
            $usuario = trim($DatosPost['usuario'] ?? "");
            $contrasena = trim($DatosPost['contrasena'] ?? "");
            $email = filter_var($DatosPost['email'], FILTER_SANITIZE_EMAIL) ?? "";

            //validar datos
            if ($usuario == "") {
                $errores["usuario"] = "Introduzca un nombre de usuario";
            } elseif (!preg_match("/^[a-zA-Z][a-zA-Z0-9_]{7,15}$/", $usuario)) {
                $errores["usuario"] = "Usuario inválido: debe empezar con letra, solo letras, números y _, entre 8 y 16 caracteres";
            }
            //IMPORTANTE, MIRAR LA VAALIDACIÓN DEL FRONTED, FALTA AÑADIR NUMEROS A LA PASS
            if ($contrasena == "") {
                $errores["contrasena"] = "Introduzca una contraseña";
            } elseif (!preg_match("/^(?=.*[A-Z])(?=.*[a-z])(?=.*[@!?%])[A-Za-z@!%?]{6,15}$/", $contrasena)) {
                $errores["contrasena"] = "mínimo 6 caracteres y máximo 15, al menos una mayúscula, al menos una minúscula, al menos un símbolo (@!?%)";
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
            //si no hay errores
            if (empty($errores)) {
                if ($this->usuarioModelo->obtenerUsuario($usuario)) {
                    $errores["usuario"] = "Ya existe un usuario con ese nombre";
                }elseif ($this->usuarioModelo->existeEmail($email)) {
                    $errores["email"] = "Ya existe un usuario con ese email";
                }
            }

            //cabecera json
            header('Content-Type: application/json');
            //si no hay errores
            if (empty($errores)) {
                //hashear contraseña y crear usuario
                $contrasenaHasheada = password_hash($contrasena, PASSWORD_DEFAULT);
                if($this->usuarioModelo->crearUsuario($usuario, $contrasenaHasheada, $email)){
                    echo json_encode([
                        "status" => "ok",
                        "mensaje" => "usuario registrado correctamente"
                    ]);
                }else{
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

?>