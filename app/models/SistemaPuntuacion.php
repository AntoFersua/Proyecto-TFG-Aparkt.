<?php

require_once __DIR__ . "/Conexion.php";
require_once __DIR__ . "/Model.php";

class SistemaPuntuacion extends Model
{
    const PUNTOS_CREAR = 10;
    const PUNTOS_OCUPAR = 5;
    const PUNTOS_LIBERAR = 15;

    public function obtenerPuntuacion($usuarioId)
    {
        $consulta = "SELECT puntuacion FROM Usuario WHERE id = :id";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $usuarioId, PDO::PARAM_INT);
        $stmt->execute();
        $resultado = $stmt->fetch();
        return $resultado['puntuacion'] ?? 0;
    }

    public function sumandoPuntuacion($usuarioId, $puntos, $descripcion)
    {
        $consulta = "UPDATE Usuario SET puntuacion = puntuacion + :puntos WHERE id = :id";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $usuarioId, PDO::PARAM_INT);
        $stmt->bindValue(":puntos", $puntos, PDO::PARAM_INT);
        $stmt->execute();

        $this->registrarAccion($usuarioId, $descripcion, $puntos);

        return $stmt->rowCount();
    }


    //no se valora que se pueda quitar puntos, pero si se hace una acción que lo requiera, se restarán pero no se permitirá que la puntuación sea negativa (función adicional)
    public function restarPuntuacion($usuarioId, $puntos, $descripcion)
    {
        $consulta = "UPDATE Usuario SET puntuacion = GREATEST(0, puntuacion - :puntos) WHERE id = :id";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $usuarioId, PDO::PARAM_INT);
        $stmt->bindValue(":puntos", $puntos, PDO::PARAM_INT);
        $stmt->execute();

        $this->registrarAccion($usuarioId, $descripcion, -$puntos);

        return $stmt->rowCount();
    }

    // Método privado para registrar cada acción en el historial de puntuación (función adicional)

    private function registrarAccion($usuarioId, $descripcion, $puntos)
    {
        $consulta = "INSERT INTO SistemaPuntuacion (usuario_id, cupon_id, descripcion, puntos) 
                    VALUES (:usuario_id, NULL, :descripcion, :puntos)";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":usuario_id", $usuarioId, PDO::PARAM_INT);
        $stmt->bindValue(":descripcion", $descripcion, PDO::PARAM_STR);
        $stmt->bindValue(":puntos", $puntos, PDO::PARAM_INT);
        $stmt->execute();
    }

    // Método para obtener el historial de puntuación de un usuario para estadisticas o visualización (función adicional)
    public function obtenerHistorial($usuarioId)
    {
        $consulta = "SELECT * FROM SistemaPuntuacion WHERE usuario_id = :usuario_id ORDER BY id DESC";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":usuario_id", $usuarioId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}