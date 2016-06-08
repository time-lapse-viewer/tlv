function addBaseLayersToTheMap() { tlv.baseLayers = {}; }

function addLayerToTheMap(layer) {
	var params = {
		FORMAT: "image/png",
		IDENTIFIER: new Date().getTime(),
		IMAGE_ID: layer.imageId,
		LAYERS: layer.indexId,
		LIBRARY: layer.library,
		TRANSPARENT: true,
		VERSION: "1.1.1"
	};

	var image = new ol.layer.Image({
		opacity: layer.opacity || 1,
		source: new ol.source.ImageWMS({
			params: params,
			ratio: 1,
			url: tlv.contextPath + "/wms"
		}),
		visible: true
	});

	image.getSource().on("imageloadstart", function(event) { theLayerHasStartedLoading(this); });
	image.getSource().on("imageloadend", function(event) { theLayerHasFinishedLoading(this); });;

	layer.mapLayer = image;
	layer.layerIsLoaded = 0;

	tlv.map.addLayer(layer.mapLayer);
}

function buildSummaryTable() {
	var table = $("#timeLapseSummaryTable")[0];

	for (var i = table.rows.length - 1; i >= 0; i--) { table.deleteRow(i); }

	var row = table.insertRow(0);
	var cell = row.insertCell(row.cells.length);
	row.insertCell(row.cells.length);
	var keys = ["imageId", "acquisitionDate", "library"];
	$.each(
		keys,
		function(i, x) {
			var cell = row.insertCell(row.cells.length);
			$(cell).append(x.capitalize().replace(/([A-Z])/g, " $1"));
		}
	);

	$.each(
		tlv.layers,
		function(i, x) {
			row = table.insertRow(table.rows.length);
			cell = row.insertCell(row.cells.length);
			$(cell).append(i + 1);

			cell = row.insertCell(row.cells.length);
			$(cell).css("white-space", "nowrap");
			var downButton = "<span class = 'glyphicon glyphicon-arrow-down' title = 'Move Down'></span>";
			var upButton = "<span class = 'glyphicon glyphicon-arrow-up' title = 'Move Up'></span>";

			if (i == 0) {
				$(cell).append("<a href = javascript:moveLayerDownInStack(" + i + ");buildSummaryTable();>" + downButton + "</a>");
				$(cell).css("text-align", "right");
			}
			else if (i == tlv.layers.length - 1) { $(cell).append("<a href = javascript:moveLayerUpInStack(" + i + ");buildSummaryTable();>" + upButton + "</a>"); }
			else {
				$(cell).append("<a href = javascript:moveLayerUpInStack(" + i + ");buildSummaryTable();>" + upButton + "</a>");
				$(cell).append("<a href = javascript:moveLayerDownInStack(" + i + ");buildSummaryTable();>" + downButton + "</a>");
			}

			cell = row.insertCell(row.cells.length);
			$(cell).append(x.imageId);

			cell = row.insertCell(row.cells.length);
			$(cell).append(x.acquisitionDate);

			cell = row.insertCell(row.cells.length);
			$(cell).append(tlv.availableResources.complete[x.library].label);
		}
	);
}

function calculateInitialViewBbox() {
	var bbox = convertRadiusToBbox(tlv.location[0], tlv.location[1], 1000);


	return [bbox.minLon, bbox.minLat, bbox.maxLon, bbox.maxLat];
}

function changeFrame(param) {
	var layer = tlv.layers[tlv.currentLayer];
	layer.mapLayer.setVisible(layer.keepVisible);

	if (param === "fastForward") { tlv.currentLayer = getNextFrameIndex(); }
	else if (param === "rewind") { tlv.currentLayer = getPreviousFrameIndex(); }
	else if (typeof param === "number") { tlv.currentLayer = param; }

	tlv.layers[tlv.currentLayer].mapLayer.setVisible(true);

	tlv.map.renderSync();

	if (tlv.layers[tlv.currentLayer].layerIsLoaded == 0) { tlv.loadingSpinner.stop(); }
	else {
		if (!tlv.loadingSpinner.el) { tlv.loadingSpinner.spin($("#map")[0]); }
	}

	updateScreenText();
}

function compassRotate(event) {
	if (event.alpha) { tlv.map.getView().rotate(event.alpha * Math.PI / 180); }
	else{ displayErrorDialog("Sorry, we couldn't get a good reading. :("); }
}

