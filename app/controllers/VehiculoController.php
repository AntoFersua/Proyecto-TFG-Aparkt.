<?php

require __DIR__ . '/../models/Conexion.php';
require __DIR__ . '/../models/Vehiculo.php';

class VehiculoController
{
    private $vehiculoModelo;

    public function __construct($conexion)
    {
        $this->vehiculoModelo = new Vehiculo($conexion);
    }

    public function obtener()
    {
        session_start();
        header('Content-Type: application/json');

        if (!isset($_SESSION['usuario'])) {
            echo json_encode(["status" => "error", "mensaje" => "No autenticado"]);
            exit();
        }

        $usuarioId = $_SESSION['usuario_id'];
        $vehiculos = $this->vehiculoModelo->obtenerPorUsuario($usuarioId);

        echo json_encode(["status" => "ok", "vehiculos" => $vehiculos]);
    }

    public function crear()
    {
        session_start();
        header('Content-Type: application/json');

        if (!isset($_SESSION['usuario'])) {
            echo json_encode(["status" => "error", "mensaje" => "No autenticado"]);
            exit();
        }

        $inputJSON = file_get_contents('php://input');
        $DatosPost = json_decode($inputJSON, true);

        $errores = [];
        $tipoVehiculo = trim($DatosPost['tipoVehiculo'] ?? '');
        $tamano = trim($DatosPost['tamano'] ?? '');

        if ($tipoVehiculo == '') {
            $errores['tipoVehiculo'] = "El tipo de vehículo es obligatorio";
        }
        if ($tamano == '') {
            $errores['tamano'] = "El tamaño es obligatorio";
        }

        if (!empty($errores)) {
            echo json_encode(["status" => "error", "errores" => $errores]);
            exit();
        }

        $usuarioId = $_SESSION['usuario_id'];
        $id = $this->vehiculoModelo->crearVehiculo($usuarioId, $tipoVehiculo, $tamano);

        echo json_encode(["status" => "ok", "mensaje" => "Vehículo creado", "id" => $id]);
    }

    public function actualizar()
    {
        session_start();
        header('Content-Type: application/json');

        if (!isset($_SESSION['usuario'])) {
            echo json_encode(["status" => "error", "mensaje" => "No autenticado"]);
            exit();
        }

        $inputJSON = file_get_contents('php://input');
        $DatosPost = json_decode($inputJSON, true);

        $errores = [];
        $id = intval($DatosPost['id'] ?? 0);
        $tipoVehiculo = trim($DatosPost['tipoVehiculo'] ?? '');
        $tamano = trim($DatosPost['tamano'] ?? '');

        if ($id <= 0) {
            $errores['id'] = "ID de vehículo inválido";
        }
        if ($tipoVehiculo == '') {
            $errores['tipoVehiculo'] = "El tipo de vehículo es obligatorio";
        }
        if ($tamano == '') {
            $errores['tamano'] = "El tamaño es obligatorio";
        }

        if (!empty($errores)) {
            echo json_encode(["status" => "error", "errores" => $errores]);
            exit();
        }

        $usuarioId = $_SESSION['usuario_id'];
        $this->vehiculoModelo->actualizarVehiculo($id, $usuarioId, $tipoVehiculo, $tamano);

        echo json_encode(["status" => "ok", "mensaje" => "Vehículo actualizado"]);
    }

    public function eliminar()
    {
        session_start();
        header('Content-Type: application/json');

        if (!isset($_SESSION['usuario'])) {
            echo json_encode(["status" => "error", "mensaje" => "No autenticado"]);
            exit();
        }

        $inputJSON = file_get_contents('php://input');
        $DatosPost = json_decode($inputJSON, true);

        $id = intval($DatosPost['id'] ?? 0);

        if ($id <= 0) {
            echo json_encode(["status" => "error", "mensaje" => "ID de vehículo inválido"]);
            exit();
        }

        $usuarioId = $_SESSION['usuario_id'];
        $this->vehiculoModelo->eliminarVehiculo($id, $usuarioId);

        echo json_encode(["status" => "ok", "mensaje" => "Vehículo eliminado"]);
    }
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'VehiculoController.php') {
    $conexion = require __DIR__ . '/../models/Conexion.php';
    $controller = new VehiculoController($conexion);

    $action = $_GET['action'] ?? '';

    switch ($action) {
        case 'obtener':
            $controller->obtener();
            break;
        case 'crear':
            $controller->crear();
            break;
        case 'actualizar':
            $controller->actualizar();
            break;
        case 'eliminar':
            $controller->eliminar();
            break;
        default:
            header('Content-Type: application/json');
            echo json_encode(["status" => "error", "mensaje" => "Acción no válida"]);
    }
}
?>