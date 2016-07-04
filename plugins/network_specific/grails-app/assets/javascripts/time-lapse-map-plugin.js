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
						"?IDENTIFIER=" + Math.floor(Math.random() * 1000000) +
						"&IMAGE_ID=" + layer.imageId +
						"&LAYERS=" + layer.indexId +
						"&LIBRARY=" + layer.library +
						"&X={x}&Y={y}&Z={z}"
				}),
				visible: false
			});

			image.getSource().on("tileloadstart", function(event) { theLayerHasStartedLoading(this); });
			image.getSource().on("tileloadend", function(event) { theLayerHasFinishedLoading(this); });;

			layer.mapLayer = image;
			layer.layerLoaded = false;
			layer.tileLoading = 0;

			tlv.map.addLayer(layer.mapLayer);
			break;
		default:
			addLayerToTheMapPlugin(layer);
			break;
	}
}
