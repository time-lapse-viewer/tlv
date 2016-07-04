var addLayerToTheMapPlugin = addLayerToTheMap;
addLayerToTheMap = function(layer) {
	switch (layer.library) {
		case "landsat":
		case "planetLabs":
		case "rapidEye":
			var mapLayer = new ol.layer.Tile({
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

			mapLayer.getSource().on("tileloadstart", function(event) { theTileHasStartedLoading(this); });
			mapLayer.getSource().on("tileloadend", function(event) { theTileHasFinishedLoading(this); });;

			layer.mapLayer = mapLayer;
			layer.layerLoaded = false;
			layer.tilesLoaded = 0;
			layer.tilesLoading = 0;

			tlv.map.addLayer(layer.mapLayer);
			break;
		default:
			addLayerToTheMapPlugin(layer);
			break;
	}
}
