package coordinate_conversion


import grails.transaction.Transactional


@Transactional
class CoordinateConversionService {
	
	def convertDdToDmsService
	def convertDdToMgrsService
	def convertDmsToDdService
	def convertGeolocationService
	def convertMgrsToDdService
	

	def serviceMethod(location) {
		def result = [:]

		def ddRegExp = /(\-?\d{1,2}[.]\d+)[^\d|^-]+(\-?\d{1,3}[.]\d+)/
		def dmsRegExp = /(?i)(\d{2})[^\w]*(\d{2})[^\w]*(\d{2}[.]?\d{0,2})([n|s])[^\w]*(\d{3})[^\w]*(\d{2})[^\w]*(\d{2}[.]?\d{0,2})[^\w]*([e|w])/
		def mgrsRegExp = /(?i)(\d{1,2})([a-z])[^\w]*([a-z])([a-z])[^\w]*(\d{5})[^\w]*(\d{5})/

	
		// dd
		if (location ==~ ddRegExp) {
			def latitude
			def longitude
			location.find(ddRegExp) { 
				matcher, lat, lon -> 
				latitude = lat as Double
				longitude = lon as Double
			}



			if (!"${latitude}".isNumber()) { return [error: "Please specify latitude as a number."] }
			else if (latitude < -90 || latitude > 90) { return [error: "Latitude value must be between -90 and 90."] }
			else if (!"${longitude}".isNumber()) { return [error: "Please specify longitude as a number."] }
			else if (longitude < -180 || longitude > 180) { return [error: "Longitude value must be between -180 and 180."] }
			else { return [latitude: latitude, longitude: longitude] }
		}
		// dms
		else if (location ==~ dmsRegExp) {
			def dmsLatitude 
			def dmsLongitude 
			location.find(dmsRegExp) {
				matcher, latDeg, latMin, latSec, latOri, lonDeg, lonMin, lonSec, lonOri ->
				dmsLatitude = [
					degrees: latDeg as Integer,
					minutes: latMin as Integer,
					seconds: latSec as Double,
					orientation: latOri
				]
				dmsLongitude = [
					degrees: lonDeg as Integer,
					minutes: lonMin as Integer,
					seconds: lonSec as Double,
					orientation: lonOri
				]
			}

		
			if (dmsLatitude.degrees > 90) { return [error: "Latitude degrees must be less than or equal to 90."] }
			else if (dmsLatitude.minutes >= 60) { return [error: "Latitude minutes must be less than 60."] }
			else if (dmsLatitude.seconds >= 60) { return [error: "Latitude seconds must be less than 60."] } 
			else if (dmsLongitude.degrees > 180) { return [error: "Longitude degrees must be less than or equal to 180."] } 
			else if (dmsLongitude.minutes >= 60) { return [error: "Longitude minutes must be less than 60."] }
			else if (dmsLongitude.seconds >= 60) { return [error: "Longitude seconds must be less than 60."] }
			else {
				def latitude = convertDmsToDdService.serviceMethod(dmsLatitude.degrees, dmsLatitude.minutes, dmsLatitude.seconds, dmsLatitude.orientation)
				def longitude = convertDmsToDdService.serviceMethod(dmsLongitude.degrees, dmsLongitude.minutes, dmsLongitude.seconds, dmsLongitude.orientation)
				return [latitude: latitude, longitude: longitude]
			}
		}
		// mgrs
		else if (location ==~ mgrsRegExp) {
			def components
			location.find(mgrsRegExp) {
				matcher, one, two, three, four, five, six ->
				components = [
					one: one as Integer,
					two: two, 
					three: three,
					four: four,
					five: five as Integer,
					six: six as Integer
				]
			}
	
			def latLon = convertMgrsToDdService.serviceMethod(components.one, components.two, components.three, components.four, components.five, components.six) 
			if (!latLon.error) { return [latitude: latLon.latitude, longitude: latLon.longitude] }
			else { return [error: latLon.error] }
		}
		else {
			// assume it is a place name and use the geolocation service
			def locationInfo = location ? convertGeolocationService.serviceMethod(location) : null
			if (!locationInfo.error) { return [latitude: locationInfo.latitude, longitude: locationInfo.longitude] }
			else { return [error: locationInfo.error] } 
		}
	}
}
