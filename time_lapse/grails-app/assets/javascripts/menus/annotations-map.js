var anAnnotationHasBeenAddedMap = anAnnotationHasBeenAdded;
anAnnotationHasBeenAdded = function(event) {
	anAnnotationHasBeenAddedMap(event);

	removeDrawInteraction();
}

function createAnnotationsLayer() {
	var source = new ol.source.Vector();
	source.on("addfeature", anAnnotationHasBeenAdded);

	// define a default style
	var style = new ol.style.Style({
		fill: new ol.style.Fill({ color: "rgba(255, 255, 0, 0)" }),
		image: new ol.style.Circle({
			fill: new ol.style.Fill({ color: "rgba(255, 255, 0, 1)" }),
			radius: 5
		}),
		stroke: new ol.style.Stroke({
			color: "rgba(255, 255, 0, 1)",
            width: 2
 		})
	});

	var layer = tlv.layers[tlv.currentLayer];
	layer.annotationsLayer = new ol.layer.Vector({
		source: source,
		style: style
	});
	tlv.map.addLayer(layer.annotationsLayer);
}

function drawCircle() {
	tlv.draw = new ol.interaction.Draw({
        source: tlv.layers[tlv.currentLayer].annotationsLayer.getSource(),
		type: "Circle"
	});
}

function drawLineString() {
	tlv.draw = new ol.interaction.Draw({
        source: tlv.layers[tlv.currentLayer].annotationsLayer.getSource(),
		type: "LineString"
	});
}

function drawPoint() {
	tlv.draw = new ol.interaction.Draw({
        source: tlv.layers[tlv.currentLayer].annotationsLayer.getSource(),
		type: "Point"
	});
}

function drawPolygon() {
	tlv.draw = new ol.interaction.Draw({
        source: tlv.layers[tlv.currentLayer].annotationsLayer.getSource(),
		type: "Polygon"
	});
}

function drawRectangle() {
	tlv.draw = new ol.interaction.Draw({
		geometryFunction: function(coordinates, geometry) {
			if (!geometry) { geometry = new ol.geom.Polygon(null); }
			var start = coordinates[0];
			var end = coordinates[1];
			geometry.setCoordinates([[
				start,
				[start[0], end[1]],
				end,
				[end[0], start[1]],
				start
			]]);


			return geometry;
        },
		maxPoints: 2,
        source: tlv.layers[tlv.currentLayer].annotationsLayer.getSource(),
		type: "LineString"
	});
}

function drawSquare() {
	tlv.draw = new ol.interaction.Draw({
		geometryFunction: ol.interaction.Draw.createRegularPolygon(4),
        source: tlv.layers[tlv.currentLayer].annotationsLayer.getSource(),
		type: "Circle"
	});
}

function drawAnnotationMap(type) {
	// create an annotations layer if one does not exist
	if (!tlv.layers[tlv.currentLayer].annotationsLayer) { createAnnotationsLayer(); }

	// create the right draw interaction
	switch (type) {
		case "circle": drawCircle(); break;
		case "lineString": drawLineString(); break;
		case "point": drawPoint(); break;
		case "polygon": drawPolygon(); break;
		case "rectangle": drawRectangle(); break;
		case "square": drawSquare(); break;
	}
	tlv.map.addInteraction(tlv.draw);
}

function removeDrawInteraction() { tlv.map.removeInteraction(tlv.draw); }
