// let myMap = L.map("map", {
//     center: [37.7749, -122.4194],
//     zoom: 4
// });

let earthquakes = L.layerGroup();
let tectonics = L.layerGroup();


let cityMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let baseMaps = {
    "City Map": cityMap,
    "Topographic Map": topoMap
};

let overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic": tectonics
};

let myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 4,
    layers: [topoMap, earthquakes]
});

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// function to create marker size
function markerSize(magnitude) {
    return magnitude * 50000;
}

// function to create color gradient for marker and legend
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

// creating the legend 
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


let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(url).then(function (response) {

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

        earthquakes.forEach(function (j) {

            L.circle(j.location, {
                fillOpacity: 0.75,
                weight: 0.75,
                color: "black",
                fillColor: colorGradient(j.depth),
                radius: markerSize(j.magnitude)
            }).bindPopup(`<h3>${j.place}</h3> <hr> <h3>Magnitude: ${j.magnitude.toLocaleString()}</h3> <h3>Depth: ${j.depth.toLocaleString()} km</h3> `).addTo(myMap);

        });

    });

});

// let url2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
// d3.json(url2).then(function (data) {

//     L.geoJSON(date, {
//         color: "orange",
//         weight: 2
//     })

// });