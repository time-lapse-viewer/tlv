package coordinate_conversion


import groovy.json.JsonOutput


class CoordinateConversionController {

	def coordinateConversionService
	

	def index() {
		def location = coordinateConversionService.serviceMethod(params.location)


		render JsonOutput.toJson(location) 
	}
}
