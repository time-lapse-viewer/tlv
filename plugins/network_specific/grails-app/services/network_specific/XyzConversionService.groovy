package network_specific


import grails.transaction.Transactional


@Transactional
class XyzConversionService {

	def grailsApplication
	def xyzConversionPlanetLabsService


	def serviceMethod(params) {
		def library = params.LIBRARY

		
		switch (library) {
			case "planetLabs": 
				return xyzConversionPlanetLabsService.serviceMethod(params)
				break
		}
	}
}
