package network_specific.digital_globe


import grails.transaction.Transactional


@Transactional
class WmsConversionDigitalGlobeService {

	def grailsApplication
	def imageProxyService


	def serviceMethod(params) {
		def library = grailsApplication.config.libraries.digitalGlobe

		def viewUrl = library.viewUrl + "?"
		params.CONNECTID = library.connectId
		params.COVERAGE_CQL_FILTER = "featureId='${params.LAYERS}'"
		params.LAYERS = "DigitalGlobe:Imagery"

		params.each() { viewUrl += "${it}&" }
println "Start DG Download: ${new Date()}"
		def imageBytes = imageProxyService.serviceMethod([
			password: library.password,
			url: viewUrl,
			username: library.username
		])
println "End DG Download: ${new Date()}"

		return imageBytes
	}
}
