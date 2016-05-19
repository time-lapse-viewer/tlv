package time_lapse


class XyzController {

	def xyzConversionService


	def index() {
		//logService.recordChipRequest(params, request)
		def imageBytes = xyzConversionService.serviceMethod(params)

println "Begin XYZ Response: ${new Date()}"
		response.contentType = "image/png"
		response.outputStream << imageBytes
		response.outputStream.flush()
		response.outputStream.close()
println "Begin XYZ Response: ${new Date()}"
	}
}