function createContextMenuContent(coordinate) {
	var coordConvert = new CoordinateConversion();
	var latitude = coordinate[1];
	var longitude = coordinate[0];
	var dd = latitude.toFixed(6) + ", " + longitude.toFixed(6);
	var dms = coordConvert.ddToDms(latitude, "lat") + " " + coordConvert.ddToDms(longitude, "lon");
	var mgrs = coordConvert.ddToMgrs(latitude, longitude);

	$("#mouseClickDiv").html("<div align = 'center' class = 'row'>" + dd + " // " + dms + " // " + mgrs + "</div>");


	$("#imageMetadataDiv").html("");
	$.each(
		tlv.layers[tlv.currentLayer].metadata,
		function(i, x) {
			var key = i.capitalize().replace(/([A-Z])/g, " $1");
			$("#imageMetadataDiv").append("<b>" + key + "</b>: " + x + "<br>");
		}
	);
}

function createMapControls() {
	var span = document.createElement("span");
	span.className = "glyphicon glyphicon-fullscreen";
	var fullScreenControl = new ol.control.FullScreen({ label: span });

	tlv.mapControls = [
		createMousePositionControl(),
		fullScreenControl
	];
}

function createMousePositionControl() {
	var mousePositionControl = new ol.control.MousePosition({
		coordinateFormat: function(coordinate) {
			var lat = coordinate[1];
			var lon = coordinate[0];
			var coordConvert = new CoordinateConversion();
			switch(mousePositionControl.coordinateDisplayFormat) {
				case 0: return coordinate[1].toFixed(6) + ", " + coordinate[0].toFixed(6); break;
				case 1: return coordConvert.ddToDms(lat, "lat") + " " + coordConvert.ddToDms(lon, "lon"); break;
				case 2: return coordConvert.ddToMgrs(lat, lon); break;
			}
		},
		projection: "EPSG:4326"
	});

	mousePositionControl.coordinateDisplayFormat = 0;
	$(mousePositionControl.element).click(function() {
		mousePositionControl.coordinateDisplayFormat++;
		if (mousePositionControl.coordinateDisplayFormat >= 3) { mousePositionControl.coordinateDisplayFormat = 0; }
	});


	return mousePositionControl;
}

function deleteFrame() {
	changeFrame("rewind");

	var nextFrameIndex = getNextFrameIndex();
	var spliceIndex = nextFrameIndex == 0 ? 0 : nextFrameIndex;
	tlv.layers.splice(spliceIndex, 1);
	if (tlv.currentLayer > tlv.layers.length - 1) { tlv.currentLayer = tlv.layers.length - 1; }

	changeFrame("fastForward");
}

function disableCompassMapRotation() { window.removeEventListener("deviceorientation", compassRotate, false); }

function disableManualMapRotation() {
	tlv.mapInteractions.dragRotate.setActive(false);
	tlv.mapInteractions.pinchRotate.setActive(false);

	tlv.mapInteractions.dragPan.setActive(true);
}

function disableMapRotation() {
	disableCompassMapRotation();
	disableManualMapRotation();
}

function enableCompassMapRotation() {
	if (window.DeviceOrientationEvent) { window.addEventListener("deviceorientation", compassRotate, false); }
	else { displayErrorDialog("Sorry, your device doesn't support device orientation. :("); }
}

function enableManualMapRotation() {
	tlv.mapInteractions.dragPan.setActive(false);

	tlv.mapInteractions.dragRotate.setActive(true);
	tlv.mapInteractions.pinchRotate.setActive(true);
}

function geoJump() {
	var location = $("#geoJumpLocationInput").val();
	var point = convertGeospatialCoordinateFormat(location, function(point) { tlv.map.getView().setCenter(point); });
	if (point) { tlv.map.getView().setCenter(point); }
}

function getLayerIdentifier(source) {
	if (typeof source.getParams == "function") { return source.getParams().IDENTIFIER; }
	// assume an XYZ layer
	else { return source.getUrls()[0]; }
}

function getNextFrameIndex() { return tlv.currentLayer >= tlv.layers.length - 1 ? 0 : tlv.currentLayer + 1; }

function getPreviousFrameIndex() { return tlv.currentLayer <= 0 ? tlv.layers.length - 1 : tlv.currentLayer - 1; }

