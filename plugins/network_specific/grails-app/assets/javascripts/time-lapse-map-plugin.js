var addLayerToTheMapPlugin = addLayerToTheMap;
addLayerToTheMap = function(layer) {
	switch (layer.library) {
		case "landsat":
		case "planetLabs":
		case "rapidEye":
			var image = new ol.layer.Tile({
				opacity: 0,
				source: new ol.source.XYZ({
					url: tlv.contextPath + "/xyz" +
						"?IDENTIFIER=" + new Date().getTime() +
						"&IMAGE_ID=" + layer.imageId +
						"&LAYERS=" + layer.indexId +
						"&LIBRARY=" + layer.library +
						"&X={x}&Y={y}&Z={z}"
				}),
				visible: true
			});

			image.getSource().on("tileloadstart", function(event) { theLayerHasStartedLoading(this); });
			image.getSource().on("tileloadend", function(event) { theLayerHasFinishedLoading(this); });;

			layer.mapLayer = image;
			layer.layerIsLoaded = 0;

			tlv.map.addLayer(layer.mapLayer);
			break;
		default:
			addLayerToTheMapPlugin(layer);
			break;
	}
}
