function beginSearch() {
	displayLoadingDialog("We are searching the libraries for imagery... fingers crossed!");

	var searchParams = getSearchParams();
	if (searchParams) {
		$.ajax({
			data: "searchParams=" + JSON.stringify(searchParams),
			dataType: "json",
			error: function(jqXhr, textStatus, errorThrown) { 
				hideLoadingDialog();
				searchError();
				console.dir(jqXhr);
				console.dir(textStatus);
				console.dir(errorThrown);
			},
			success: function(data) {
				hideLoadingDialog();
				$.each(data, function(i, x) { tlv[i] = x; });

				tlv.bbox = calculateInitialViewBbox();
				setupTimeLapse(); 
			},
			url: tlv.contextPath + "/search/searchLibrary"
		});	
	}
	else { hideLoadingDialog(); }
}

function bookmarkSearchParams() {
	var url = location.origin + tlv.contextPath + "?";

	var searchParams = getSearchParams();	
	if (searchParams) {
		var bookmarkParams = [];
		$.each(
			searchParams,
			function(i, x) {
				if (Array.isArray(x)) { bookmarkParams.push(i + "=" + x.join()); }
				else { bookmarkParams.push(i + "=" + x); }
			}
		);
		url += bookmarkParams.join("&");

		$("#searchBookmarkHref").attr("href", url);
		$("#searchBookmarkDialog").modal("show");
	}
}

function disableAllSensorCheckboxes() {
	$.each(
		tlv.availableResources.sensors,
		function(i, x) {
			var checkbox = $("#searchSensor" + x.name.capitalize() + "Checkbox");
			if (checkbox.is(":checked")) { checkbox.trigger("click"); } 
			
			var label = $("#searchSensor" + x.name.capitalize() + "Label");
			label.attr("disabled", true);
			label.fadeTo("fast", 0.5);
		}
	);
}

function disableSensorCheckbox(sensorName) {
	var checkbox = $("#searchSensor" + sensorName.capitalize() + "Checkbox");
	if (checkbox.is(":checked")) { checkbox.trigger("click"); }

	var label = $("#searchSensor" + sensorName.capitalize() + "Label");
	label.attr("disabled", true);
	label.fadeTo("fast", 0.5);
}

function disableAllTailoredGeointCheckboxes() {
	$.each(
		tlv.availableResources.tailoredGeoint,
		function(i, x) {
			var checkbox = $("#searchTailoredGeoint" + x.name.capitalize() + "Checkbox");
			if (checkbox.is(":checked")) { checkbox.trigger("click"); }

			var label = $("#searchTailoredGeoint" + x.name.capitalize() + "Label");
			label.attr("disabled", true);
			label.fadeTo("fast", 0.5);
		}
	);
}

function disableTailoredGeointCheckbox(tailoredGeointName) {
	var checkbox = $("#searchTailoredGeoint" + tailoredGeointName.capitalize() + "Checkbox");
	if (checkbox.is(":checked")) { checkbox.trigger("click"); }

	var label = $("#searchTailoredGeoint" + tailoredGeointName.capitalize() + "Label");
	label.attr("disabled", true);
	label.fadeTo("fast", 0.5);
}

function enableSensorCheckbox(sensorName) {
	var label = $("#searchSensor" + sensorName.capitalize() + "Label");
	label.attr("disabled", false);
	label.fadeTo("fast", 1);
}

function enableTailoredGeointCheckbox(tailoredGeointName) {
        var label = $("#searchTailoredGeoint" + tailoredGeointName.capitalize() + "Label");
        label.attr("disabled", false);
        label.fadeTo("fast", 1);
}

function getDate(date) {
	var year = date.getFullYear();

	var month = date.getMonth() + 1; 
	month = month < 10 ? "0" + month : month;

	var day = date.getDate();
	day = day < 10 ? "0" + day : day;

	var hour = date.getHours();
	hour = hour < 10 ? "0" + hour : hour;

	var minute = date.getMinutes();
	minute = minute < 10 ? "0" + minute : minute;

	var second = date.getSeconds();
	second = second < 10 ? "0" + second : second;


	return { day: day, hour: hour, minute: minute, month: month, second: second, year: year };
}

function getEndDate() {
	var date = $("#searchEndDateTimePicker").data("DateTimePicker").date().toDate();


	return getDate(date);
}

