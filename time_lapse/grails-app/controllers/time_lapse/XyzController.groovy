package time_lapse


import javax.imageio.ImageIO


class XyzController {

	def xyzConversionService


	def index() {
		//logService.recordChipRequest(params, request)
		def bufferedImage = xyzConversionService.serviceMethod(params)

		response.contentType = "image/png"
		ImageIO.write(bufferedImage, "png", response.outputStream)
		response.outputStream.flush()
		response.outputStream.close()
	}
}
