package network_specific


import grails.transaction.Transactional


@Transactional
class WmsConversionService {

	def grailsApplication
	def wmsConversionDigitalGlobeService
	def wmsConversionO2Service
	def wmsConversionOmarService


	def serviceMethod(params) {
		params.remove("action")
		params.remove("controller")
		if (params.FORMAT) { params.remove("format") }
		else if (!params.format) { params.format = "image/png" }


		def library = params.LIBRARY ?: params.library
		// remove params that are not used by any WMS schema
		params.remove("LIBRARY"); params.remove("library")
		params.remove("IMAGE_ID"); params.remove("image_id")

		switch (library) {
			case "digitalGlobe":
				return wmsConversionDigitalGlobeService.serviceMethod(params)
				break
			case "o2":
				return wmsConversionO2Service.serviceMethod(params)
				break
			case "omar": 
				return wmsConversionOmarService.serviceMethod(params)
				break
		}
	}
}
