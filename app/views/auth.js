const SESSION_ENDPOINT = '/controllers/LoginController.php';

let cachedUser = null;

export async function getSession() {
  try {
    const response = await fetch(SESSION_ENDPOINT, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    cachedUser = data.logged ? data.user : null;
    return data;
  } catch (error) {
    console.error('Error fetching session:', error);
    cachedUser = null;
    return { logged: false };
  }
}

export async function requireAuth() {
  const session = await getSession();

  if (!session.logged) {
    const basePath = window.location.pathname.includes('/PRUEBAS/') ? '/PRUEBAS' : '';
    window.location.href = basePath + '/app/views/login/login.html';
    return null;
  }

  return session.user;
}

export function getUser() {
  return cachedUser;
}

export function isLoggedIn() {
  return cachedUser !== null;
}

export function hideIfLoggedOut(element) {
  if (!cachedUser) {
    element.classList.add('hidden');
  }
}

export function showIfLoggedIn(element) {
  if (cachedUser) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}

export function toggleByAuth(element, showIfLoggedIn = true) {
  if (showIfLoggedIn) {
    showIfLoggedIn(element);
  } else {
    hideIfLoggedOut(element);
  }
}

export function initAuthUI() {
  const authElements = document.querySelectorAll('[data-auth]');

  authElements.forEach(el => {
    const action = el.dataset.auth;
    if (action === 'show') {
      showIfLoggedIn(el);
    } else if (action === 'hide') {
      hideIfLoggedOut(el);
    }
  });
}