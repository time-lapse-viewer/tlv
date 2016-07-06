function addBaseLayersToTheMap() { tlv.baseLayers = {}; }

function addLayerToTheMap(layer) {
	var source;
	switch (layer.type) {
		case "wms":
			var params = {
				FORMAT: "image/png",
				IDENTIFIER: Math.floor(Math.random() * 1000000),
				IMAGE_ID: layer.imageId,
				LAYERS: layer.indexId,
				LIBRARY: layer.library,
				TRANSPARENT: true,
				VERSION: "1.1.1"
			};

			source = new ol.source.TileWMS({
				params: params,
				url: tlv.contextPath + "/wms"
			});
			break;
		case "xyz":
			source = new ol.source.XYZ({
				url: tlv.contextPath + "/xyz" +
					"?IDENTIFIER=" + Math.floor(Math.random() * 1000000) +
					"&IMAGE_ID=" + layer.imageId +
					"&LAYERS=" + layer.indexId +
					"&LIBRARY=" + layer.library +
					"&X={x}&Y={y}&Z={z}"
			});
			break;
	}

	source.on("tileloadstart", function(event) { theTileHasStartedLoading(this); });
	source.on("tileloadend", function(event) { theTileHasFinishedLoading(this); });

	layer.mapLayer = new ol.layer.Tile({
		opacity: 0,
		source: source,
		visible: false
	});

	layer.layerLoaded = false;
	layer.tilesLoaded = 0;
	layer.tilesLoading = 0;

	tlv.map.addLayer(layer.mapLayer);
}

function compassRotate(event) {
	if (event.alpha) { tlv.map.getView().rotate(event.alpha * Math.PI / 180); }
	else{ displayErrorDialog("Sorry, we couldn't get a good reading. :("); }
}

function createContextMenuContent(coordinate) {
	coordinate = ol.proj.transform(coordinate, "EPSG:3857", "EPSG:4326");
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

function getLayerIdentifier(source) {
	if (typeof source.getParams == "function") { return source.getParams().IDENTIFIER; }
	// assume an XYZ layer
	else { return source.getUrls()[0]; }
}

function preloadAnotherLayer(index) {
	var layer = tlv.layers[index];
	// if the loayer is already loaded, find a layer that isn't loaded and load that one
	if (layer.layerLoaded) {
		$.each(
			tlv.layers,
			function(i, x) {
				if (!x.layerLoaded) {
					preloadAnotherLayer(i);


					return false;
				}
			}
		);
	}
	else { layer.mapLayer.setVisible(true); }
}

function setupMap() {
	// if a map already exists, reset it and start from scratch
	if (tlv.map) { tlv.map.setTarget(null); }

	createMapControls();
	tlv.map = new ol.Map({
		controls: ol.control.defaults().extend(tlv.mapControls),
		interactions: ol.interaction.defaults({ doubleClickZoom: false }).extend([
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
		target: "map"
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

	tlv.map.on("moveend", theMapHasMoved);

	$(".ol-zoom-in").click(function() { $(this).blur(); });
	$(".ol-zoom-out").click(function() { $(this).blur(); });
}

function syncMapPositionWithGlobe() {
	var position = tlv.globe.camera.positionCartographic;
	var latitude = position.latitude * 180 / Math.PI;
	var longitude = position.longitude * 180 / Math.PI;
	tlv.map.getView().setCenter([longitude, latitude]);
}

function theMapHasMoved(event) {}

function theTileHasFinishedLoading(layerSource) {
	setTimeout(function() {
		var thisLayerId = getLayerIdentifier(layerSource);
		var thisLayer;

		var allVisibleLayersHaveFinishedLoading = true;
		$.each(
			tlv.layers,
			function(i, x) {
				var id = getLayerIdentifier(x.mapLayer.getSource());
				if (thisLayerId == id) {
					thisLayer = x;
					x.tilesLoaded += 1;
					if (x.tilesLoading == x.tilesLoaded) {
						x.layerLoaded = true;
						if (x.mapLayer.getOpacity() == 0) { x.mapLayer.setVisible(false); }
					}
				}
				if (!x.layerLoaded && x.mapLayer.getVisible() && x.mapLayer.getOpacity() != 0) {
					updateTileLoadingProgressBar();
 					allVisibleLayersHaveFinishedLoading = false;
				}
			}
		);

		if (allVisibleLayersHaveFinishedLoading) { updateTileLoadingProgressBar(); }

		if (thisLayer.layerLoaded && allVisibleLayersHaveFinishedLoading) { preloadAnotherLayer(getNextFrameIndex()); }
	}, 100);
}

function theTileHasStartedLoading(layerSource) {
	var thisLayerId = getLayerIdentifier(layerSource);
	$.each(
		tlv.layers,
		function(i, x) {
			var id = getLayerIdentifier(x.mapLayer.getSource());
			if (thisLayerId == id) {
				if (x.layerLoaded) {
					x.layerLoaded = false;
					x.tilesLoaded = 0;
					x.tilesLoading = 0;
				}
				x.tilesLoading += 1;

				if (x.mapLayer.getVisible() && x.mapLayer.getOpacity() != 0) { updateTileLoadingProgressBar(); }
			}
		}
	);
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

function updateTileLoadingProgressBar() {
	var tilesLoaded = tilesLoading = 0;
	$.each(
		tlv.layers,
		function(i, x) {
			if (x.mapLayer.getVisible() && x.mapLayer.getOpacity() != 0) {
				tilesLoaded += x.tilesLoaded;
				tilesLoading += x.tilesLoading;
			}
		}
	);

	var width = (tilesLoaded / tilesLoading * 100).toFixed(1);
	var progressBar = $("#tileLoadProgressBar");
	progressBar.css("width", width + "%");
	if (width < 100) { progressBar.css("visibility", "visible"); }
	else { setTimeout(function() { progressBar.css("visibility", "hidden"); }, 250) }
}
