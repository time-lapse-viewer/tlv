package time_lapse


class WmsController {

	def wmsConversionService


	def index() {
		//logService.recordChipRequest(params, request)
		def imageBytes = wmsConversionService.serviceMethod(params)


		response.contentType = "image/png"
		response.outputStream << imageBytes
		response.outputStream.flush()
		response.outputStream.close()
	}
}
