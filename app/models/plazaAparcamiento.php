<?php

require_once __DIR__ . "/Conexion.php";
require_once __DIR__ . "/Model.php";

class PlazaAparcamiento extends Model
{
    public function crearPlaza($ubicacion, $tipo, $tamano, $zonaId, $usuarioId = null)
    {
        $consulta = "INSERT INTO plazaaparcamiento (ubicacion, tipo, tamano, zona_id, usuario_id) 
                VALUES (ST_GeomFromText(:ubicacion), :tipo, :tamano, :zona_id, :usuario_id)";

        $stmt = $this->_conexion->prepare($consulta);

        $stmt->bindValue(":ubicacion", $ubicacion, PDO::PARAM_STR);
        $stmt->bindValue(":tipo", $tipo, PDO::PARAM_STR);
        $stmt->bindValue(":tamano", $tamano, PDO::PARAM_STR);
        $stmt->bindValue(":zona_id", $zonaId, PDO::PARAM_INT);

        if ($usuarioId === null) {
            $stmt->bindValue(":usuario_id", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(":usuario_id", $usuarioId, PDO::PARAM_INT);
        }

        $stmt->execute();
        return $this->_conexion->lastInsertId();
    }

    public function obtenerTodas()
    {
        $consulta = "SELECT p.*, ST_X(p.ubicacion) as latitud, ST_Y(p.ubicacion) as longitud,
                    z.id as zona_id
                    FROM plazaaparcamiento p
                    LEFT JOIN zona z ON p.zona_id = z.id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPorId($id)
    {
        $consulta = "SELECT p.*, ST_X(p.ubicacion) as latitud, ST_Y(p.ubicacion) as longitud
                    FROM plazaaparcamiento p
                    WHERE p.id = :id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function obtenerPorZona($zonaId)
    {
        $consulta = "SELECT p.*, ST_X(p.ubicacion) as latitud, ST_Y(p.ubicacion) as longitud
                    FROM plazaaparcamiento p
                    WHERE p.zona_id = :zona_id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":zona_id", $zonaId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerDisponibles()
    {
        $consulta = "SELECT p.*, ST_X(p.ubicacion) as latitud, ST_Y(p.ubicacion) as longitud
                    FROM plazaaparcamiento p
                    WHERE p.ocupado = 0";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPorUsuario($usuarioId)
    {
        $consulta = "SELECT p.*, ST_X(p.ubicacion) as latitud, ST_Y(p.ubicacion) as longitud
                    FROM plazaaparcamiento p
                    WHERE p.usuario_id = :usuario_id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":usuario_id", $usuarioId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function actualizarPlaza($id, $tipo, $tamano, $zonaId)
    {
        $consulta = "UPDATE plazaaparcamiento 
                SET tipo = :tipo, tamano = :tamano, zona_id = :zona_id
                WHERE id = :id";

        $stmt = $this->_conexion->prepare($consulta);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->bindValue(":tipo", $tipo, PDO::PARAM_STR);
        $stmt->bindValue(":tamano", $tamano, PDO::PARAM_STR);
        $stmt->bindValue(":zona_id", $zonaId, PDO::PARAM_INT);

        $stmt->execute();

        return $stmt->rowCount();
    }

    public function ocuparPlaza($id, $usuarioId)
    {
        $consulta = "UPDATE plazaaparcamiento 
                SET ocupado = 1, usuario_id = :usuario_id, hora_reporte = NOW()
                WHERE id = :id";

        $stmt = $this->_conexion->prepare($consulta);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->bindValue(":usuario_id", $usuarioId, PDO::PARAM_INT);

        $stmt->execute();

        return $stmt->rowCount();
    }

    public function liberarPlaza($id)
    {
        $consulta = "UPDATE plazaaparcamiento 
                SET ocupado = 0, usuario_id = NULL, hora_reporte = NOW()
                WHERE id = :id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->rowCount();
    }

    public function eliminarPlaza($id)
    {
        $consulta = "DELETE FROM plazaaparcamiento WHERE id = :id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->rowCount();
    }
}
