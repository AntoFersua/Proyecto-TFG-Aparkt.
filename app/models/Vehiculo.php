<?php

require __DIR__ . "/Conexion.php";

class Vehiculo extends Model
{
    // private $tipos_vehiculos = ["berlina", "turismo", "furgoneta", "moto"];
    // private $tamanos = ["grande", "mediano", "pequeño"];

    public function crearVehiculo($usuario, $tipo_vehiculo, $tamano, $id_plaza_aparcamiento)
    {

        $consulta = "SELECT id FROM Usuario WHERE nombre= :nombre";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->execute(['nombre' => $usuario]);
        $fila = $stmt->fetch();
        if (!$fila) {
            throw new Exception("No existe id para ese usuario");
        } else {
            $id_usuario=$fila['id'];
            $consulta1 = "INSERT INTO Vehiculo (tipo_vehiculo, id_usuario, id_plaza_aparcamiento, tamano)
            VALUES(:tipo_vehiculo, :id_usuario, :id_plaza_aparcamiento, :tamano)"; 
            $stmt = $this->_conexion->prepare($consulta1);
            $stmt->execute([
                'nombre' => $usuario,
                'tipo_vehiculo' => $tipo_vehiculo,
                'id_usuario' => $id_usuario,
                'id_plaza_aparcamiento' => $id_plaza_aparcamiento,
                'tamano' => $tamano
            ]);
            return $stmt->true;
        }

    }

}

