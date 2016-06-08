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
		def results = [
			layers: [],
			location: params.location.collect({ it as Double })
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
}
