<?php
    class Configuracion {
        public static function get ($apiKey){
            //leer el archivo .env
            $env = parse_ini_file(__DIR__ . '/../../.env'); 
  
            //devolver valor  
            return $env[$apiKey] ?? null; 
        }
    } 
?>