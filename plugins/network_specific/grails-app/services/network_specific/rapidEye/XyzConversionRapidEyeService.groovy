package network_specific.landsat


import grails.transaction.Transactional


@Transactional
class XyzConversionRapidEyeService {

	def grailsApplication
	def imageProxyService


	def serviceMethod(params) {
		def library = grailsApplication.config.libraries.rapidEye

		def viewUrls = library.viewUrls
		def viewUrl = viewUrls[new Random().nextInt(viewUrls.size())]
		viewUrl += "/${params.LAYERS ?: params.layers}/${params.Z ?: params.z}/${params.X ?: params.x}/${params.Y ?: params.y}.png"

		def imageBytes = imageProxyService.serviceMethod([
			password: library.password,
			url: viewUrl,
			username: library.username
		])


		return imageBytes
	}
}
