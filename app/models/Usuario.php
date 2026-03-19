<?php

    require __DIR__ . "/Conexion.php";

    class Usuario {
    private $_conexion;

    public function __construct($conexion) {
        $this->_conexion = $conexion; // guardamos la conexión para usarla en los métodos
    }


    public function obtenerUsuario($usuario){
        $consulta = "SELECT * FROM Usuario WHERE nombre = :nombre";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->execute(['nombre' => $usuario]);
        return $stmt->fetch();
    }

    public function existeEmail($email){
        $consulta = "SELECT COUNT(*) FROM Usuario WHERE email = :email";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->execute(['email' => $email]);
        return $stmt->fetch();
    }

    public function verificarContrasena($contrasena, $hash) {
        return password_verify($contrasena, $hash);
    }

    public function crearUsuario($usuario, $contrasenaHasheada, $email){
        $consulta = "INSERT INTO Usuario (Nombre, puntuacion, contrasena, email) VALUES (:nombre, :puntuacion, :contrasenaHasheada, :email)";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->execute([
            'nombre' => $usuario,
            'puntuacion' => 0,
            'contrasenaHasheada' => $contrasenaHasheada,
            'email' => $email,
        ]);
        return $stmt->true;
    }
}

?>