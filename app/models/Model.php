<?php

require_once __DIR__ . "/Conexion.php";

class Model
{
    protected $_conexion;

    public function __construct($conexion)
    {
        $this->_conexion = $conexion; // guardamos la conexión para usarla en los métodos
    }
}