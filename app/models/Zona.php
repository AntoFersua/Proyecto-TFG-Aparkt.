<?php

require_once __DIR__ . "/Conexion.php";
require_once __DIR__ . "/Model.php";

class Zona extends Model
{
    public function crearZona($ubicacion)
    {
        $consulta = "INSERT INTO Zona (ubicacion)
        VALUES (:ubicacion)";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->execute(['ubicacion' => $ubicacion]);
        return $stmt->rowCount() > 0;
    }

    public function obtenerZonas()
    {
        $consulta = "SELECT * FROM Zona ORDER BY ubicacion";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function eliminarZona($id)
    {
        $consulta = "DELETE FROM Zona WHERE id = :id";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}


?>