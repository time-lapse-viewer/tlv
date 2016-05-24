package coordinate_conversion


import grails.transaction.Transactional


@Transactional
class ConvertDdToDmsService {


	def serviceMethod(dd, position) {
		def degreesAbs = Math.abs(dd)
		def degrees = Math.floor(degreesAbs) as Integer

		def minutesAbs = (degreesAbs - degrees) * 60
		def minutes = Math.floor(minutesAbs) as Integer

		def seconds = (minutesAbs - minutes) * 60
		seconds = seconds.round(2).trunc(2)

		def dms = ""
		// The latitude must have two digits in its degrees section. Similarly, longitude must have three.
		if (degrees < 10) {
			dms = position == "latitude" ? "0" : "00"
		}
		else if (degrees < 100 && position == "longitude")  { dms += "0" }
		dms += "${degrees}"
	
		// The latitude and longitude must have two digits in their minutes and seconds sections.
		dms = minutes < 10 ? "${dms}0${minutes}" : "${dms}${minutes}"
		dms = seconds < 10 ? "${dms}0${seconds}" : "${dms}${seconds}"
	
		if (position == "latitude") { dms = dd >= 0 ? "${dms}N" : "${dms}S" }
		else { dms = dd >= 0 ? "${dms}E" : "${dms}W" }


		return dms
	}
}
