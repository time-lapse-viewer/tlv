function addSwipeListenerToMap() {
	var firstLayer, secondLayer = null;
	if (!firstLayer) { firstLayer = tlv.currentLayer; }
	if (!secondLayer) { secondLayer = tlv.currentLayer >= tlv.layers.length - 1 ? 0 : tlv.currentLayer + 1; }

	tlv.layers[firstLayer].mapLayer.setVisible(true);
	tlv.layers[secondLayer].mapLayer.setVisible(true);

	tlv.swipeLayers = [firstLayer, secondLayer].sort();
	tlv.layers[tlv.swipeLayers[0]].mapLayer.on("precompose", precomposeSwipe);
	tlv.layers[tlv.swipeLayers[0]].mapLayer.on("postcompose", postcomposeSwipe);
}

var changeFrameView = changeFrame;
	changeFrame = function(params) {
	if ($("#swipeButton").html() == "ON") {
		turnOffSwipe();
		changeFrameView(params);
		turnOnSwipe();
	}
	else { changeFrameView(params); }
}

var createMapControlsView = createMapControls;
createMapControls = function() {
	createMapControlsView();
	tlv.mapControls.push(createSliderControl());
}

function createSliderControl() {
	var sliderInput = document.createElement("input");
	sliderInput.id = "swipeSliderInput";
	sliderInput.style = "width: 100%";
	sliderInput.type = "text";

	sliderInput.setAttribute("data-slider-id", "swipeSlider");


	return new ol.control.Control({ element: sliderInput });
}

function initializeSwipeSlider() {
	var swipeSlider = $("#swipeSliderInput");
	swipeSlider.slider({
		max: 100,
		min: 0,
		tooltip: "hide",
		value: 50
	});
	swipeSlider.on("slide", function() { tlv.map.render(); });

	$("#swipeSlider").hide();
}

var precomposeSwipe = function(event) {
	var context = event.context;
	var width = context.canvas.width * $("#swipeSliderInput").slider("getValue") / 100;

	context.save();
	context.beginPath();
	context.rect(width, 0, context.canvas.width - width, context.canvas.height);
	context.clip();
}

var postcomposeSwipe = function(event) { event.context.restore(); }

function removeSwipeListenerFromMap() {
	$.each(
		tlv.layers,
		function(i, x) {
			x.mapLayer.un("precompose", precomposeSwipe);
			x.mapLayer.un("postcompose", postcomposeSwipe);
			x.mapLayer.setVisible(false);
		}
	);

	tlv.layers[tlv.currentLayer].mapLayer.setVisible(true);
}

function swipeToggleButtonClick(desiredState) {
	var button = $("#swipeButton");
	toggleButton(button, desiredState);

	if (button.html() == "ON") { turnOnSwipe(); }
	else { turnOffSwipe(); }
}

var setupMapView = setupMap;
setupMap = function() {
	setupMapView();
	initializeSwipeSlider();
}

function turnOffSwipe() {
	$("#swipeSlider").hide();
	removeSwipeListenerFromMap();
	//tlv.map.render();
}

function turnOnSwipe() {
	$("#swipeSlider").show();
	addSwipeListenerToMap();
	//tlv.map.render();
}
