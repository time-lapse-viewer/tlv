function changeBaseLayer(layerName) {
	$.each(tlv.baseLayers, function(i, x) { x.setVisible(false); });
	if (tlv.baseLayers[layerName]) {
		tlv.baseLayers[layerName].setVisible(true);
	}
}

var addBaseLayersToTheMapPlugin = addBaseLayersToTheMap;
addBaseLayersToTheMap = function() {
	addBaseLayersToTheMapPlugin();

	tlv.baseLayers.openStreetMap = new ol.layer.Tile({
		source: new ol.source.OSM({ /* take away the default attributions button */ attributions: [] }),
		visible: false
	});

	var bingMapsKey = "DhP2StHGLfc9t3NOjOlN~f8DtDayAYJnhZTchKJt4MQ~Atf9K5qheUlh1o4rJkTVrzKKDmKsL_jue9ZBN6imZnK_00taby3mtvt2_RNdq2tO";
	$.each(
		{
			bingMapsAerial: "Aerial",
			bingMapsAerialWithLabels: "AerialWithLabels",
			bingMapsRoad: "Road"
		},
		function(i, x) {
			tlv.baseLayers[i] = new ol.layer.Tile({
				source: new ol.source.BingMaps({
					imagerySet: x,
					key: bingMapsKey
				}),
				visible: false
			});
		}
	);

	$.each(tlv.baseLayers, function(i, x) { tlv.map.addLayer(x); });

	if (tlv.baseLayer) { changeBaseLayer(tlv.baseLayer); }
}
