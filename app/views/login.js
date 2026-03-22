document.addEventListener('DOMContentLoaded', () => {
  const navUl = document.querySelector('.navPrincipal ul');
  const navLinks = document.querySelectorAll('.navPrincipal ul li');

  let spanDelante = document.createElement('span');
  spanDelante.className = 'span-delante';
  navUl.appendChild(spanDelante);

  let spanDetras = document.createElement('span');
  spanDetras.className = 'span-detras';
  navUl.appendChild(spanDetras);

  let circle = document.createElement('div');
  circle.className = 'nav-circulo';
  navUl.appendChild(circle);

  function moverCirculo(li) {
    const liRect = li.getBoundingClientRect();
    const ulRect = navUl.getBoundingClientRect();
    const left = liRect.left - ulRect.left + (liRect.width / 2) - 35;
    circle.style.transform = `translateY(calc(-50% + 17px)) translateX(${left}px) scale(1)`;
    spanDelante.style.transform = `translateY(calc(-50% + 17px)) translateX(${left}px) scale(1)`;
    spanDetras.style.transform = `translateY(calc(-50% + 17px)) translateX(${left}px) scale(1)`;
  }

  function ocultarCirculo() {
    circle.style.transform = 'translateY(-50%) scale(0)';
    spanDelante.style.transform = 'translateY(-50%) scale(0)';
    spanDetras.style.transform = 'translateY(-50%) scale(0)';
  }

  navLinks.forEach((li) => {
    li.addEventListener('mouseenter', () => {
      moverCirculo(li);
    });
  });

  navUl.addEventListener('mouseleave', () => {
    ocultarCirculo();
  });
});
