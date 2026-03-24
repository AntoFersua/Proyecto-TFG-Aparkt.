<?php
    session_start(); //recuperamos sesion
    $_SESSION= []; //borrar todo el contenido de la sesion
    session_destroy();//cierra la sesion, elimina todos los datos de la sesion en el servidor
    header("location: ../login.php");//redirijo al login
    exit();//me salgo por si hay mas codigo abajo no lo ejecute
?>