package time_lapse


import javax.imageio.ImageIO


class WmsController {

	def wmsConversionService


	def index() {
		//logService.recordChipRequest(params, request)
		def bufferedImage = wmsConversionService.serviceMethod(params)


		response.contentType = "image/png"
		ImageIO.write(bufferedImage, "png", response.outputStream)
		response.outputStream.flush()
		response.outputStream.close()
		//redirect(url: url)
	}
}
