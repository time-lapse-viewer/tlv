package network_specific


import grails.transaction.Transactional


@Transactional
class SearchLibraryService {

	def coordinateConversionService
	def grailsApplication
	def httpDownloadService
	def mathConversionService
	def searchDigitalGlobeService
	def searchPlanetLabsService
	def searchOmarService


	def serviceMethod(params) {
		def location = coordinateConversionService.serviceMethod(params.location)
		if (!location.error) {
			params.location = [location.longitude, location.latitude]

			def results = [
				layers: [],
				location: [location.longitude, location.latitude]
			]

			params.libraries.each() { 
				if (it == "digitalGlobe") { results.layers += searchDigitalGlobeService.searchLibrary(params) }
				else if (it == "omar") { results.layers += searchOmarService.searchLibrary(params) }
				else if (it == "planetLabs") { results.layers += searchPlanetLabsService.searchLibrary(params) }
			}


			if (results.layers.size() > params.maxResults) {
				def howManyToDrop = results.layers.size() - params.maxResults
				results.layers = results.layers.reverse().drop(howManyToDrop).reverse()
			}

			results.layers.sort({ it.acquisitionDate })


			return results
		}
		else { return location }
	}	
}
