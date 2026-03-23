window.addEventListener('DOMContentLoaded', function () {
    //token - key
    //mapboxgl.accessToken = ;

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
    
});