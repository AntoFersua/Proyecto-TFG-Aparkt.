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

        public function crearUsuario($usuario, $contrasenaHasheada, $email)
        {
            $consulta = "INSERT INTO Usuario (Nombre, puntuacion, contrasena, email) VALUES (:nombre, :puntuacion, :contrasenaHasheada, :email)";
            $stmt = $this->_conexion->prepare($consulta);
            $stmt->bindValue(":nombre", $usuario, PDO::PARAM_STR);
            $stmt->bindValue(":puntuacion", 0, PDO::PARAM_INT);
            $stmt->bindValue(":contrasenaHasheada", $contrasenaHasheada, PDO::PARAM_STR);
            $stmt->bindValue(":email", $email, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->rowCount() > 0;
        }
    }

?>