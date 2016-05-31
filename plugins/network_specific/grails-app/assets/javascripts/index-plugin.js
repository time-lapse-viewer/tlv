var convertGeospatialCoordinateFormatPlugin = convertGeospatialCoordinateFormat;
convertGeospatialCoordinateFormat = function(inputString, callbackFunction) {
	var location = convertGeospatialCoordinateFormatPlugin(inputString);
	if (!location) {
		displayLoadingDialog("We're checking our maps for that location... BRB!");

		$.ajax({
			data: "location=" + inputString,
			dataType: "json",
			error: function(jqXhr, textStatus, errorThrown) {
				hideLoadingDialog();
				console.dir(jqXhr);
				console.dir(textStatus);
				console.dir(errorThrown);
			},
			success: function(data) {
				hideLoadingDialog();
				if (data.error) { displayErrorDialog(data.error); }
				else {
					var point = [data.longitude, data.latitude];
					callbackFunction(point);
				}
			},
			url: tlv.contextPath + "/coordinateConversion"
		});
	}
}
