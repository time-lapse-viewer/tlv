package time_lapse


import grails.transaction.Transactional


@Transactional
class LogsService {
		

	def getIpAddress(request) { 
		["client-ip", "x-cluster-client-ip", "x-forwarded-for"].each() {
			def ip = request.getHeader(it)
			if (ip) { return ip }
		}


		return "N/A"
	}

	def recordWmsRequest(params, request) {
		new WmsRequest(
			bbox: params.BBOX,
			date: new Date(),
			imageId: params.IMAGE_ID,
			ipAddress: getIpAddress(request),
                        library: params.LIBRARY	
		).save()
	}

	def recordXyzRequest(params, request) {
		new XyzRequest(
			date: new Date(),
			imageId: params.IMAGE_ID,
			ipAddress: getIpAddress(request),
			library: params.LIBRARY,
			x: params.X,
			y: params.Y,
			z: params.Z
		).save()
	}
}
