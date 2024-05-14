var myMap ={};
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var hue = ["#9eff3d", "#f6ff00", "#fff131", "#f7ba3e", "#e87223", "#f22a13"];

function createMap(earthquakesLayer) {
    
    var map = L.map('map').setView([0, 0], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    earthquakesLayer.addTo(map);
}

d3.json(queryUrl).then(data => {
    createFeatures(data.features);
});

function circleHue(magnitude) {
    const index = Math.min(Math.floor(magnitude), 5);
    return hue[index];
}

function calcRadius(magnitude) {
    return (magnitude/5) * 20;
  }

function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: createCircleMarker,
        onEachFeature: addPopup
    });

    createMap(earthquakes);
}

function createCircleMarker(feature) {
    var coordinates = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
    var magnitude = +feature.properties.mag;

    return L.circleMarker(coordinates, {
        fillColor: circleHue(magnitude),
        color: "rgb(153,51,204)",
        weight: 0.5,
        opacity: 0.7,
        fillOpacity: 0.7,
        radius: calcRadius(magnitude)
    });
}

function addPopup(feature, layer) {
    layer.bindPopup("<h5>" + feature.properties.place + "</h5><hr><p>Magnitude: " + feature.properties.mag + "</p>");
}
