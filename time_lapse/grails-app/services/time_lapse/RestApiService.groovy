package time_lapse


import grails.transaction.Transactional


@Transactional
class RestApiService {

	def grailsApplication

    
	def serviceMethod(params) {
		params.remove("action")
		params.remove("controller")

		/*
		// check for a saved link
		if (params.tlv?.isNumber()) {
			def identifier = params.tlv
			def linkExport = LinkExport.findByIdentifier(identifier)
			if (linkExport) {
				def json = new JsonSlurper().parseText(linkExport.tlvInfo)
				json.each() { params[it.key] = it.value }
			}
		}

		// if a bbox is provided, convert it an array of doubles
		if (params.bbox) { params.bbox = params.bbox.split(",").collect({ it as Double }) }

		// check for image IDs
		if (params.imageIds) {
			params.layers = []
			params.imageIds.split(",").each() {
				def image = it.split(":")
				def imageId = image[0]
				def library = image[1]

				def layer = searchLibraryService.searchImageId([imageId: imageId, library: library])
				params.layers.push(layer)
			}

			// if nothing is supplied giving a hint at a starting center point, grab the center of the first footprint you can find
			if (!params.bbox && !params.location) {
				def footprint = params.layers.find({ it.metadata.footprint }).metadata.footprint
				if (footprint) {
					def linearRing = new LinearRing(footprint)
					def centroid = linearRing.getCentroid()
					params.location = [centroid.getX(), centroid.getY()]
				}
			}
		}
		*/

		params.availableResources = [:]
		params.availableResources.complete = grailsApplication.config.libraries
		params.availableResources.libraries = grailsApplication.config.libraries.collect({ it.key })
		params.availableResources.sensors = grailsApplication.config.libraries.collect({ it.value.sensors }).flatten().unique({ it.name }).sort({ it.name })
		params.availableResources.tailoredGeoint = grailsApplication.config.libraries.collect({ it.value.tailoredGeoint }).flatten().unique({ it.name }).sort({ it.name })

		params.defaultLocation = grailsApplication.config.defaultLocation


		return params
}

}
