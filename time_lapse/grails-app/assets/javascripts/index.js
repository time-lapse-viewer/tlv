function convertGeospatialCoordinateFormat(inputString) {
	var ddPattern = /(\-?\d{1,2}[.]?\d*)[\s+|,?]\s*(\-?\d{1,3}[.]?\d*)/;
	var dmsPattern = /(\d{2})[^\d]*(\d{2})[^\d]*(\d{2}[.]?\d*)([n|N|s|S])[^\w]*(\d{3})[^\d]*(\d{2})[^d]*(\d{2}[.]?\d*)([e|E|w|W])/;
	var mgrsPattern = /(\d{1,2})([a-zA-Z])[^\w]*([a-zA-Z])([a-zA-Z])[^\w]*(\d{5})[^\w]*(\d{5})/;

	var coordinateConversion = new CoordinateConversion();

	if (inputString.match(dmsPattern)) {
		var latitude = coordinateConversion.dmsToDd(RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4);
		var longitude = coordinateConversion.dmsToDd(RegExp.$5, RegExp.$6, RegExp.$7, RegExp.$8);


		return [longitude, latitude];
	}
	else if (inputString.match(ddPattern)) {
		var latitude = RegExp.$1;
		var longitude = RegExp.$2;


		return [longitude, latitude];
	}
	else if (inputString.match(mgrsPattern)) {
		var location = coordinateConversion.mgrsToDd(RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4, RegExp.$5, RegExp.$6);


		return convertGeospatialCoordinateFormat(location);
	}
	else { return false; }
}

function convertRadiusToBbox(x, y, radius) {
	/* radius * 1 nautical mile / 1852 meters * 1 minute latitude / 1 nautical mile * 1 deg latitude / 60 minute latitude */
	var deltaLatitude = radius / 1852 / 60;
	var deltaLongitude = radius / 1852 / 60 * Math.cos(Math.abs(y) * Math.PI / 180);


	return { maxLat: y + deltaLatitude, maxLon: x + deltaLongitude, minLat: y - deltaLatitude, minLon: x - deltaLongitude };
}

function disableMenuButtons() {
	var menuButtons = $(".navbar-nav")[0].children;
	for (var i = 1; i < menuButtons.length; i++) { $(menuButtons[i]).hide(); }
}

function displayErrorDialog(message) {
	var messageDiv = $("#errorDialog").children()[1];
	$(messageDiv).html(message);
	$("#errorDialog").show();
}

function displayLoadingDialog(message) {
	$("#loadingDialog").modal("show");
	$("#loadingDialogMessageDiv").html(message);
}

function enableMenuButtons() {
	var menuButtons = $(".navbar-nav")[0].children;
	for (var i = 1; i < menuButtons.length; i++) { $(menuButtons[i]).show(); }
}

function enableKeyboardShortcuts() {
	$(document).on(
		"keydown",
		function(event) {
			// only if a modal is not open
			if (!$(".modal-backdrop").is(":visible")) {
				var keyCode = event.keyCode;

				switch(keyCode) {
					// left arrow key
					case 37: changeFrame("rewind"); break;
					// right arrow key
					case 39: changeFrame("fastForward"); break;
					// delete key
					case 46: deleteFrame(); break;
				}
			}
		}
	);
}

function hideErrorDialog() { $("#errorDialog").hide(); }

function hideLoadingDialog() { $("#loadingDialog").modal("hide"); }

function initializeLoadingDialog() {
	$("#loadingDialog").modal({
		keyboard: false,
		show: false
	});
}

function toggleButton(button, desiredStatus) {
	if (desiredStatus) { button.html(desiredStatus); }
	else { button.html(button.html() == "ON" ? "OFF" : "ON"); }

	if (button.html() == "ON") {
		button.removeClass("btn-danger");
		button.addClass("btn-success");
	}
	else {
		button.removeClass("btn-success");
		button.addClass("btn-danger");
	}
}
