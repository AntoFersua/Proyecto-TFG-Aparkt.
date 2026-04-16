<?php
//importar los archivos
require __DIR__ . '/../models/Conexion.php';
require __DIR__ . '/../models/Vehiculo.php';
class VehiculoController
{
    private $vehiculoModelo;
    public function __construct($conexion)
    {
        $this->vehiculoModelo = new Vehiculo($conexion);
    }
    public function crear()
    {
        // Obtener el contenido raw del body
        $inputJSON = file_get_contents('php://input');
        // Convertir a array asociativo
        $DatosPost = json_decode($inputJSON, true);
        $errores = [];
        //obtener datos del frontend
        $tipoVehiculo = trim($DatosPost['tipoVehiculo'] ?? '');
        $tamano = trim($DatosPost['tamano'] ?? '');

        //validaciones básicas
        if ($tipoVehiculo == '') {
            $errores['tipoVehiculo'] = "El tipo de vehículo es obligatorio";
        }
        if ($tamano == '') {
            $errores['tamano'] = "El tamaño es obligatorio";
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

        //si todo está bien, crear sesión y guardar vehículo
        session_start();
        $usuarioId = $_SESSION['usuario_id'];
        $id = $this->vehiculoModelo->crearVehiculo($usuarioId, $tipoVehiculo, $tamano);

        //devolver éxito
        echo json_encode([
            "status" => "ok",
            "mensaje" => "Vehículo creado",
            "id" => $id
        ]);
    }
}
//Ejecuta automaticamente el proceso de crear vehículo cuando se accede al archivo VehiculoController
if (basename($_SERVER['SCRIPT_FILENAME']) === 'VehiculoController.php') {
    $conexion = require __DIR__ . '/../models/Conexion.php';
    $controller = new VehiculoController($conexion);
    $controller->crear();
}