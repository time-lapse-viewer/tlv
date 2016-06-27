var anAnnotationHasBeenAddedMap = anAnnotationHasBeenAdded;
anAnnotationHasBeenAdded = function(event) {
	anAnnotationHasBeenAddedMap(event);

	removeInteraction(tlv.drawInteraction);
	removeInteraction(tlv.modifyFeaturesInteraction);
	removeInteraction(tlv.selectFeaturesInteraction);
}

var changeFrameAnnotations = changeFrame;
changeFrame = function(param) {
	var annotationsLayer = tlv.layers[tlv.currentLayer].annotationsLayer;
	if (annotationsLayer) { annotationsLayer.setVisible(false); }

	changeFrameAnnotations(param);

	var annotationsLayer = tlv.layers[tlv.currentLayer].annotationsLayer;
	if (annotationsLayer) { annotationsLayer.setVisible(true); }

	removeInteraction(tlv.drawInteraction);
	removeInteraction(tlv.modifyFeaturesInteraction);
	removeInteraction(tlv.selectFeaturesInteraction);
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

function deleteAnnotationsMap() {
	var layer = tlv.layers[tlv.currentLayer].annotationsLayer;
	if (layer) {
		tlv.selectFeaturesInteraction = new ol.interaction.Select({ layers: [layer] });
		tlv.selectFeaturesInteraction.on(
			"select",
			function(event) {
				var feature = event.selected[0];
				layer.getSource().removeFeature(feature);
				removeInteraction(tlv.selectFeaturesInteraction);
			}
		);
		tlv.map.addInteraction(tlv.selectFeaturesInteraction);
	}
}

function drawCircle() {
	tlv.drawInteraction = new ol.interaction.Draw({
        source: tlv.layers[tlv.currentLayer].annotationsLayer.getSource(),
		type: "Circle"
	});
}

function drawLineString() {
	tlv.drawInteraction = new ol.interaction.Draw({
        source: tlv.layers[tlv.currentLayer].annotationsLayer.getSource(),
		type: "LineString"
	});
}

function drawPoint() {
	tlv.drawInteraction = new ol.interaction.Draw({
        source: tlv.layers[tlv.currentLayer].annotationsLayer.getSource(),
		type: "Point"
	});
}

function drawPolygon() {
	tlv.drawInteraction = new ol.interaction.Draw({
        source: tlv.layers[tlv.currentLayer].annotationsLayer.getSource(),
		type: "Polygon"
	});
}

function drawRectangle() {
	tlv.drawInteraction = new ol.interaction.Draw({
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
	tlv.drawInteraction = new ol.interaction.Draw({
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
	tlv.map.addInteraction(tlv.drawInteraction);
}

function modifyAnnotationMap() {
	var layer = tlv.layers[tlv.currentLayer].annotationsLayer;
	if (layer) {
		var features = new ol.Collection(layer.getSource().getFeatures());
		if (features) {
			tlv.modifyFeaturesInteraction = new ol.interaction.Modify({
        		deleteCondition: function(event) {
          			return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
        		},
				features: features
			});
    		tlv.map.addInteraction(tlv.modifyFeaturesInteraction);
		}
	}
}

function removeInteraction(interaction) {
	// make sure there is an interaction to remove first
	if (interaction) {
		tlv.map.removeInteraction(interaction);
		interaction = null;
	}
}
