package network_specific.o2


import grails.transaction.Transactional


@Transactional
class WmsConversionO2Service {

	def grailsApplication


	def serviceMethod(params) {
		def library = grailsApplication.config.libraries.o2

		def viewUrl = library.viewUrl + "?"
		params.FILTER = "index_id LIKE '${params.LAYERS}'"
		params.LAYERS = "omar:raster_entry"

		// best default image values
		params.BANDS = "default"
		params.BRIGHTNESS = 0
		params.CONTRAST = 1
		params.INTERPOLATION = "bilinear"
		params.SHARPEN_MODE = "none"
		params.STRETCH_MODE = "linear_auto_min_max"
		params.STRECTH_MODE_REGION = "viewport"

		params.each() { viewUrl += "${it}&" }


		return viewUrl
	}
}
