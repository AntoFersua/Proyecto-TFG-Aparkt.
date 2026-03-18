<?php

    require __DIR__ . "/Conexion.php";

    class Usuario {
    private $_conexion;

    public function __construct($conexion) {
        $this->_conexion = $conexion; // guardamos la conexión para usarla en los métodos
    }

    public function obtenerPorUsuario($usuario) {
        $consulta = "SELECT * FROM Usuario WHERE usuario = :usuario";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->execute(['usuario' => $usuario]);
        return $stmt->fetch();
    }

    public function verificarContrasena($contrasena, $hash) {
        return password_verify($contrasena, $hash);
    }
}

?>