
var background = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=API_KEY);

var map = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [background]
});

graymap_background.addTo(map);

var base = {
  Satellite: background,
};

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {


  function style(feature) {
    return {
      opacity: .9,
      fillOpacity: .9,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.4
    };
  }

  function CaseColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#0066cc";
      case magnitude > 4:
        return "#0080ff";
      case magnitude > 3:
        return "#4da6ff";
      case magnitude > 2:
        return "#80bfff";
      case magnitude > 1:
        return "#b3d9ff";
      default:
        return "#e6f2ff";
    }
  }


  function radius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 3;
  }


  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  }).addTo(earthquakes);

  earthquakes.addTo(map);


  var legend = L.control({
    position: "bottomright"
  });


  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");

    var mag = [0, 1, 2, 3, 4, 5];
    var color = [
      "#e6f2ff",
      "#b3d9ff",
      "#80bfff",
      "#4da6ff",
      "#0080ff",
      "#0066cc"
    ];


    for (var i = 0; i < mag.length; i++) {
      div.innerHTML += "<i style='background: " + color[i] + "'></i> " +
        mag[i] + (mag[i + 1] ? "&ndash;" + mag[i + 1] + "<br>" : "+");
    }
    return div;
  };


  legend.addTo(map);

});