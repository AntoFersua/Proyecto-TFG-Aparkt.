<?php
//incluir el archivo conexion
require __DIR__ . "/Conexion.php";
require __DIR__ . "/Model.php";

//clase usuario que hereda de model
class Usuario extends Model
{
    //FUNCIONES 
    public function obtenerUsuarioPorNombre($usuario)
    {
        $consulta = "SELECT * FROM Usuario WHERE nombre = :nombre";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":nombre", $usuario, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function obtenerUsuarioPorEmail($email)
    {
        $consulta = "SELECT * FROM Usuario WHERE email = :email";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":email", $email, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function existeEmail($email)
    {
        $consulta = "SELECT COUNT(*) as total FROM Usuario WHERE email = :email";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":email", $email, PDO::PARAM_STR);
        $stmt->execute();
        $resultado = $stmt->fetch();
        return $resultado['total'] > 0;
    }

    public function verificarContrasena($contrasena, $hash)
    {
        return password_verify($contrasena, $hash);
    }

    public function obtenerUsuarioPorId($id)
    {
        $consulta = "SELECT * FROM Usuario WHERE id = :id";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function crearUsuario($nombre, $apellido, $ciudad, $contrasenaHasheada, $email, $telefono)
    {
        $consulta = "INSERT INTO Usuario (nombre, apellido, ciudad, puntuacion, contrasena, email, telefono) VALUES (:nombre, :apellido, :ciudad, :puntuacion, :contrasena, :email, :telefono)";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":nombre", $nombre, PDO::PARAM_STR);
        $stmt->bindValue(":apellido", $apellido, PDO::PARAM_STR);
        $stmt->bindValue(":ciudad", $ciudad, PDO::PARAM_STR);
        $stmt->bindValue(":telefono", $telefono, PDO::PARAM_STR);
        $stmt->bindValue(":puntuacion", 0, PDO::PARAM_INT);
        $stmt->bindValue(":contrasena", $contrasenaHasheada, PDO::PARAM_STR);
        $stmt->bindValue(":email", $email, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function verificarTelefono($telefono)
    {
        // Si la columna telefono no existe, retornar 0
        return 0;

        $consulta = "SELECT COUNT(*) FROM Usuario WHERE telefono = :telefono";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":telefono", $telefono, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchColumn();
    }


    
}
