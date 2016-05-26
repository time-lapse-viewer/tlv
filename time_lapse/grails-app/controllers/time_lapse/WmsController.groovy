package time_lapse


class WmsController {

	def logsService
	def wmsConversionService


	def index() {
		logsService.recordWmsRequest(params, request)
		def imageBytes = wmsConversionService.serviceMethod(params)


		response.contentType = "image/png"
		response.outputStream << imageBytes
		response.outputStream.flush()
		response.outputStream.close()
	}
}
