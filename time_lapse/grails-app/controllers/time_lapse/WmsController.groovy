package time_lapse


class WmsController {

	def wmsConversionService


	def index() {
		//logService.recordChipRequest(params, request)
		def imageBytes = wmsConversionService.serviceMethod(params)

println "Begin WMS Response: ${new Date()}"
		response.contentType = "image/png"
		response.outputStream << imageBytes
		response.outputStream.flush()
		response.outputStream.close()
println "End WMS Response: ${new Date()}"
	}
}