function getTimeToAdjacentImage(layerIndex, adjacency) {
	var layerIndex2 = null;
	if (adjacency == "previous" && layerIndex > 0) { layerIndex2 = layerIndex - 1; }
	else if (adjacency == "next" && layerIndex < tlv.layers.length - 1) { layerIndex2 = layerIndex + 1; }

	if (typeof layerIndex2 == "number") {
		var date1 = tlv.layers[layerIndex].acquisitionDate ? new Date(Date.parse(tlv.layers[layerIndex].acquisitionDate)) : null;
		var date2 = tlv.layers[layerIndex2].acquisitionDate ? new Date(Date.parse(tlv.layers[layerIndex2].acquisitionDate)) : null;

		if (date1 && date2) {
			var timeDifference = Math.abs(date2 - date1);
			var seconds = parseInt(timeDifference / 1000);

			var minutes = parseInt(seconds / 60);
			if (minutes > 0) { seconds -= minutes * 60; }

			var hours = parseInt(minutes / 60);
			if (hours > 0) { minutes -= hours * 60; }

			var days = parseInt(hours / 24);
			if (days > 0) { hours -= days * 24; }

			var months = parseInt(days / 30);
			if (months > 0) { days -= months * 30; }

			var years = parseInt(months / 12);
			if (years > 0) { months -= years * 12; }


			if (years > 0) {
				if (months > 0) { return "~" + years + "yr., " + months + " mon."; }
				else { return "~" + years + "yr."; }
			}
			else if (months > 0) {
				if (days > 0) { return "~" + months + "mon., " + days + "dy."; }
				else { return "~" + months + "mon."; }
			}
			else if (days > 0) {
				if (hours > 0) { return "~" + days + "dy., " + hours + "hr."; }
				else { return "~" + days + "dy."; }
			}
			else if (hours > 0) {
				if (minutes > 0) { return "~" + hours + "hr., " + minutes + "min."; }
				else { return "~" + hours + "hr."; }
			}
			else if (minutes > 0) {
				if (seconds > 0) { return "~" + minutes + "min., " + seconds + "sec."; }
				else { return "~" + minutes + "min."; }
			}
			else if (seconds > 0) { return "~" + seconds + "sec."; }
			else { return "0 sec."; }
		}
	}
	else { return false; }
}

function moveLayerDownInStack(layerIndex) {
	var nextLayerIndex = layerIndex + 1;
	if (nextLayerIndex < tlv.layers.length)	{
		var thisLayer = tlv.layers[layerIndex];
		tlv.layers[layerIndex] = tlv.layers[nextLayerIndex];
		tlv.layers[nextLayerIndex] = thisLayer;

		var collection = tlv.map.getLayers();
		var element = collection.removeAt(tlv.layers.length - 1 - layerIndex);
        	collection.insertAt(tlv.layers.length - 1 - nextLayerIndex, element);
	}

	changeFrame("fastForward");
	changeFrame("rewind");

	if ($("#summaryTableDialog").hasClass("in")) { buildSummaryTable(); }
}

function moveLayerUpInStack(layerIndex) {
	var collection = tlv.map.getLayers();
	var element = collection.getArray()[tlv.layers.length - 1 - layerIndex];

	var previousLayerIndex = layerIndex - 1;
	if (previousLayerIndex >= 0) {
		var thisLayer = tlv.layers[layerIndex];
		tlv.layers[layerIndex] = tlv.layers[previousLayerIndex];
		tlv.layers[previousLayerIndex] = thisLayer;

		var collection = tlv.map.getLayers();
		var element = collection.removeAt(tlv.layers.length - 1 - layerIndex);
		collection.insertAt(tlv.layers.length - 1 - previousLayerIndex, element);
	}

	changeFrame("fastForward");
	changeFrame("rewind");

	if ($("#summaryTableDialog").hasClass("in")) { buildSummaryTable(); }
}

var pageLoadTimeLapse = pageLoad;
pageLoad = function() {
	pageLoadTimeLapse();

	if (tlv.layers) {
		$("#searchDialog").modal("hide");
		tlv.bbox = calculateInitialViewBbox();
		setupTimeLapse();
	}
}

function playStopTimeLapse(button) {
	var className = button.className;

	$(button).removeClass(className);
	if (className.contains("play")) {
		playTimeLapse();
		className = className.replace("play", "stop");
	}
	else {
		stopTimeLapse();
		className = className.replace("stop", "play");
	}
	$(button).addClass(className);
}

function playTimeLapse() {
	changeFrame("fastForward");
	tlv.timeLapseAdvance = setTimeout("playTimeLapse()", 1000);
}

function setupMap() {
	// if a map already exists, reset it and start from scratch
	if (tlv.map) { tlv.map.setTarget(null); }

	createMapControls();
	tlv.map = new ol.Map({
		controls: ol.control.defaults().extend(tlv.mapControls),
		interactions: ol.interaction.defaults({
			altShiftDragRotate: false,
			dragPan: false,
			pinchRotate: false
		}).extend([
			new ol.interaction.DragAndDrop({
				formatConstructors: [
					ol.format.GPX,
					ol.format.GeoJSON,
					ol.format.IGC,
					ol.format.KML,
					ol.format.TopoJSON
				]
			})
		]),
		logo: false,
		target: "map",
		view: new ol.View({ projection: "EPSG:4326" })
	});

	updateMapSize();

	// setup context menu
	tlv.map.getViewport().addEventListener("contextmenu",
		function (event) {
			event.preventDefault();
			var pixel = [event.layerX, event.layerY];
			var coordinate = tlv.map.getCoordinateFromPixel(pixel);
			createContextMenuContent(coordinate);
			$("#contextMenuDialog").modal("show");
		}
	);

	$(".ol-zoom-in").click(function() { $(this).blur(); });
	$(".ol-zoom-out").click(function() { $(this).blur(); });
}

