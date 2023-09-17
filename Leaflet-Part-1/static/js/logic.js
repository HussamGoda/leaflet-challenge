// Create a map object.
let myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3
  });
  
  // Add a tile layer.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Store our API endpoint as queryUrl.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log(data.features)
  //createFeatures(data.features);
});

function chooseColor(depth) {
    if (depth <= 10) return "#F9B327";
    else if (depth > 10 && depth <= 30) return "#F97540";
    else if (depth > 30 && depth <= 50) return "#B95A33";
    else if (depth > 50 && depth <= 70) return "#838025";
    else if (depth >70 && depth <= 90) return "#257383";
    else return "#024729";
  }

  d3.json(url).then(function(data) {
    // Create GeoJSON layer with the data
    L.geoJson(data, {
      // Styling each feature (in this case, a neighbourhood)
      pointToLayer: function (feature, latlng) {
        let depth = feature.geometry.coordinates[2];
        let radius = Math.sqrt(feature.properties.mag) * 10;
        return L.circleMarker(latlng, {
          radius: radius,
          fillColor: chooseColor(depth),
          color: "white",
          weight: 1,
          opacity: 0,
          fillOpacity: 0.8
        });
      },
    
      onEachFeature: function (feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Place: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Longitude: " + feature.geometry.coordinates[0] + "<br>Latitude: " + feature.geometry.coordinates[1]);
      }
    }).addTo(myMap);
});

// legend control
let legend = L.control({
  position: 'bottomright'
});

// legend content and  style (html)
legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend');
  div.style.border = '2px solid black';
  div.style.backgroundColor = 'white';
  var depths = [0, 10, 30, 50, 70, 90];
  var labels = [];

  // depths and colors
  const depthRanges = [
    { label: '-10 - 10', color: '#F9B327' },
    { label: '10 - 30', color: '#F97540' },
    { label: '30 - 50', color: '#B95A33' },
    { label: '50 - 70', color: '#838025' },
    { label: '70 - 90', color: '#257383' },
    { label: '90+', color: '#024729' },
  ];

// color swatches and labels for depths range
depthRanges.forEach(range => {
  let entry = document.createElement('div');

  let swatch = document.createElement('div');
  swatch.className = 'legend-swatch';
  swatch.style.backgroundColor = range.color;

  let label = document.createElement('div');
  label.textContent = range.label;
  label.className = 'legend-label';

  entry.appendChild(swatch);
  entry.appendChild(label);

  div.appendChild(entry);
});

return div;
};

// add legend to Mymap
legend.addTo(myMap);
