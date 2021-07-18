let myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 3
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function markerSize(magnitude) {
    return magnitude * 50000;
}

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(url).then(function (response) {

    // console.log(response);

    response.features.forEach(function (i) {
        let coords = i.geometry.coordinates;
        // console.log(coords);
        let lat = coords[1];
        let lon = coords[0];
        let depth = coords[2];
        // console.log(lat);
        let mag = i.properties.mag;
        let place = i.properties.place;
        // console.log(magnitude);
        let earthquakes = [
            {
                place: place,
                location: [lat, lon],
                magnitude: mag
            }
        ]
        // console.log(earthquakes);

        earthquakes.forEach(function (j) {
            // console.log(j.location);
            // console.log(j.magnitude);
            console.log(j.place);

            L.circle(j.location, {
                fillOpacity: 0.75,
                color: "white",
                fillColor: "green",
                radius: markerSize(j.magnitude)
            }).bindPopup(`<h3>${j.place}</h1> <hr> <h3>Magnitude: ${j.magnitude.toLocaleString()}</h3>`).addTo(myMap);

        });

    });




});
