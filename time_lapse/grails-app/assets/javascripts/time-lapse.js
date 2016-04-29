function addLayersToTheMap() {
	$.each(
		tlv.layers,
		function(i, x) {
			var params = {
				BANDS: x.bands || "2,1,0",
				BRIGHTNESS: x.brightness || 0,
				CONTRAST: x.contrast || 0,
				DRA: x.dra || "auto",
				DRA_AREA: x.draArea || "viewport",
				DRA_SIGMA: x.draSigma || 1,
				FORMAT: x.keepVisible ? "image/png" : "image/jpeg",
				IDENTIFIER: new Date().getTime(),
				IMAGE_ID: x.imageId,
				INTEPOLATION: x.interpolation || "bilinear",
				KEEP_VISIBLE: x.keepVisible || false,
				LAYERS: x.indexId,
				LIBRARY: x.library,
				OFFSET_LAT: x.offsetLat || 0,
				OFFSET_LON: x.offsetLon || 0,
				OPACITY: x.opacity || 1,
				ROTATE: x.rotate || 0,
				SHARPNESS: x.sharpness || 0,
				TRANSPARENT: x.keepVisible || false,
				VERSION: "1.1.1"
			};

			var image = new ol.layer.Image({
				opacity: x.opacity || 1,
				source: new ol.source.ImageWMS({
					params: params,
					ratio: 1,
					url: tlv.contextPath + "/wms"
				}),
				visible: i == 0 ? true : false
			});

			image.getSource().on("imageloadstart", function(event) { theLayerHasStartedLoading(this); });
			image.getSource().on("imageloadend", function(event) { theLayerHasFinishedLoading(this); });;

			x.mapLayer = image;
			x.layerIsLoaded = 0;
			
			tlv.map.addLayer(x.mapLayer);
		}
	);

	tlv.map.getLayers().getArray().reverse();
}

function buildSummaryTable() {
	var table = $("#timeLapseSummaryTable")[0];
	
	for (var i = table.rows.length - 1; i >= 0; i--) { table.deleteRow(i); }

	var row = table.insertRow(0);
	var cell = row.insertCell(row.cells.length);
	row.insertCell(row.cells.length);
	$.each(
		tlv.layers[0].metadata,
		function(key, value) {
			var cell = row.insertCell(row.cells.length);
			$(cell).append(key.capitalize().replace(/([A-Z])/g, " $1"));
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

			$.each(
				x.metadata,
				function(key, value) {
					cell = row.insertCell(row.cells.length);
					$(cell).append(value);
				}
			);
		}
	);
}

function calculateInitialViewBbox() {        
	var bbox = convertRadiusToBbox(tlv.location[0], tlv.location[1], 1000); 


	return [bbox.minLon, bbox.minLat, bbox.maxLon, bbox.maxLat];
}

