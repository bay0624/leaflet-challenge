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

#### Tectonic plates data with geoJSON
```JavaScript
let url2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
d3.json(url2).then(function (data) {

    L.geoJSON(data, {
        color: "yellow",
        weight: 2
    }).addTo(tectonics);
    tectonics.addTo(myMap);
```
