(() => {
  const carrusel = $(".owl-carousel");
  const pasos = document.querySelectorAll(".indicador-paso .paso");
  const btnCrear = document.getElementById("btnCrear");
  const navCarrusel = document.querySelector(".nav-carrusel");

  const totalPasos = 3;

  carrusel.owlCarousel({
    items: 1,
    navText: ["Atrás", "Siguiente"],
    navContainer: ".nav-carrusel",
    dots: false,
    smartSpeed: 300,
    loop: false,
    mouseDrag: false,
    touchDrag: false,
  });

  function actualizarUI(index) {
    pasos.forEach((p, i) => {
      p.classList.toggle("activo", i <= index);
    });

    const btnAtras = navCarrusel.querySelector(".owl-prev");
    const btnSiguiente = navCarrusel.querySelector(".owl-next");

    btnAtras.style.display = index > 0 ? "block" : "none";

    if (index === totalPasos - 1) {
      btnSiguiente.style.display = "none";
      btnCrear.style.display = "block";
    } else {
      btnSiguiente.style.display = "block";
      btnCrear.style.display = "none";
    }
  }

  carrusel.on("changed.owl.carousel", function (e) {
    actualizarUI(e.item.index);
  });

  actualizarUI(0);
})();
