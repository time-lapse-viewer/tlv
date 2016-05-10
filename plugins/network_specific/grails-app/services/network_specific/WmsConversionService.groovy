package network_specific


import grails.transaction.Transactional


@Transactional
class WmsConversionService {

	def grailsApplication


	def serviceMethod(params) {
		params.remove("action")
		params.remove("controller")
		params.remove("format")


		def library = params.LIBRARY
		// remove params that are not used by any WMS schema
		params.remove("LIBRARY")
		params.remove("IMAGE_ID")
	

		def viewUrl = grailsApplication.config.libraries[library].viewUrl + "?"

		if (library == "omar") {
			// best default image values
			params.BANDS = "default"
			params.BRIGHTNESS = 0
			params.CONTRAST = 1
			params.INTERPOLATION = "bilinear"
			params.SHARPEN_MODE = "none"
			params.STRETCH_MODE = "linear_auto_min_max"
			params.STRECTH_MODE_REGION = "viewport" 
		}
		else if (library == "digitalGlobe") { 
			params.CONNECTID = grailsApplication.config.libraries[library].connectId 
			params.COVERAGE_CQL_FILTER = "featureId='${params.LAYERS}'"
			params.LAYERS = "DigitalGlobe:Imagery"
		}
				
		params.each() { viewUrl += "${it}&" }


		return viewUrl
	}
}
