package coordinate_conversion


//import grails.transaction.Transactional


//@Transactional
class ConvertGeolocationService {

	def grailsApplication
	def httpDownloadService


	def serviceMethod(locationString) {
		def url = "https://maps.googleapis.com/maps/api/geocode/json?address=${locationString}&key=${grailsApplication.config.googleApiKey}"
		def location = httpDownloadService.serviceMethod([url: url])
		if (location) {
			def center = location.results[0]?.geometry.location ?: null
			
		
			return center ? [latitude: center.lat, longitude: center.lng] : [error: "Placename not found."]
		}
		else { return [error: "There was a problem reaching the geocoder."] }
	}
}
