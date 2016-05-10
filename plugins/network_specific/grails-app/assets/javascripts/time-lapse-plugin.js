var addLayerToTheMapPlugin = addLayerToTheMap;
addLayerToTheMap = function(layer) {
	if (layer.library == "planetLabs") {
		var image = new ol.layer.Tile({
			opacity: layer.opacity || 1,
			source: new ol.source.XYZ({ 
				url: tlv.contextPath + "/xyz" + 
					"?IDENTIFIER=" + new Date().getTime() +
					"&IMAGE_ID=" + layer.imageId +
					"&LAYERS=" + layer.indexId +
					"&LIBRARY=" + layer.library +
					"&X={x}&Y={y}&Z={z}"
			}),
			visible: false
		});

		//image.getSource().on("imageloadstart", function(event) { theLayerHasStartedLoading(this); });
		//image.getSource().on("imageloadend", function(event) { theLayerHasFinishedLoading(this); });;

		layer.mapLayer = image;
		layer.layerIsLoaded = 0;

		tlv.map.addLayer(layer.mapLayer);
	}
	else { addLayerToTheMapPlugin(layer); }
}
