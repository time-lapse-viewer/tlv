package network_specific


import grails.transaction.Transactional


@Transactional
class XyzConversionService {

	def grailsApplication


	def serviceMethod(params) {
		def library = params.LIBRARY		

		def viewUrls = grailsApplication.config.libraries[library].viewUrls
		def viewUrl = viewUrls[new Random().nextInt(viewUrls.size())]

		if (library == "planetLabs") { viewUrl += "/${params.LAYERS}/${params.Z}/${params.X}/${params.Y}.png" }


		return viewUrl
	}
}
