package coordinate_conversion


import grails.transaction.Transactional


@Transactional
class ConvertDmsToDdService {


	def serviceMethod(degrees, minutes, seconds, orientation) {
		def dd = degrees + minutes / 60 + seconds / 3600
		dd = orientation ==~ /(?i)[s|w]/ ? -dd : dd 
	
	
		return dd
	}
}