function changeFrame(param) {
	var mapLayer = tlv.layers[tlv.currentLayer].mapLayer;
	mapLayer.setVisible(mapLayer.getSource().getParams().KEEP_VISIBLE);

	if (param === "fastForward") { tlv.currentLayer = getNextFrameIndex(); }
	else if (param === "rewind") { tlv.currentLayer = getPreviousFrameIndex(); }
	else if (typeof param === "number") { tlv.currentLayer = param; }

	tlv.layers[tlv.currentLayer].mapLayer.setVisible(true);

	tlv.map.renderSync();

	if (tlv.layers[tlv.currentLayer].layerIsLoaded == 0) { tlv.loadingSpinner.stop(); }
	else { tlv.loadingSpinner.spin($("#map")[0]); }

	updateScreenText();
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

function createTmsMaps() {
	$.each(
		tlv.layers,
		function(i, x)  {
			if (!x.tmsMap) {
				var tmsMap = document.createElement("div");
				tmsMap.id = "tmsMap" + i;
				$("#map").parent().prepend(tmsMap);
				//x.tmsMap = new ol.layer.Image({
				//	source: new ol.source.
				//});
			}
		}
	);
}

function deleteFrame() {
	changeFrame("rewind");

	var nextFrameIndex = getNextFrameIndex();
	var spliceIndex = nextFrameIndex == 0 ? 0 : nextFrameIndex;
	tlv.layers.splice(spliceIndex, 1);
	if (tlv.currentLayer > tlv.layers.length - 1) { tlv.currentLayer = tlv.layers.length - 1; } 

	changeFrame("fastForward");
}

function disableMapRotation() {
	tlv.map.removeInteraction(tlv.mapInteractions.dragRotate);
	tlv.map.addInteraction(tlv.mapInteractions.dragPan);
}

function enableDisableMapRotation(button) {
	var text = button.innerHTML;
	if (text.contains("Enable")) {
		enableMapRotation();
		text = text.replace("Enable", "Disable");
	}
	else {
		disableMapRotation();
		text = text.replace("Disable", "Enable");
	}
	button.innerHTML = text;
}

function enableMapRotation() {
	tlv.map.removeInteraction(tlv.mapInteractions.dragPan);
	tlv.map.addInteraction(tlv.mapInteractions.dragRotate);
}

function geoJump() {
	var location = $("#geoJumpLocationInput").val();
	var point = convertGeospatialCoordinateFormat(location);
	tlv.map.getView().setCenter(point); 
}

function getNextFrameIndex() { return tlv.currentLayer >= tlv.layers.length - 1 ? 0 : tlv.currentLayer + 1; }

function getPreviousFrameIndex() { return tlv.currentLayer <= 0 ? tlv.layers.length - 1 : tlv.currentLayer - 1; }

function getTimeToAdjacentImage(layerIndex, adjacency) {
	var layerIndex2 = null;
	if (adjacency == "previous" && layerIndex > 0) { layerIndex2 = layerIndex - 1; }
	else if (adjacency == "next" && layerIndex < tlv.layers.length - 1) { layerIndex2 = layerIndex + 1; }

	if (typeof layerIndex2 == "number") { 
		var date1 = tlv.layers[layerIndex].metadata.acquisitionDate ? new Date(Date.parse(tlv.layers[layerIndex].metadata.acquisitionDate)) : null;
		var date2 = tlv.layers[layerIndex2].metadata.acquisitionDate ? new Date(Date.parse(tlv.layers[layerIndex2].metadata.acquisitionDate)) : null;

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
	//setupMap();
	
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

function setupBaseLayers() { tlv.baseLayers = {}; }

function setupMap() {
	// if a map already exists, reset it and start from scratch
	if (tlv.map) { tlv.map.setTarget(null); }

	tlv.map = new ol.Map({
		controls: ol.control.defaults().extend([
			createMousePositionControl(),
			new ol.control.FullScreen()
		]),
		interactions: ol.interaction.defaults({
			altShiftDragRotate: false,
			dragPan: false
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
}

function setupTimeLapse() {
	setupMap();

	// setup interactions so rotation can be controlled independently
	tlv.mapInteractions = {
		altDragRotate: new ol.interaction.DragRotate({ condition: ol.events.condition.altKeyOnly }),
		dragPan: new ol.interaction.DragPan({ condition: ol.events.condition.noModifierKeys }),
		dragRotate: new ol.interaction.DragRotate({ condition: ol.events.condition.always })
	};
	tlv.map.addInteraction(tlv.mapInteractions.altDragRotate);
	tlv.map.addInteraction(tlv.mapInteractions.dragPan);

	tlv.layerZIndex = 0;
	setupBaseLayers();

	if (tlv.reverseChronological == "true") { tlv.layers.reverse(); }
	addLayersToTheMap();

	tlv.map.getView().fit(tlv.bbox, tlv.map.getSize());

	// register map listeners
	tlv.map.on("moveend", theMapHasMoved);

	tlv.currentLayer = 0;

	enableMenuButtons();

	updateScreenText();
}

function stopTimeLapse() { clearTimeout(tlv.timeLapseAdvance); }

function switchToOrthoMode() {
	tlv.viewMode = "ortho";
}

function switchToRawMode() {
	tlv.viewMode = "raw";

	createTmsMaps();
}

function switchToUpMode() {
	tlv.viewMode = "up";

	createTmsMaps();
}

function theLayerHasFinishedLoading(layerSource) {
	var currentLayerId = tlv.layers[tlv.currentLayer].mapLayer.getSource().getParams().IDENTIFIER;
	var thisLayerId = layerSource.getParams().IDENTIFIER;
	$.each(
		tlv.layers, 
		function(i, x) { 
			var id = x.mapLayer.getSource().getParams().IDENTIFIER;
			if (thisLayerId == id) { 
				x.layerIsLoaded += 1; 
				if (thisLayerId == currentLayerId && x.layerIsLoaded == 0) { tlv.loadingSpinner.stop(); }

				return false;
			}
		}
	);
}

function theLayerHasStartedLoading(layerSource) { 
	var currentLayerId = tlv.layers[tlv.currentLayer].mapLayer.getSource().getParams().IDENTIFIER;
	var thisLayerId = layerSource.getParams().IDENTIFIER;
	$.each(
		tlv.layers,
		function(i, x) {
			var id = x.mapLayer.getSource().getParams().IDENTIFIER;
			if (thisLayerId == id) { 
				x.layerIsLoaded -= 1; 
				if (thisLayerId == currentLayerId && x.layerIsLoaded < 0) {
					var target = $("#map")[0];
					tlv.loadingSpinner.spin(target);
				}


				return false;
			}		
		}
	);
}

function theMapHasMoved() { /* place holder to be overriden by other functions */ }

function updateAcquisitionDate() { 
	var acquisitionDate = tlv.layers[tlv.currentLayer].metadata.acquisitionDate;
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

function updateImageId() { $("#imageIdDiv").html(tlv.layers[tlv.currentLayer].imageId); }

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