function getSearchParams() {
	var searchObject = {};

	var endDate = getEndDate();
	searchObject.endYear = endDate.year;
	searchObject.endMonth = endDate.month;
	searchObject.endDay = endDate.day;
	searchObject.endHour = endDate.hour;
	searchObject.endMinute = endDate.minute;
	searchObject.endSecond = endDate.second;

	var libraries = getSelectedLibraries();
	if (libraries.length == 0) { 
		alert("Please select a library, thanks."); 
		$("#searchDialog").modal("show");
		return; 
	}
	searchObject.libraries = libraries;

	var locationString = $("#searchLocationInput").val();
	if (locationString == "") { locationString = tlv.defaultLocation; }
	var location = convertGeospatialCoordinateFormat(locationString);
	if (!location) { return false; }
	else { searchObject.location = location; }

	var maxCloudCover = $("#searchMaxCloudCoverInput").val();
	searchObject.maxCloudCover = maxCloudCover;

	var maxResults = $("#searchMaxResultsSelect").val();
	searchObject.maxResults = parseInt(maxResults);

	var minNiirs = $("#searchMinNiirsInput").val();
	searchObject.minNiirs = parseFloat(minNiirs);

	var sensors = getSelectedSensors();
	if (sensors.length == 0) { 
		alert("Please select a sensor, thanks."); 
		$("#searchDialog").modal("show");
		return; 
	}
	searchObject.sensors = sensors;

	var startDate = getStartDate();
	searchObject.startYear = startDate.year;
	searchObject.startMonth = startDate.month;
	searchObject.startDay = startDate.day;
	searchObject.startHour = startDate.hour;	
	searchObject.startMinute = startDate.minute;
	searchObject.startSecond = startDate.second;

	var tailoredGeoint = getSelectedTailoredGeoint();
	searchObject.tailoredGeoint = tailoredGeoint;

	
	return searchObject;
}

function getSelectedLibraries() {
	var libraries = [];
	$.each(
		tlv.availableResources.libraries,
		function(i, x) {
			var checkbox = $("#searchLibrary" + x.capitalize() + "Checkbox");
			if (checkbox.is(":checked")) { libraries.push(x); }
		}
	);


	return libraries;
}

function getSelectedSensors() {
	var sensors = [];
	if ($("#searchSensorAllCheckbox").is(":checked")) { sensors.push("all"); }
	else { 
		$.each(
			tlv.availableResources.sensors,
			function(i, x) {
				var checkbox = $("#searchSensor" + x.name.capitalize() + "Checkbox");
				if (checkbox.is(":checked")) { sensors.push(x.name); }
			}
		);
	}


	return sensors;
}

function getSelectedTailoredGeoint() {
	var tailoredGeoint = [];
	if ($("#searchTailoredGeointAllCheckbox").is(":checked")) { tailoredGeoint.push("all"); }
	else { 
		$.each(
			tlv.availableResources.tailoredGeoint,
			function(i, x) {
				var checkbox = $("#searchTailoredGeoint" + x.name.capitalize() + "Checkbox");
				if (checkbox.is(":checked")) { tailoredGeoint.push(x.name); }
			}
		);
	}


	return tailoredGeoint;
}


function getStartDate() {
	var date = $("#searchStartDateTimePicker").data("DateTimePicker").date().toDate();
        

	return getDate(date);
}

function initializeEndDateTimePicker() {
	var endDateTimePicker = $("#searchEndDateTimePicker");
	endDateTimePicker.datetimepicker({ 
		format: "MM/DD/YYYY HH:mm:ss",
		keyBinds: null
	});

	// default to current date or user defined
	var endDate = new Date();
	if (tlv.endYear) { endDate.setFullYear(tlv.endYear); }
	if (tlv.endMonth) { endDate.setMonth(tlv.endMonth - 1); }
	if (tlv.endDay) { endDate.setDate(tlv.endDay); }
	if (tlv.endHour) { endDate.setHours(tlv.endHour); }
	if (tlv.endMinute) { endDate.setMinutes(tlv.endMinute); }
	if (tlv.endSecond) { endDate.setSeconds(tlv.endSecond); }
	endDateTimePicker.data("DateTimePicker").date(endDate);
}

function initializeLibraryCheckboxes() {
	if (tlv.libraries) {
		$.each(
			tlv.libraries.split(","),
			function(i, x) {
				var checkbox = $("#searchLibrary" + x.capitalize() + "Checkbox");
				checkbox.trigger("click");
			}
		);
	}
}

function initializeLocationInput() {
	if (tlv.location) {
		$("#searchLocationInput").val(tlv.location);
		$("#searchDialog").modal("hide");
		beginSearch();
	}
	else { $("#searchDialog").modal("show"); }
}

function initializeMaxCloudCoverInput() {
	var maxCloudCover = tlv.maxCloudCover ? tlv.maxCloudCover : 100;
	$("#searchMaxCloudCoverInput").val(maxCloudCover);
}

