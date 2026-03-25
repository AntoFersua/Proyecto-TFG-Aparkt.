<?php

require __DIR__ . "/Conexion.php";

class Zona extends Model {
    
    public function crearZona($ubicacion){
        $consulta = "INSERT INTO Zona (ubicacion)
        VALUES (:ubicacion)";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->execute(['ubicacion' => $ubicacion]);
        return $stmt->true;
    }

}


?>