package time_lapse


class XyzController {

	def logsService
	def xyzConversionService


	def index() {
		logsService.recordXyzRequest(params, request)
		def imageBytes = xyzConversionService.serviceMethod(params)


		response.contentType = "image/png"
		response.outputStream << imageBytes
		response.outputStream.flush()
		response.outputStream.close()
	}
}
