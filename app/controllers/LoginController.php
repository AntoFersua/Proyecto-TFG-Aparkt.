<?php
//importar los archivos
require __DIR__ . '/../models/Conexion.php';
require __DIR__ . '/../models/Usuario.php';
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

        //validaciones básicas
        if ($usuario == '') {
            $errores['usuario'] = "Introduce un usuario o email";
        }
        if ($contrasena == '') {
            $errores['contrasena'] = "Introduce una contraseña";
        }

        //indicar cabecera json y devolver respuesta al frontend
        header('Content-Type: application/json');

        //si hay errores de validación básica, devolverlos
        if (!empty($errores)) {
            echo json_encode([
                "status" => "error",
                "errores" => $errores
            ]);
            exit();
        }

        // Validar que sea email
        if (strpos($usuario, '@') === false) {
            $errores['usuario'] = "Introduce un email válido";
        }

        // Buscar por email
        $user_info = $this->usuarioModelo->obtenerUsuarioPorEmail($usuario);
        if (!$user_info) {
            $errores['usuario'] = "No existe cuenta con este email";
        }

        //si hay errores de base de datos, devolverlos
        if (!empty($errores)) {
            echo json_encode([
                "status" => "error",
                "errores" => $errores
            ]);
            exit();
        }

        //verificar contraseña
        $contrasenaInfo = $this->usuarioModelo->verificarContrasena($contrasena, $user_info['contrasena']);
        if (!$contrasenaInfo) {
            $errores['contrasena'] = "Contraseña incorrecta";
        }

        //si hay errores de contraseña, devolverlos
        if (!empty($errores)) {
            echo json_encode([
                "status" => "error",
                "errores" => $errores
            ]);
            exit();
        }

        //si todo está bien, crear sesión
        session_start();
        $_SESSION["usuario"] = $usuario;
        //devolver éxito
        echo json_encode([
            "status" => "ok",
            "mensaje" => "Usuario inició sesión correctamente"
        ]);
    }
}
//Ejecuta automaticamente el proceso de login cuando se accede al archivo LoginController
if (basename($_SERVER['SCRIPT_FILENAME']) === 'LoginController.php') {
    $conexion = require __DIR__ . '/../models/Conexion.php';
    $controller = new LoginController($conexion);
    $controller->login();
}
