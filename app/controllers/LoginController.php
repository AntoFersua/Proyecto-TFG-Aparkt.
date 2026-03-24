<?php
    //importar los archivos
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

            //obtener datos del frontend
            $usuario = trim($DatosPost['usuario'] ?? '');
            $contrasena = trim($DatosPost['contrasena'] ?? '');

            //valdiaciones
            if ($usuario == '') {
                $errores['usuario'] = "Introduce un usuario";
            }
            if ($contrasena == '') {
                $errores['contrasena'] = "Introduce un contraseña";
            }

            //si no hay errores 
            if (empty($errores)) {
                //buscar usuario en BBDD
                $user_info = $this->usuarioModelo->obtenerUsuario($usuario);
                //si no existe
                if (!$user_info) {
                    $errores['usuario'] = "Usuario no existe";
                } else {
                    //en caso de que existe, verificar password 
                    $contrasenaInfo = $this->usuarioModelo->verificarContrasena($contrasena, $user_info['contrasena']);
                    if (!$contrasenaInfo) {
                        $errores['contrasena'] = "contraseña incorrecta";
                    }
                }

                //si usuario existe y contraseña es correcta 
                if ($user_info && $contrasenaInfo) {
                    //inica sesión 
                    session_start();
                    $_SESSION["usuario"] = $usuario;

                    //indicar cabecera json y devolver respuesta al frontend
                    header('Content-Type: application/json');
                    echo json_encode([
                        "status" => "ok",
                        "mensaje" => "Usuario inicio sesión correctamente"
                    ]);
                    exit();

                } else {
                    //devolver error 
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