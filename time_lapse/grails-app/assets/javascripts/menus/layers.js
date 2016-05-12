if (typeof addLayersToProxyMap == "function") {
	var addLayersToProxyMapLayers = addLayersToProxyMap;
	addLayersToProxyMap = function() {
		addLayersToProxyMapLayers();
	
		if ($("#layersCrossHairButton").html() == "ON") { tlv.proxyMap.addLayer(tlv.crossHairLayer); }
		if ($("#layersSearchOriginButton").html() == "ON") { tlv.proxyMap.addLayer(tlv.searchOriginLayer); }
	}
}

function crossHairToggleButtonClick(desiredState) {
	var button = $("#layersCrossHairButton");
	toggleButton(button, desiredState);

	if (button.html() == "ON") { displayCrossHairLayer(); }
	else { hideCrossHairLayer(); }
}

function displayCrossHairLayer() {
	if (!tlv.crossHairLayer) {
		var stroke = new ol.style.Stroke({
			 color: "rgba(255, 255, 0, 1)",
			 width: 2
		});
		var style = new ol.style.Style({ stroke: stroke });
		
		tlv.crossHairLayer = new ol.layer.Vector({
			source: new ol.source.Vector(),
			style: style
		});
		tlv.map.addLayer(tlv.crossHairLayer);
	}
	else { tlv.crossHairLayer.setVisible(true); }
	refreshCrossHairLayer();
}

function displaySearchOriginLayer() {
	if (!tlv.searchOriginLayer) {
		var point = new ol.geom.Point(tlv.location);
		var feature = new ol.Feature(point);

		var fill = new ol.style.Fill({ color: "rgba(255, 255, 0, 1)"});
		var circle = new ol.style.Circle({
			fill: fill,
			radius: 5
		});
		var text = new ol.style.Text({
			fill: fill,
			offsetY: 13,
			text: "Search Origin"
		});
		var style = new ol.style.Style({
			image: circle,
			text: text
		});

		tlv.searchOriginLayer = new ol.layer.Vector({
			source: new ol.source.Vector({ features: [feature] }),
			style: style
		});
		tlv.map.addLayer(tlv.searchOriginLayer);
	}
	else { tlv.searchOriginLayer.setVisible(true); }
}

function hideCrossHairLayer() { tlv.crossHairLayer.setVisible(false); }

function hideSearchOriginLayer() { tlv.searchOriginLayer.setVisible(false); }

function refreshCrossHairLayer() { 
	var mapCenter = tlv.map.getView().getCenter();

	var centerPixel = tlv.map.getPixelFromCoordinate(mapCenter);
	var deltaXPixel = [centerPixel[0] + 10, centerPixel[1]];
	var deltaYPixel = [centerPixel[0], centerPixel[1] + 10];
	
	var deltaXDegrees = tlv.map.getCoordinateFromPixel(deltaXPixel)[0] - mapCenter[0];
	var deltaYDegrees = tlv.map.getCoordinateFromPixel(deltaYPixel)[1] - mapCenter[1];

	var horizontalLinePoints = [
		[mapCenter[0] - deltaXDegrees, mapCenter[1]],
		[mapCenter[0] + deltaXDegrees, mapCenter[1]]
	];
	var horizontalLineGeometry = new ol.geom.LineString(horizontalLinePoints);
	var horizontalLineFeature = new ol.Feature(horizontalLineGeometry);

	var verticalLinePoints = [
		[mapCenter[0], mapCenter[1] - deltaYDegrees],
		[mapCenter[0], mapCenter[1] + deltaYDegrees]
	];
	var verticalLineGeometry = new ol.geom.LineString(verticalLinePoints);
	var verticalLineFeature = new ol.Feature(verticalLineGeometry);
	
	var source = tlv.crossHairLayer.getSource();
        $.each(source.getFeatures(), function(i, x) { source.removeFeature(x); });
	source.addFeatures([horizontalLineFeature, verticalLineFeature]);
}

function searchOriginToggleButtonClick(desiredState) {
	var button = $("#layersSearchOriginButton");
	toggleButton(button, desiredState);

	if (button.html() == "ON") { displaySearchOriginLayer(); }
	else { hideSearchOriginLayer(); }
}

var theMapHasMovedLayers = theMapHasMoved;
theMapHasMoved = function() {
	theMapHasMovedLayers();

	var crossHairButton = $("#layersCrossHairButton");
	if (crossHairButton.html() == "ON") { refreshCrossHairLayer(); }
}

var setupTimeLapseLayers = setupTimeLapse;
setupTimeLapse = function() {
	setupTimeLapseLayers();

	tlv.crossHairLayer = null;
	if (tlv.crossHairLayerEnabled == "true" || $("#layersCrossHairButton").html() == "ON") { crossHairToggleButtonClick("ON"); }

	tlv.searchOriginLayer = null;
	if (tlv.searchOriginLayerEnabled == "true" || $("#layersSearchOriginButton").html() == "ON") { searchOriginToggleButtonClick("ON"); }
}	