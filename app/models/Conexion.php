<?php

    $_servidor="localhost";
    $_usuario="root";
    $_contrasena="";
    $_bd="aparkt";

    try {
        $_conexion = new PDO(
            "mysql:host=$_servidor;dbname=$_bd;charset=utf8mb4",
            $_usuario,
            $_contrasena
        );

        //Configurar el lanzamiento de excepciones
        $_conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        //Configurar por defecto FETCH_ASSOC
        $_conexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        //Comprobar que funciona
        //echo "Todo funciona correctamente. Estás conectado! <br>";

    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(["status" => "error", "mensaje" => "Error de conexión: " . $e->getMessage()]);
        exit();
    }

    return $_conexion;
?>
