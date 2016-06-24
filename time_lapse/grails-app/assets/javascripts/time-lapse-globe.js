CESIUM_BASE_URL = "/assets/cesium";

function changeFrameGlobe(param) {
	var layer = tlv.layers[tlv.currentLayer];
	layer.globeLayer.show = layer.keepVisible;

	if (param === "fastForward") { tlv.currentLayer = getNextFrameIndex(); }
	else if (param === "rewind") { tlv.currentLayer = getPreviousFrameIndex(); }
	else if (typeof param === "number") { tlv.currentLayer = param; }

	tlv.layers[tlv.currentLayer].globeLayer.show = true;
}

function checkWebGlCompatability() {
	if (!window.WebGLRenderingContext) { displayErrorDialog("Your browser doesn't know what WebGL is. :("); }
	else {
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("webgl");
		if (!context) { displayErrorDialog("Your browser supports WebGL but the initialization failed. :("); }
		else { return true; }
	}
}

function setupGlobe() {
	tlv.globe = new olcs.OLCesium({
		map: tlv.map,
		sceneOptions: {
    		contextOptions: {
      			webgl: { preserveDrawingBuffer: true }
    		}
  		}
	});
	// only render the globe when necessary
	tlv.globe.enableAutoRenderLoop();

	var globe = tlv.globe.getCesiumScene().globe;
	// make the globe background color the same as the body background
	globe.baseColor = new Cesium.Color(0.153, 0.169, 0.188, 1);
	// add a tile loading function to tell when the glove had finished loading
	globe.tileLoadProgressEvent.addEventListener(
		function(event) {
			if (event == 0) { hideLoadingSpinner(); }
			else { displayLoadingSpinner(); }
		}
	);

	if (tlv.dimensions == "3") {
		$("#dimensionsSelect").val(3);
		addDimension();
	}
}

var setupTimeLapseGlobe = setupTimeLapse;
setupTimeLapse = function() {
	setupTimeLapseGlobe();

	setupGlobe();
}
