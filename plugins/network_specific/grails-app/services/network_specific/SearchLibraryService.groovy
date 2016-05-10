package network_specific


import grails.transaction.Transactional


@Transactional
class SearchLibraryService {

	def grailsApplication
	def httpDownloadService
	def mathConversionService
	def searchDigitalGlobeService
	def searchPlanetLabsService
	def searchOmarService


	def serviceMethod(params) {
		def resultsMap = [
			layers: [],
			location: params.location.collect({ it as Double })
		]

		params.libraries.each() { 
			if (it == "digitalGlobe") { resultsMap.layers += searchDigitalGlobeService.searchLibrary(params) }
			else if (it == "omar") { resultsMap.layers += searchOmarService.searchLibrary(params) }
			else if (it == "planetLabs") { resultsMap.layers += searchPlanetLabsService.searchLibrary(params) }
		}


		if (resultsMap.layers.size() > params.maxResults) {
			def howManyToDrop = resultsMap.layers.size() - params.maxResults
			resultsMap.layers = resultsMap.layers.reverse().drop(howManyToDrop).reverse()
		}

		resultsMap.layers.sort({ it.acquisitionDate })

		return resultsMap
	}	
}
