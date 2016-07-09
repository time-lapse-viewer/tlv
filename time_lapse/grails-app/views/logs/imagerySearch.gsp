<!DOCTYPE html>
<html>
	<head>
		<meta content = "logs" name = "layout"/>
		<g:set var = "entityName" value = "${message(code: 'imagerySearch.label', default: 'ImagerySearch')}"/>
		<title><g:message code="default.list.label" args="[entityName]"/></title>
	</head>
	<body>
		<div id ="list-imagerySearch" class = "content scaffold-list" role = "main">
			<h1>
				<g:message code="default.list.label" args="[entityName]"/>
				<button class = "btn btn-primary" onclick = exportLogsTable() title = "Export Table">
					<span class = "glyphicon glyphicon-download-alt"></span>
				</button>
			</h1>

			<div class = "map" id = "map" style = "background-color: black"></div>

			<f:table collection="${imagerySearchList}" />

			<div class="pagination">
				<g:paginate total="${imagerySearchCount ?: 0}" />
			</div>
		</div>

		<g:javascript>
			loadStylesheet();

			function loadStylesheet() {
				var link = document.createElement("link");
				link.href = "/assets/ol-3.15.1.css";
				link.onload = function() { loadJavascript(); }
				link.rel = "stylesheet";
				link.type = "text/css";
				document.getElementsByTagName("head")[0].appendChild(link);
			}

			function loadJavascript() {
				var script = document.createElement('script');
				script.async = true;
				script.onload = function() { setupMap(); }
				script.src = "/assets/ol3-cesium-debug-1.16.js";
				script.type = "text/javascript";

				document.getElementsByTagName('head')[0].appendChild(script);
		}

		function setupMap() {
			var map = new ol.Map({
				layers: [
					new ol.layer.Vector({
						source: new ol.source.Vector({
							url: "/world/world.geojson",
							format: new ol.format.GeoJSON()
						})
					})
				],
				logo: false,
				view: new ol.View({
					center: [0, 0],
					projection: "EPSG:4326"
				}),
				target: "map"
	        });
			map.getView().fit([-180, -90, 180, 90], map.getSize());

			var table = $("body").find("table")[0];
			var locationCell = 0;
			$.each(
				table.rows[0].cells,
				function(i, x) {
						var cell = $(x).children()[0];
						if ($(cell).html().contains("Location")) { locationCell = i; }
				}
			);

			var features = [];
			$.each(
				table.rows,
				function(i, x) {
					if (i != 0) {
						var location = x.cells[locationCell].innerHTML.split(",");
						var longitude = parseFloat(location[0]);
						var latitude = parseFloat(location[1]);
						var point = new ol.geom.Point([longitude, latitude]);
						var feature = new ol.Feature({ geometry: point });
						features.push(feature);
					}
				}
			);
			var heatmap = new ol.layer.Heatmap({
				source: new ol.source.Vector({ features: features })
			});
			map.addLayer(heatmap);
		}
		</g:javascript>
	</body>
</html>
