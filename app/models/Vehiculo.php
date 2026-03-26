<?php

require __DIR__ . "/Conexion.php";
require __DIR__ . "/Model.php";

class Vehiculo extends Model
{
    // private $tipos_vehiculos = ["berlina", "turismo", "furgoneta", "moto"];
    // private $tamanos = ["grande", "mediano", "pequeño"];

    public function crearVehiculo($usuarioId, $tipoVehiculo, $tamano, $plazaId = null)
    {
        $consulta = "INSERT INTO Vehiculo (usuario_id, tipo_vehiculo, tamano, plaza_aparcamiento_id) VALUES (:usuario_id, :tipo_vehiculo, :tamano, :plaza_id)";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":usuario_id", $usuarioId, PDO::PARAM_INT);
        $stmt->bindValue(":tipo_vehiculo", $tipoVehiculo, PDO::PARAM_STR);
        $stmt->bindValue(":tamano", $tamano, PDO::PARAM_STR);
        $stmt->bindValue(":plaza_id", $plazaId, $plazaId ? PDO::PARAM_INT : PDO::PARAM_NULL);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function obtenerVehiculosPorUsuario($usuarioId)
    {
        $consulta = "SELECT v.*, pa.ubicacion as plaza_ubicacion FROM Vehiculo v LEFT JOIN PlazaAparcamiento pa ON v.plaza_aparcamiento_id = pa.id WHERE v.usuario_id = :usuario_id";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":usuario_id", $usuarioId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}

