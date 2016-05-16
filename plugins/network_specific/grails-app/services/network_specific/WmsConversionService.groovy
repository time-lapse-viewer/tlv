package network_specific


import grails.transaction.Transactional


@Transactional
class WmsConversionService {

	def grailsApplication
	def wmsConversionDigitalGlobeService
	def wmsConversionOmarService


	def serviceMethod(params) {
		params.remove("action")
		params.remove("controller")
		params.remove("format")


		def library = params.LIBRARY
		// remove params that are not used by any WMS schema
		params.remove("LIBRARY")
		params.remove("IMAGE_ID")


		switch (library) {
			case "digitalGlobe":
				return wmsConversionDigitalGlobeService.serviceMethod(params)
				break
			case "omar": 
				return wmsConversionOmarService.serviceMethod(params)
				break
		}		
	}
}
