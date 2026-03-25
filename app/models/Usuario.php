<?php
//incluir el archivo conexion
require __DIR__ . "/Conexion.php";

//clase usuario que hereda de model
class Usuario extends Model
{
    //FUNCIONES 
    public function obtenerUsuario($usuario)
    {
        $consulta = "SELECT * FROM Usuario WHERE nombre = :nombre";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":nombre", $usuario, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function existeEmail($email)
    {
        $consulta = "SELECT COUNT(*) FROM Usuario WHERE email = :email";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":email", $email, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch();
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

    public function crearUsuario($usuario, $contrasenaHasheada, $email, $apellidos = null)
    {
        $consulta = "INSERT INTO Usuario (nombre, apellidos, puntuacion, contrasena, email) VALUES (:nombre, :apellidos, :puntuacion, :contrasenaHasheada, :email)";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":nombre", $usuario, PDO::PARAM_STR);
        $stmt->bindValue(":apellidos", $apellidos, PDO::PARAM_STR);
        $stmt->bindValue(":puntuacion", 0, PDO::PARAM_INT);
        $stmt->bindValue(":contrasenaHasheada", $contrasenaHasheada, PDO::PARAM_STR);
        $stmt->bindValue(":email", $email, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}

?>