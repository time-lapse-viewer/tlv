package network_specific.landsat


import grails.transaction.Transactional


@Transactional
class XyzConversionLandsatService {

	def grailsApplication


	def serviceMethod(params) {
		def library = grailsApplication.config.libraries.landsat

		def viewUrls = library.viewUrls
		def viewUrl = viewUrls[new Random().nextInt(viewUrls.size())]
		viewUrl += "/${params.LAYERS ?: params.layers}/${params.Z ?: params.z}/${params.X ?: params.x}/${params.Y ?: params.y}.png"
		viewUrl += "?api_key=${params.API_KEY}"


		return viewUrl
	}
}
