(function() {
  function esperarYConfigurar(intentos) {
    intentos = intentos || 0;
    if (intentos > 100) return;

    var btn = document.getElementById('modoOscuro');
    if (!btn) {
      setTimeout(function() { esperarYConfigurar(intentos + 1); }, 100);
      return;
    }

    var sol = btn.querySelector('.icon-sol');
    var luna = btn.querySelector('.icon-luna');
    if (!sol || !luna) {
      setTimeout(function() { esperarYConfigurar(intentos + 1); }, 100);
      return;
    }

    function actualizarIcono(escuro) {
      sol.style.display = escuro ? 'none' : 'block';
      luna.style.display = escuro ? 'block' : 'none';
    }

    var esOscuro = document.documentElement.getAttribute('data-theme') === 'dark';
    actualizarIcono(esOscuro);

    btn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      var actual = document.documentElement.getAttribute('data-theme');
      var nuevo = actual === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nuevo);
      document.documentElement.style.colorScheme = nuevo;
      localStorage.setItem('modoOscuro', nuevo === 'dark' ? 'true' : 'false');
      actualizarIcono(nuevo === 'dark');
    };
  }

  esperarYConfigurar(0);
})();
