function pageLoad() {
	initializeLoadingDialog();

	disableMenuButtons();

	enableKeyboardShortcuts();
}

$(document).ready(function() { pageLoad(); });
