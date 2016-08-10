package network_specific


import grails.transaction.Transactional


@Transactional
class SearchLibraryService {

	def grailsApplication
	def httpDownloadService
	def mathConversionService
	def searchDigitalGlobeService
	def searchLandsatService
	def searchO2Service
	def searchOmarService
	def searchPlanetLabsService
	def searchRapidEyeService


	def serviceMethod(params) {
		def results = [
			layers: [],
			location: params.location.collect({ it as Double })
		]

		params.libraries.each() {
			switch (it) {
				case "digitalGlobe":
 					results.layers += searchDigitalGlobeService.searchLibrary(params)
					break
				case "landsat":
					results.layers += searchLandsatService.searchLibrary(params)
					break
				case "o2":
					results.layers += searchO2Service.searchLibrary(params)	
					break
				case "omar":
					results.layers += searchOmarService.searchLibrary(params)
					break
				case "planetLabs":
					results.layers += searchPlanetLabsService.searchLibrary(params)
					break
				case "rapidEye":
					results.layers += searchRapidEyeService.searchLibrary(params)
					break
			}
		}


		if (results.layers.size() > params.maxResults) {
			def howManyToDrop = results.layers.size() - params.maxResults
			results.layers = results.layers.reverse().drop(howManyToDrop).reverse()
		}

		results.layers.sort({ it.acquisitionDate })


		return results
	}
}
