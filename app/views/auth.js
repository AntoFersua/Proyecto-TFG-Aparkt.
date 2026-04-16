/**
 * auth.js - Módulo de gestión de sesión (Frontend)
 * 
 * Este archivo centraliza toda la lógica de autenticación del frontend.
 * Permite verificar si el usuario está logueado, obtener sus datos,
 * y controlar la visibilidad de elementos según el estado de sesión.
 * 
 * Se usa en todas las páginas que necesitan verificar la sesión del usuario.
 */

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Obtiene la ruta base según la URL actual del navegador.
 * Necesario porque el proyecto puede estar en /PRUEBAS/ o en la raíz.
 * 
 * @returns {string} '/' o '/PRUEBAS'
 */
function obtenerRutaBase() {
  const ruta = window.location.pathname;
  // Si la URL contiene /PRUEBAS/, devolvemos /PRUEBAS
  if (ruta.includes('/Proyecto-TFG-Aparkt/')) return '/Proyecto-TFG-Aparkt';
  // Si contiene /app/, estamos en la raíz
  if (ruta.includes('/app/')) return '';
  // Por defecto vacío
  return '';
}

// ============================================================================
// CONSTANTES Y VARIABLES
// ============================================================================

// Endpoint que verifica la sesión (PHP que devuelve si hay usuario logueado)
const ENDPOINT_SESION = obtenerRutaBase() + '/app/controllers/MeController.php';

// Variable para almacenar en memoria el usuario actual (cache)
let usuarioCache = null;

// Variable para almacenar la sesión actual (cache)
let sesionActual = null;

// ============================================================================
// FUNCIÓN PRINCIPAL: Obtener sesión
// ============================================================================

/**
 * Hace fetch al endpoint de sesión para verificar si el usuario está logueado.
 * 
 * @returns {Promise<{logueado: boolean, usuario: object|null}>} Objeto con estado de sesión
 * 
 * Ejemplo de respuesta:
 * { logueado: true, usuario: { email: 'usuario@email.com' } }
 * { logueado: false, usuario: null }
 */
export async function obtenerSesion() {
  try {
    console.log('Fetching session from:', ENDPOINT_SESION);
    
    // Fetch al endpoint con credentials: 'include' para enviar cookies de sesión
    const respuesta = await fetch(ENDPOINT_SESION, {
      credentials: 'include'
    });

    // Si el servidor devuelve error (404, 500, etc.), lanzar excepción
    if (!respuesta.ok) {
      throw new Error(`HTTP error! status: ${respuesta.status}`);
    }

    // Convertir respuesta a JSON
    const datos = await respuesta.json();
    console.log('Session response:', datos);

    // Guardar en cache el usuario si está logueado
    usuarioCache = datos.logueado ? datos.usuario : null;
    sesionActual = datos;

    // Devolver solo logueado y usuario
    return {
      logueado: datos.logueado,
      usuario: datos.usuario
    };
  } catch (error) {
    // Si hay error de red o del servidor
    console.error('Error fetching session:', error);
    usuarioCache = null;
    sesionActual = { logueado: false };
    // Devolver usuario no logueado por seguridad
    return { logueado: false };
  }
}

// ============================================================================
// FUNCIÓN: Requiere autenticación (redirige si no está logueado)
// ============================================================================

/**
 * Verifica la sesión y si no está logueado, redirige a la página de login.
 * Útil para páginas que requieren obligatoriamente estar logueado.
 * 
 * @param {string} urlRedireccion - URL a la que redirigir si no está logueado
 * @returns {Promise<object|null>} El usuario si está logueado, null si no
 */
export async function requerirAuth(urlRedireccion = '/app/views/login/login.html') {
  const sesion = await obtenerSesion();

  // Si no está logueado, redirigir al login
  if (!sesion.logueado) {
    const rutaBase = obtenerRutaBase();
    window.location.href = rutaBase + urlRedireccion;
    return null;
  }

  // Si está logueado, devolver los datos del usuario
  return sesion.usuario;
}

// ============================================================================
// FUNCIÓN: Obtener usuario actual (desde cache)
// ============================================================================

/**
 * Devuelve el usuario cacheado (sin hacer fetch).
 * Útil para obtener el usuario rápidamente sin esperar una petición.
 * 
 * @returns {object|null} El usuario o null si no está logueado
 */
export function obtenerUsuario() {
  return usuarioCache;
}

// ============================================================================
// FUNCIÓN: ¿Está logueado?
// ============================================================================

/**
 * Simple check de si el usuario está logueado (boolean).
 * 
 * @returns {boolean} true si está logueado, false si no
 */
