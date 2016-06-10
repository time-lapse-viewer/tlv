function initializeLoadingSpinner() {
	var options = {
		  className: "spinner"	// The CSS class to assign to the spinner
		, color: "#fff" 	// #rgb or #rrggbb or array of colors
		, corners: 1 		// Corner roundness (0..1)
		, direction: 1 		// 1: clockwise, -1: counterclockwise
		, fps: 20 		// Frames per second when using setTimeout() as a fallback for CSS
		, hwaccel: false 	// Whether to use hardware acceleration
		, left: "50%" 		// Left position relative to parent
		, length: 28 		// The length of each line
		, lines: 13 		// The number of lines to draw
		, opacity: 0	 	// Opacity of the lines
		, position: "absolute"	// Element positioning
		, radius: 42 		// The radius of the inner circle
		, rotate: 0 		// The rotation offset
		, scale: 0.25 		// Scales overall size of the spinner
		, shadow: true 		// Whether to render a shadow
		, speed: 0.5 		// Rounds per second
		, top: '50%' 		// Top position relative to parent
		, trail: 100 		// Afterglow percentage
		, width: 14 		// The line thickness
		, zIndex: 2e9 		// The z-index (defaults to 2000000000)
	};

	tlv.loadingSpinner = new Spinner(options);
}

function pageLoad() {
	initializeLoadingDialog();

	disableMenuButtons();

	enableKeyboardShortcuts();

	initializeLoadingSpinner();
}

$(document).ready(function() { pageLoad(); });