function setupTimeLapse() {
	setupMap();

	// setup interactions so rotation can be controlled independently
	tlv.mapInteractions = {
		altDragRotate: new ol.interaction.DragRotate({ condition: ol.events.condition.altKeyOnly }),
		dragPan: new ol.interaction.DragPan({ condition: ol.events.condition.noModifierKeys }),
		dragRotate: new ol.interaction.DragRotate({ condition: ol.events.condition.always }),
		pinchRotate: new ol.interaction.PinchRotate({ condition: ol.events.condition.always })
	};
	$.each(tlv.mapInteractions, function(i, x) { tlv.map.addInteraction(x); });
	tlv.mapInteractions.dragRotate.setActive(false);
	tlv.mapInteractions.pinchRotate.setActive(false);
	
	addBaseLayersToTheMap();

	if (tlv.chronological == "false") { tlv.layers.reverse(); }
	// add layers to the map
	$.each(
		tlv.layers,
		function(i, x) {
			x.keepVisible = x.keepVisible || false;
			addLayerToTheMap(x);
		}
	);

	tlv.map.getView().fit(tlv.bbox, tlv.map.getSize());

	// register map listeners
	tlv.map.on("moveend", theMapHasMoved);

	tlv.currentLayer = 0;

	enableMenuButtons();

	updateScreenText();

	// cycle through the stack to start downloading each frame
	$.each(tlv.layers, function(i, x) { changeFrame("fastForward"); });
}

function stopTimeLapse() { clearTimeout(tlv.timeLapseAdvance); }

function theLayerHasFinishedLoading(layerSource) {
	var thisLayerId = getLayerIdentifier(layerSource);

	var allVisibleLayersHaveFinishedLoading = true;
	$.each(
		tlv.layers,
		function(i, x) {
			var id = getLayerIdentifier(x.mapLayer.getSource());
			if (thisLayerId == id) { x.layerIsLoaded += 1; }

			if (x.layerIsLoaded != 0 && x.mapLayer.getVisible()) { allVisibleLayersHaveFinishedLoading = false; }
		}
	);

	if (allVisibleLayersHaveFinishedLoading) { tlv.loadingSpinner.stop(); }
}

function theLayerHasStartedLoading(layerSource) {
	var thisLayerId = getLayerIdentifier(layerSource);
	$.each(
		tlv.layers,
		function(i, x) {
			var id = getLayerIdentifier(x.mapLayer.getSource());
			if (thisLayerId == id) { x.layerIsLoaded -= 1; }

			if (x.mapLayer.getVisible()) {
				// only start the spinner if it's not already spinning
				if (!tlv.loadingSpinner.el) { tlv.loadingSpinner.spin($("#map")[0]); }
			}
		}
	);
}

function theMapHasMoved() { /* place holder to be overriden by other functions */ }

function updateAcquisitionDate() {
	var acquisitionDate = tlv.layers[tlv.currentLayer].acquisitionDate;
	if (acquisitionDate) {
		var timeToNextImage = getTimeToAdjacentImage(tlv.currentLayer, "next");
		var timeToPreviousImage = getTimeToAdjacentImage(tlv.currentLayer, "previous");
		$("#acquisitionDateDiv").html(
			(timeToPreviousImage ? timeToPreviousImage + " <- " : "") +
			acquisitionDate + "z" +
			(timeToNextImage ? " -> " + timeToNextImage : "")
		);
	}
	else { $("#acquisitionDateDiv").html("N/A"); }
}

function updateImageId() {
	var layer = tlv.layers[tlv.currentLayer];
	var libraryLabel = tlv.availableResources.complete[layer.library].label;
	$("#imageIdDiv").html(libraryLabel + ": " + layer.imageId);
}

function updateMapSize() {
	if (tlv.map) {
		var windowHeight = $(window).height();
		var securityClassificationHeaderHeight = $(".security-classification").parent().height();
		var navigationMenuHeight = $("#navigationMenu").parent().height();
		var imageInfoHeight = $("#navigationMenu").parent().next().height();
		var mapHeight = windowHeight - securityClassificationHeaderHeight - navigationMenuHeight - imageInfoHeight;
		$("#map").height(mapHeight);
		tlv.map.updateSize();
	}
}

function updateScreenText() {
	updateImageId();
	updateAcquisitionDate();
	updateTlvLayerCount();
}

function updateTlvLayerCount() {
	var currentCount = tlv.currentLayer + 1;
	$("#tlvLayerCountSpan").html(currentCount + "/" + tlv.layers.length);
}
