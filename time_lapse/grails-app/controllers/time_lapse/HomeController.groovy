package time_lapse


import groovy.json.JsonOutput


class HomeController {

	def restApiService


	def index() {
		def model = restApiService.serviceMethod(params)


		render(view: "../index.gsp", model: [tlvParams : JsonOutput.toJson(model)])
	}
}
