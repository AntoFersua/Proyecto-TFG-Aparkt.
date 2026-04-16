import { iniciarAuth, obtenerUsuario, cerrarSesion } from './auth.js';

let usuarioActual = null;

window.addEventListener("DOMContentLoaded", async function () {
  // Verificar sesión
  await iniciarAuth({
    alLoguearse: (usuario) => {
      usuarioActual = usuario;
      configurarUIUsuarioLogueado(usuario);
    },
    alNoLoguearse: () => {
      configurarUIUsuarioNoLogueado();
    }
  });

  // Cargar mapa
  fetch("../config/config.php")
    .then(function (response) {
      //Mostrar mensaje y convertir la respuesta en JSON
      console.log("Status:", response.status);
      return response.json();
    })
    .then(function (data) {
      //Token
      mapboxgl.accessToken = data.MAPS_API_KEY;

      //Mapa
      const mapa = new mapboxgl.Map({
        //id del div donde se carga el mapa
        container: "mapa",
        style: "mapbox://styles/mapbox/standard",
        //Globo terráqueo
        projection: "globe",
        zoom: 15,
        //Coordenadas Teatinos
        center: [-4.475468174458712, 36.72410119432091]
      });

      //Cuando el estilo del mapa se carga, se establece la niebla por defecto
      mapa.on("style.load", function () {
        mapa.setFog({});
      });

      //Cuando el mapa termina de cargar, se añade el control de navegación del zoom y rotación, y el estado de aparcamiento
      mapa.on("load", function () {
        mapa.addControl(new mapboxgl.NavigationControl());

        //Indicar estado de aparcamiento
        function estadoAparcamiento(
          longitudX,
          latitudY,
          radioCirculo,
          idSource,
          idCapa,
          colorRelleno,
          colorBorde,
        ) {
          //Coordenada de la señal
          const centro = [longitudX, latitudY];
          //Radio del circulo en metros
          const radio = radioCirculo;
          const opciones = {
            //Numero de pts del circulo
            steps: 64,
            units: "meters",
            properties: {},
          };
          //crear el circulo
          const circulo = turf.circle(centro, radio, opciones);
          //Añadir datos geograficos al mapa en forma de geojson
          mapa.addSource(idSource, {
            type: "geojson",
            data: circulo,
          });
          //Añadir capa visual al mapa
          mapa.addLayer({
            //identificador de la capa
            id: idCapa,
            //de tipo poligono con relleno
            type: "fill",
            //enlazar con la fuente zona
            source: idSource,
            paint: {
              "fill-color": colorRelleno,
              "fill-outline-color": colorBorde,
            },
          });
          return {
            sourceID: idSource,
            layerID: idCapa,
          };
        }

        const zona1 = estadoAparcamiento(
          -4.476059,
          36.718963,
          100,
          "zona",
          "zona-parking-fill",
          "rgba(255, 0, 0, 0.3)",
          "red",
        );

        //eliminar layer y luego source
        //mapa.removeLayer(zona1.layerID);
        //mapa.removeSource(zona1.sourceID);

        const zona2 = estadoAparcamiento(
          -4.476059,
          36.72896,
          500,
          "zona2",
          "zona-fill",
          "rgba(255, 0, 0, 0.3)",
          "red",
        );

        const aparcamiento1 = estadoAparcamiento(-4.478995, 36.719671, 3, "aparcamiento1", "aparcamiento1-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento2 = estadoAparcamiento(-4.478964, 36.719724, 3, "aparcamiento2", "aparcamiento2-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento3 = estadoAparcamiento(-4.478932, 36.719775, 3, "aparcamiento3", "aparcamiento3-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento4 = estadoAparcamiento(-4.478893, 36.719831, 3, "aparcamiento4", "aparcamiento4-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento5 = estadoAparcamiento(-4.478849, 36.719893, 3, "aparcamiento5", "aparcamiento5-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento6 = estadoAparcamiento(-4.478809, 36.719951, 3, "aparcamiento6", "aparcamiento6-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento7 = estadoAparcamiento(-4.478773, 36.720014, 3, "aparcamiento7", "aparcamiento7-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento8 = estadoAparcamiento(-4.478735, 36.720075, 3, "aparcamiento8", "aparcamiento8-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento9 = estadoAparcamiento(-4.478698, 36.720135, 3, "aparcamiento9", "aparcamiento9-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento10 = estadoAparcamiento(-4.478652, 36.720199, 3, "aparcamiento10", "aparcamiento10-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento11 = estadoAparcamiento(-4.478620, 36.720259, 3, "aparcamiento11", "aparcamiento11-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento12 = estadoAparcamiento(-4.478586, 36.720321, 3, "aparcamiento12", "aparcamiento12-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento13 = estadoAparcamiento(-4.478549, 36.720377, 3, "aparcamiento13", "aparcamiento13-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento14 = estadoAparcamiento(-4.478893, 36.719831, 3, "aparcamiento14", "aparcamiento14-fill", "rgba(255, 0, 0, 0.3)", "red");

        const aparcamiento15 = estadoAparcamiento(-4.478381, 36.720620, 3, "aparcamiento15", "aparcamiento15-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento16 = estadoAparcamiento(-4.478348, 36.720672, 3, "aparcamiento16", "aparcamiento16-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento17 = estadoAparcamiento(-4.478305, 36.720726, 3, "aparcamiento17", "aparcamiento17-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento18 = estadoAparcamiento(-4.478275, 36.720781, 3, "aparcamiento18", "aparcamiento18-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento19 = estadoAparcamiento(-4.478243, 36.720835, 3, "aparcamiento19", "aparcamiento19-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento20 = estadoAparcamiento(-4.478201, 36.720897, 3, "aparcamiento20", "aparcamiento20-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento21 = estadoAparcamiento(-4.478166, 36.720953, 3, "aparcamiento21", "aparcamiento21-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento22 = estadoAparcamiento(-4.478113, 36.7201023, 3, "aparcamiento22", "aparcamiento22-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento23 = estadoAparcamiento(-4.478120, 36.721014, 3, "aparcamiento23", "aparcamiento23-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento24 = estadoAparcamiento(-4.478085, 36.721070, 3, "aparcamiento24", "aparcamiento24-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento25 = estadoAparcamiento(-4.478042, 36.721132, 3, "aparcamiento25", "aparcamiento25-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento26 = estadoAparcamiento(-4.478005, 36.721189, 3, "aparcamiento26", "aparcamiento26-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento27 = estadoAparcamiento(-4.477965, 36.721239, 3, "aparcamiento27", "aparcamiento27-fill", "rgba(0, 255, 0, 0.3)", "green");
      });

      //Obtener las coordenadas y la dirección de una ubi específica
      function obtenerDireccionDeCoordenadas(e) {
        //Obtener latitud y longitud, se accede mediante las propiedades del objeto. e.lngLat da latitud y longitud juntas
        const longitud = e.lngLat.lng;
        const latitud = e.lngLat.lat;

        //Obtener la dirección a partir de las coordenadas mediante la API de geocoding inverso de Mapbox
        fetch(
          "https://api.mapbox.com/search/geocode/v6/reverse?longitude=" +
            longitud +
            "&latitude=" +
            latitud +
            "&access_token=" +
            mapboxgl.accessToken,
        )
          .then(function (response) {
            //Convertir la respuesta en JSON
            return response.json();
          })
          //Procesar datos obtenidos
          .then(function (datos) {
            /*Se obtiene el nombre del lugar completo con calle, provincia y país o solo el nombre de la calle o un nombre de la calle o un mensaje por defecto.
                        Se accede al elemento 0 del array features de datos, si existe se accede a properties, si existe se accede a full_address en caso de que no se sigue con name...
                        console.log(datos);*/
            const address =
              datos.features[0]?.properties?.full_address ||
              datos.features[0]?.properties?.name ||
              "Dirección no encontrada";
            alert(
              "Coordenadas: " +
                longitud.toFixed(6) +
                ", " +
                latitud.toFixed(6) +
                "\nDirección: " +
                address,
            );
          })
          //En caso de error
          .catch(function (error) {
            alert(
              "Coordenadas: " +
                longitud.toFixed(6) +
                ", " +
                latitud.toFixed(6) +
                "\nError al obtener dirección",
            );
          });
      }
      mapa.on("click", obtenerDireccionDeCoordenadas);

      //Redirigir el mapa a la nueva ubicación
      function buscarLugar(inputBusqueda) {
        //Obtener el texto de la barra de navegación de búsqueda
        const searchText = inputBusqueda.value;
        //Llamada a la API de geocoding directo de Mapbox, uso de encodeURIComponent para evitar carácteres raros en URL
        fetch(
          "https://api.mapbox.com/search/geocode/v6/forward?q=" +
            encodeURIComponent(searchText) +
            "&access_token=" +
            mapboxgl.accessToken,
        )
          .then(function (response) {
            //Convertir la respuesta en JSON
            return response.json();
          })
          //Procesar datos obtenidos
          .then(function (datos) {
            const feature = datos.features[0];
            //si feature tiene datos
            if (feature) {
              //Obtener coordenadas de longitud y latitud
              const longitudNuevaBusqueda = feature.geometry.coordinates[0];
              const latitudNuevaBusqueda = feature.geometry.coordinates[1];

              //Mover la ubicación del mapa con la función flyto
              mapa.flyTo({
                center: [longitudNuevaBusqueda, latitudNuevaBusqueda],
                essential: true, //Asegura que la animación se realice
              });
            } else {
              alert("No se encontraron resultados para: " + searchText);
            }
          })
          //En caso de error
          .catch(function (error) {
            alert("Error al obtener coordenadas para: " + searchText);
          });
      }

      //Obtener el formulario de realizar una búsqueda
      let formulario = document.querySelector("form");
      //Aplicar listener en caso de que sea enviado
      formulario.addEventListener("submit", enviarFormulario);
      //Evento es un objeto
      function enviarFormulario(evento) {
        //Obtener el input
        let input = document.querySelector("#busqueda");
        //Si no está vacio se llama a la función
        if (input.value.length != 0) {
          buscarLugar(input);
        }
        //Parar para no recargar la página
        evento.preventDefault();
      }
      //formulario.removeEventListener("click", enviarFormulario);

      //Crear popup con titulo y texto
      function crearPopupTituloParrafo(titulo, parrafo) {
        const popupTituloParrafo = new mapboxgl.Popup().setHTML(
          "<h3>" + titulo + "</h3><p>" + parrafo + "</p>",
        );

        return popupTituloParrafo;
      }

      const popupAnuncianteCasaLola = crearPopupTituloParrafo(
        "Casa Lola",
        "El mejor restaurante de la zona.",
      );
      const popupAnuncianteCasaPaco = crearPopupTituloParrafo(
        "Casa Paco",
        "El mejor restaurante de la zona.",
      );

      //Forma sin función
      /*const popupAnuncianteCasaLola = new mapboxgl.Popup()
            .setHTML('<h3>Casa Lola</h3><p>El mejor restaurante de la zona.</p>');*/

      //Crear popup con solo titulo
      function crearPopupTitulo(titulo) {
        const popupTitulo = new mapboxgl.Popup().setHTML(
          "<h3>" + titulo + "</h3>",
        );

        return popupTitulo;
      }

      const popupUsuarioCasa = crearPopupTitulo("Mi Casa");
      const popupUsuarioColegio = crearPopupTitulo("Mi Cole");

      //Crear popup con solo texto
      function crearPopupTexto(texto) {
        const popupTexto = new mapboxgl.Popup().setText(texto);

        return popupTexto;
      }

      const popupUsuarioUbicacion = crearPopupTexto("Mi ubi");

      //Forma sin función
      /*const popupUsuarioUbicacion = new mapboxgl.Popup()
            .setText('Mi ubi');*/

      //añadir marcador basico
      function añadirMarcadorBasico(longitudX, latitudY, popup) {
        const marker = new mapboxgl.Marker({
          color: "#005a60",
          scale: 1,
          //arrastrable
          //draggable: true
        })
          //Asignar coordenadas
          .setLngLat([longitudX, latitudY])
          //Crear un popup que indique info del marcador
          .setPopup(popup) //.setPopup(new mapboxgl.Popup().setText('Aquí hay un parking'))
          //Añadir al mapa
          .addTo(mapa); //se usa el encadenamiento de métodos porque cada método devuelve el propio objeto this, es igual que hacer marker.addTo(mapa)
        return marker;
      }

      const marcaUbi = añadirMarcadorBasico(
        -4.47204,
        36.71872,
        popupUsuarioUbicacion,
      );
      const marcaCasa = añadirMarcadorBasico(
        -4.47234,
        36.71372,
        popupUsuarioCasa,
      );
      const marcaCole = añadirMarcadorBasico(
        -4.47304,
        36.71472,
        popupUsuarioColegio,
      );
      //marcaUbi.remove();

      //añadir marcador Personalizado Logo
      function añadirMarcadorPersonalizado(longitudX, latitudY, popup) {
        const anunciante = document.createElement("div");
        anunciante.className = "custom-marker";
        anunciante.innerHTML = `<img src="./assets/imagotipoAparkt.png" alt="anunciante" style="width:60px;height:60px;display:block;">`;

        const markerAnunciante = new mapboxgl.Marker({
          element: anunciante,
          anchor: "bottom", //se centra lo de abajo
        })
          .setLngLat([longitudX, latitudY])
          .setPopup(popup)
          .addTo(mapa);
        return markerAnunciante;
      }

      const marcaCasaLola = añadirMarcadorPersonalizado(
        -4.480782,
        36.717794,
        popupAnuncianteCasaLola,
      );
      const marcaCasaPaco = añadirMarcadorPersonalizado(
        -4.4807,
        36.7201,
        popupAnuncianteCasaPaco,
      );
      //marcaCasaLola.remove();
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
});

function configurarUIUsuarioLogueado(usuario) {
  console.log('Usuario logueado:', usuario);

  // Botón de perfil - abrir banner
  const perfilBtn = document.getElementById('perfilUsuario');
  if (perfilBtn) {
    perfilBtn.addEventListener('click', () => {
      const banner = document.getElementById('bannerUsuario');
      if (banner) {
        banner.classList.add('abierto');
      }
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => cerrarSesion());
  }
}

function configurarUIUsuarioNoLogueado() {
  console.log('Usuario no logueado');

  // Si no está logueado, el botón de perfil no hace nada
}
