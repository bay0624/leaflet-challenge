# Objective
Welcome to the United States Geological Survey, or USGS for short. The USGS is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.

The USGS is interested in building a new set of tools that will allow them to visualize their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. Their hope is that being able to visualize their data will allow them to better educate the public and other government organizations (and hopefully secure more funding) on issues facing our planet.

The website displays "All Earthquakes from the Past Week." Earthquakes with higher magnitudes appear larger and earthquakes with greater depth appear darker in color. <b>https://bay0624.github.io/leaflet-challenge/</b>

Default Map             |  Satellite Map
:-------------------------:|:-------------------------:
![Default Map](https://github.com/bay0624/leaflet-challenge/blob/main/images/DefaultMap.png?raw=true) |  ![Satellite Map](https://github.com/bay0624/leaflet-challenge/blob/main/images/SatelliteMap.png?raw=true)

Terrain Map             |  Topographic Map
:-------------------------:|:-------------------------:
![Terrain Map](https://github.com/bay0624/leaflet-challenge/blob/main/images/TopographicMap.png?raw=true) |  ![Topo Map](https://github.com/bay0624/leaflet-challenge/blob/main/images/TerrainMap.png?raw=true)


# Technologies
- JavaScript (Leaflet, D3)
- HTML
- CSS

# Steps

#### Creating layer groups
```JavaScript
let earthquakePoints = L.layerGroup();
let tectonics = L.layerGroup();
```

#### Creating map tiles
```JavaScript
let defaultMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let satelliteMap = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

let terrainMap = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

let baseMaps = {
    "Satellite": satelliteMap,
    "Topographic": topoMap,
    "Terrain": terrainMap,
    "Default": defaultMap,
};

let overlayMaps = {
    "Earthquakes": earthquakePoints,
    "Tectonic": tectonics
};

let myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 4,
    layers: [satelliteMap, earthquakePoints]
});

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);
```

#### Function for creating marker size
```JavaScript
function markerSize(magnitude) {
    return magnitude * 35000;
}
```

#### Function for creating color gradient for marker and legend
```JavaScript
function colorGradient(depth) {

    if (depth > 90) {
        return "#ff0d0d";
    }
    else if (depth > 70) {
        return "#ff4e11";
    }
    else if (depth > 50) {
        return "#ff8e15";
    }
    else if (depth > 30) {
        return "#fab733";
    }
    else if (depth > 10) {
        return "#acb334";
    }
    else {
        return "#69b34c";
    }
}
```

#### Creating the map legend 
```JavaScript
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
        depthChart = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // looping through depthChart and generating a label with a colored square for each depth range
    for (let i = 0; i < depthChart.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorGradient(depthChart[i] + 1) + '"></i> ' +
            depthChart[i] + (depthChart[i + 1] ? '&ndash;' + depthChart[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);
```

#### Getting Earthquake Data from USGS
```JavaScript
let url1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url1).then(function (response) {

    response.features.forEach(function (i) {
        let coords = i.geometry.coordinates;
        let lat = coords[1];
        let lon = coords[0];
        let depth = coords[2];
        let mag = i.properties.mag;
        let place = i.properties.place;

        // creating earthquake object
        let earthquakes = [
            {
                place: place,
                location: [lat, lon],
                magnitude: mag,
                depth: depth
            }
        ]
```

#### Getting Pop-Up information
```JavaScript
earthquakes.forEach(function (j) {

            L.circle(j.location, {
                fillOpacity: 0.75,
                weight: 0.75,
                color: "black",
                fillColor: colorGradient(j.depth),
                radius: markerSize(j.magnitude)
            }).bindPopup(`<h3>${j.place}</h3> <hr> <h3>Magnitude: ${j.magnitude.toLocaleString()}</h3> <h3>Depth: ${j.depth.toLocaleString()}</h3> `).addTo(earthquakePoints);
            earthquakePoints.addTo(myMap);
```

#### Creating tectonic plates data with geoJSON
```JavaScript
let url2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
d3.json(url2).then(function (data) {

    L.geoJSON(data, {
        color: "yellow",
        weight: 2
    }).addTo(tectonics);
    tectonics.addTo(myMap);
```

