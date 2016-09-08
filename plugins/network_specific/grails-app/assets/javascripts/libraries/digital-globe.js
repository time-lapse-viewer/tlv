var beginSearchDigitalGlobe = beginSearch;
beginSearch = function() {
	var libraries = getSelectedLibraries();
	if (libraries.indexOf("digitalGlobe") > -1) {
		if (!tlv.digitalGlobeCredentials) {
			$("#digitalGlobeCredentialsDialog").modal("show");
			var loginButton = $("#digitalGlobeCredentialsDialog .modal-footer").children()[0];
			loginButton.onclick = function() { validateDigitalGlobeCredentials(beginSearch); }


			return false;
		}
		else { beginSearchDigitalGlobe(); }
	}
	else { beginSearchDigitalGlobe(); }
}

var createImageLayerSourceDigitalGlobe = createImageLayerSource;
createImageLayerSource = function(layer) {
	if (layer.library == "digitalGlobe") {
			return new ol.source.TileWMS({
				params: {
					CONNECTID: tlv.digitalGlobeCredentials.connectId,
					COVERAGE_CQL_FILTER: "featureId='" + layer.indexId + "'",
					FORMAT: "image/png",
					IDENTIFIER: Math.floor(Math.random() * 1000000),
					IMAGE_ID: layer.imageId,
					LAYERS: "DigitalGlobe:Imagery",
					TRANSPARENT: true,
					VERSION: "1.1.1"
				},
				url: tlv.availableResources.complete.digitalGlobe.viewUrl
			});
	}
	else { return createImageLayerSourceDigitalGlobe(layer); }
}

function invalidDigitalGlobeCredentials() {
	displayErrorDialog("Nope, those weren't the right credentials.");
	$("#digitalGlobeCredentialsDialog").modal("show");
	tlv.digitalGlobeCredentials = null;
}

function validateDigitalGlobeCredentials(callback) {
	displayLoadingDialog("Hang tight, we'll see if our bouncer will let you in.");

	var password = $("#digitalGlobePasswordInput").val();
	var username = $("#digitalGlobeUsernameInput").val();
	$.ajax({
		data: "password=" + encodeURIComponent(password) + "&username=" + encodeURIComponent(username),
		dataType: "json",
		error: function(jqXhr, textStatus, errorThrown) {
			hideLoadingDialog();
			invalidGbdxCredentials();
		},
		success: function(data) {
			hideLoadingDialog();

			if (data.connectId) {
				tlv.digitalGlobeCredentials = {
					connectId: data.connectId,
					password: password,
					username: username
				};

				callback();
			}
			else { invalidDigitalGlobeCredentials(); }
		},
		type: "POST",
		url: tlv.contextPath + "/digitalGlobe/validateCredentials"
	});
}
