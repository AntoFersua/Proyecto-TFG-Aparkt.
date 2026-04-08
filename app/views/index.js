window.addEventListener('DOMContentLoaded', function () {

    fetch('../config/config.php')
        .then(function(response){
            //Mostrar mensaje y convertir la respuesta en JSON
            console.log("Status:", response.status);
            return response.json();
        })
        .then(function(data){
            //Token
            mapboxgl.accessToken = data.MAPS_API_KEY;

            //Mapa
            const mapa = new mapboxgl.Map({
                //id del div donde se carga el mapa
                container: 'mapa',
                style: 'mapbox://styles/mapbox/standard',
                //Globo terráqueo 
                projection: 'globe',
                zoom: 15,
                //Coordenadas Teatinos
                center: [-4.475468174458712, 36.72410119432091]
            });

            //Cuando el estilo del mapa se carga, se establece la niebla por defecto
            mapa.on('style.load', function () {
                mapa.setFog({});
            });

            
            //Cuando el mapa termina de cargar, se añade el control de navegación del zoom y rotación
            mapa.on('load', function () {
               mapa.addControl(new mapboxgl.NavigationControl());
            });

            
            //Obtener las coordenadas y la dirección de una ubi específica
            mapa.on('click', function (e) {
                //Obtener latitud y longitud, se accede mediante las propiedades del objeto. e.lngLat da latitud y longitud juntas
                const longitud = e.lngLat.lng;
                const latitud = e.lngLat.lat;

                //Obtener la dirección a partir de las coordenadas mediante la API de geocoding inverso de Mapbox
                fetch('https://api.mapbox.com/search/geocode/v6/reverse?longitude=' + longitud + '&latitude=' + latitud + '&access_token=' + mapboxgl.accessToken)
                    .then(function (response) {
                        //Convertir la respuesta en JSON
                        return response.json();
                    })
                    //Procesar datos obtenidos
                    .then(function (datos) {
                        /*Se obtiene el nombre del lugar completo con calle, provincia y país o solo el nombre de la calle o un mensaje por defecto.
                        Se accede al elemento 0 del array features de datos, si existe se accede a properties, si existe se accede a full_address en caso de que no se sigue con name...
                        console.log(datos);*/  
                        const address = datos.features[0]?.properties?.full_address || datos.features[0]?.properties?.name || 'Dirección no encontrada'; 
                        alert('Coordenadas: ' + longitud.toFixed(6) + ', ' + latitud.toFixed(6) + '\nDirección: ' + address);
                    })
                    //En caso de error
                    .catch(function (error) {
                        alert('Coordenadas: ' + longitud.toFixed(6) + ', ' + latitud.toFixed(6) + '\nError al obtener dirección');
                    });
            });

            //añadir marcador
            new mapboxgl.Marker({ color: 'red' })
                //Asignar coordenadas
                .setLngLat([-4.47204, 36.71872])
                //Crear un popup que indique info del marcador 
                .setPopup(
                    new mapboxgl.Popup().setText('Aquí hay un parking')
                )
                //Añadir al mapa 
                .addTo(mapa); 

        })
        .catch(function(error){
            console.log("Error: " + error);
        });

});