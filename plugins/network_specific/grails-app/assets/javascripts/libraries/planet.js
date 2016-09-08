var createImageLayerSourcePlanet = createImageLayerSource;
createImageLayerSource = function(layer) {
	switch (layer.library) {
		case "landsat":
		case "planetLabs":
		case "rapidEye":
			var urls = tlv.availableResources.complete[layer.library].viewUrls.slice(0);
			$.each(
				urls,
				function(i, x) {
					urls[i] += "/" + layer.indexId +
						"/{z}/{x}/{y}.png" +
						"?api_key=" + tlv.planetCredentials.apiKey +
						"&INDENTIFIER=" + Math.floor(Math.random() * 1000000);
				}
			);


			return new ol.source.XYZ({
				crossOrigin: "anonymous",
				urls: urls
			});
		default: return createImageLayerSourcePlanet(layer);
	}
}

var beginSearchPlanet = beginSearch;
beginSearch = function() {
	var libraries = getSelectedLibraries();
	if (libraries.indexOf("landsat") > -1 || libraries.indexOf("planetLabs") > -1 || libraries.indexOf("rapidEye") > -1) {
		if (!tlv.planetCredentials) {
			$("#planetCredentialsDialog").modal("show");
			var loginButton = $("#planetCredentialsDialog .modal-footer").children()[0];
			loginButton.onclick = function() { validatePlanetCredentials(beginSearch); }


			return false;
		}
		else { beginSearchPlanet(); }
	}
	else { beginSearchPlanet(); }
}

function invalidPlanetCredentials() {
	displayErrorDialog("Nope, those weren't the right credentials.");
	$("#planetCredentialsDialog").modal("show");
	tlv.planetCredentials = null;
}

function validatePlanetCredentials(callback) {
	displayLoadingDialog("Hang tight, we'll see if our bouncer will let you in.");

	var password = $("#planetPasswordInput").val();
	var username = $("#planetUsernameInput").val();
	$.ajax({
		data: "email=" + username + "&password=" + password,
		dataType: "json",
		error: function(jqXhr, textStatus, errorThrown) {
			hideLoadingDialog();
			invalidPlanetCredentials();
		},
		success: function(data) {
			hideLoadingDialog();

			var token = data.token;
			var base64 = token.match(/[.](\w+)[.]/);
			if (base64) {
				var decoded_base64 = atob(base64[1]);
				var json = JSON.parse(decoded_base64);
				tlv.planetCredentials = {
					apiKey: json.api_key,
					password: password,
					username: username
				};

				callback();
			}
			else { invalidPlanetCredentials(); }
		},
		type: "POST",
		url: "https://api.planet.com/v0/auth/login"
	});
}
