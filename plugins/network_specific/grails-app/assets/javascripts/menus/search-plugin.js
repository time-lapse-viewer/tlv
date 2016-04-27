var initializeLibraryCheckboxesPlugin = initializeLibraryCheckboxes;
initializeLibraryCheckboxes = function() {
	if (tlv.libraries) { initializeLibraryCheckboxesPlugin(); }
	else {
		var library = tlv.availableResources.libraries[0];
		var libraryCheckbox = $("#searchTabLibrary" + library.capitalize() + "Checkbox");
		libraryCheckbox.trigger("click");
	}
}
