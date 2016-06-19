package network_specific


import grails.transaction.Transactional


@Transactional
class XyzConversionService {

	def grailsApplication
	def xyzConversionLandsatService
	def xyzConversionPlanetLabsService
	def xyzConversionRapidEyeService


	def serviceMethod(params) {
		def library = params.LIBRARY ?: params.library


		switch (library) {
			case "landsat":
				return xyzConversionLandsatService.serviceMethod(params)
				break
			case "planetLabs":
				return xyzConversionPlanetLabsService.serviceMethod(params)
				break
			case "rapidEye":
				return xyzConversionRapidEyeService.serviceMethod(params)
				break
		}
	}
}
