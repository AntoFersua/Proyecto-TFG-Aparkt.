window.addEventListener('DOMContentLoaded', function () {
    fetch('../config/config.php')
        .then(function(response){
            console.log("Status:", response.status);
            return response.json();
        }) 
        .then(function(data){ 
            //token - key
            mapboxgl.accessToken = data.MAPS_API_KEY;

            //crear el mapa 
            const mapa = new mapboxgl.Map({
                container: 'mapa', 
                style: 'mapbox://styles/mapbox/standard', 
                projection: 'globe', 
                zoom: 15, 
                center: [-4.475468174458712, 36.72410119432091] 
            });

            //añadir control de navegación
            mapa.addControl(new mapboxgl.NavigationControl());
        })
        .catch(function(error){
            console.log("Error: " + error);
        });
    
     
});