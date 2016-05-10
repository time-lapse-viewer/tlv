package time_lapse


class XyzController {

	def xyzConversionService


	def index() {
		//logService.recordChipRequest(params, request)
		def url = xyzConversionService.serviceMethod(params)


		redirect(url: url)
	}
}
