package time_lapse


class WmsController {

	def wmsConversionService


	def index() {
		//logService.recordChipRequest(params, request)
		def url = wmsConversionService.serviceMethod(params)


		redirect(url: url)
	}
}
