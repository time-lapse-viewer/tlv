package network_specific.omar


import grails.transaction.Transactional


@Transactional
class WmsConversionOmarService {

	def grailsApplication
	def imageProxyService


	def serviceMethod(params) {
		def library = grailsApplication.config.libraries.omar	

		def viewUrl = library.viewUrl + "?"
		// best default image values
		params.BANDS = "default"
		params.BRIGHTNESS = 0
		params.CONTRAST = 1
		params.INTERPOLATION = "bilinear"
		params.SHARPEN_MODE = "none"
		params.STRETCH_MODE = "linear_auto_min_max"
		params.STRECTH_MODE_REGION = "viewport"

		params.each() { viewUrl += "${it}&" }

		def imageBytes = imageProxyService.serviceMethod([url: viewUrl])


		return imageBytes
	}
}
