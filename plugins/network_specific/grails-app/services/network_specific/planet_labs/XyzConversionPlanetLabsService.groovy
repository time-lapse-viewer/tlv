package network_specific.planet_labs


import grails.transaction.Transactional


@Transactional
class XyzConversionPlanetLabsService {

	def grailsApplication
	def imageProxyService


	def serviceMethod(params) {
		def library = grailsApplication.config.libraries.planetLabs

		def viewUrls = library.viewUrls
		def viewUrl = viewUrls[new Random().nextInt(viewUrls.size())]
		viewUrl += "/${params.LAYERS}/${params.Z}/${params.X}/${params.Y}.png" 
println "Start PLANET Download: ${new Date()}"
		def imageBytes = imageProxyService.serviceMethod([
			password: library.password,
			url: viewUrl,
			username: library.username
		])
println "End PLANET Download: ${new Date()}"

		return imageBytes
	}
}