export function estaLogueado() {
  return usuarioCache !== null;
}

// ============================================================================
// FUNCIÓN: Ocultar elemento si no está logueado
// ============================================================================

/**
 * Añade la clase 'hidden' al elemento si el usuario NO está logueado.
 * Sirve para mostrar elementos solo a usuarios NO logueados (ej: botón Login).
 * 
 * @param {HTMLElement} elemento - Elemento HTML a procesar
 */
export function ocultarSiNoLogueado(elemento) {
  if (!usuarioCache) {
    elemento.classList.add('hidden');
  }
}

// ============================================================================
// FUNCIÓN: Mostrar elemento si está logueado
// ============================================================================

/**
 * Añade o quita la clase 'hidden' según si el usuario está logueado.
 * Sirve para mostrar elementos solo a usuarios logueados (ej: perfil).
 * 
 * @param {HTMLElement} elemento - Elemento HTML a procesar
 */
export function mostrarSiLogueado(elemento) {
  if (usuarioCache) {
    elemento.classList.remove('hidden');
  } else {
    elemento.classList.add('hidden');
  }
}

// ============================================================================
// FUNCIÓN: Inicializar UI según autenticación
// ============================================================================

/**
 * Busca todos los elementos con atributo data-auth y los muestra/oculta
 * según el estado de sesión.
 * 
 * Uso en HTML: <button data-auth="hide">Login</button>
 *              <button data-auth="show">Perfil</button>
 */
export function inicializarUIAuth() {
  // Buscar todos los elementos con data-auth="show" o data-auth="hide"
  const elementosAuth = document.querySelectorAll('[data-auth]');

  elementosAuth.forEach(el => {
    const accion = el.dataset.auth;
    
    if (accion === 'show') {
      // Mostrar solo si está logueado
      mostrarSiLogueado(el);
    } else if (accion === 'hide') {
      // Ocultar si está logueado (mostrar si no lo está)
      ocultarSiNoLogueado(el);
    }
  });
}

// ============================================================================
// FUNCIÓN PRINCIPAL: Inicializar autenticación en una página
// ============================================================================

/**
 * Función principal que inicializa toda la lógica de sesión.
 * Llama a obtenerSesion, actualiza la UI, y ejecuta callbacks según corresponda.
 * 
 * @param {Object} opciones - Opciones de configuración
 * @param {Function} opciones.alLoguearse - Callback cuando el usuario está logueado
 * @param {Function} opciones.alNoLoguearse - Callback cuando el usuario NO está logueado
 * @param {boolean} opciones.requerirAuth - Si true, redirige al login si no está logueado
 * @param {string} opciones.urlRedireccion - URL de redirección si requerirAuth es true
 * 
 * @example
 * await iniciarAuth({
 *   alLoguearse: (usuario) => console.log('Hola', usuario.email),
 *   alNoLoguearse: () => console.log('Necesitas login')
 * });
 */
export async function iniciarAuth(opciones = {}) {
  // Desestructurar opciones con valores por defecto
  const {
    alLoguearse = null,      // Función a ejecutar si está logueado
    alNoLoguearse = null,    // Función a ejecutar si NO está logueado
    requerirAuth = false,   // Por defecto no requiere autenticación obligatoria
    urlRedireccion = '/app/views/login/login.html' // URL de login por defecto
  } = opciones;

  // Obtener sesión del servidor
  const sesion = await obtenerSesion();

  // Si está logueado
  if (sesion.logueado) {
    // Guardar usuario en cache
    usuarioCache = sesion.usuario;
    
    // Actualizar UI (elementos con data-auth)
    inicializarUIAuth();
    
    // Ejecutar callback si existe
    if (alLoguearse) {
      alLoguearse(usuarioCache);
    }
  } 
  // Si NO está logueado
  else {
    // Si requerirAuth es true, redirigir al login
    if (requerirAuth) {
      const rutaBase = obtenerRutaBase();
      window.location.href = rutaBase + urlRedireccion;
      return;
    }
    
    // Ejecutar callback si existe
    if (alNoLoguearse) {
      alNoLoguearse();
    }
  }
}

// ============================================================================
// FUNCIÓN: Cerrar sesión
// ============================================================================

/**
 * Redirige al archivo PHP que destruye la sesión y cierra sesión.
 * 
 * @param {string} urlRedireccion - URL a la que ir después de cerrar sesión
 */
export function cerrarSesion(urlRedireccion = '/app/views/login/login.html') {
  const rutaBase = obtenerRutaBase();
  // Redirigir al Logout.php que destruye la sesión
  window.location.href = rutaBase + '/app/controllers/Logout.php';
}