function initializeMaxResultsSelect() {
	var maxResults = tlv.maxResults ? tlv.maxResults : 10;
	$("#searchMaxResultsSelect option[value = '" + maxResults + "']").prop("selected", true);
}

function initializeMinNiirsInput() {
	var minNiirs = tlv.minNiirs ? tlv.minNiirs : 0;
	$("#searchMinNiirsInput").val(minNiirs);
}

function initializeSensorCheckboxes() {
	if (tlv.sensors) {
		$.each(
			tlv.sensors.split(","),
			function(i, x) {
				var checkbox = $("#searchSensor" + x.capitalize() + "Checkbox");
                                checkbox.trigger("click");
			}
		);
	}
	else { 
		$("#searchSensorAllCheckbox").trigger("click"); 
		disableAllSensorCheckboxes();
	}
}

function initializeStartDateTimePicker() {
	var startDateTimePicker = $("#searchStartDateTimePicker");
	startDateTimePicker.datetimepicker({ 
		format: "MM/DD/YYYY HH:mm:ss",
		keyBinds: null
	});

	// default to the beginning of the day 30 days prior to the end date
	var endDate = $("#searchEndDateTimePicker").data("DateTimePicker").date().toDate();
	var startDate = new Date(endDate - 30 * 24 * 60 * 60 * 1000);
	if (tlv.startYear) { startDate.setFullYear(tlv.startYear); }
	if (tlv.startMonth) { startDate.setMonth(tlv.startMonth - 1); }
	if (tlv.startDay) { startDate.setDate(tlv.startDay); }
	startDate.setHours(tlv.startHour ? tlv.startHour : 0);
	startDate.setMinutes(tlv.startMinute ? tlv.startMinute : 0);
	startDate.setSeconds(tlv.startSecond ? tlv.startSecond : 0);
	startDateTimePicker.data("DateTimePicker").date(startDate);
}

function initializeTailoredGeointCheckboxes() {
	// default should be such that no tailored geoint checkbox is selected
	if (tlv.tailoredGeoint) {
		$.each(
			tlv.tailoredGeoint.split(","),
			function(i, x) {
				var checkbox = $("#searchTailoredGeoint" + x.capitalize() + "Checkbox");
				checkbox.trigger("click");
			}
		);
	}
}

function librarySensorCheck() {
	if ($("#searchSensorAllCheckbox").is(":checked")) { disableAllSensorCheckboxes(); }
	else {
		$.each(
			tlv.availableResources.sensors,
			function(i, x) {
				var sensorName = x.name;
				var thisSensorShouldBeEnabled = false;
				$.each(
					tlv.availableResources.complete,
					function(j, y) {
						var libraryCheckbox = $("#searchLibrary" + j.capitalize() + "Checkbox");
						if (libraryCheckbox.is(":checked")) {
							$.each(
								y.sensors,
								function(k, z) {
									if (z.name == sensorName) { thisSensorShouldBeEnabled = true; }
								}
							);
						}
					}
				);
				if (thisSensorShouldBeEnabled) { enableSensorCheckbox(sensorName); }
				else { disableSensorCheckbox(sensorName); }
			}
		);
	}

	if ($("#searchTailoredGeointAllCheckbox").is(":checked")) { disableAllTailoredGeointCheckboxes(); }
	else {
		$.each(
			tlv.availableResources.tailoredGeoint,
			function(i, x) {
				var tailoredGeointName = x.name;
				var thisTailoredGeointShouldBeEnabled = false;
				$.each(
					tlv.availableResources.complete,
					function(j, y) {
						var libraryCheckbox = $("#searchLibrary" + j.capitalize() + "Checkbox");
						if (libraryCheckbox.is(":checked")) {
							$.each(
								y.tailoredGeoint,
								function(k, z) {
									if (z.name == tailoredGeointName) { thisTailoredGeointShouldBeEnabled = true; }
								}
							);
						}
					}
				);
				if (thisTailoredGeointShouldBeEnabled) { enableTailoredGeointCheckbox(tailoredGeointName); }
				else { disableTailoredGeointCheckbox(tailoredGeointName); }
			}
		);
	}
}

var pageLoadSearch = pageLoad;
pageLoad = function() {
	pageLoadSearch();
	setupSearchMenuDialog();
}

function searchError() { alert("Uh oh, something went wrong with your search!"); }

function setupSearchMenuDialog() {
	// start with the end date since the start date's default is based on the end date
	initializeEndDateTimePicker();
	initializeStartDateTimePicker();

	initializeSensorCheckboxes();
	initializeTailoredGeointCheckboxes();
	initializeMinNiirsInput();
	initializeMaxCloudCoverInput();
	initializeMaxResultsSelect();
	initializeLibraryCheckboxes();

	initializeLocationInput();
}
