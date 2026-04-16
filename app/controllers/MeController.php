<?php
/**
 * MeController.php
 * 
 * Este archivo se usa para verificar si el usuario tiene una sesión activa.
 * Devuelve un JSON con la información de la sesión.
 * 
 * El frontend (auth.js) llama a este endpoint para saber si el usuario está logueado.
 */

// Configuración de sesión - permite cookies en mismo sitio (Lax)
ini_set('session.cookie_samesite', 'Lax');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

// Inicia o recupera la sesión actual del usuario
session_start();

// Establece que la respuesta será JSON
header('Content-Type: application/json');

// Comprueba si existe la variable de sesión "usuario"
// Esta variable se crea en LoginController.php cuando el usuario hace login correctamente
$logueado = isset($_SESSION['usuario']) && !empty($_SESSION['usuario']);

// Devuelve JSON con:
// - logueado: boolean indicando si hay sesión activa
// - usuario: el email del usuario si está logueado, null si no
// - session_id: ID de la sesión (debug)
// - session_contents: contenido de la sesión (debug)
// - cookies: cookies actuales (debug)
echo json_encode([
    'logueado' => $logueado,
    'usuario' => $logueado ? $_SESSION['usuario'] : null,
    'session_id' => session_id(),
    'session_contents' => $_SESSION,
    'cookies' => $_COOKIE
]);